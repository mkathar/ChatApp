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

  watch: {
    $route(to, from) {
      this.$store.dispatch("getCurrentUser");
      this.$store.dispatch("getAllConversations");

      this.$store.dispatch("getConversationPartners");
    },
  },
};
</script>
