<template>
  <div>
    <SidebarMessage />
    <div class="textArea">
      <TextHeader />
      <div v-if="$store.state.textActive">
        <TextNav />
        <Message />
        <TextWrite />
      </div>
    </div>
  </div>
</template>

<script>
import message from "../components/message.vue";
import sidebarMessage from "../components/sidebarMessage.vue";
import { Icon } from "../icon";
import textHeader from "../components/textHeader.vue";
import textWrite from "../components/textWrite.vue";
import { mapState } from "vuex";
import textNav from "../components/textNav.vue";

export default {
  setup() {},
  components: {
    Message: message,
    SidebarMessage: sidebarMessage,
    Icon: Icon,
    TextHeader: textHeader,
    TextWrite: textWrite,
    TextNav: textNav,
  },
  watch: {
    $route(to, from) {
      console.log("New route path: " + to.path);
      console.log("Old route path: " + from.path);
    },
  },

  mounted() {},

  computed: {
    ...mapState(["textActive"]),
  },
};
</script>
