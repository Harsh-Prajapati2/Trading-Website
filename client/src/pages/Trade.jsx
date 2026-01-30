import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { buyStock, sellStock, getPortfolio } from "../api/trade.api";
import { getWallet } from "../api/wallet.api";
import { validateTradeForm } from "../utils/validation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Trade.css";

export default function Trade() {
  const navigate = useNavigate();
  const location = useLocation();
  const { stock, details } = location.state || {};

  const [tradeType, setTradeType] = useState("BUY");
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    if (!stock) {
      navigate("/stocks");
      return;
    }
    fetchUserData();
  }, [stock]);

  const fetchUserData = async () => {
    try {
      const [walletData, portfolioData] = await Promise.all([
        getWallet(),
        getPortfolio(),
      ]);
      setWalletBalance(walletData.balance || 0);
      setPortfolio(portfolioData);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");
    setSuccessMessage("");

    // Validate form
    const validationErrors = validateTradeForm(
      stock.symbol,
      quantity,
      walletBalance,
      details?.price || stock.price,
      tradeType
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Additional validation for SELL
    if (tradeType === "SELL") {
      const holding = portfolio.find((p) => p.symbol === stock.symbol);
      if (!holding || holding.quantity < parseInt(quantity)) {
        setErrors({
          quantity: "Insufficient quantity to sell",
        });
        return;
      }
    }

    try {
      setLoading(true);
      const qty = parseInt(quantity);

      let result;
      if (tradeType === "BUY") {
        result = await buyStock(stock.symbol, qty);
      } else {
        result = await sellStock(stock.symbol, qty);
      }

      setSuccessMessage(result.message || `${tradeType} order executed successfully!`);
      setQuantity("");
      setWalletBalance(result.balance);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      setServerError(error.error || "Trade failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalCost = quantity
    ? (parseFloat(quantity) * parseFloat(details?.price || stock?.price || 0)).toFixed(2)
    : 0;

  if (!stock) {
    return <div>Loading...</div>;
  }

  return (
    <div className="trade-page">
      <Navbar />
      <div className="trade-content">
        <button onClick={() => navigate("/stocks")} className="back-btn">
          ← Back to Stocks
        </button>

      <div className="trade-container">
        <div className="trade-info">
          <h2>{stock.symbol}</h2>
          <div className="price-info">
            <p className="current-price">
              Current Price: <strong>₹{parseFloat(details?.price || stock.price).toFixed(2)}</strong>
            </p>
            {details && (
              <div className="stock-details">
                <p>Open: ₹{parseFloat(details.open).toFixed(2)}</p>
                <p>High: ₹{parseFloat(details.high).toFixed(2)}</p>
                <p>Low: ₹{parseFloat(details.low).toFixed(2)}</p>
                <p
                  className={
                    parseFloat(details.change) >= 0 ? "positive" : "negative"
                  }
                >
                  Change: {parseFloat(details.change).toFixed(2)} ({details.changePercent})
                </p>
              </div>
            )}
          </div>

          <div className="balance-info">
            <p>Wallet Balance: <strong>₹{walletBalance.toFixed(2)}</strong></p>
            {tradeType === "BUY" && (
              <p className={totalCost > walletBalance ? "error-text" : ""}>
                Total Cost: <strong>₹{totalCost}</strong>
              </p>
            )}
          </div>
        </div>

        <div className="trade-form-section">
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          {serverError && <div className="error-message">{serverError}</div>}

          <form onSubmit={handleSubmit} className="trade-form">
            <div className="trade-type-selector">
              <button
                type="button"
                className={`type-btn ${tradeType === "BUY" ? "active" : ""}`}
                onClick={() => setTradeType("BUY")}
              >
                Buy
              </button>
              <button
                type="button"
                className={`type-btn ${tradeType === "SELL" ? "active" : ""}`}
                onClick={() => setTradeType("SELL")}
              >
                Sell
              </button>
            </div>

            <div className="input-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  if (errors.quantity) {
                    setErrors({ ...errors, quantity: "" });
                  }
                }}
                min="1"
                className={errors.quantity ? "input-error" : ""}
              />
              {errors.quantity && (
                <span className="field-error">{errors.quantity}</span>
              )}
              {errors.balance && (
                <span className="field-error">{errors.balance}</span>
              )}
            </div>

            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Price per unit:</span>
                <span>₹{parseFloat(details?.price || stock.price).toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Quantity:</span>
                <span>{quantity || 0}</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount:</span>
                <span>₹{totalCost}</span>
              </div>
            </div>

            <button
              type="submit"
              className={`trade-button ${tradeType.toLowerCase()}`}
              disabled={loading || !quantity}
            >
              {loading ? "Processing..." : `${tradeType} ${stock.symbol}`}
            </button>
          </form>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
