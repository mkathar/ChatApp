<template>
  <div class="textArea__group">
    <div class="textArea__group__box">
      <input
        class="textArea__group__box__input"
        type="text"
        v-model="messageText"
        @keyup.enter="handleSendMessage"
        placeholder="Type a message..."
      />
      <Icon name="send" @click="handleSendMessage" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Icon } from "@/icon";

export default {
  components: {
    Icon,
  },
  data() {
    return {
      messageText: "",
    };
  },
  computed: {
    ...mapState("chats", ["activeChat"]),
  },
  methods: {
    ...mapActions("messages", ["sendMessage"]),
    async handleSendMessage() {
      if (!this.messageText.trim() || !this.activeChat) return;

      try {
        await this.sendMessage({
          chatId: this.activeChat.chat_id,
          messageText: this.messageText,
        });
        this.messageText = "";
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    },
  },
};
</script>

<style scoped>
.textArea__group__box {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f0f0f0;
}
.textArea__group__box__input {
  flex-grow: 1;
  padding: 10px;
  border: none;
  border-radius: 20px;
  margin-right: 10px;
}
</style>
