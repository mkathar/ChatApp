import axiosInstance from "../base/baseURL";

export const authService = {
  login: (credentials) => axiosInstance.post("/login", credentials),
  register: (userData) => axiosInstance.post("/register", userData),
  logout: () => axiosInstance.post("/logout"),
  getProfile: () => axiosInstance.get("/profile"),
};
