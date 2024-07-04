<template>
  <div>
    <SidebarMessage />
    <div class="textArea">
      <TextHeader />
      <Text />
    </div>
  </div>
</template>

<script>
import sidebarMessage from "../components/sidebarMessage.vue";
import { Icon } from "../icon";
import textHeader from "../components/textHeader.vue";

import { mapState } from "vuex";
import text from "../components/text.vue";

export default {
  setup() {},
  components: {
    SidebarMessage: sidebarMessage,
    Icon: Icon,
    TextHeader: textHeader,
    Text: text,
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
