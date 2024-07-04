<template>
  <TextNav />
  <Message />
  <TextWrite />
</template>

<script>
import message from "./message.vue";
import textNav from "./textNav.vue";
import textWrite from "./textWrite.vue";

export default {
  data() {
    return {};
  },
  components: {
    Message: message,
    TextWrite: textWrite,
    TextNav: textNav,
  },
};
</script>
