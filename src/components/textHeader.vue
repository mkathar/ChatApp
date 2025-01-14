<template>
  <header class="header">
    <div class="header__group">
      <h1 class="header__title">Welcome</h1>
      <Icon name="line" />
      <div class="header__group__box">
        <img
          class="header__group__box__img"
          src="https://picsum.photos/id/237/40/40"
          alt=""
        />
        <p class="header__group__box__name">
          {{ currentUser?.user_name }}
        </p>
        <Icon name="logout" :size="32" @click="logout" />
      </div>
    </div>
  </header>
</template>

<script>
import { Icon } from "../icon";
import { mapState } from "vuex";

export default {
  components: {
    Icon,
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.currentUser,
    }),
  },
  methods: {
    async logout() {
      try {
        await this.$store.dispatch("logout");
        this.$router.push("/login");
      } catch (error) {
        console.error("Çıkış yapılırken hata:", error);
      }
    },
  },
};
</script>
