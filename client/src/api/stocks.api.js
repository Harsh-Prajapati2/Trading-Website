import api from "./axios";

export const getStocks = async () => {
  const res = await api.get("/stocks");
  return res.data;
};
