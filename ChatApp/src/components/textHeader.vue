<template>
  <header class="header">
    <div class="header__group">
      <h1 class="header__title">Welcome</h1>
      <Icon name="line" />
      <div class="header__group__box">
        <img
          class="header__group__box__img"
          src=" https://picsum.photos/id/237/40/40"
          alt=""
        />
        <p
          class="header__group__box__name"
          v-text="this.$store.state.currentUser.user_name"
        ></p>
        <Icon name="logout" :size="32" @click="logout" />
      </div>
    </div>
  </header>
</template>

<script>
import { Icon } from "../icon";
import axiosInstance from "../services/base/baseURL";

export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {
    async logout() {
      try {
        const response = await axiosInstance.get("/oturumu-kapat");
        if (response.status === 200) {
          this.isLoggedIn = false;
          this.$store.commit("logoutUser");
        } else {
          console.error("Oturumu sonlandırma başarısız oldu");
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
  components: {
    Icon: Icon,
  },
};
</script>
