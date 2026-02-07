import axios from "axios";

const api = axios.create({
  // baseURL: "https://v4tgz06m-5000.inc1.devtunnels.ms/", // backend URL
  baseURL: "http://localhost:5000/", // backend URL
  // baseURL : "" 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
