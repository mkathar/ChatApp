<template>
  <div class="sidebarMessage" v-if="this.$route.name == `text`">
    <div class="sidebarMessage__header"></div>
    <div class="sidebarMessage__nav">
      <div class="sidebarMessage__nav__group">
        <Icon name="search" />
        <input class="sidebarMessage__nav__group__input" type="text" />
      </div>
    </div>
    <div class="sidebarMessage__users">
      <div v-if="!allConversations" class="sidebarMessage__users__load"></div>

      <div
        v-if="allConversations"
        v-for="(message, index) in allConversations"
        class="sidebarMessage__users__content"
        :key="index"
        @click="MessagesForPartner"
        :id="message.mesajlaşılanKişi_Id"
      >
        <img
          class="sidebarMessage__users__content__img"
          :src="message.img"
          alt=""
        />
        <div class="sidebarMessage__users__content__group">
          <div class="sidebarMessage__users__content__group__box">
            <h3
              v-text="message.mesajlaşılanKişi"
              class="sidebarMessage__users__content__group__box__name"
            ></h3>
            <p
              v-text="message.message_time"
              class="sidebarMessage__users__content__group__box__time"
            ></p>
          </div>
          <p
            v-text="message.Mesajlar[0].message_text"
            class="sidebarMessage__users__content__group__message"
          ></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { io } from "socket.io-client";
import { Icon } from "../icon.jsx";
import axios from "axios";
import axiosInstance from "../services/base/baseURL.js";
import { mapState } from "vuex";

export default {
  data() {
    return {
      messages: [],
      wait: true,
    };
  },
  components: {
    Icon,
  },
  methods: {
    MessagesForPartner(e) {
      console.log(e.targetid);
      const partner_id = e.target.id;
      this.showMessage();
      console.log(partner_id);
      this.$store.dispatch("getMessagesForPartner", partner_id);
    },
    updateVariable(e) {
      const newValue = e.target.id;
      this.$store
        .dispatch("updateVariable", newValue)
        .then((response) => {
          // Başarılı yanıt
          console.log(response.data);
        })
        .catch((error) => {
          // Hata durumu
          console.error("İşlem hatası:", error);
        });
    },

    showMessage() {
      const textisActive = true;
      this.$store.commit("showText", textisActive);
    },
    async checkSession() {
      try {
        const response = await axiosInstance.get("/oturum-durumu");
        this.isLoggedIn = response.data.isLoggedIn;
        console.log("oturum açık");
      } catch (error) {
        console.error(error);
        this.isLoggedIn = false;
      }
    },
  },
  created() {
    this.checkSession();
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.currentUser,
      allConversations: (state) => state.allConversations,
      conversationPartners: (state) => state.conversationPartners,
      conversationMessages: (state) => state.conversationMessages,
      textActive: (state) => state.textActive,
    }),
  },
  mounted() {},
};
</script>
