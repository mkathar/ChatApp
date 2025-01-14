<template>
  <RouterView :key="$route.fullPath"></RouterView>
</template>
<script>
import Welcome from "./pages/welcome.vue";

export default {
  data() {
    return {};
  },
  components: { Welcome },

  async created() {
    // Sayfa yüklendiğinde auth kontrolü
    if (localStorage.getItem("token")) {
      await this.$store.dispatch("checkAuth");
    }
  },

  watch: {
    $route: {
      async handler(to) {
        const token = localStorage.getItem("token");

        // Auth gerektiren route'lar için kontrol
        if (to.meta.requiresAuth && !token) {
          this.$router.push("/login");
        }

        // Text sayfasına gidildiğinde auth kontrolü
        if (to.name === "text" && token) {
          await this.$store.dispatch("checkAuth");
        }
      },
      immediate: true,
    },
  },
};
</script>
