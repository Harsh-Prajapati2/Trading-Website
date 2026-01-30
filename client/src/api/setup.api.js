import api from "./axios";

export const updateUsername = async (username) => {
  try {
    const res = await api.post("/auth/username", { username });
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to update username" };
  }
};

export const getUserProfile = async () => {
  try {
    const res = await api.get("/auth/profile");
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch profile" };
  }
};
