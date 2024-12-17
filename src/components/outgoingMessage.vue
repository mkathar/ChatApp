<template>
  <div class="outgoingMessage">
    <p class="outgoingMessage__time">{{ formatTime(message.sent_at) }}</p>
    <div class="outgoingMessage__box">
      <p v-if="showSender" class="outgoingMessage__box__sender">
        {{ message.sender_name }}
      </p>
      <div class="outgoingMessage__group">
        <p class="outgoingMessage__group__text">{{ message.message_text }}</p>
      </div>
    </div>
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
