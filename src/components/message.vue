<template>
  <div class="message-container">
    <div class="message-container__t" v-if="activeChat">
      <div
        v-for="message in chatMessages"
        :key="message.message_id"
        :class="{
          outgoingMessage: isSentMessage(message),
          fromMessage: !isSentMessage(message),
        }"
      >
        <div v-if="!isSentMessage(message)" class="fromMessage">
          <div class="fromMessage__img">
            {{ getInitials(message.sender_name) }}
          </div>
          <div class="fromMessage__group">
            <p class="fromMessage__group__text">{{ message.message_text }}</p>
          </div>
          <p class="fromMessage__time">{{ formatTime(message.sent_at) }}</p>
        </div>

        <div v-else class="outgoingMessage">
          <p class="outgoingMessage__time">{{ formatTime(message.sent_at) }}</p>
          <div class="outgoingMessage__group">
            <p class="outgoingMessage__group__text">
              {{ message.message_text }}
            </p>
          </div>
          <div class="outgoingMessage__img">
            {{ getInitials(currentUser.user_name) }}
          </div>
        </div>
      </div>
    </div>
    <div class="message-container__noMessage" v-else>
      <h1 class="message-container__noMessage__content">Bir sohbet seçin...</h1>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  methods: {
    isSentMessage(message) {
      return message.sender_id === this.currentUser?.user_id;
    },
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    getInitials(name) {
      if (!name) return "";
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();
    },
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.currentUser,
      activeChat: (state) => state.activeChat,
      chatMessages: (state) => state.messages,
    }),
  },
  watch: {
    "activeChat.chat_id": {
      immediate: true,
      handler(newChatId) {
        if (newChatId) {
          this.$store.dispatch("getMessagesForPartner", newChatId);
        }
      },
    },
  },
};
</script>
