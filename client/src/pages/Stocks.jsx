import React, { useEffect, useState } from 'react';
import Dashboard from '../components/Dashboard';
import CandlestickChart from '../components/CandlestickChart';
import TradingTerminal from '../components/TradingTerminal';
import AssetsTable from '../components/AssetsTable';
import OrderBook from '../components/OrderBook';
import { getStocks } from '../api/stocks.api';
import './Stocks.css';

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStocks() {
      try {
        const data = await getStocks();
        setStocks(data);
      } catch (error) {
        console.error("Failed to fetch stocks:", error);
        // Handle error appropriately in UI
      } finally {
        setLoading(false);
      }
    }

    loadStocks();
    // No interval for now to avoid excessive requests during dev
  }, []);

  return (
    <Dashboard>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, John!</p>
      </div>
      {loading ? (
        <p>Loading market data...</p>
      ) : (
        <div className="stock-dashboard-grid">
          <CandlestickChart />
          <TradingTerminal stocks={stocks} />
          <OrderBook />
          <AssetsTable stocks={stocks} />
        </div>
      )}
    </Dashboard>
  );
};

export default Stocks;
