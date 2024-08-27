<template>
  <header class="header">
    <div class="header__group">
      <h1 class="header__title">Welcome</h1>
      <Icon name="line" />
      <div class="header__group__box" v-if="currentUser">
        <div class="header__group__box__avatar">
          {{ getInitials(currentUser.name) }}
        </div>
        <p class="header__group__box__name">{{ currentUser.name }}</p>
        <Icon name="logout" :size="32" @click="handleLogout" />
      </div>
    </div>
  </header>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Icon } from "@/icon";

export default {
  computed: {
    ...mapState("auth", ["currentUser"]),
  },
  methods: {
    ...mapActions("auth", ["logout"]),
    getInitials(name) {
      if (!name) return "";
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();
    },
    handleLogout() {
      this.logout(() => {
        this.$router.push("/");
      });
    },
  },
  components: {
    Icon,
  },
};
</script>

<style scoped>
.header__group__box__avatar {
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
