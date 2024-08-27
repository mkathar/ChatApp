<template>
  <div class="fromMessage">
    <div class="fromMessage__group">
      <p class="fromMessage__group__text">{{ message.message_text }}</p>
    </div>
    <p class="fromMessage__time">{{ formatTime(message.sent_at) }}</p>
  </div>
</template>

<script>
export default {
  props: ["message"],
  methods: {
    formatTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
};
</script>

<style scoped></style>
