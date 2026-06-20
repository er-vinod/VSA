import numpy as np
import pandas as pd

def calculate_rsi(data: pd.Series, period: int = 14) -> pd.Series:
    """Calculates Relative Strength Index (RSI)."""
    delta = data.diff()
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)

    avg_gain = gain.ewm(span=period, adjust=False).mean()
    avg_loss = loss.ewm(span=period, adjust=False).mean()

    rs = avg_gain / avg_loss
    return 100 - (100 / (1 + rs))

def calculate_sma(data: pd.Series, period: int) -> pd.Series:
    """Calculates Simple Moving Average (SMA)."""
    return data.rolling(window=period).mean()

def calculate_ema(data: pd.Series, period: int) -> pd.Series:
    """Calculates Exponential Moving Average (EMA)."""
    # Pandas ewm function with adjust=False and alpha=(2/(period+1)) approximates EMA
    return data.ewm(span=period, adjust=False).mean()

def calculate_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """Calculates all required indicators (RSI, SMA, EMA) on the OHLCV DataFrame."""
    # Ensure we have a 'Close' column to work with
    if 'Close' not in df.columns:
        raise ValueError("DataFrame must contain a 'Close' price column.")

    df['RSI'] = calculate_rsi(df['Close'])

    # Standard periods used for SMA/EMA visualization (can be parameterized later)
    df['SMA_10'] = calculate_sma(df['Close'], period=10)
    df['EMA_20'] = calculate_ema(df['Close'], period=20)

    return df