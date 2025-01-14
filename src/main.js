import { createApp } from "vue";
import App from "./App.vue";
import "./assets/scss/main.css";

import store from "./store/store";
import router from "./router";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true,
  autoConnect: true,
});

const app = createApp(App);

if (process.env.NODE_ENV === "development") {
  app.config.devtools = true;
}

app.config.globalProperties.$socket = socket;

app.use(store);
app.use(router);
app.mount("#app");

socket.on("connect", () => {
  console.log("Socket.IO bağlantısı kuruldu");
});

socket.on("connect_error", (error) => {
  console.error("Socket.IO bağlantı hatası:", error);
});
