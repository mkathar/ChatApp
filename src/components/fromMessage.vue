<template>
  <div class="fromMessage">
    <div class="fromMessage__box">
      <p v-if="showSender" class="fromMessage__box__sender">
        {{ message.sender_name }}
      </p>
      <div class="fromMessage__group">
        <p class="fromMessage__group__text">{{ message.message_text }}</p>
      </div>
    </div>
    <p class="fromMessage__time">{{ formatTime(message.sent_at) }}</p>
  </div>
</template>
<script>
export default {
  props: ["message", "showSender"],
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
