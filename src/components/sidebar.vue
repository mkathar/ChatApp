<template>
  <div class="sidebar">
    <div class="sidebar__group">
      <div
        v-for="(item, index) in welcomeContent"
        class="sidebar__group__content"
        :class="item.isActive"
        :key="index"
        v-if="this.$route.name === `welcome`"
      >
        <img src="../assets/img/menu-item-bg.png" alt="" />
        <Icon :name="item.contentName" />
        <p class="sidebar__group__content__name">{{ item.displayName }}</p>
      </div>
      <div
        v-for="(item, index) in processContent"
        class="sidebar__group__content"
        :class="item.isActive"
        :key="index"
        v-if="this.$route.name === `login` || this.$route.name === `register`"
      >
        <img src="../assets/img/menu-item-bg.png" alt="" />
        <Icon :name="item.contentName" :size="item.size" />

        <router-link :to="item.url" class="sidebar__group__content__name">{{
          item.displayName
        }}</router-link>
      </div>

      <!-- <div class="sidebar__group__content" :class="work">
        <img src="../assets/img/menu-item-bg.png" alt="" />
        <Icon name="work" />
        <p>Our Work</p>
      </div>
      <div class="sidebar__group__content" :class="gallery">
        <img src="../assets/img/menu-item-bg.png" alt="" />
        <Icon name="gallery" />
        <p class="sidebar__group__content__name">Gallery</p>
      </div>
      <div class="sidebar__group__content" :class="contact">
        <img src="../assets/img/menu-item-bg.png" alt="" />
        <Icon name="contact" />
        <p class="sidebar__group__content__name">Contact</p>
      </div>-->
    </div>
  </div>
</template>

<script>
import { Icon } from "@/icon";

export default {
  data() {
    return {
      welcomeContent: [
        { displayName: "Our Company", contentName: "company", isActive: null },
        { displayName: "How it Works", contentName: "work", isActive: null },
        { displayName: "Gallery", contentName: "gallery", isActive: null },
        { displayName: "Contact", contentName: "contact", isActive: null },
      ],
      processContent: [
        {
          displayName: "Home",
          url: "/",
          contentName: "home",
          isActive: null,
          size: "100px",
        },
        {
          displayName: "Login",
          url: "login",
          contentName: "login",
          isActive: null,
          size: "100px",
        },
        {
          displayName: "Sign In",
          url: "register",
          contentName: "register",
          isActive: null,
          size: "100px",
        },
      ],
      modifier: "active",
      company: null,
      work: null,
      gallery: null,
      contact: null,
    };
  },
  components: { Icon: Icon },

  mounted() {
    window.addEventListener("scroll", this.onScroll);
    this.routeControl();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll);
  },
  created() {
    this.$watch(
      () => this.$route.name,
      (name) => {
        console.log(name);
        this.routeControl();
      }
    );
  },
  methods: {
    onScroll(e) {
      console.log(window.scrollY);
      if (window.scrollY < 500 && this.$route.name === "welcome") {
        this.welcomeContent[0].isActive = this.modifier;
        console.log(this.modifier);
      } else {
        this.welcomeContent[0].isActive = null;
      }
      if (
        window.scrollY >= 500 &&
        window.scrollY <= 1000 &&
        this.$route.name === "welcome"
      ) {
        this.welcomeContent[1].isActive = this.modifier;
      } else {
        this.welcomeContent[1].isActive = null;
      }
      if (
        window.scrollY >= 1000 &&
        window.scrollY <= 2000 &&
        this.$route.name === "welcome"
      ) {
        this.welcomeContent[2].isActive = this.modifier;
      } else {
        this.welcomeContent[2].isActive = null;
      }
      if (
        window.scrollY >= 2000 &&
        window.scrollY <= 3000 &&
        this.$route.name === "welcome"
      ) {
        this.welcomeContent[3].isActive = this.modifier;
      } else {
        this.welcomeContent[3].isActive = null;
      }
    },
    routeControl() {
      if (this.$route.name === "login") {
        this.processContent[1].isActive = this.modifier;
      } else {
        this.processContent[1].isActive = null;
      }
      if (this.$route.name === "signIn") {
        this.processContent[2].isActive = this.modifier;
      } else {
        this.processContent[2].isActive = null;
      }
    },
  },
};
</script>
