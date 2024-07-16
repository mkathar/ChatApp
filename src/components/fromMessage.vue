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

<style scoped>
.fromMessage {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
}
.fromMessage__group {
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  max-width: 70%;
}
.fromMessage__time {
  font-size: 12px;
  color: #999;
  margin-left: 10px;
}
</style>
