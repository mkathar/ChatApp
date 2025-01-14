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
          <button class="login__form__group__box__btn" @click="login">
            Login
          </button>
        </div>
      </div>
    </div>
    <div v-if="passwordControl">
      <h1>Şifre yanlış</h1>
    </div>
  </div>
</template>

<script>
import { Icon } from "../icon";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  components: {
    Icon,
  },
  computed: {
    passwordControl() {
      return this.$store.state.passwordControl;
    },
  },
  methods: {
    async login() {
      try {
        const success = await this.$store.dispatch("loginUser", {
          user_email: this.email,
          password: this.password,
        });

        if (success) {
          this.$router.push("/text");
        }
      } catch (error) {
        console.error("Login failed:", error);
        this.$store.commit("SET_PASSWORD_CONTROL", true);
      }
    },
  },
};
</script>
