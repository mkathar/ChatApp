import { createStore } from "vuex";
import auth from "./modules/auth";
import chats from "./modules/chats";
import messages from "./modules/messages";
import { io } from "socket.io-client";
import ui from "./modules/ui";
export default createStore({
  state: {
    socket: null,
  },
  mutations: {
    SET_SOCKET(state, socket) {
      state.socket = socket;
    },
  },
  actions: {
    initSocket({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        if (!this.state.socket) {
          const socket = io("http://localhost:3000", {
            withCredentials: true,
          });

          socket.on("connect", () => {
            console.log("WebSocket connected");
            commit("SET_SOCKET", socket);

            socket.on("message received", (message) => {
              dispatch("messages/addSocketMessage", message);
            });

            socket.on("chats updated", (chats) => {
              dispatch("chats/updateChats", chats);
            });

            resolve(socket);
          });

          socket.on("connect_error", (error) => {
            console.error("WebSocket connection error:", error);
            reject(error);
          });
        } else {
          resolve(this.state.socket);
        }
      });
    },
    joinChat({ state }, chatId) {
      if (state.socket) {
        state.socket.emit("join chat", chatId);
      }
    },
    leaveChat({ state }, chatId) {
      if (state.socket) {
        state.socket.emit("leave chat", chatId);
      }
    },
    sendMessage({ state }, messageData) {
      if (state.socket) {
        state.socket.emit("new message", messageData);
      }
    },
  },
  modules: {
    auth,
    chats,
    messages,
    ui,
  },
});
