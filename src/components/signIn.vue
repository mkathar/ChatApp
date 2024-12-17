<template>
  <div class="signIn">
    <div class="signIn__form">
      <Icon name="register" size="100px" />
      <div class="signIn__form__group">
        <input
          class="signIn__form__group__input"
          type="text"
          placeholder="Name"
          v-model="name"
        />
        <input
          class="signIn__form__group__input"
          type="text"
          placeholder="Email"
          v-model="email"
        />
        <input
          class="signIn__form__group__input"
          type="text"
          placeholder="Password"
          v-model="password"
        />
        <div class="signIn__form__group__box">
          <p class="signIn__form__group__box__ques">
            Do you have a Account? <router-link to="/login">Login</router-link>
          </p>
          <button class="signIn__form__group__box__btn" @click="signIn()">
            Sign In
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Icon } from "../icon";

export default {
  data() {
    return {};
  },
  components: {
    Icon: Icon,
  },
  methods: {
    signIn() {
      const newUser = {
        username: this.name,
        email: this.email,
        password: this.password,
      };
      console.log(newUser);
      this.$store.commit("signIn", newUser);
    },
  },
};
</script>
