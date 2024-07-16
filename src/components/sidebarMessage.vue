<template>
  <div class="sidebarMessage" v-if="$route.name === 'text'">
    <div class="sidebarMessage__header"></div>

    <div class="sidebarMessage__nav">
      <div class="sidebarMessage__nav__group">
        <Icon name="search" />

        <input
          class="sidebarMessage__nav__group__input"
          type="text"
          v-model="searchQuery"
          placeholder="Search or start new chat"
        />
      </div>
    </div>

    <div class="sidebarMessage__users">
      <div v-if="loadingChats" class="sidebarMessage__users__load">
        Loading chats...
      </div>

      <div v-else-if="error" class="sidebarMessage__users__error">
        {{ error }}
      </div>

      <div
        v-else-if="chats && chats.length"
        class="sidebarMessage__users__list"
      >
        <div
          v-for="chat in filteredChats"
          :key="chat.chat_id"
          class="sidebarMessage__users__content"
          @click="handleSetActiveChat(chat)"
          :class="{ active: activeChat && activeChat.chat_id === chat.chat_id }"
        >
          <div class="sidebarMessage__users__content__avatar">
            {{ getInitials(chat.display_name) }}
          </div>

          <div class="sidebarMessage__users__content__group">
            <div class="sidebarMessage__users__content__group__box">
              <h3 class="sidebarMessage__users__content__group__box__name">
                {{ chat.display_name }}
              </h3>

              <p class="sidebarMessage__users__content__group__box__time">
                {{ formatDate(chat.latest_message_sent_at) }}
              </p>
            </div>

            <p class="sidebarMessage__users__content__group__message">
              {{ chat.latest_message_text || "No messages yet" }}
            </p>

            <p class="sidebarMessage__users__content__group__last-seen">
              {{ getLastSeenStatus(chat) }}
            </p>
          </div>
        </div>
      </div>

      <div v-else class="sidebarMessage__users__empty">No chats found.</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

import { Icon } from "../icon.jsx";

export default {
  name: "SidebarMessage",

  components: {
    Icon,
  },

  data() {
    return {
      searchQuery: "",
    };
  },

  computed: {
    ...mapState("chats", ["chats", "activeChat", "loadingChats", "error"]),

    ...mapState("auth", ["currentUser"]),

    ...mapGetters("chats", ["getAllChats"]),

    filteredChats() {
      if (!this.chats) return [];

      return this.chats.filter((chat) =>
        chat.display_name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },

  methods: {
    ...mapActions("chats", ["fetchChats", "setActiveChat"]),

    ...mapActions("messages", ["fetchMessages"]),

    formatDate(dateString) {
      if (!dateString) return "";

      const date = new Date(dateString);

      return date.toLocaleTimeString([], {
        hour: "2-digit",

        minute: "2-digit",
      });
    },

    getInitials(name) {
      return name

        .split(" ")

        .map((word) => word[0])

        .join("")

        .toUpperCase();
    },

    async handleSetActiveChat(chat) {
      console.log("Setting active chat:", chat);

      try {
        await this.setActiveChat(chat);

        console.log(
          "Active chat set, fetching messages for chat ID:",

          chat.chat_id
        );

        await this.fetchMessages(chat.chat_id);

        console.log("Messages fetched successfully");
      } catch (error) {
        console.error("Error setting active chat or fetching messages:", error);

        // You might want to show an error message to the user here
      }
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

      return ""; // Grup sohbetleri için farklı bir yaklaşım uygulayabilirsiniz
    },
  },

  created() {
    this.fetchChats();
  },

  mounted() {
    // Belirli aralıklarla sohbetleri güncelle (örneğin her 1 dakikada bir)

    this.updateInterval = setInterval(() => {
      this.fetchChats();
    }, 60000); // 60000 ms = 1 dakika
  },

  beforeUnmount() {
    // Komponent yok edilmeden önce interval'i temizle

    clearInterval(this.updateInterval);
  },
};
</script>

<style scoped>
.sidebarMessage__users__content__avatar {
  width: 40px;

  height: 40px;

  border-radius: 50%;

  background-color: #ccc;

  display: flex;

  justify-content: center;

  align-items: center;

  font-weight: bold;
}

.sidebarMessage__users__content.active {
  background-color: #e6e6e6;
}

.sidebarMessage__users__error {
  color: red;

  padding: 10px;

  text-align: center;
}

.sidebarMessage__users__empty {
  text-align: center;

  padding: 20px;

  color: #888;
}

.sidebarMessage__users__content__group__last-seen {
  font-size: 0.8em;

  color: #888;

  margin-top: 5px;
}
</style>
