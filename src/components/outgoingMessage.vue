<template>
  <div class="outgoingMessage">
    <p class="outgoingMessage__time">{{ formatTime(message.sent_at) }}</p>
    <div class="outgoingMessage__group">
      <p class="outgoingMessage__group__text">{{ message.message_text }}</p>
    </div>
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

<style scoped>
.outgoingMessage {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
.outgoingMessage__group {
  background-color: #dcf8c6;
  padding: 10px;
  border-radius: 10px;
  max-width: 70%;
}
.outgoingMessage__time {
  font-size: 12px;
  color: #999;
  margin-right: 10px;
}
</style>
