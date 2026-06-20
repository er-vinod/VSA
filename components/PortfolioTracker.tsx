// components/PortfolioTracker.tsx
import React, { useState, useEffect } from 'react';

interface HoldingDetail {
    current_price: number;
    shares: number;
    avg_buy_price: number;
    invested_value: number;
    current_market_value: number;
    pnl: number; // P&L in currency units
}

interface OverallMetrics {
    total_invested: number;
    total_current_value: number;
    total_pnl: number;
}

interface PortfolioState {
    holdings: Record<string, HoldingDetail>;
    overall_metrics: OverallMetrics;
}

type InitialHoldings = { ticker: string; buy_date: string; quantity: number; avg_cost: number };

const initialMockHoldings: InitialHoldings[] = [
    { ticker: "PAYTM", buy_date: "2025-01-01", quantity: 10, avg_cost: 850 },
    { ticker: "NYKAA", buy_date: "2026-03-15", quantity: 5, avg_cost: 450 },
];

const PortfolioTracker: React.FC = () => {
    const [holdings, setHoldings] = useState<InitialHoldings[]>(initialMockHoldings);
    const [currentData, setCurrentData] = useState<{ holdings: Record<string, any>; overall_metrics: OverallMetrics } | null>(null);
    const [loading, setLoading] = useState(false);

    // Placeholder for fetching current data from the /holdings endpoint
    const fetchPortfolioData = async () => {
        setLoading(true);
        // In a real app: await fetch('/api/holdings', { method: 'GET' });
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call delay

        // Mocking the successful response structure from Task #3 backend logic
        const mockOverallMetrics: OverallMetrics = {
            total_invested: 12500.00,
            total_current_value: 14800.00,
            total_pnl: 2300.00
        };

        // Mocking individual holdings based on the mock data structure
        const mockHoldingsState: Record<string, any> = {
            "PAYTM": { current_price: 950.00, shares: 10, avg_buy_price: 850.00, invested_value: 8500.00, current_market_value: 9500.00, pnl: 1000.00 },
            "NYKAA": { current_price: 420.00, shares: 5, avg_buy_price: 450.00, invested_value: 2250.00, current_market_value: 2100.00, pnl: -150.00 },
        };

        setCurrentData({ holdings: mockHoldingsState, overall_metrics: mockOverallMetrics });
        setLoading(false);
    };

    useEffect(() => {
        fetchPortfolioData();
    }, []); // Fetch data on mount

    const renderHoldingCard = (ticker: string, data: any) => {
        const pnlColor = data.pnl >= 0 ? 'text-green-600' : 'text-red-600';
        return (
            <div key={ticker} className="border p-4 rounded-lg mb-3 bg-white shadow-sm">
                <h4 className="text-lg font-bold">{ticker}</h4>
                <p className="text-sm text-gray-600 mb-2">Current Price: ₹{data.current_price.toFixed(2)}</p>

                <div className="grid grid-cols-3 gap-4 text-center pt-2 border-t mt-2">
                    <div>
                        <p className="text-sm font-medium">{`Shares`}</p>
                        <p className="text-lg font-semibold">{data.shares.toFixed(0)}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Invested</p>
                        <p className="text-lg font-semibold">₹{data.invested_value.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">P&L Today</p>
                        <p className={`text-xl font-extrabold ${pnlColor}`}>₹{data.pnl.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="p-10 text-center text-blue-600">Loading Portfolio Data...</div>;
    }

    const metrics = currentData?.overall_metrics;
    const holdings = currentData?.holdings;

    return (
        <div className="space-y-8">
            {/* Overall Metrics Card */}
            <div className="p-6 bg-blue-50 border-l-4 border-blue-600 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Overall Portfolio Snapshot</h3>
                <div className="flex justify-between items-center text-sm mt-4">
                    <p>Total Invested: <span className="font-bold">₹{metrics.total_invested.toFixed(2)}</span></p>
                    <p>Current Value: <span className="font-bold text-blue-700">₹{metrics.total_current_value.toFixed(2)}</span></p>
                </div>
                <div className={`flex justify-between items-center mt-3 p-2 rounded ${metrics.total_pnl >= 0 ? 'bg-green-100' : 'bg-red-100'} border`}>
                    <p className="text-lg font-medium">Total P&L:</p>
                    <p className={`text-xl font-extrabold ${metrics.total_pnl >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        ₹{Math.abs(metrics.total_pnl).toFixed(2)}
                    </p>
                </div>
            </div>

            <h3 className="text-xl font-semibold border-b pb-2">Individual Holdings</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {Object.entries(holdings).map(([ticker, data]) => renderHoldingCard(ticker, data))}
            </div>
        </div>
    );
};

export default PortfolioTracker;