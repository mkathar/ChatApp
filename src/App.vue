<template>
  <RouterView :key="$route.fullPath"></RouterView>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "App",
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
    ...mapState(["socket"]),
  },
  methods: {
    ...mapActions("auth", ["initAuth", "fetchCurrentUser"]),
    ...mapActions("conversations", ["fetchConversations"]),
    ...mapActions(["initSocket"]),
    async initializeApp() {
      await this.initAuth();
      if (this.isAuthenticated) {
        await this.fetchCurrentUser();
        await this.fetchConversations();
      }
      await this.initSocket();
    },
  },
  created() {
    this.initializeApp();
  },
  watch: {
    isAuthenticated(newValue) {
      if (newValue) {
        this.fetchCurrentUser();
        this.fetchConversations();
      }
    },
    socket(newSocket) {
      if (newSocket) {
        console.log("WebSocket bağlantısı kuruldu");

        newSocket.on("error", (error) => {
          console.error("WebSocket hatası:", error);
        });

        newSocket.on("disconnect", (reason) => {
          console.log("WebSocket bağlantısı koptu:", reason);
        });

        newSocket.on("reconnect", (attemptNumber) => {
          console.log(
            "WebSocket yeniden bağlandı, deneme sayısı:",
            attemptNumber
          );
          if (this.isAuthenticated) {
            this.fetchConversations();
          }
        });
      }
    },
  },
};
</script>

<style>
/* Genel stil tanımlamaları buraya eklenebilir */
</style>
