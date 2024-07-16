<template>
  <div class="conversation-list">
    <div v-for="conversation in conversations" :key="conversation.id" @click="selectConversation(conversation)">
      {{ conversation.partner.user_name }}
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ConversationList',
  computed: {
    ...mapState(['conversations'])
  },
  methods: {
    ...mapActions(['setActiveConversation']),
    selectConversation(conversation) {
      this.setActiveConversation(conversation);
    }
  }
}
</script>
