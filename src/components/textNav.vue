<template>
  <nav class="nav" v-if="textActive">
    <div class="nav__group">
      <img
        class="nav__group__img"
        src="https://picsum.photos/id/232/40/40"
        alt=""
      />
      <p class="nav__group__name" v-if="activeChat">
        {{ activeChat.display_name }}
      </p>
    </div>
    <div class="nav__group">
      <Icon name="phone" />
      <Icon name="sendMessage" />
    </div>
    <div class="nav__group--1">
      <div class="nav__group--1__box">
        <p class="nav__group--1__box__title">Company</p>
        <p class="nav__group--1__box__text">Process</p>
      </div>
      <div class="nav__group--1__box">
        <p class="nav__group--1__box__title">Status</p>
        <div class="nav__group--1__box__dot"></div>
      </div>
    </div>
    <button class="nav__button" @click="showMessage">
      <Icon name="close" />
    </button>
  </nav>
  <nav class="nav" v-if="!textActive">
    <p></p>
  </nav>
</template>

<script>
import { mapState } from "vuex";
import { Icon } from "../icon";

export default {
  data() {
    return { noPartner: "unknowUser" };
  },
  components: {
    Icon: Icon,
  },
  methods: {
    showMessage() {
      this.$store.commit("CLEAR_ACTIVE_CHAT");
    },
  },
  computed: {
    ...mapState({
      activeChat: (state) => state.activeChat,
      textActive: (state) => state.textActive,
    }),
  },
};
</script>
