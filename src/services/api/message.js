import axiosInstance from "../base/baseURL";

export const messageService = {
  getMessages: (chatId) => axiosInstance.get(`/messages/${chatId}`),
  sendMessage: (messageData) => axiosInstance.post("/messages", messageData),
};
