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
          @keyup.enter="handleLogin"
        />
        <input
          class="login__form__group__input"
          type="password"
          placeholder="Password"
          v-model="password"
          @keyup.enter="handleLogin"
        />
        <div class="login__form__group__box">
          <div v-if="loginError" class="login__error">
            {{ loginError }}
          </div>
        </div>
        <div class="login__form__group__box">
          <p class="login__form__group__box__ques">
            Don't have an account?
            <router-link to="/register">Sign Up</router-link>
          </p>
          <button
            class="login__form__group__box__btn"
            @click="handleLogin"
            :disabled="isLoading || !isFormValid"
          >
            {{ isLoading ? "Logging in..." : "Login" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { Icon } from "@/icon";

export default {
  name: "Login",
  components: {
    Icon,
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  computed: {
    ...mapState("auth", ["isLoading"]),
    ...mapGetters("auth", ["loginErrorMessage"]),
    loginError() {
      return this.loginErrorMessage;
    },
    isFormValid() {
      return this.email.trim() !== "" && this.password.trim() !== "";
    },
  },
  methods: {
    ...mapActions("auth", ["loginUser"]),
    async handleLogin() {
      if (!this.isFormValid) return;

      try {
        await this.loginUser({
          user_mail: this.email,
          user_password: this.password,
        });
        this.$router.push("/text");
      } catch (error) {
        console.error("Login error", error);
        // Hata zaten Vuex store'da işleniyor, burada ek bir şey yapmaya gerek yok
      }
    },
  },
};
</script>

<style scoped>
.login__error {
  color: gray;

  text-align: center;
}
</style>
