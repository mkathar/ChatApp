import { createWebHistory, createRouter } from "vue-router";

import welcome from "../pages/welcome.vue";
import process from "../pages/process.vue";
import text from "../pages/text.vue";
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
    path: "/signIn",
    name: "signIn",
    component: process,
  },
  {
    path: "/text",
    name: "text",
    component: text,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
