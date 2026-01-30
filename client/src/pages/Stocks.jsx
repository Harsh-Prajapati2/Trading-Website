import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getStocks } from "../api/stocks.api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Stocks.css";

export default function Stocks() {
  const navigate = useNavigate();
  const location = useLocation();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);

  // Fetch stocks on component mount
  useEffect(() => {
    fetchStocks();
    
    // Set up polling to refresh every 3 seconds
    const interval = setInterval(fetchStocks, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update selected stock when stocks array changes
  useEffect(() => {
    if (selectedStock && stocks.length > 0) {
      const updated = stocks.find(s => s._id === selectedStock._id);
      if (updated) {
        setSelectedStock(updated);
      }
    }
  }, [stocks]);

  // Handle auto-selection from navigation state (e.g. from Dashboard Quick Buy)
  useEffect(() => {
    if (location.state?.autoSelect && stocks.length > 0 && !selectedStock) {
      const stockToSelect = stocks.find((s) => s.symbol === location.state.autoSelect);
      if (stockToSelect) setSelectedStock(stockToSelect);
    }
  }, [stocks, location.state, selectedStock]);

  const fetchStocks = async () => {
    try {
      console.log("Fetching stocks...");
      const data = await getStocks();
      console.log("Stocks data:", data);
      
      if (Array.isArray(data) && data.length > 0) {
        setStocks(data);
        setError("");
      } else {
        setError("No stocks available. Please wait for data to load.");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching stocks:", err);
      setError(err.error || err.message || "Failed to load stocks");
      setLoading(false);
    }
  };

  const filteredStocks = searchTerm.trim() === "" 
    ? stocks 
    : stocks.filter(stock => 
        stock.symbol.toUpperCase().includes(searchTerm.toUpperCase()) ||
        (stock.sector && stock.sector.toUpperCase().includes(searchTerm.toUpperCase()))
      );

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
  };

  const handleTrade = () => {
    if (selectedStock) {
      navigate("/trade", { state: { stock: selectedStock } });
    }
  };

  return (
    <div className="stocks-page">
      <Navbar />
      
      {error && (
        <div className="error-message">
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}
      
      <div className="stocks-content">
        <div className="stocks-list-section">
          <h3>Market Stocks</h3>
          
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by symbol or sector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {loading ? (
            <div className="loading">
              <p>⏳ Loading stocks...</p>
            </div>
          ) : stocks.length === 0 ? (
            <div className="no-results">
              <p>❌ No stocks available</p>
              <p style={{fontSize: "0.9rem", color: "#a0aec0"}}>Make sure the server is running and stocks are seeded</p>
            </div>
          ) : (
            <div className="stocks-list">
              {filteredStocks.length === 0 ? (
                <p className="no-results">No matching stocks found</p>
              ) : (
                filteredStocks.map((stock) => (
                  <div
                    key={stock._id}
                    className={`stock-item ${selectedStock?._id === stock._id ? "active" : ""}`}
                    onClick={() => handleStockSelect(stock)}
                  >
                    <div className="stock-info">
                      <h4>{stock.symbol}</h4>
                      {stock.sector && (
                        <p className="stock-sector">{stock.sector}</p>
                      )}
                    </div>
                    <div className="stock-price">
                      <p className="price">₹{parseFloat(stock.price || 0).toFixed(2)}</p>
                      {stock.changePercent !== undefined && (
                        <p className={`change ${parseFloat(stock.changePercent) >= 0 ? "positive" : "negative"}`}>
                          {stock.changePercent > 0 ? "+" : ""}{parseFloat(stock.changePercent).toFixed(4)}%
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="stock-details-section">
          {selectedStock ? (
            <div className="stock-details">
              <h2>{selectedStock.symbol}</h2>
              <div className="details-content">
                <div className="detail-row">
                  <span>Current Price:</span>
                  <strong className="price-highlight">
                    ₹{parseFloat(selectedStock.price || 0).toFixed(2)}
                  </strong>
                </div>

                {selectedStock.change !== undefined && (
                  <div className="detail-row">
                    <span>Change Amount:</span>
                    <span className={parseFloat(selectedStock.change) >= 0 ? "positive" : "negative"}>
                      {selectedStock.change > 0 ? "+" : ""}
                      ₹{parseFloat(selectedStock.change).toFixed(2)}
                    </span>
                  </div>
                )}

                {selectedStock.changePercent !== undefined && (
                  <div className="detail-row">
                    <span>Change Percentage:</span>
                    <span className={parseFloat(selectedStock.changePercent) >= 0 ? "positive" : "negative"}>
                      {selectedStock.changePercent > 0 ? "+" : ""}
                      {parseFloat(selectedStock.changePercent).toFixed(4)}%
                    </span>
                  </div>
                )}

                {(selectedStock.changePercent !== undefined || selectedStock.status) && (
                  <div className="detail-row">
                    <span>Status:</span>
                    <span className={parseFloat(selectedStock.changePercent || 0) >= 0 ? "positive" : "negative"}>
                      {parseFloat(selectedStock.changePercent || 0) >= 0 ? "📈 UP" : "📉 DOWN"}
                    </span>
                  </div>
                )}

                {selectedStock.sector && (
                  <div className="detail-row">
                    <span>Sector:</span>
                    <span>{selectedStock.sector}</span>
                  </div>
                )}

                {selectedStock.basePrice && selectedStock.basePrice > 0 && (
                  <div className="detail-row">
                    <span>Base Price:</span>
                    <span>₹{parseFloat(selectedStock.basePrice).toFixed(2)}</span>
                  </div>
                )}

                {selectedStock.updatedAt && (
                  <div className="detail-row">
                    <span>Last Updated:</span>
                    <span className="time-text">
                      {new Date(selectedStock.updatedAt).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>

              <button onClick={handleTrade} className="trade-btn">
                Trade Now
              </button>
            </div>
          ) : (
            <div className="placeholder">
              <p>📊 Select a stock to view details</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
