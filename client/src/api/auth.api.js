import api from "./axios";

export const loginApi = async (data) => {
  const userData = {
    email : data.email,
    password : data.password
  }
  const res = await api.post("/auth/login", userData);
  console.log(res.data.status);
  return res.data.status;
};

export const registerApi = async (data) => {
  const createUser = {
    name : data.name,
    email : data.email,
    mobileNo : data.mobileNo,
    password : data.password
  }
  const res = await api.post("/auth/register", createUser);
  return res.data;
};
