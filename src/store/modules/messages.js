import axiosInstance from "../../services/base/baseURL";

export default {
  namespaced: true,
  state: {
    messages: [],
    loadingMessages: false,
    error: null,
  },
  mutations: {
    setMessages(state, messages) {
      state.messages = messages;
    },
    addMessage(state, message) {
      const existingMessage = state.messages.find(
        (m) => m.message_id === message.message_id
      );
      if (!existingMessage) {
        state.messages.push(message);
      }
    },
    setLoadingMessages(state, isLoading) {
      state.loadingMessages = isLoading;
    },
    setError(state, error) {
      state.error = error;
    },
  },
  actions: {
    async fetchMessages({ commit }, chatId) {
      console.log("Fetching messages for chat ID:", chatId);
      commit("setLoadingMessages", true);
      commit("setError", null);
      try {
        const response = await axiosInstance.get(`/messages/${chatId}`);
        console.log("Messages received:", response.data);
        commit("setMessages", response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
        commit("setError", "Failed to fetch messages");
      } finally {
        commit("setLoadingMessages", false);
      }
    },
    async sendMessage({ commit, rootState }, { chatId, messageText }) {
      try {
        const response = await axiosInstance.post("/messages", {
          chat_id: chatId,
          message_text: messageText,
        });

        commit("addMessage", response.data);

        if (rootState.socket) {
          rootState.socket.emit("new message", response.data);
        }

        return response.data;
      } catch (error) {
        console.error("Mesaj gönderme hatası:", error);
        throw error;
      }
    },

    addSocketMessage({ commit, rootState }, message) {
      if (message.sender_id !== rootState.auth.currentUser.id) {
        commit("addMessage", message);
      }
    },
  },
  getters: {
    getSortedMessages: (state) =>
      [...state.messages].sort(
        (a, b) => new Date(a.sent_at) - new Date(b.sent_at)
      ),
  },
};
