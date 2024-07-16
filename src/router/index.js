import { createWebHistory, createRouter } from "vue-router";

import welcome from "../pages/welcome.vue";
import process from "../pages/process.vue";
import textArea from "../pages/textArea.vue";
const routes = [
  {
    path: "/",
    name: "welcome",
    component: welcome,
  },
  {
    path: "/login",
    name: "login",
    component: process,
  },
  {
    path: "/register",
    name: "signIn",
    component: process,
  },
  {
    path: "/text",
    name: "text",
    component: textArea,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
