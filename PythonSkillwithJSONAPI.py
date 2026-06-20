import yfinance as yf
import pandas as pd
import numpy as np
from holding_tracker import HoldingTracker

app = FastAPI()

tickers = {
    "PAYTM": "PAYTM.NS",
    "NYKAA": "NYKAA.NS",
    "PBFINTECH": "PBFINTECH.NS",
    "JIOFIN": "JIOFIN.NS",
    "TATAMOTORS": "TATAMOTORS.NS",
    "SWIGGY": "SWIGGY.NS",
    "SIEMENSEN": "SIEMENSEN.NS",
    "WAAREE": "WAAREE.NS",
    "SONACOMS": "SONACOMS.NS",
    "ETERNAL": "ETERNAL.NS"
}

# --- VSA Scanner ---
def vsa_signals(df):
    df['Spread'] = df['High'] - df['Low']
    df['ClosePos'] = (df['Close'] - df['Low']) / df['Spread']
    df['VolAvg'] = df['Volume'].rolling(14).mean()

    signals = []
    for i in range(1, len(df)):
        row, prev = df.iloc[i], df.iloc[i-1]
        is_vsa_nd = row['Close'] > prev['Close'] and row['Spread'] < df['Spread'].rolling(14).mean().iloc[i] and row['Volume'] < row['VolAvg']:
        is_vsa_ns = row['Close'] < prev['Close'] and row['Spread'] < df['Spread'].rolling(14).mean().iloc[i] and row['Volume'] < row['VolAvg']:
        is_shakeout = row['Spread'] > 2*df['Spread'].rolling(14).mean().iloc[i] and row['ClosePos'] > 0.7 and row['Volume'] > 1.5*row['VolAvg']:

        # --- Indicator Confirmation Logic (Confluence) ---
        is_bullish_confirmed = (row['RSI'].fillna(100) >= 40) and (row['SMA_10'].fillna(np.nan) > row['EMA_20'].fillna(np.nan))
        is_bearish_confirmed = (row['RSI'].fillna(0) <= 60) and (row['SMA_10'].fillna(np.nan) < row['EMA_20'].fillna(np.nan))

        if is_vsa_nd and is_bullish_confirmed:
            signals.append("ND")
        elif is_vsa_ns and is_bearish_confirmed:
            signals.append("NS")
        elif is_shakeout and (is_bullish_confirmed or is_bearish_confirmed):
            # Shakeout confirmation is more complex, requiring either trend support
            signals.append("Shakeout")
        else:
            signals.append("")

    df['Signal'] = [""] + signals
    return df