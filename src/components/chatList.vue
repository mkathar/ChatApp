<template>
  <div class="chat-list">
    <div v-if="loadingChats" class="chat-list__loading">Loading chats...</div>
    <div v-else-if="error" class="chat-list__error">
      {{ error }}
    </div>
    <div v-else-if="chats && chats.length" class="chat-list__items">
      <div
        v-for="chat in chats"
        :key="chat.chat_id"
        class="chat-list__item"
        :class="{
          'chat-list__item--active':
            activeChat && activeChat.chat_id === chat.chat_id,
        }"
        @click="$emit('setActiveChat', chat)"
      >
        <div class="chat-list__avatar">
          {{ getInitials(chat.display_name) }}
        </div>
        <div class="chat-list__content">
          <div class="chat-list__header">
            <h3 class="chat-list__name">{{ chat.display_name }}</h3>
            <p class="chat-list__time">
              {{ formatDate(chat.latest_message_sent_at) }}
            </p>
          </div>
          <p class="chat-list__message">
            {{ truncateMessage(chat.latest_message_text) }}
          </p>
          <p class="chat-list__status">
            {{ getLastSeenStatus(chat) }}
          </p>
        </div>
        <button
          v-if="activeChat && activeChat.chat_id === chat.chat_id"
          @click.stop="$emit('openDeleteModal', chat)"
          class="chat-list__delete-btn"
        >
          <Icon name="trash" />
        </button>
      </div>
    </div>
    <div v-else class="chat-list__empty">No chats found.</div>
  </div>
</template>

<script>
import { Icon } from "../icon.jsx";

export default {
  name: "ChatList",
  components: { Icon },
  props: {
    chats: {
      type: Array,
      required: true,
    },
    activeChat: {
      type: Object,
      default: null,
    },
    loadingChats: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: null,
    },
    currentUser: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getInitials(name) {
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();
    },
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    getLastSeenStatus(chat) {
      if (chat.chat_type === "private") {
        const otherUserId = chat.participants.find(
          (id) => id !== this.currentUser.id
        );
        const lastSeen = chat.last_seen_times[otherUserId];
        if (!lastSeen) return "Offline";
        const lastSeenDate = new Date(lastSeen);
        const now = new Date();
        const diffMinutes = Math.floor((now - lastSeenDate) / 60000);
        if (diffMinutes < 1) return "Online";
        if (diffMinutes < 60) return `Last seen ${diffMinutes} minutes ago`;
        if (diffMinutes < 1440)
          return `Last seen ${Math.floor(diffMinutes / 60)} hours ago`;
        return `Last seen ${Math.floor(diffMinutes / 1440)} days ago`;
      }
      return "";
    },
    truncateMessage(message) {
      if (!message) return "No messages yet";
      const words = message.split(" ");
      if (words.length > 4) {
        return words.slice(0, 4).join(" ") + "...";
      }
      return message;
    },
  },
};
</script>
