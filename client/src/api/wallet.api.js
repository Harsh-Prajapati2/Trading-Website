import api from "./axios";

export const initWallet = async () => {
  try {
    const res = await api.post("/wallet/init");
    return res.data;
  } catch (error) {
    const errorData = error.response?.data || { error: "Failed to initialize wallet" };
    throw { error: errorData.message || errorData.error || "Failed to initialize wallet" };
  }
};

export const creditWallet = async (amount, method = "bank") => {
  try {
    const res = await api.post("/wallet/credit", { amount, method });
    return res.data;
  } catch (error) {
    const errorData = error.response?.data || { error: "Failed to credit wallet" };
    throw { error: errorData.message || errorData.error || "Failed to credit wallet" };
  }
};

export const debitWallet = async (amount, method = "bank") => {
  try {
    const res = await api.post("/wallet/debit", { amount, method });
    return res.data;
  } catch (error) {
    const errorData = error.response?.data || { error: "Failed to debit wallet" };
    throw { error: errorData.message || errorData.error || "Failed to debit wallet" };
  }
};

export const getWallet = async () => {
  try {
    const res = await api.get("/wallet/balance");
    return res.data;
  } catch (error) {
    const errorData = error.response?.data || { error: "Failed to fetch wallet" };
    throw { error: errorData.message || errorData.error || "Failed to fetch wallet" };
  }
};

export const getTransactions = async () => {
  try {
    const res = await api.get("/wallet/transactions");
    return res.data;
  } catch (error) {
    const errorData = error.response?.data || { error: "Failed to fetch transactions" };
    throw { error: errorData.message || errorData.error || "Failed to fetch transactions" };
  }
};

export const withdrawWallet = async (amount, bankName, accountNo, ifsc, method = "bank") => {
  try {
    const res = await api.post("/wallet/withdraw", { amount, bankName, accountNo, ifsc, method });
    return res.data;
  } catch (error) {
    const errorData = error.response?.data || { error: "Failed to withdraw funds" };
    throw { error: errorData.message || errorData.error || "Failed to withdraw funds" };
  }
};
