<template>
  <div class="modal">
    <div class="modal-content">
      <h3>
        {{ selectedUsers.length > 1 ? "Yeni Grup Sohbeti" : "Yeni Sohbet" }}
      </h3>

      <div class="search-section">
        <input
          v-model="localUserSearchQuery"
          @input="onSearchUsers"
          placeholder="Kullanıcı ara..."
          class="search-input"
        />

        <div v-if="searchResults.length > 0" class="search-results">
          <div
            v-for="user in searchResults"
            :key="user.user_id"
            @click="selectUser(user)"
            class="search-result-item"
          >
            {{ user.user_name }} ({{ user.user_email }})
          </div>
        </div>
      </div>

      <div v-if="selectedUsers.length > 0" class="selected-users">
        <h4>Seçili Kullanıcılar:</h4>
        <div class="selected-user-list">
          <div
            v-for="user in selectedUsers"
            :key="user.user_id"
            class="selected-user-item"
          >
            {{ user.user_name }}
            <span @click="removeUser(user)" class="remove-user">×</span>
          </div>
        </div>
      </div>

      <div v-if="selectedUsers.length > 1" class="group-name-section">
        <input
          v-model="groupName"
          placeholder="Grup ismi girin"
          class="group-name-input"
        />
      </div>

      <div class="modal-actions">
        <button
          @click="createChat"
          :disabled="!canCreateChat"
          class="create-button"
        >
          {{ selectedUsers.length > 1 ? "Grup Oluştur" : "Sohbet Başlat" }}
        </button>
        <button @click="$emit('close')" class="cancel-button">İptal</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { chatService } from "../services/api/chat";

export default {
  name: "NewChatModal",
  data() {
    return {
      localUserSearchQuery: "",
      selectedUsers: [],
      groupName: "",
    };
  },
  computed: {
    ...mapGetters(["getSearchResults"]),
    searchResults() {
      return this.getSearchResults;
    },
    canCreateChat() {
      if (this.selectedUsers.length > 1) {
        return this.selectedUsers.length >= 2 && this.groupName.trim() !== "";
      }
      return this.selectedUsers.length === 1;
    },
  },
  methods: {
    async onSearchUsers() {
      if (this.localUserSearchQuery.length >= 2) {
        await this.$store.dispatch("searchUsers", this.localUserSearchQuery);
      }
    },
    selectUser(user) {
      if (!this.selectedUsers.some((u) => u.user_id === user.user_id)) {
        this.selectedUsers.push(user);
      }
    },
    removeUser(user) {
      this.selectedUsers = this.selectedUsers.filter(
        (u) => u.user_id !== user.user_id
      );
      if (this.selectedUsers.length <= 1) {
        this.groupName = "";
      }
    },
    async createChat() {
      if (!this.canCreateChat) {
        console.log("Oluşturma kontrolü başarısız:", {
          selectedUsers: this.selectedUsers.length,
          hasGroupName: this.groupName.trim() !== "",
        });
        return;
      }

      try {
        const chatData = {
          chat_type: this.selectedUsers.length > 1 ? "group" : "private",
          chat_name: this.selectedUsers.length > 1 ? this.groupName : null,
          participants: this.selectedUsers.map((user) => user.user_id),
        };

        console.log("Sohbet oluşturma isteği:", chatData);
        const response = await chatService.createChat(chatData);
        console.log("Sohbet oluşturuldu:", response.data);

        await this.$store.dispatch("fetchChats");

        this.$emit("close");
      } catch (error) {
        console.error(
          "Sohbet oluşturma hatası:",
          error.response?.data || error
        );
      }
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-results {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 4px;
}

.search-result-item {
  padding: 8px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.search-result-item:hover {
  background: #f5f5f5;
}

.selected-users {
  margin: 15px 0;
}

.selected-user-item {
  display: inline-flex;
  align-items: center;
  background: #6c5ce7;
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  margin: 3px;
}

.remove-user {
  margin-left: 5px;
  cursor: pointer;
  font-weight: bold;
}

.group-name-input {
  width: 100%;
  padding: 8px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.create-button {
  background: #6c5ce7;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.create-button:disabled {
  background: #a8a4d3;
  cursor: not-allowed;
}

.cancel-button {
  background: #f0f0f0;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
