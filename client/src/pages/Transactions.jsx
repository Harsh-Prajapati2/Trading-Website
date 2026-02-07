import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getTransactions } from "../api/wallet.api";
import "../styles/Transactions.css";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data.transactions || []);
      setError("");
    } catch (err) {
      setError(err.error || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTransactions = () => {
    if (filterType === "all") return transactions;
    return transactions.filter(t => t.type === filterType);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case "credit":
        return "💰";
      // case "debit":
      //   return "💸";
      case "withdraw":
        return "🏦";
      default:
        return "📝";
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case "credit":
        return "credit";
      case "debit":
        return "debit";
      case "withdraw":
        return "withdraw";
      default:
        return "";
    }
  };

  const filteredTransactions = getFilteredTransactions();

  if (loading) {
    return (
      <div className="transactions">
        <Navbar />
        <div className="transactions-loading">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="transactions">
      <Navbar />

      <div className="transactions-container">
        <header className="transactions-header">
          <h1>Transaction History</h1>
          <p>View all your wallet transactions</p>
        </header>

        {error && <div className="transactions-error">{error}</div>}

        <div className="transactions-filters">
          <button
            className={`filter-btn ${filterType === "all" ? "active" : ""}`}
            onClick={() => setFilterType("all")}
          >
            All
          </button>
          <button
            className={`filter-btn ${filterType === "credit" ? "active" : ""}`}
            onClick={() => setFilterType("credit")}
          >
            💰 Deposits
          </button>
          {/* <button
            className={`filter-btn ${filterType === "debit" ? "active" : ""}`}
            onClick={() => setFilterType("debit")}
          >
            💸 Debits
          </button> */}
          <button
            className={`filter-btn ${filterType === "withdraw" ? "active" : ""}`}
            onClick={() => setFilterType("withdraw")}
          >
            🏦 Withdrawals
          </button>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="no-transactions">
            <p>No transactions found</p>
          </div>
        ) : (
          <div className="transactions-list">
            {filteredTransactions.map((transaction, index) => (
              <div
                key={index}
                className={`transaction-item ${getTransactionColor(transaction.type)}`}
              >
                <div className="transaction-icon">
                  {getTransactionIcon(transaction.type)}
                </div>

                <div className="transaction-details">
                  <div className="transaction-type">
                    <span className="type-label">
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                    {transaction.method && (
                      <span className="method-badge">{transaction.method}</span>
                    )}
                  </div>
                  <p className="transaction-date">
                    {formatDate(transaction.createdAt)}
                  </p>
                  {transaction.bankName && (
                    <p className="transaction-bank">{transaction.bankName}</p>
                  )}
                  {transaction.remark && (
                    <p className="transaction-remark">{transaction.remark}</p>
                  )}
                </div>

                <div className="transaction-amount">
                  <span className={`amount ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === "debit" || transaction.type === "withdraw" ? "-" : "+"}
                    ₹{transaction.amount.toFixed(2)}
                  </span>
                  <span className={`status ${transaction.status}`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
