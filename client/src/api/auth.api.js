import api from "./axios";

export const loginApi = async (data) => {
  const userData = {
    email: data.email,
    password: data.password
  };
  try {
    const res = await api.post("/auth/login", userData);
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Login failed" };
  }
};

export const registerApi = async (data) => {
  const createUser = {
    name: data.name,
    email: data.email,
    mobileNo: data.mobileNo,
    password: data.password
  };
  try {
    const res = await api.post("/auth/register", createUser);
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Registration failed" };
  }
};
