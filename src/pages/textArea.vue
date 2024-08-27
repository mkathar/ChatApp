<template>
  <SidebarMessage />
  <div class="textArea">
    <div
      :class="{ 'blur-background': isNewChatModalOpen || isDeleteModalOpen }"
    >
      <TextHeader />
      <Text />
    </div>
  </div>
</template>

<script>
import sidebarMessage from "../components/sidebarMessage.vue";
import { Icon } from "@/icon";
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
  computed: {
    ...mapState("ui", ["isNewChatModalOpen", "isDeleteModalOpen"]),
    ...mapState(["textActive"]),
  },
  mounted() {},
};
</script>

<style scoped>
.blur-background {
  filter: blur(5px);
  transition: filter 0.3s ease;
}
</style>
