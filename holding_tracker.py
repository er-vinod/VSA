import yfinance as yf
import pandas as pd
from typing import List, Dict

class HoldingTracker:
    """Manages user portfolio holdings, calculates current P&L, and tracks metrics."""

    def __init__(self):
        # Example structure for initial holdings data (should ideally come from a DB/API)
        # {ticker_symbol: {"buy_date": "YYYY-MM-DD", "quantity": float, "avg_cost": float}}
        self.holdings: Dict[str, Dict] = {}

    def add_holding(self, ticker: str, buy_date: str, quantity: float, avg_cost: float):
        """Adds or updates a user's holding."""
        if not isinstance(quantity, (int, float)) or quantity <= 0:
            raise ValueError("Quantity must be a positive number.")
        if avg_cost < 0:
             raise ValueError("Average cost cannot be negative.")
        self.holdings[ticker] = {
            "buy_date": buy_date,
            "quantity": quantity,
            "avg_cost": avg_cost
        }

    def get_all_tickers(self) -> List[str]:
        """Returns a list of all tracked ticker symbols."""
        return list(self.holdings.keys())

    def track_portfolio(self, market_data: dict) -> dict:
        """
        Calculates the current valuation and P&L for all holdings.
        market_data is expected to be a dictionary mapping ticker symbol to its current price (float).
        Returns a summarized portfolio view.
        """
        portfolio_summary = {}
        total_invested_value = 0.0
        total_current_value = 0.0

        for ticker, data in self.holdings.items():
            if ticker not in market_data:
                # Cannot price this holding today
                continue

            current_price = market_data[ticker]
            invested_value = data['quantity'] * data['avg_cost']
            current_market_value = current_price * data['quantity']
            pnl = (current_price - data['avg_cost']) * data['quantity']

            portfolio_summary[ticker] = {
                "current_price": round(current_price, 2),
                "shares": data['quantity'],
                "avg_buy_price": round(data['avg_cost'], 2),
                "invested_value": round(invested_value, 2),
                "current_market_value": round(current_market_value, 2),
                "pnl": round(pnl, 2)
            }
            total_invested_value += invested_value
            total_current_value += current_market_value

        # Overall portfolio metrics
        overall_metrics = {
            "total_invested": round(total_invested_value, 2),
            "total_current_value": round(total_current_value, 2),
            "total_pnl": round(total_current_value - total_invested_value, 2)
        }

        return {
            "holdings": portfolio_summary,
            "overall_metrics": overall_metrics
        }

# Note: In a real application, self.holdings would be loaded from a database connection.