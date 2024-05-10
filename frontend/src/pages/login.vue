<template>
  <div class="login" :style="backgroundStyle">
    <div style="height: 20%">.</div>
    <div style="width: 300px; margin-left: auto; margin-right: auto">
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
        v-loading="loading"
        element-loading-text="正在登录..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="loginContainer"
      >
        <h3 class="loginTitle">Bumpty Oj 登录</h3>
        <el-form-item prop="email">
          <el-input
            v-model="loginForm.email"
            placeholder="邮箱"
            prefix-icon="el-icon-s-custom"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="密码"
            v-model="loginForm.password"
            @keydown.enter.native="submitForm('loginForm')"
            prefix-icon="el-icon-key"
          ></el-input>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button
            type="primary"
            @click="submitForm('loginForm')"
            class="submit_btn"
            size="medium"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Message } from "element-ui";
import { postRequest } from "@/utils/request";
export default {
  name: "login",
  data() {
    return {
      loading: false,
      loginForm: {
        email: "",
        password: "",
      },
      rules: {
        email: [{ required: true, message: "请输入邮箱地址", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  computed: {
    backgroundStyle: function () {
      let high = window.innerHeight - 110;
      return (
        "background-image:url('../../image/bupt.jpg'); background-repeat: no-repeat; background-size: cover;background-position: center;height:" +
        high +
        "px;"
      );
    },
  },
  created() {
    document.title = "Bumpty OJ";
  },
  methods: {
    submitForm(loginForm) {
      this.$refs[loginForm].validate(async (valid) => {
        if (!valid) {
          Message.error("表单验证失败");
          return false;
        }
        this.loading = true;
        try {
          const resp = await postRequest("/api/user/login", this.loginForm);
          this.loading = false;
          if (resp && resp.code === "200") {
            this.$db.save("USER", resp.payload);
            this.$db.save("LOGIN", "1");
            this.$store.commit("login", resp.payload);
            this.$router.replace("/problems");
          } else {
            Message.error((resp && resp.error && resp.error.msg) || "登录失败");
          }
        } catch (error) {
          this.loading = false;
          Message.error("网络请求异常或服务器错误");
          console.error("请求错误：", error);
        }
      });
    },
  },
};
</script>

<style>
body {
  margin: 0;
}

.login {
  width: 100%;
}

.loginContainer {
  border-radius: 5px;
  background-clip: padding-box;
  width: 260px;
  padding: 5px 40px 5px 40px;
}

.loginTitle {
  margin: 20px auto 20px auto;
  text-align: center;
  color: #52abff;
  font-size: 26px;
}
</style>
