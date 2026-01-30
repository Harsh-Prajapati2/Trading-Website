import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { getPortfolioDetail, getRealizedPnL } from "../api/trade.api";
import { creditWallet } from "../api/wallet.api";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [portfolio, setPortfolio] = useState([]);
  const [realizedPnL, setRealizedPnL] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositError, setDepositError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [portfolioData, pnlData] = await Promise.all([
        getPortfolioDetail(),
        getRealizedPnL(),
      ]);
      setPortfolio(portfolioData);
      setRealizedPnL(pnlData.realizedPnL || 0);
      setError("");
    } catch (err) {
      setError(err.error || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    setDepositError("");
    const amount = parseFloat(depositAmount);

    if (!depositAmount || amount <= 0) {
      setDepositError("Please enter a valid amount");
      return;
    }

    try {
      await creditWallet(amount);
      setDepositAmount("");
      setShowDeposit(false);
      fetchDashboardData();
    } catch (err) {
      setDepositError(err.error || "Failed to deposit funds");
    }
  };

  const calculateTotalValue = () => {
    return portfolio.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0);
  };

  const calculateUnrealizedPnL = () => {
    return portfolio.reduce((sum, item) => sum + item.unrealized, 0);
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <Navbar />
      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>

      {error && <div className="dashboard-error">{error}</div>}

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Portfolio Value</h3>
          <p className="stat-value">₹{calculateTotalValue().toFixed(2)}</p>
        </div>

        <div className="stat-card">
          <h3>Unrealized P&L</h3>
          <p className={`stat-value ${calculateUnrealizedPnL() >= 0 ? "positive" : "negative"}`}>
            ₹{calculateUnrealizedPnL().toFixed(2)}
          </p>
        </div>

        <div className="stat-card">
          <h3>Realized P&L</h3>
          <p className={`stat-value ${realizedPnL >= 0 ? "positive" : "negative"}`}>
            ₹{realizedPnL.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="portfolio-section">
        <h2>Your Holdings</h2>
        {portfolio.length === 0 ? (
          <p className="no-holdings">No holdings yet. Start trading!</p>
        ) : (
          <div className="portfolio-table-container">
            <table className="portfolio-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Quantity</th>
                  <th>Avg. Price</th>
                  <th>Current Price</th>
                  <th>Current Value</th>
                  <th>Unrealized P&L</th>
                  <th>Return %</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((holding) => (
                  <tr key={holding.symbol}>
                    <td className="symbol">{holding.symbol}</td>
                    <td>{holding.quantity}</td>
                    <td>₹{holding.avgPrice.toFixed(2)}</td>
                    <td>₹{holding.currentPrice.toFixed(2)}</td>
                    <td>₹{(holding.currentPrice * holding.quantity).toFixed(2)}</td>
                    <td className={holding.unrealized >= 0 ? "positive" : "negative"}>
                      ₹{holding.unrealized.toFixed(2)}
                    </td>
                    <td className={holding.percent >= 0 ? "positive" : "negative"}>
                      {holding.percent.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showDeposit && (
        <div className="deposit-modal">
          <div className="deposit-card">
            <h3>Add Funds to Wallet</h3>
            <input
              type="number"
              placeholder="Enter amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              min="1"
              step="100"
            />
            {depositError && <p className="error">{depositError}</p>}
            <div className="modal-buttons">
              <button onClick={handleDeposit} className="btn-confirm">
                Deposit
              </button>
              <button onClick={() => setShowDeposit(false)} className="btn-cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
