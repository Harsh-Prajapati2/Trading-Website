import api from "./axios";

export const getStocks = async () => {
  try {
    const res = await api.get("/stocks");
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch stocks" };
  }
};

export const getStockQuote = async (symbol) => {
  try {
    const res = await api.get(`/stocks/quote/${symbol}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch stock quote" };
  }
};

export const searchStocks = async (keyword) => {
  try {
    const res = await api.get(`/stocks/search/${keyword}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to search stocks" };
  }
};
