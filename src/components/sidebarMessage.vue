<template>
  <div class="sidebarMessage" v-if="this.$route.name == `text`">
    <div class="sidebarMessage__header"></div>
    <div class="sidebarMessage__nav">
      <button class="sidebarMessage__nav__add" @click="openNewChatModal">
        <Icon name="add" />
      </button>
      <div class="sidebarMessage__nav__group">
        <Icon name="search" />
        <input class="sidebarMessage__nav__group__input" type="text" />
      </div>
    </div>

    <Transition name="modal">
      <NewChatModal
        v-if="showNewChatModal"
        :is-group-chat="isGroupChat"
        :selected-users="selectedUsers"
        :new-group-name="newGroupName"
        :search-error="searchError"
        :existing-chat-error="existingChatError"
        @close="closeNewChatModal"
        @user-selected="handleUserSelected"
        @user-removed="handleUserRemoved"
        @create-chat="handleCreateChat"
        @chat-created="handleChatCreated"
      />
    </Transition>

    <div class="sidebarMessage__users">
      <div v-if="!chats.length" class="sidebarMessage__users__load"></div>
      <div
        v-for="chat in chats"
        :key="chat.chat_id"
        class="sidebarMessage__users__content"
        :class="{ active: isActiveChat(chat.chat_id) }"
        @click="MessagesForPartner(chat.chat_id)"
      >
        <div class="sidebarMessage__users__content__img">
          {{ chat.display_name?.charAt(0) }}
        </div>
        <div class="sidebarMessage__users__content__group">
          <div class="sidebarMessage__users__content__group__box">
            <h3 class="sidebarMessage__users__content__group__box__name">
              {{ chat.display_name }}
            </h3>
            <p class="sidebarMessage__users__content__group__box__time">
              {{ formatTime(chat.created_at) }}
            </p>
          </div>
          <p class="sidebarMessage__users__content__group__message">
            {{ chat.last_message }}
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="alertMessage"
      :class="['alert', alertMessage.success ? 'alert-success' : 'alert-error']"
    >
      {{ alertMessage.message }}
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from "vue";
import { Icon } from "../icon.jsx";
import { mapState } from "vuex";
import NewChatModal from "./newChatModal.vue";

export default {
  components: {
    Icon,
    NewChatModal,
  },
  data() {
    return {
      showNewChatModal: false,
      isGroupChat: false,
      selectedUsers: [],
      newGroupName: "",
      allUsers: [],
      searchError: null,
      existingChatError: null,
      alertMessage: null,
      socketInstance: null,
    };
  },
  methods: {
    async MessagesForPartner(chatId) {
      try {
        await this.$store.dispatch("getMessagesForPartner", chatId);

        if (this.socketInstance) {
          this.socketInstance.emit("join chat", chatId);
        }

        this.showMessage();
      } catch (error) {
        console.error("Mesajlar yüklenirken hata:", error);
      }
    },
    showMessage() {
      this.$store.commit("showText", true);
    },
    isActiveChat(chatId) {
      return this.$store.state.activeChat?.chat_id === chatId;
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    openNewChatModal() {
      this.showNewChatModal = true;
    },
    closeNewChatModal() {
      this.showNewChatModal = false;
      this.resetModalData();
    },
    resetModalData() {
      this.isGroupChat = false;
      this.selectedUsers = [];
      this.newGroupName = "";
      this.searchError = null;
      this.existingChatError = null;
      this.allUsers = [];
    },
    async searchUsers(query) {
      if (!query.trim()) {
        this.allUsers = [];
        return;
      }
      try {
        const response = await this.$store.dispatch("searchUsers", query);
        this.allUsers = response;
      } catch (error) {
        this.searchError = "Kullanıcı araması başarısız oldu";
      }
    },
    selectUser(user) {
      if (!this.selectedUsers.some((u) => u.id === user.id)) {
        this.selectedUsers.push(user);
      }
    },
    removeUser(user) {
      this.selectedUsers = this.selectedUsers.filter((u) => u.id !== user.id);
    },
    toggleGroupChat() {
      this.isGroupChat = !this.isGroupChat;
      if (!this.isGroupChat) {
        this.newGroupName = "";
      }
    },
    updateGroupName(name) {
      this.newGroupName = name;
    },
    async createNewChat(chatData) {
      try {
        await this.$store.dispatch("createNewChat", chatData);
        this.closeNewChatModal();
        this.$store.dispatch("fetchChats");
      } catch (error) {
        this.existingChatError = "Sohbet oluşturulamadı";
      }
    },
    handleChatCreated(result) {
      console.log("Sohbet oluşturma sonucu:", result);

      this.alertMessage = result;

      setTimeout(() => {
        this.alertMessage = null;
      }, 3000);
    },
    initializeSocket() {
      const instance = getCurrentInstance();
      if (instance && instance.proxy.$socket) {
        this.socketInstance = instance.proxy.$socket;
        const currentUser = this.$store.state.currentUser;

        console.log("Socket bağlantısı başlatılıyor...");

        this.socketInstance.on("message received", (messageData) => {
          console.log(
            "Socket: Yeni mesaj alındı, store'a gönderiliyor:",
            messageData
          );
          this.$store.dispatch("handleSocketMessage", messageData);
        });

        if (currentUser?.user_id) {
          this.socketInstance.emit("setup", currentUser.user_id);
        }
      } else {
        console.error("Socket bağlantısı bulunamadı!");
      }
    },
  },
  computed: {
    ...mapState({
      chats: (state) => state.chats,
      activeChat: (state) => state.activeChat,
    }),
  },
  created() {
    this.$store.dispatch("fetchChats");
    this.initializeSocket();
  },
  beforeUnmount() {
    if (this.socketInstance) {
      this.socketInstance.off("message received");
    }
  },
};
</script>

<style scoped>
.alert {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  border-radius: 4px;
  z-index: 1000;
}

.alert-success {
  background: #4caf50;
  color: white;
}

.alert-error {
  background: #f44336;
  color: white;
}
</style>
