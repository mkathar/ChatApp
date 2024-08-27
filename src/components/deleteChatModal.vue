<template>
  <div class="delete-chat-modal">
    <div class="delete-chat-modal__content">
      <h3 class="delete-chat-modal__title">Sohbeti Sil</h3>
      <p class="delete-chat-modal__message">
        "{{ chatToDelete.display_name }}" sohbetini gerçekten silmek istiyor
        musunuz? Bu işlem geri alınamaz.
      </p>
      <div class="delete-chat-modal__actions">
        <button
          @click="$emit('confirmDelete')"
          class="delete-chat-modal__delete-btn"
        >
          Evet, Sil
        </button>
        <button @click="$emit('close')" class="delete-chat-modal__cancel-btn">
          İptal
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DeleteChatModal",
  props: {
    chatToDelete: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.delete-chat-modal {
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

.delete-chat-modal__content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
}

.delete-chat-modal__title {
  color: #e53935;
  margin-bottom: 20px;
  text-align: center;
}

.delete-chat-modal__message {
  margin-bottom: 20px;
  text-align: center;
}

.delete-chat-modal__actions {
  display: flex;
  justify-content: space-between;
}

.delete-chat-modal__delete-btn,
.delete-chat-modal__cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.delete-chat-modal__delete-btn {
  background-color: #e53935;
  color: white;
}

.delete-chat-modal__delete-btn:hover {
  background-color: #c62828;
}

.delete-chat-modal__cancel-btn {
  background-color: #e0e0e0;
  color: #333;
}

.delete-chat-modal__cancel-btn:hover {
  background-color: #bdbdbd;
}
</style>
