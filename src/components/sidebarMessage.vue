<template>
  <div class="sidebar-message" v-if="$route.name === 'text'">
    <div
      class="sidebar-message__container"
      :class="{ 'sidebar-message__container--blur': isAnyModalOpen }"
    >
      <div class="sidebar-message__header"></div>
      <div class="sidebar-message__nav">
        <div class="sidebar-message__nav__group">
          <Icon name="search" />
          <input
            class="sidebar-message__nav__group__input"
            type="text"
            v-model="searchQuery"
            placeholder="Search or start new chat"
          />
        </div>
        <button @click="openNewChatModal" class="sidebar-message__new-chat-btn">
          <Icon name="add" />
        </button>
      </div>
      <ChatList
        :chats="filteredChats"
        :activeChat="activeChat"
        :loadingChats="loadingChats"
        :error="error"
        :currentUser="currentUser"
        @setActiveChat="handleSetActiveChat"
        @openDeleteModal="handleOpenDeleteModal"
      />
    </div>

    <NewChatModal
      v-if="isNewChatModalOpen"
      :isGroupChat="isGroupChat"
      :selectedUsers="selectedUsers"
      :newGroupName="newGroupName"
      :allUsers="allUsers"
      :searchError="searchError"
      :existingChatError="existingChatError"
      @close="closeNewChatModal"
      @createChat="createNewChat"
      @toggleGroupChat="toggleGroupChat"
      @searchUsers="searchUsers"
      @selectUser="selectUser"
      @removeUser="removeUser"
      @updateNewGroupName="updateNewGroupName"
    />
    <DeleteChatModal
      v-if="isDeleteModalOpen"
      :chatToDelete="chatToDelete"
      @close="handleCloseDeleteModal"
      @confirmDelete="confirmDeleteChat"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { Icon } from "../icon.jsx";
import { debounce } from "lodash";
import axiosInstance from "../services/base/baseURL";
import ChatList from "./ChatList.vue";
import NewChatModal from "./NewChatModal.vue";
import DeleteChatModal from "./DeleteChatModal.vue";

export default {
  name: "SidebarMessage",
  components: {
    Icon,
    ChatList,
    NewChatModal,
    DeleteChatModal,
  },
  data() {
    return {
      searchQuery: "",
      userSearchQuery: "",
      allUsers: [],
      selectedUsers: [],
      isGroupChat: false,
      newGroupName: "",
      searchError: null,
      chatToDelete: null,
      existingChatError: null,
    };
  },
  computed: {
    ...mapState("chats", ["chats", "activeChat", "loadingChats", "error"]),
    ...mapState("auth", ["currentUser"]),
    ...mapState("ui", ["isNewChatModalOpen", "isDeleteModalOpen"]),
    ...mapGetters("chats", ["getAllChats"]),
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
    isAnyModalOpen() {
      return this.isNewChatModalOpen || this.isDeleteModalOpen;
    },
  },
  methods: {
    ...mapActions("chats", [
      "fetchChats",
      "setActiveChat",
      "createChat",
      "deleteChat",
    ]),
    ...mapActions("messages", ["fetchMessages"]),
    ...mapActions("ui", [
      "openNewChatModal",
      "closeNewChatModal",
      "openDeleteModal",
      "closeDeleteModal",
    ]),

    searchUsers: debounce(async function (query) {
      this.searchError = null;
      if (!query.trim()) {
        this.allUsers = [];
        return;
      }

      try {
        const response = await axiosInstance.get("/users/search", {
          params: { query: query },
        });

        if (response.data && Array.isArray(response.data)) {
          this.allUsers = response.data.map((user) => ({
            id: user.user_id,
            name: user.username,
            email: user.email,
            profilePicture: user.profile_picture_url,
            bio: user.bio,
          }));
        } else {
          this.allUsers = [];
          console.warn(
            "Unexpected response format from user search API:",
            response.data
          );
        }
      } catch (error) {
        console.error("Error searching users:", error);
        this.searchError = `Kullanıcı araması sırasında bir hata oluştu: ${
          error.response?.data?.message || error.message
        }`;
        this.allUsers = [];
      }
    }, 300),

    async handleSetActiveChat(chat) {
      try {
        await this.setActiveChat(chat);
        await this.fetchMessages(chat.chat_id);
      } catch (error) {
        console.error("Error setting active chat or fetching messages:", error);
      }
    },

    async createNewChat(chatData) {
      try {
        this.existingChatError = null;
        if (!chatData.isGroup) {
          const existingChat = this.chats.find(
            (chat) =>
              chat.chat_type === "private" &&
              chat.participants.includes(chatData.participants[0]) &&
              chat.participants.includes(this.currentUser.id)
          );

          if (existingChat) {
            this.existingChatError =
              "Bu kullanıcı ile zaten bir sohbetiniz var. Sohbete Yönlendiriliyorsun";
            setTimeout(() => {
              this.closeNewChatModal();
              this.setActiveChat(existingChat);
              this.$router.push({
                name: "text",
                params: { chatId: existingChat.chat_id },
              });
            }, 2000);
            return;
          }
        }

        const newChat = await this.createChat(chatData);
        this.closeNewChatModal();
        this.setActiveChat(newChat);
        this.$router.push({
          name: "text",
          params: { chatId: newChat.chat_id },
        });
      } catch (error) {
        console.error("Yeni sohbet oluşturma hatası:", error);
        this.existingChatError = "Sohbet oluşturulurken bir hata oluştu.";
      }
    },

    selectUser(user) {
      if (
        !this.selectedUsers.some((selectedUser) => selectedUser.id === user.id)
      ) {
        this.selectedUsers.push(user);
      }
      this.userSearchQuery = "";
      this.allUsers = [];
    },

    removeUser(user) {
      this.selectedUsers = this.selectedUsers.filter(
        (selectedUser) => selectedUser.id !== user.id
      );
    },

    toggleGroupChat() {
      this.isGroupChat = !this.isGroupChat;
      if (!this.isGroupChat && this.selectedUsers.length > 1) {
        this.selectedUsers = [this.selectedUsers[0]];
      }
      this.newGroupName = "";
    },

    updateNewGroupName(name) {
      this.newGroupName = name;
    },

    handleOpenDeleteModal(chat) {
      this.chatToDelete = chat;
      this.openDeleteModal();
    },

    handleCloseDeleteModal() {
      this.chatToDelete = null;
      this.closeDeleteModal();
    },

    async confirmDeleteChat() {
      if (this.chatToDelete) {
        try {
          await this.deleteChat(this.chatToDelete.chat_id);
          this.handleCloseDeleteModal();
        } catch (error) {
          console.error("Failed to delete chat:", error);
        }
      }
    },
  },
  created() {
    this.fetchChats();
  },
  mounted() {
    this.updateInterval = setInterval(() => {
      this.fetchChats();
    }, 60000);
  },
  beforeUnmount() {
    clearInterval(this.updateInterval);
  },
};
</script>
