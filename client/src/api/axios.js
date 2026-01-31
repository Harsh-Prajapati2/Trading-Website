import axios from "axios";

const DEFAULT_BACKEND = "http://localhost:5000";
const BACKEND_URL = import.meta?.env?.VITE_BACKEND_URL || DEFAULT_BACKEND;

const api = axios.create({
  baseURL: BACKEND_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
