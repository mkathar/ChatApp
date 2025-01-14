import axiosInstance from "../base/baseURL";

export const userService = {
  searchUsers: (query) => axiosInstance.get(`/users/search?search=${query}`),
};
