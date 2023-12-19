import { createStore } from "vuex";
import axiosInstance from "../services/base/baseURL";
import router from "../router/index.js";

const store = createStore({
  state: {
    textActive: false,
    currentUser: [],
    allConversations: [],
    conversationPartners: [],
    conversationMessages: [],
    yourVariable: null,
  },
  mutations: {
    async signIn(state, newUser) {
      console.log(newUser);
      try {
        const response = await axiosInstance.post("/register", newUser);

        if (response.status === 201) {
          alert("Kullanıcı başarıyla kaydedildi.");
        } else {
          alert("Kullanıcı kaydedilirken bir hata oluştu.");
        }
      } catch (error) {
        console.error("İstek sırasında bir hata oluştu:", error);
        alert("Kullanıcı kaydedilirken bir hata oluştu.");
      }
    },
    loginUser(state, authentication) {
      axiosInstance
        .post("/login", {
          user_mail: authentication.currentUserMail,
          user_password: authentication.currentUserPassword,
        })
        .then((response) => {
          state.currentUser = response.data;

          router.push("/text");
        })
        .catch((error) => {
          console.log("kullanıcı kimlik");
          console.error(error);
        });
    },
    logoutUser(state) {
      state.allConversations = "";
      state.currentUser = "";
      state.conversationMessages = "";
      state.conversationPartners = "";
      router.push("/login");
    },
    showText(state, textİsActive) {
      state.textActive = textİsActive;
    },
    setConversationPartners(state, conversationPartners) {
      console.log("setcm", conversationPartners);
      state.conversationPartners = conversationPartners;
    },

    setConversationMessages(state, conversationMessages) {
      console.log(" setConversationMessages", conversationMessages);
      state.conversationMessages = conversationMessages;
    },
    setAllConversations(state, allConversations) {
      console.log(" setAllConversations", allConversations);
      state.allConversations = allConversations;
    },
    setCurrentUser(state, currentUser) {
      console.log(" currentUser", currentUser);
      state.currentUser = currentUser;
    },
    setVariable(state, newValue) {
      state.yourVariable = newValue;
    },
  },
  actions: {
    async getCurrentUser(currentUser) {
      try {
        const response = await axiosInstance.get("/profile");
        // console.log(" CURRENTUSER", response.data);
        currentUser.commit("setCurrentUser", response.data);
      } catch (error) {
        console.error("HENÜZ KULLANICI GİRİŞİ YAPILMAMIŞ OLABİLİR");
        console.error("API hatası:", error);
      }
    },
    async getAllConversations(allConversations) {
      try {
        const response = await axiosInstance.get("/allConversations");
        console.log(" allConversations", response.data);

        allConversations.commit("setAllConversations", response.data);
      } catch (error) {
        console.error("API hatası:", error);
      }
    },
    // async getConversationMessages(conversationMessages) {
    //   try {
    //     const response = await axiosInstance.get("/conversationMessages");
    //     console.log(" conversationMessages", response.data);
    //     conversationMessages.commit("setConversationMessages", response.data);
    //   } catch (error) {
    //     console.error("API hatası:", error);
    //   }
    // },
    async getConversationPartners(conversationPartners) {
      try {
        const response = await axiosInstance.get("/conversationPartners");
        console.log(" conversationPartners", response.data);
        conversationPartners.commit("setConversationPartners", response.data);
      } catch (error) {
        console.error("API hatası:", error);
      }
    },
    updateVariable({ commit }, newValue) {
      return new Promise((resolve, reject) => {
        axiosInstance
          .post("/api/updateVariable", { newValue })
          .then((response) => {
            commit("setVariable", newValue);
            resolve(response);
          })
          .catch((error) => {
            console.error("API hatası:", error);
            reject(error);
          });
      });
    },
    async getMessagesForPartner({ commit }, partner_id) {
      const userId = this.state.currentUser.user_id;
      const partnerId = partner_id;
      console.log("userId", userId);
      console.log("partnerId", partnerId);

      try {
        const response = await axiosInstance.get(
          `/getConversationMessages/${userId}/${partnerId}`
        );
        const data = response.data.conversationMessages;
        commit("setConversationMessages", response.data.conversationMessages);
      } catch (error) {
        console.error("Mesajları alma hatası:", error);
      }
    },
  },
  getters: {},
});

export default store;
