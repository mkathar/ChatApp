<template>
  <div class="ourWork">
    <div class="ourWork__content">
      <div class="ourWork__content__group-1">
        <Icon name="register" :size="100" />

        <router-link class="ourWork__content__group__title" to="/signIn"
          >.01 Get Account</router-link
        >
        <p class="ourWork__content__group__description">
          Take the first step towards seamless communication with your loved
          ones by creating your account today.
        </p>
      </div>
      <div class="ourWork__content__group-2">
        <Icon name="login" :size="100" />

        <router-link class="ourWork__content__group__title" to="/login"
          >.02 Login to App</router-link
        >
        <p class="ourWork__content__group__description">
          Please enter your username and password to access your account. Click
          on the title to begin communicating effortlessly with your loved ones!
        </p>
      </div>
      <div class="ourWork__content__group-3">
        <Icon name="message" :size="100" />
        <h1 class="ourWork__content__group__title">.03 Send Message</h1>
        <p class="ourWork__content__group__description">
          Now, our comprehensive services are fully accessible to you. Take
          advantage of seamless connectivity to stay in touch with your loved
          ones comfortably and effortlessly, all with just a press of the send
          button.
        </p>
      </div>
    </div>
    <div class="ourWork__group">
      <h1 class="ourWork__group__title">How it Works</h1>
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
};
</script>
