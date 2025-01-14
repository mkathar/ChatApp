import { createStore } from "vuex";
import axiosInstance from "../services/base/baseURL";
import { userService } from "../services/api/user";
import { chatService } from "../services/api/chat";
export default createStore({
  state: {
    currentUser: null,
    isAuthenticated: false,
    passwordControl: false,
    userProfile: null,
    chats: [],
    activeChat: null,
    messages: [],
    textActive: false,
    searchResults: [],
    activeSection: 0,
    welcomeSections: [
      {
        displayName: "Our Company",
        contentName: "company",
        isActive: "active",
      },
      { displayName: "How it Works", contentName: "work", isActive: null },
      { displayName: "Gallery", contentName: "gallery", isActive: null },
      { displayName: "Contact", contentName: "contact", isActive: null },
    ],
  },

  mutations: {
    SET_USER(state, user) {
      state.currentUser = user;
      state.isAuthenticated = true;
    },
    SET_PROFILE(state, profile) {
      state.userProfile = profile;
    },
    SET_CHATS(state, chats) {
      state.chats = chats;
    },
    CLEAR_USER(state) {
      state.currentUser = null;
      state.userProfile = null;
      state.chats = [];
      state.isAuthenticated = false;
    },
    SET_ACTIVE_CHAT(state, chat) {
      state.activeChat = chat;
    },
    SET_MESSAGES(state, messages) {
      state.messages = messages;
    },
    showText(state, isActive) {
      state.textActive = isActive;
    },
    SET_SEARCH_RESULTS(state, results) {
      state.searchResults = results;
    },
    SET_ACTIVE_SECTION(state, index) {
      state.welcomeSections.forEach((section) => (section.isActive = null));
      state.welcomeSections[index].isActive = "active";
      state.activeSection = index;
    },
  },

  actions: {
    async loginUser({ commit, dispatch }, credentials) {
      try {
        const response = await axiosInstance.post("/login", credentials);

        if (response.data.success && response.data.token) {
          localStorage.setItem("token", response.data.token);
          commit("SET_USER", response.data.user);

          // Login sonrası profil ve sohbet bilgilerini al
          await dispatch("fetchProfile");
          await dispatch("fetchChats");
          return true;
        }
        return false;
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },

    async fetchProfile({ commit }) {
      try {
        const response = await axiosInstance.get("/profile");
        if (response.data.success) {
          commit("SET_PROFILE", response.data.user);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    },

    async fetchChats({ commit }) {
      try {
        const response = await axiosInstance.get("/conversations");
        const formattedChats = response.data.map((chat) => ({
          chat_id: chat.chat_id,
          chat_type: chat.chat_type,
          chat_name: chat.chat_name,
          created_at: chat.created_at,
          display_name: chat.display_name,
          last_message: chat.last_message,
        }));

        commit("SET_CHATS", formattedChats);
        return formattedChats;
      } catch (error) {
        console.error("Sohbetler yüklenirken hata:", error);
        throw error;
      }
    },

    async checkAuth({ commit, dispatch }) {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          commit("CLEAR_USER");
          return false;
        }

        const response = await axiosInstance.get("/profile");

        if (response.data.success) {
          commit("SET_USER", response.data.user);
          await dispatch("fetchProfile");
          await dispatch("fetchChats");
          return true;
        }

        localStorage.removeItem("token");
        commit("CLEAR_USER");
        return false;
      } catch (error) {
        localStorage.removeItem("token");
        commit("CLEAR_USER");
        return false;
      }
    },

    async getMessagesForPartner({ commit }, chatId) {
      try {
        const response = await axiosInstance.get(`/messages/${chatId}`);
        commit("SET_MESSAGES", response.data);

        // Aktif sohbeti de güncelle
        const activeChat = this.state.chats.find(
          (chat) => chat.chat_id === chatId
        );
        if (activeChat) {
          commit("SET_ACTIVE_CHAT", activeChat);
        }

        return response.data;
      } catch (error) {
        console.error("Mesajlar yüklenirken hata:", error);
        throw error;
      }
    },

    async logout({ commit }) {
      try {
        await axiosInstance.post("/logout");
        localStorage.removeItem("token");
        commit("CLEAR_USER");
      } catch (error) {
        console.error("Çıkış yaparken hata:", error);
        throw error;
      }
    },

    async sendMessage({ commit, state }, { message_text }) {
      try {
        if (!state.activeChat) {
          throw new Error("Aktif sohbet bulunamadı");
        }

        const response = await axiosInstance.post("/messages", {
          chat_id: state.activeChat.chat_id,
          message_text,
        });

        commit("SET_MESSAGES", [...state.messages, response.data]);

        return response.data;
      } catch (error) {
        console.error("Mesaj gönderilirken hata:", error);
        throw error;
      }
    },

    async searchUsers({ commit }, searchTerm) {
      console.log("Store - Arama terimi:", searchTerm);
      try {
        const response = await userService.searchUsers(searchTerm);
        console.log("Store - Backend yanıtı:", response.data);
        commit("SET_SEARCH_RESULTS", response.data);
        return response.data;
      } catch (error) {
        console.error("Store - Arama hatası:", error);
        commit("SET_SEARCH_RESULTS", []);
        return [];
      }
    },

    async handleSocketMessage({ dispatch }, messageData) {
      try {
        console.log("Store: Socket mesajı işleniyor:", messageData);

        // Aktif sohbet kontrolü
        if (this.state.activeChat?.chat_id === messageData.chat_id) {
          console.log("Store: Aktif sohbet mesajları güncelleniyor");
          await dispatch("getMessagesForPartner", messageData.chat_id);
        }

        // Sohbet listesini güncelle
        console.log("Store: Sohbet listesi güncelleniyor");
        await dispatch("fetchChats");
      } catch (error) {
        console.error("Store: Socket mesaj işleme hatası:", error);
      }
    },
  },

  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    currentUser: (state) => state.currentUser,
    userProfile: (state) => state.userProfile,
    chats: (state) => state.chats,
    activeChat: (state) => state.activeChat,
    chatMessages: (state) => state.messages,
    textActive: (state) => state.textActive,
    getSearchResults: (state) => state.searchResults,
  },
});
