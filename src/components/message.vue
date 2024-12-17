<template>
  <div class="message-container">
    <div class="message-container__t" v-if="conversationMessages && textActive">
      <div
        v-for="message in conversationMessages.Mesajlar"
        :key="message.message_id"
        :class="{
          outgoingMessage: isSentMessage(message),
          fromMessage: isReceivedMessage(message),
        }"
      >
        <div
          :class="{
            outgoingMessage__group: isSentMessage(message),
            fromMessage__group: isReceivedMessage(message),
          }"
        >
          <p>{{ message.message_text }}</p>
          <p>{{ message.message_time }}</p>
        </div>
      </div>
    </div>
    <div class="message-container__noMessage" v-if="!textActive">
      <h1 class="message-container__noMessage__content">
        Henüz bir mesaj başlatmadın...
      </h1>
    </div>
  </div>
</template>

<script>
import outgoingMessage from "./outgoingMessage.vue";
import fromMessage from "./fromMessage.vue";
import textNav from "./textNav.vue";
import { mapState } from "vuex";
export default {
  data() {
    return {
      dizi: [1, 2, 3, 4],
    };
  },
  components: {
    OutgoingMessage: outgoingMessage,
    FromMessage: fromMessage,
    TextNav: textNav,
  },
  methods: {
    isSentMessage(message) {
      return message.sender_id === this.currentUser.user_id;
    },
    isReceivedMessage(message) {
      return message.receiver_id === this.currentUser.user_id;
    },
    selam() {
      console.log(this.textActive);
    },
  },

  computed: {
    ...mapState({
      conversationMessages: (state) => state.conversationMessages,
      currentUser: (state) => state.currentUser,
      textActive: (state) => state.textActive,
    }),
    conversationMessagess() {
      const sortedMessages = this.conversationMessages.Mesajlar.sort(
        (a, b) => new Date(a.message_time) - new Date(b.message_time)
      );
      const groupedMessages = sortedMessages.reduce((result, message) => {
        const key = message.sender_id === 0 ? "user" : "other";
        result[key] = result[key] || [];
        result[key].push(message);
        return result;
      }, {});
      return [
        ...(groupedMessages.user || []),
        ...(groupedMessages.other || []),
      ];
    },
    currentUserID() {
      return 0;
    },
  },
  watch: {
    textActive(to, from) {
      console.log(this.textActive);
    },
  },
};
</script>
