import yfinance as yf
import pandas as pd
import numpy as np

class VSAStrategy:
    def __init__(self, ticker, period="1y", interval="1d"):
        self.ticker = ticker
        self.df = yf.download(ticker, period=period, interval=interval)
        self.df = self.df.dropna()
        self.signals = None
        self.trades = None

    def apply_vsa(self):
        df = self.df.copy()
        df['Spread'] = df['High'] - df['Low']
        df['ClosePos'] = (df['Close'] - df['Low']) / df['Spread']
        df['VolAvg'] = df['Volume'].rolling(14).mean()

        signals = []
        for i in range(1, len(df)):
            row, prev = df.iloc[i], df.iloc[i-1]
            if row['Close'] > prev['Close'] and row['Spread'] < df['Spread'].rolling(14).mean().iloc[i] and row['Volume'] < row['VolAvg']:
                signals.append("ND")
            elif row['Close'] < prev['Close'] and row['Spread'] < df['Spread'].rolling(14).mean().iloc[i] and row['Volume'] < row['VolAvg']:
                signals.append("NS")
            elif row['Spread'] > 2*df['Spread'].rolling(14).mean().iloc[i] and row['ClosePos'] > 0.7 and row['Volume'] > 1.5*row['VolAvg']:
                signals.append("Shakeout")
            else:
                signals.append("")
        df['Signal'] = [""] + signals
        self.signals = df
        return df

    def backtest(self):
        df = self.signals if self.signals is not None else self.apply_vsa()
        trades = []
        position = None
        entry_price = None

        for i, row in df.iterrows():
            # Signal check must now consider indicators as well
            if row['Signal'] in ["NS", "Shakeout"] and position is None:
                position = "LONG"
                entry_price = row['Close']
            elif row['Signal'] == "ND" and position == "LONG":
                pnl = (row['Close'] - entry_price) / entry_price
                trades.append(pnl)
                position = None
                entry_price = None

        self.trades = trades
        return trades

    def metrics(self):
        if not self.trades:
            return {"win_rate": 0, "avg_pnl": 0, "sharpe": 0}
        win_rate = sum([1 for t in self.trades if t > 0]) / len(self.trades)
        avg_pnl = np.mean(self.trades)
        sharpe = avg_pnl / np.std(self.trades) if np.std(self.trades) != 0 else 0
        return {
            "win_rate": round(win_rate*100,2),
            "avg_pnl": round(avg_pnl*100,2),
            "sharpe": round(sharpe,2)
        }
