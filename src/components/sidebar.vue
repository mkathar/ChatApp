<template>
  <div class="sidebar">
    <div class="sidebar__group">
      <template v-if="$route.name === 'welcome'">
        <div
          v-for="(item, index) in welcomeContent"
          :key="index"
          class="sidebar__group__content"
          :class="{ active: item.isActive }"
        >
          <img src="../assets/img/menu-item-bg.png" alt="" />
          <Icon :name="item.contentName" />
          <p class="sidebar__group__content__name">{{ item.displayName }}</p>
        </div>
      </template>
      <template v-else>
        <div
          v-for="(item, index) in processContent"
          :key="index"
          class="sidebar__group__content"
          :class="{ active: isActiveRoute(item.url) }"
        >
          <img src="../assets/img/menu-item-bg.png" alt="" />
          <Icon :name="item.contentName" :size="item.size" />
          <router-link :to="item.url" class="sidebar__group__content__name">
            {{ item.displayName }}
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { Icon } from "@/icon";

export default {
  components: { Icon },
  data() {
    return {
      welcomeContent: [
        { displayName: "Our Company", contentName: "company", isActive: false },
        { displayName: "How it Works", contentName: "work", isActive: false },
        { displayName: "Gallery", contentName: "gallery", isActive: false },
        { displayName: "Contact", contentName: "contact", isActive: false },
      ],
      processContent: [
        { displayName: "Home", url: "/", contentName: "home", size: "100px" },
        {
          displayName: "Login",
          url: "/login",
          contentName: "login",
          size: "100px",
        },
        {
          displayName: "Sign Up",
          url: "/register",
          contentName: "register",
          size: "100px",
        },
      ],
    };
  },
  methods: {
    isActiveRoute(url) {
      return this.$route.path === url;
    },
    onScroll() {
      if (this.$route.name !== "welcome") return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      this.welcomeContent.forEach((item, index) => {
        const sectionHeight =
          (documentHeight - windowHeight) / this.welcomeContent.length;
        const start = index * sectionHeight;
        const end = (index + 1) * sectionHeight;
        item.isActive = scrollY >= start && scrollY < end;
      });
    },
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll);
    this.onScroll(); // İlk yüklemede aktif öğeyi belirlemek için
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll);
  },
};
</script>
