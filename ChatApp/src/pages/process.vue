<template>
  <div>
    <Sidebar />
    <div v-if="this.$route.name == `signIn`"><SigIn /></div>

    <div v-if="this.$route.name == `login`"><Login /></div>
  </div>
</template>

<script>
import sidebar from "../components/sidebar.vue";
import { Icon } from "../icon";
import sigIn from "../components/signIn.vue";
import login from "../components/login.vue";

export default {
  data() {
    return {};
  },
  components: {
    Sidebar: sidebar,
    Icon: Icon,
    SigIn: sigIn,
    Login: login,
  },
};
</script>
