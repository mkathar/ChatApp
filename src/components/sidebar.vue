<template>
  <div class="sidebar">
    <div class="sidebar__group">
      <!-- Welcome içeriği için wrapper -->
      <template v-if="$route.name === 'welcome'">
        <div
          v-for="(item, index) in welcomeContent"
          class="sidebar__group__content"
          :class="{ active: item.isActive === 'active' }"
          :key="index"
          @click="scrollToSection(index)"
        >
          <img src="../assets/img/menu-item-bg.png" alt="" />
          <Icon :name="item.contentName" />
          <p class="sidebar__group__content__name">{{ item.displayName }}</p>
        </div>
      </template>

      <!-- Process içeriği için wrapper -->
      <template v-if="$route.name === 'login' || $route.name === 'signIn'">
        <div
          v-for="(item, index) in processContent"
          class="sidebar__group__content"
          :class="item.isActive"
          :key="'process-' + index"
        >
          <img src="../assets/img/menu-item-bg.png" alt="" />
          <Icon :name="item.contentName" :size="item.size" />
          <router-link :to="item.url" class="sidebar__group__content__name">
            {{ item.displayName }}
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { Icon } from "../icon";
import { mapState } from "vuex";

export default {
  data() {
    return {
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
          url: "signIn",
          contentName: "register",
          isActive: null,
          size: "100px",
        },
      ],
      modifier: "active",
      isScrolling: false,
    };
  },
  components: { Icon: Icon },

  mounted() {
    window.addEventListener("keydown", this.handleKeyNavigation);
    window.addEventListener("wheel", this.handleScroll, { passive: false });

    // İlk section'ı aktif et
    setTimeout(() => {
      document.querySelector(".welcome__section").classList.add("active");
    }, 100);

    this.routeControl();
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.handleKeyNavigation);
    window.removeEventListener("wheel", this.handleScroll);
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
  computed: {
    ...mapState(["welcomeSections", "activeSection"]),
    welcomeContent() {
      return this.welcomeSections;
    },
  },
  methods: {
    scrollToSection(index) {
      if (this.isScrolling) return;
      this.isScrolling = true;

      this.$store.commit("SET_ACTIVE_SECTION", index);

      setTimeout(() => {
        this.isScrolling = false;
      }, 100);
    },

    handleScroll(event) {
      if (this.isScrolling) return;
      event.preventDefault();

      // Scroll tekerleği için
      if (
        event.deltaY > 0 &&
        this.activeSection < this.welcomeSections.length - 1
      ) {
        this.scrollToSection(this.activeSection + 1);
      } else if (event.deltaY < 0 && this.activeSection > 0) {
        this.scrollToSection(this.activeSection - 1);
      }
    },

    handleKeyNavigation(e) {
      if (this.$route.name !== "welcome" || this.isScrolling) return;

      if (e.key === "ArrowUp" && this.activeSection > 0) {
        this.scrollToSection(this.activeSection - 1);
      } else if (
        e.key === "ArrowDown" &&
        this.activeSection < this.welcomeSections.length - 1
      ) {
        this.scrollToSection(this.activeSection + 1);
      }
    },
    routeControl() {
      if (this.$route.name == "login") {
        this.processContent[1].isActive = this.modifier;
      } else {
        this.processContent[1].isActive = null;
      }
      if (this.$route.name == "signIn") {
        this.processContent[2].isActive = this.modifier;
      } else {
        this.processContent[2].isActive = null;
      }
    },
  },
};
</script>
