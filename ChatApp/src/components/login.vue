<template>
  <div class="login">
    <div class="login__form">
      <Icon name="login" size="100px" />
      <div class="login__form__group">
        <input
          class="login__form__group__input"
          type="email"
          placeholder="Email"
          v-model="email"
        />
        <input
          class="login__form__group__input"
          type="password"
          placeholder="Password"
          v-model="password"
        />
        <div class="login__form__group__box">
          <p class="login__form__group__box__ques">
            You don't have an account?
            <router-link to="/signIn">Sign In</router-link>
          </p>
          <button class="login__form__group__box__btn" @click="login()">
            Login
          </button>
        </div>
      </div>
    </div>
    <div v-if="passwordControl">
      <h1>şifren Yanlıştı</h1>

      <button @click="selam">123</button>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { Icon } from "../icon";

export default {
  data() {
    return { currentUser: null };
  },
  components: {
    Icon: Icon,
  },
  methods: {
    login() {
      const authentication = {
        currentUserMail: this.email,
        currentUserPassword: this.password,
      };
      this.$store.commit("loginUser", authentication);
    },
    selam() {
      const answer = false;
      this.$store.commit("passwordControl", answer);
    },
  },
  computed: {
    ...mapState({
      passwordControl: (state) => state.passwordControl,
    }),
  },
};
</script>
