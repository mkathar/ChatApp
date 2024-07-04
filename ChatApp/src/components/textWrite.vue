<template>
  <div class="textArea__group">
    <div class="textArea__group__box">
      <input
        class="textArea__group__box__input"
        type="text"
        v-model="message"
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
    return {};
  },
  methods: {
    async sendMessage() {
      var currentdate = new Date();
      var datetime =
        currentdate.getDate() +
        "-" +
        (currentdate.getMonth() + 1) +
        "-" +
        currentdate.getFullYear() +
        " " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();
      const newMessage = {
        message_text: this.message,
        message_time: datetime,
        receiver_id: this.conversationMessages.mesajlaşılanKişi.user_id,
        sender_id: this.currentUser.user_id,
      };
      console.log(newMessage);
      if (newMessage.message_text) {
        try {
          const response = await axiosInstance.post("/sendmessage", newMessage);

          if (response.status === 201) {
            alert("Mesaj başarıyla gönderildi.");
          } else {
            alert("Mesaj gönderilirken bir hata oluştu.");
          }
        } catch (error) {
          console.error("İstek sırasında bir hata oluştu:", error);
          alert("Mesaj gönderilirken bir hata oluştu.");
        }
      }
    },
  },
  components: {
    Icon: Icon,
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.currentUser,
      allConversations: (state) => state.allConversations,
      conversationPartners: (state) => state.conversationPartners,
      conversationMessages: (state) => state.conversationMessages,
      textActive: (state) => state.textActive,
    }),
  },
};
</script>
