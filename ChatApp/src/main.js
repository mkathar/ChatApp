import { createApp } from "vue";
import App from "./App.vue";
import "./assets/scss/main.css";

import store from "./store/store";
import router from "./router";

const app = createApp(App);

app.use(store);
app.use(router);
app.mount("#app");
