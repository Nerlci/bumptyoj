<template>
  <div>
    <div class="user-bar">
      <div v-if="!this.$store.state.status.isLogin">
        <el-button @click="Login" icon="el-icon-user" type="primary"
          >登录</el-button
        >
        <el-button @click="Register" icon="el-icon-edit">注册</el-button>
      </div>
      <div v-else>
        <el-button @click="userInfo" type="primary">{{
          this.$store.state.status.username
        }}</el-button>
        <el-button @click="logout" type="info">注销</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Message } from "element-ui";

export default {
  name: "UserBar",
  methods: {
    Login() {
      this.$router.push({ name: "login" });
    },
    Register() {
      this.$router.push({ name: "register" });
    },
    userInfo() {
      this.$router.push({ name: "user" });
    },
    logout() {
      this.getRequest("/api/user/logout").then(() => {
        this.$store.commit("logout");
        Message.info("注销成功");
        location.reload();
      });
    },
    Manager() {
      this.$router.push({ name: "problemAdd" });
    },
  },
};
</script>

<style scoped>
.user-bar {
  margin-top: 10px;
  margin-right: 20%;
  text-align: right;
}
</style>
