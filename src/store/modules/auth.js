import axiosInstance from "../../services/base/baseURL";
const TOKEN_KEY = "user_token";

export default {
  namespaced: true,
  state: {
    currentUser: null,
    loginError: null,
    isLoading: false,
    signInError: null,
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user
        ? {
            id: user.id || user.user_id,
            name: user.name || user.username || user.user_name,
            email: user.email,
          }
        : null;
    },
    setLoginError(state, error) {
      state.loginError = error;
    },
    setLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    setSignInError(state, error) {
      state.signInError = error;
    },
  },
  actions: {
    async loginUser({ commit, dispatch }, credentials) {
      commit("setLoading", true);
      commit("setLoginError", null);
      try {
        const response = await axiosInstance.post("/login", credentials);
        const { user, token } = response.data;
        commit("setCurrentUser", user);
        dispatch("setToken", token);
        return user;
      } catch (error) {
        console.error("Login error", error);
        const errorMessage =
          error.response?.data?.message || "An error occurred during login.";
        commit("setLoginError", errorMessage);
        throw error;
      } finally {
        commit("setLoading", false);
      }
    },
    async signIn({ commit }, newUser) {
      commit("setSignInError", null);
      try {
        const response = await axiosInstance.post("/register", newUser);
        return response.data;
      } catch (error) {
        console.error("Sign in error", error);
        const errorMessage =
          error.response?.data?.message || "An error occurred during sign in.";
        commit("setSignInError", errorMessage);
        throw error;
      }
    },
    async fetchCurrentUser({ commit }) {
      try {
        const response = await axiosInstance.get("/profile");
        commit("setCurrentUser", response.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
        throw error;
      }
    },
    async logout({ commit }, callback) {
      try {
        await axiosInstance.get("/logout");
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        commit("setCurrentUser", null);
        localStorage.removeItem(TOKEN_KEY);
        delete axiosInstance.defaults.headers.common["Authorization"];
        if (typeof callback === "function") {
          callback();
        }
      }
    },
    setToken({ commit }, token) {
      localStorage.setItem(TOKEN_KEY, token);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    },
    async initAuth({ dispatch, commit }) {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        commit("setLoading", true);
        try {
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;
          await dispatch("fetchCurrentUser");
        } catch (error) {
          console.error("Error initializing auth:", error);
          dispatch("logout");
        } finally {
          commit("setLoading", false);
        }
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.currentUser,
    getSignInError: (state) => state.signInError,
    loginErrorMessage: (state) => state.loginError,
  },
};
