<template>
  <div>
    <Sidebar />
    <div v-if="this.$route.name === `signIn`"><SignIn /></div>

    <div v-if="this.$route.name === `login`"><Login /></div>
  </div>
</template>

<script>
import sidebar from "../components/sidebar.vue";
import { Icon } from "@/icon";
import signIn from "../components/signIn.vue";
import login from "../components/login.vue";

export default {
  data() {
    return {};
  },
  components: {
    Sidebar: sidebar,
    Icon: Icon,
    SignIn: signIn,
    Login: login,
  },
};
</script>
