import api from "./axios";

export const buyStock = (symbol, quantity) =>
  api.post("/trade/buy", { symbol, quantity });

export const sellStock = (symbol, quantity) =>
  api.post("/trade/sell", { symbol, quantity });
