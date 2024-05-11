<template>
  <div id="app">
    <el-container>
      <el-header>
        <HeaderBar />
      </el-header>
      <el-main>
        <router-view style="margin-bottom: 80px" />
      </el-main>
      <el-footer :style="{ height }">
        <footer-bar />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import HeaderBar from "./components/HeaderBar";
import FooterBar from "./components/FooterBar";

export default {
  name: "App",
  props: {
    height: {
      type: String,
      default: "10px",
    },
  },
  components: {
    FooterBar,
    HeaderBar,
  },
  created() {
    console.log(document.cookie);
    const hasToken = document.cookie.includes("token=");

    if (
      hasToken &&
      (!this.$store.state.user || !this.$store.state.user.isLogin)
    ) {
      this.postRequest("/api/user/login").then((response) => {
        this.$store.commit("login", response.payload);
      });
    }
    // this.getRequest('/loginStatue').then(resp => {
    //   //console.log(resp)
    //   if (resp === null) return
    //   if (resp.statue === 0) {
    //      this.$store.commit('login', resp.data);
    //   } else {
    //     this.$store.commit('logout')
    //   }
    // })
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
