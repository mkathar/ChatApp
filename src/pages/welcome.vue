<template>
  <div class="welcome">
    <Sidebar />
    <transition name="fade" mode="out-in">
      <component
        :is="currentSection"
        :key="activeSection"
        class="welcome__section"
        :class="{ active: true }"
      />
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Hi from "../components/hi.vue";
import OurWork from "../components/ourWork.vue";
import OurGallery from "../components/ourGallery.vue";
import Contact from "../components/contact.vue";
import Sidebar from "../components/sidebar.vue";

export default {
  components: {
    Sidebar,
    Hi,
    OurWork,
    OurGallery,
    Contact,
  },
  created() {
    this.$store.commit("SET_ACTIVE_SECTION", 0);
  },
  computed: {
    ...mapState(["activeSection"]),
    currentSection() {
      const sections = ["Hi", "OurWork", "OurGallery", "Contact"];
      return sections[this.activeSection] || "Hi";
    },
  },
};
</script>
