export default {
  namespaced: true,
  state: {
    isNewChatModalOpen: false,
    isDeleteModalOpen: false,
  },
  mutations: {
    SET_NEW_CHAT_MODAL(state, isOpen) {
      state.isNewChatModalOpen = isOpen;
    },
    SET_DELETE_MODAL(state, isOpen) {
      state.isDeleteModalOpen = isOpen;
    },
  },
  actions: {
    openNewChatModal({ commit }) {
      commit("SET_NEW_CHAT_MODAL", true);
    },
    closeNewChatModal({ commit }) {
      commit("SET_NEW_CHAT_MODAL", false);
    },
    openDeleteModal({ commit }) {
      commit("SET_DELETE_MODAL", true);
    },
    closeDeleteModal({ commit }) {
      commit("SET_DELETE_MODAL", false);
    },
  },
  getters: {
    isNewChatModalOpen: (state) => state.isNewChatModalOpen,
    isDeleteModalOpen: (state) => state.isDeleteModalOpen,
  },
};
