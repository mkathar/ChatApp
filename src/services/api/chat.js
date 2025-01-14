import axiosInstance from "../base/baseURL";

export const chatService = {
  createChat: (chatData) => {
    console.log("ChatService - Sohbet oluşturma isteği:", chatData);
    return axiosInstance.post("/conversations", chatData); // Backend'deki doğru endpoint
  },
};
