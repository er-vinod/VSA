// components/StockScanner.tsx
import React, { useState } from 'react';

interface ScanResult {
    ticker: string;
    signal: string; // ND, NS, Shakeout, or ""
    rsi: number | null;
    ma_confirmation: boolean;
    pnl: number | null;
}

interface StockScannerProps {}

const StockScanner: React.FC<StockScannerProps> = () => {
    const [tickersInput, setTickersInput] = useState('');
    const [scanResults, setScanResults] = useState<ScanResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // This function simulates calling the FastAPI /scanner endpoint
    const handleRunScan = async () => {
        if (!tickersInput) {
            setError("Please enter at least one ticker symbol.");
            setScanResults([]);
            return;
        }
        setLoading(true);
        setError(null);

        try {
            // Placeholder for actual API call: await fetch('/api/scanner', { method: 'POST', body: JSON.stringify({ tickers: tickersInput }) });
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

            // Mock Data generation to represent a successful API call
            const mockResults: ScanResult[] = [
                { ticker: "PAYTM", signal: "ND", rsi: 72.5, ma_confirmation: true, pnl: 150.20 },
                { ticker: "NYKAA", signal: "", rsi: null, ma_confirmation: false, pnl: -35.10 },
                // Add more mock results here for testing UI
            ];

            setScanResults(mockResults);
        } catch (err) {
            setError("Failed to fetch scan data from the backend API.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <label className="block text-sm font-medium text-gray-700">
                Enter Tickers (e.g., PAYTM, NYKAA):
            </label>
            <input
                type="text"
                value={tickersInput}
                onChange={(e) => setTickersInput(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Comma-separated tickers (PAYTM, NYKAA)"
                disabled={loading}
            />

            <button
                onClick={handleRunScan}
                disabled={loading || !tickersInput}
                className={`w-full py-2 px-4 rounded-md text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition duration-150`}
            >
                {loading ? 'Scanning...' : 'Run Stock Scan'}
            </button>

            {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}

            <h3 className="text-lg font-semibold pt-4">Scan Results</h3>
            {scanResults.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border divide-y border-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticker</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RSI (14)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MA Confirmed</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Simulated P&L ($)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {scanResults.map((result) => (
                                <tr key={result.ticker} className={result.signal ? 'bg-green-50/50' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{result.ticker}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${result.signal ? 'text-green-700' : 'text-gray-500'}`}>{result.signal}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{result.rsi?.toFixed(2) || "N/A"}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${result.ma_confirmation ? 'text-green-700' : 'text-red-500'}`}>
                                        {result.ma_confirmation ? '✅' : '❌'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">{result.pnl?.toFixed(2) || "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center p-10 border-dashed border-gray-300 rounded-md">
                    Enter tickers and click 'Run Stock Scan' to see results here.
                </div>
            )}
        </div>
    );
};

export default StockScanner;