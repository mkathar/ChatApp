import axiosInstance from "../../services/base/baseURL";

export default {
  namespaced: true,
  state: {
    chats: [],
    activeChat: null,
    loadingChats: false,
    error: null,
  },
  mutations: {
    setChats(state, chats) {
      state.chats = chats;
    },
    setActiveChat(state, chat) {
      state.activeChat = chat;
    },
    addChat(state, chat) {
      state.chats.push(chat);
    },
    updateChat(state, updatedChat) {
      const index = state.chats.findIndex(
        (chat) => chat.chat_id === updatedChat.chat_id
      );
      if (index !== -1) {
        state.chats.splice(index, 1, updatedChat);
      }
    },
    setLoadingChats(state, isLoading) {
      state.loadingChats = isLoading;
    },
    setError(state, error) {
      state.error = error;
    },
  },
  actions: {
    async fetchChats({ commit }) {
      commit("setLoadingChats", true);
      commit("setError", null);
      try {
        const response = await axiosInstance.get("/user-chats");
        commit("setChats", response.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
        commit("setError", "Failed to fetch chats");
      } finally {
        commit("setLoadingChats", false);
      }
    },
    async createChat({ commit }, { chatType, chatName, participantIds }) {
      commit("setError", null);
      try {
        const response = await axiosInstance.post("/chats", {
          chatType,
          chatName,
          participantIds,
        });
        commit("addChat", response.data);
        return response.data;
      } catch (error) {
        console.error("Error creating chat:", error);
        commit("setError", "Failed to create chat");
        throw error;
      }
    },
    setActiveChat({ commit, dispatch, rootState }, chat) {
      commit("setActiveChat", chat);
      if (rootState.socket) {
        rootState.socket.emit("join chat", chat.chat_id);
      }
      dispatch("messages/fetchMessages", chat.chat_id, { root: true });
    },
    async updateChat({ commit }, updatedChat) {
      commit("setError", null);
      try {
        const response = await axiosInstance.put(
          `/chats/${updatedChat.chat_id}`,
          updatedChat
        );
        commit("updateChat", response.data);
        return response.data;
      } catch (error) {
        console.error("Error updating chat:", error);
        commit("setError", "Failed to update chat");
        throw error;
      }
    },
    // WebSocket üzerinden gelen sohbet güncellemelerini işleme
    updateChats({ commit }, chats) {
      commit("setChats", chats);
    },
  },
  getters: {
    getActiveChat: (state) => state.activeChat,
    getAllChats: (state) => state.chats,
    getChatById: (state) => (id) => {
      return state.chats.find((chat) => chat.chat_id === id);
    },
    getLoadingStatus: (state) => state.loadingChats,
    getError: (state) => state.error,
  },
};
