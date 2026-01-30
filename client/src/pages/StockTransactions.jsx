import { useState, useEffect } from "react";
import { getOrders } from "../api/trade.api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./StockTransactions.css";

export default function StockTransactions() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data || []);
      setError("");
      setLoading(false);
    } catch (err) {
      setError(err.error || "Failed to load stock transactions");
      setLoading(false);
    }
  };

  const filteredOrders =
    filterType === "All"
      ? orders
      : orders.filter((order) => order.type === filterType);

  const getTotalValue = (order) => {
    return parseFloat(order.amount || 0).toFixed(2);
  };

  const getPnL = (order) => {
    if (order.pnl !== undefined) {
      return parseFloat(order.pnl).toFixed(2);
    }
    return "-";
  };

  return (
    <div className="stock-transactions-page">
      <Navbar />

      {error && (
        <div className="error-message">
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      <div className="transactions-container">
        <div className="transactions-header">
          <h1>📊 Stock Transaction History</h1>
          <p className="subtitle">View all your buy and sell transactions</p>
        </div>

        <div className="filter-section">
          <button
            className={`filter-btn ${filterType === "All" ? "active" : ""}`}
            onClick={() => setFilterType("All")}
          >
            All Transactions
          </button>
          <button
            className={`filter-btn ${filterType === "BUY" ? "active" : ""}`}
            onClick={() => setFilterType("BUY")}
          >
            Buys
          </button>
          <button
            className={`filter-btn ${filterType === "SELL" ? "active" : ""}`}
            onClick={() => setFilterType("SELL")}
          >
            Sells
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <p>⏳ Loading transactions...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="no-transactions">
            <p>📭 No {filterType === "All" ? "" : filterType.toLowerCase()} transactions yet</p>
            <p className="subtitle">Start trading to see your transaction history</p>
          </div>
        ) : (
          <div className="transactions-list">
            <div className="transactions-table">
              <div className="table-header">
                <div className="col symbol">Symbol</div>
                <div className="col type">Type</div>
                <div className="col quantity">Quantity</div>
                <div className="col price">Price</div>
                <div className="col total">Total Value</div>
                <div className="col pnl">P&L</div>
                <div className="col date">Date</div>
              </div>

              <div className="table-body">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="table-row">
                    <div className="col symbol">
                      <strong>{order.symbol}</strong>
                    </div>
                    <div className="col type">
                      <span
                        className={`badge ${
                          order.type === "BUY" ? "buy-badge" : "sell-badge"
                        }`}
                      >
                        {order.type === "BUY" ? "🟢 BUY" : "🔴 SELL"}
                      </span>
                    </div>
                    <div className="col quantity">{order.quantity}</div>
                    <div className="col price">
                      ₹{parseFloat(order.price || 0).toFixed(2)}
                    </div>
                    <div className="col total">
                      ₹{getTotalValue(order)}
                    </div>
                    <div className="col pnl">
                      {order.type === "SELL" && order.pnl !== undefined ? (
                        <span
                          className={
                            parseFloat(order.pnl) >= 0 ? "positive" : "negative"
                          }
                        >
                          {parseFloat(order.pnl) >= 0 ? "+" : ""}
                          ₹{getPnL(order)}
                        </span>
                      ) : (
                        <span className="neutral">-</span>
                      )}
                    </div>
                    <div className="col date">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && filteredOrders.length > 0 && (
          <div className="transactions-summary">
            <div className="summary-card">
              <h3>Total Buys</h3>
              <p className="amount">
                ₹
                {filteredOrders
                  .filter((o) => o.type === "BUY")
                  .reduce((sum, o) => sum + parseFloat(o.amount || 0), 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="summary-card">
              <h3>Total Sells</h3>
              <p className="amount">
                ₹
                {filteredOrders
                  .filter((o) => o.type === "SELL")
                  .reduce((sum, o) => sum + parseFloat(o.amount || 0), 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="summary-card">
              <h3>Total Realized P&L</h3>
              <p
                className={`amount ${
                  filteredOrders
                    .filter((o) => o.type === "SELL" && o.pnl !== undefined)
                    .reduce((sum, o) => sum + parseFloat(o.pnl || 0), 0) >= 0
                    ? "positive"
                    : "negative"
                }`}
              >
                ₹
                {filteredOrders
                  .filter((o) => o.type === "SELL" && o.pnl !== undefined)
                  .reduce((sum, o) => sum + parseFloat(o.pnl || 0), 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
