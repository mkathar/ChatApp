<template>
  <div class="message__container">
    <div v-if="loadingMessages">Loading messages...</div>
    <div v-else-if="error">{{ error }}</div>
    <div class="message__container__group" v-else-if="messages.length">
      <div v-for="message in sortedMessages" :key="message.message_id">
        <outgoingMessage
          v-if="isCurrentUserMessage(message)"
          :message="message"
          :showSender="activeChat.chat_type === 'group'"
        />
        <fromMessage
          v-else
          :message="message"
          :showSender="activeChat.chat_type === 'group'"
        />
      </div>
    </div>
    <div class="noMessage_container" v-else>henüz mesaj başlatılmamış</div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import outgoingMessage from "./outgoingMessage.vue";
import fromMessage from "./fromMessage.vue";

export default {
  components: {
    outgoingMessage,
    fromMessage,
  },
  computed: {
    ...mapState("messages", ["messages", "loadingMessages", "error"]),
    ...mapState("auth", ["currentUser"]),
    ...mapState("chats", ["activeChat"]),
    ...mapGetters("messages", ["getSortedMessages"]),
    sortedMessages() {
      return this.getSortedMessages;
    },
  },
  methods: {
    ...mapActions("messages", ["fetchMessages"]),
    isCurrentUserMessage(message) {
      return message.sender_id === this.currentUser.id;
    },
  },
  watch: {
    activeChat: {
      immediate: true,
      handler(newActiveChat) {
        if (newActiveChat) {
          this.fetchMessages(newActiveChat.chat_id);
        }
      },
    },
  },
  mounted() {
    if (this.activeChat) {
      this.fetchMessages(this.activeChat.chat_id);
    }
  },
};
</script>
