import api from "./axios";

export const buyStock = async (symbol, quantity) => {
  try {
    const res = await api.post("/trade/buy", { symbol, quantity });
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Buy failed" };
  }
};

export const sellStock = async (symbol, quantity) => {
  try {
    const res = await api.post("/trade/sell", { symbol, quantity });
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Sell failed" };
  }
};

export const getPortfolio = async () => {
  try {
    const res = await api.get("/portfolio/portfolio");
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch portfolio" };
  }
};

export const getPortfolioDetail = async () => {
  try {
    const res = await api.get("/portfolio/portfolio/detail");
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch portfolio details" };
  }
};

export const getRealizedPnL = async () => {
  try {
    const res = await api.get("/portfolio/pnl/realized");
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch PnL" };
  }
};
