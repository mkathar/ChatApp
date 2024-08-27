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
    REMOVE_CHAT(state, chatId) {
      state.chats = state.chats.filter((chat) => chat.chat_id !== chatId);
    },
  },
  actions: {
    async fetchChats({ commit }) {
      commit("setLoadingChats", true);
      commit("setError", null);
      try {
        console.log("Fetching chats...");
        const response = await axiosInstance.get("/user-chats");
        console.log("Chats fetched successfully:", response.data);
        commit("setChats", response.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
        console.error("Error response:", error.response);
        commit("setError", "Failed to fetch chats");
      } finally {
        commit("setLoadingChats", false);
      }
    },
    async deleteChat({ commit, dispatch }, chatId) {
      try {
        await axiosInstance.delete(`/chats/${chatId}`);
        commit("REMOVE_CHAT", chatId);
        dispatch("setActiveChat", null);
      } catch (error) {
        console.error("Error deleting chat:", error);
        throw error;
      }
    },
    async createChat(
      { commit, dispatch },
      { participants, chatName, isGroup }
    ) {
      try {
        const response = await axiosInstance.post("/new-chat", {
          participants,
          chatName,
          isGroup,
        });

        commit("addChat", response.data);

        await dispatch("fetchChats");

        dispatch("setActiveChat", response.data);

        return response.data;
      } catch (error) {
        console.error("Error creating new chat:", error);
        throw error;
      }
    },
    async setActiveChat({ commit, dispatch, rootState, state }, chat) {
      if (!chat.display_name || !chat.participants) {
        const fullChat = state.chats.find((c) => c.chat_id === chat.chat_id);
        if (fullChat) {
          chat = { ...fullChat };
        }
      }

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
