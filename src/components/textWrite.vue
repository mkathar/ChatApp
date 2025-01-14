<template>
  <div class="textArea__group">
    <div class="textArea__group__box">
      <input
        class="textArea__group__box__input"
        type="text"
        v-model="message"
        @keyup.enter="sendMessage"
      />
      <Icon name="send" @click="sendMessage" />
    </div>

    <img
      class="textArea__group__img"
      src="https://picsum.photos/id/221/40/40"
      alt=""
    />
  </div>
</template>
<script>
import { mapState } from "vuex";
import { Icon } from "../icon";
import axiosInstance from "../services/base/baseURL";

export default {
  data() {
    return {
      message: "",
    };
  },
  methods: {
    async sendMessage() {
      if (!this.message || !this.activeChat) return;

      const newMessage = {
        message_text: this.message,
        chat_id: this.activeChat.chat_id,
        sender_id: this.currentUser.user_id,
      };

      try {
        const response = await axiosInstance.post("/messages", newMessage);
        if (response.data) {
          this.message = "";
          await this.$store.dispatch(
            "getMessagesForPartner",
            this.activeChat.chat_id
          );
        }
      } catch (error) {
        console.error("Mesaj gönderilirken hata:", error);
      }
    },
  },
  components: {
    Icon: Icon,
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.currentUser,
      activeChat: (state) => state.activeChat,
      textActive: (state) => state.textActive,
    }),
  },
};
</script>
