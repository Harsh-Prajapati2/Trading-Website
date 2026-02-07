import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getPortfolioDetail, getRealizedPnL } from "../api/trade.api";
import { creditWallet } from "../api/wallet.api";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Core Data State
  const [portfolio, setPortfolio] = useState([]);
  const [realizedPnL, setRealizedPnL] = useState(0);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Modal/Form State
  const [depositAmount, setDepositAmount] = useState("");
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositError, setDepositError] = useState("");

  // Sorting State
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "desc" });

  /**
   * Main data fetching function
   * @param {boolean} showLoadingSpinner - If true, triggers the global loading state
   */
  const fetchDashboardData = useCallback(async (showLoadingSpinner = false) => {
    try {
      if (showLoadingSpinner) setLoading(true);

      const [portfolioData, pnlData] = await Promise.all([
        getPortfolioDetail(),
        getRealizedPnL(),
      ]);

      setPortfolio(portfolioData);
      setRealizedPnL(pnlData.realizedPnL || 0);
      setLastUpdated(new Date());
      setError("");
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.error || "Failed to sync dashboard data");
    } finally {
      if (showLoadingSpinner) setLoading(false);
    }
  }, []);

  // Effect for Polling (3-second interval)
  useEffect(() => {
    // Initial load
    fetchDashboardData(true);

    // Setup interval
    const pollInterval = setInterval(() => {
      fetchDashboardData(false); // Update silently in background
    }, 3000);

    // Cleanup on unmount
    return () => clearInterval(pollInterval);
  }, [fetchDashboardData]);

  // Calculation Helpers
  const calculateTotalValue = () => {
    return portfolio.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0);
  };

  const calculateUnrealizedPnL = () => {
    return portfolio.reduce((sum, item) => sum + (item.unrealized || 0), 0);
  };

  // Sorting Logic
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedPortfolio = useMemo(() => {
    if (!sortConfig.key) return portfolio;
    
    return [...portfolio].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [portfolio, sortConfig]);

  // Action Handlers
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
      fetchDashboardData(false); // Refresh after deposit
    } catch (err) {
      setDepositError(err.error || "Failed to deposit funds");
    }
  };

  const handleQuickBuy = (symbol) => {
    navigate("/stocks", { state: { autoSelect: symbol } });
  };

  const handleSell = (symbol) => {
    const stock = portfolio.find((p) => p.symbol === symbol);
    navigate("/trade", {
      state: {
        stock: {
          symbol,
          price: stock?.currentPrice,
        },
        tradeType: "SELL",
      },
    });
  };

  if (loading) {
    return (
      <div className="dashboard-loading-container">
        <div className="spinner"></div>
        <p>Loading your portfolio...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar />
      
      <div className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p className="last-updated">
              Live updates active • Last synced: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          
        </header>

        {error && <div className="dashboard-error-banner">{error}</div>}

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Portfolio Value</h3>
            <p className="stat-value">₹{calculateTotalValue().toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>

          <div className="stat-card">
            <h3>Unrealized P&L</h3>
            <p className={`stat-value ${calculateUnrealizedPnL() >= 0 ? "positive" : "negative"}`}>
              {calculateUnrealizedPnL() >= 0 ? "+" : ""}
              ₹{calculateUnrealizedPnL().toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="stat-card">
            <h3>Realized P&L</h3>
            <p className={`stat-value ${realizedPnL >= 0 ? "positive" : "negative"}`}>
              {realizedPnL >= 0 ? "+" : ""}
              ₹{realizedPnL.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="portfolio-section">
          <div className="section-header">
            <h2>Your Holdings</h2>
          </div>
          
          {portfolio.length === 0 ? (
            <div className="no-holdings">
              <p>Your portfolio is empty.</p>
              <button className ="btn-primary" onClick={() => navigate("/stocks")}>Explore Stocks</button>
            </div>
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
                    <th 
                      onClick={() => handleSort("unrealized")} 
                      style={{ cursor: "pointer", userSelect: "none" }}
                      title="Sort by P&L"
                    >
                      P&L {sortConfig.key === "unrealized" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "↕"}
                    </th>
                    <th>Return %</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPortfolio.map((holding) => (
                    <tr key={holding.symbol} className="holding-row">
                      <td className="symbol-cell"><strong>{holding.symbol}</strong></td>
                      <td>{holding.quantity}</td>
                      <td>₹{holding.avgPrice.toFixed(2)}</td>
                      <td className="price-cell">₹{holding.currentPrice.toFixed(2)}</td>
                      <td>₹{(holding.currentPrice * holding.quantity).toFixed(2)}</td>
                      <td className={holding.unrealized >= 0 ? "positive" : "negative"}>
                        {holding.unrealized >= 0 ? "+" : ""}₹{holding.unrealized.toFixed(2)}
                      </td>
                      <td className={holding.percent >= 0 ? "positive" : "negative"}>
                        {holding.percent >= 0 ? "+" : ""}{holding.percent.toFixed(2)}%
                      </td>
                      <td className="actions-cell">
                        <button className="btn-action-buy" onClick={() => handleQuickBuy(holding.symbol)}>Buy</button>
                        <button className="btn-action-sell" onClick={() => handleSell(holding.symbol)}>Sell</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showDeposit && (
        <div className="modal-overlay">
          <div className="deposit-modal">
            <h3>Add Funds</h3>
            <div className="input-wrapper">
              <span>₹</span>
              <input
                type="number"
                placeholder="Enter amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                autoFocus
              />
            </div>
            {depositError && <p className="modal-error">{depositError}</p>}
            <div className="modal-footer">
              <button onClick={() => setShowDeposit(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleDeposit} className="btn-primary">Confirm Deposit</button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}