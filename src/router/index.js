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
    path: "/signIn",
    name: "signIn",
    component: process,
  },
  {
    path: "/text",
    name: "text",
    component: textArea,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else {
    next();
  }
});

export default router;
