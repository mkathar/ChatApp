<template>
  <div class="message-list">
    <div v-for="message in activeConversationMessages" :key="message.id">
      {{ message.content }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState('auth', ['currentUser']),
    ...mapState('conversations', ['activeConversation']),
    ...mapGetters('messages', ['sortedMessages']),
  },
};
</script>
