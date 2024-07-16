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
            type="email"
            placeholder="Email"
            v-model="email"
        />
        <input
            class="signIn__form__group__input"
            type="password"
            placeholder="Password"
            v-model="password"
        />
        <div class="signIn__form__group__box">
          <p class="signIn__form__group__box__ques">
            Do you have an Account? <router-link to="/login">Login</router-link>
          </p>
          <button class="signIn__form__group__box__btn" @click="handleSignIn">
            Sign In
          </button>
        </div>
      </div>
    </div>
    <!-- Hata mesajını göster -->
    <div v-if="signInError" class="error-message">
      {{ signInError }}
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { Icon } from "@/icon";

export default {
  data() {
    return {
      name: '',
      email: '',
      password: ''
    };
  },
  components: {
    Icon: Icon,
  },
  computed: {
    ...mapGetters('auth', ['getSignInError']),
    signInError() {
      return this.getSignInError;
    }
  },
  methods: {
    ...mapActions('auth', ['signIn']),
    async handleSignIn() {
      const newUser = {
        username: this.name,
        email: this.email,
        password: this.password,
      };
      try {
        await this.signIn(newUser);
        // Başarılı kayıt sonrası yapılacak işlemler
        this.$router.push('/login');
      } catch (error) {
        console.error("Kayıt işlemi başarısız:", error);
        // Hata mesajı zaten store'da set edildi, computed property aracılığıyla görüntülenecek
      }
    },
  },
};
</script>

<style scoped>
.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>