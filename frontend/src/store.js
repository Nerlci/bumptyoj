import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: {
      isLogin: false,
      username: "",
      userId: 0,
      type: 1, //0管理员，1普通用户，2教师
    },
  },
  mutations: {
    login(state, payload) {
      if (payload === null) return;
      state.status.isLogin = true;
      state.status.username = payload.username;
      state.status.userId = payload.userId;
      state.status.type = payload.type;
    },
    logout(state) {
      state.status.isLogin = false;
      state.status.username = "";
      (state.status.userId = 0), (state.status.type = 1);
    },
  },
  actions: {},
});
