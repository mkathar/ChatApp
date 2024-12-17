<template>
  <div class="welcome">
    <Hi />
    <Sidebar />
    <OurWork />
    <OurGallery />
    <Contact />
  </div>
</template>

<script>
import hi from "../components/hi.vue";
import sidebar from "../components/sidebar.vue";
import ourWork from "../components/ourWork.vue";
import ourGallery from "../components/ourGallery.vue";

import contact from "../components/contact.vue";
export default {
  name: "Home",
  data() {
    return {};
  },
  components: {
    Hi: hi,
    Sidebar: sidebar,
    OurWork: ourWork,
    OurGallery: ourGallery,
    Contact: contact,
  },
};
</script>
