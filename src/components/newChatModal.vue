<template>
  <div class="new-chat-modal">
    <div class="new-chat-modal__content">
      <h3 class="new-chat-modal__title">
        {{ isGroupChat ? "Yeni Grup Oluştur" : "Yeni Sohbet Başlat" }}
      </h3>

      <!-- Hata mesajı alanı -->
      <div v-if="existingChatError" class="new-chat-modal__error">
        {{ existingChatError }}
      </div>

      <div class="new-chat-modal__search">
        <input
          v-model="localUserSearchQuery"
          @input="$emit('searchUsers', localUserSearchQuery)"
          placeholder="Kullanıcı ara"
          class="new-chat-modal__search-input"
        />
        <div v-if="searchError" class="new-chat-modal__error">
          {{ searchError }}
        </div>

        <ul v-if="allUsers.length > 0" class="new-chat-modal__results">
          <li
            v-for="user in allUsers"
            :key="user.id"
            @click="$emit('selectUser', user)"
            class="new-chat-modal__result-item"
          >
            {{ user.name }} ({{ user.email }})
          </li>
        </ul>
        <div
          v-else-if="localUserSearchQuery && !searchError"
          class="new-chat-modal__no-results"
        >
          Kullanıcı bulunamadı
        </div>
      </div>

      <div class="new-chat-modal__selected">
        <h4 class="new-chat-modal__subtitle">Seçilen Kullanıcılar:</h4>
        <ul class="new-chat-modal__selected-list">
          <li
            v-for="user in selectedUsers"
            :key="user.id"
            class="new-chat-modal__selected-item"
          >
            {{ user.name }}
            <button
              @click="$emit('removeUser', user)"
              class="new-chat-modal__remove-btn"
            >
              X
            </button>
          </li>
        </ul>
      </div>

      <div class="new-chat-modal__type">
        <button
          @click="$emit('toggleGroupChat')"
          class="new-chat-modal__toggle-btn"
        >
          {{ isGroupChat ? "Özel Sohbet" : "Grup Sohbeti" }}
        </button>
      </div>

      <input
        v-if="isGroupChat"
        v-model="localNewGroupName"
        placeholder="Grup adı"
        @input="$emit('update:newGroupName', localNewGroupName)"
        class="new-chat-modal__group-name-input"
      />

      <div class="new-chat-modal__actions">
        <button
          @click="
            $emit('createChat', {
              participants: selectedUsers.map((user) => user.id),
              chatName: isGroupChat ? localNewGroupName : null,
              isGroup: isGroupChat,
            })
          "
          :disabled="!canCreateChat || existingChatError"
          class="new-chat-modal__create-btn"
        >
          Oluştur
        </button>
        <button @click="$emit('close')" class="new-chat-modal__cancel-btn">
          İptal
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewChatModal",
  props: {
    isGroupChat: {
      type: Boolean,
      required: true,
    },
    selectedUsers: {
      type: Array,
      required: true,
    },
    newGroupName: {
      type: String,
      default: "",
    },
    allUsers: {
      type: Array,
      required: true,
    },
    searchError: {
      type: String,
      default: null,
    },
    existingChatError: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      localUserSearchQuery: "",
      localNewGroupName: this.newGroupName,
    };
  },
  computed: {
    canCreateChat() {
      if (this.isGroupChat) {
        return (
          this.selectedUsers.length > 1 && this.localNewGroupName.trim() !== ""
        );
      } else {
        return this.selectedUsers.length === 1;
      }
    },
  },
  watch: {
    newGroupName(newValue) {
      this.localNewGroupName = newValue;
    },
  },
  methods: {
    resetForm() {
      this.localUserSearchQuery = "";
      this.localNewGroupName = "";
    },
  },
};
</script>

<style scoped>
.new-chat-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.new-chat-modal__content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
}

.new-chat-modal__title {
  margin-bottom: 20px;
  text-align: center;
}

.new-chat-modal__search-input,
.new-chat-modal__group-name-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.new-chat-modal__error,
.new-chat-modal__no-results {
  color: red;
  margin-bottom: 10px;
}

.new-chat-modal__results {
  list-style-type: none;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.new-chat-modal__result-item {
  padding: 10px;
  cursor: pointer;
}

.new-chat-modal__result-item:hover {
  background-color: #f0f0f0;
}

.new-chat-modal__selected-list {
  list-style-type: none;
  padding: 0;
}

.new-chat-modal__selected-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  background-color: #f0f0f0;
  margin-bottom: 5px;
  border-radius: 4px;
}

.new-chat-modal__remove-btn,
.new-chat-modal__toggle-btn,
.new-chat-modal__create-btn,
.new-chat-modal__cancel-btn {
  padding: 5px 10px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.new-chat-modal__remove-btn {
  background-color: #ff4444;
  color: white;
}

.new-chat-modal__toggle-btn {
  background-color: #4caf50;
  color: white;
}

.new-chat-modal__create-btn {
  background-color: #2196f3;
  color: white;
}

.new-chat-modal__create-btn:disabled {
  background-color: #b0b0b0;
  cursor: not-allowed;
}

.new-chat-modal__cancel-btn {
  background-color: #f44336;
  color: white;
}

.new-chat-modal__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
