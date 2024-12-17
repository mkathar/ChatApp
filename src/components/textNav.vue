<template>
  <nav class="nav" v-if="activeChat">
    <div class="nav__group">
      <div class="nav__group__avatar">
        {{ getInitials(activeChat.display_name) }}
      </div>
      <div>
        <p class="nav__group__name">{{ activeChat.display_name }}</p>
        <p class="nav__group__type">
          {{
            activeChat.chat_type === "private" ? "Özel Sohbet" : "Grup Sohbeti"
          }}
        </p>
      </div>
    </div>
    <div class="nav__group">
      <Icon name="phone" />
      <Icon name="sendMessage" />
    </div>
  </nav>
</template>

<script>
import { mapState } from "vuex";
import { Icon } from "@/icon";

export default {
  components: {
    Icon,
  },

  computed: {
    ...mapState("chats", ["activeChat"]),
    ...mapState("chats", ["chats", "activeChat", "loadingChats", "error"]),

    filteredChats() {
      if (!this.chats) return [];
      return this.chats.filter((chat) => {
        if (!chat || !chat.display_name) {
          console.warn("Invalid chat object:", chat);
          return false;
        }
        return chat.display_name
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());
      });
    },
  },
  methods: {
    getInitials(name) {
      if (!name) return "";
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();
    },
  },
};
</script>

<style scoped>
.nav__group__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 10px;
}
</style>
