<template>
  <div class="login">
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
      <p class="loginTitle">登录你的账户</p>

      <el-card class="box-card" shadow="hover">
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
        <el-form-item style="margin: 0">
          <el-button
            type="primary"
            @click="submitForm('loginForm')"
            class="submitBtn"
            size="medium"
            >登录</el-button
          >
        </el-form-item>
      </el-card>
    </el-form>

    <el-card class="register-prompt" shadow="hover">
      新用户？<router-link to="/register" class="link">注册</router-link>
    </el-card>
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
            this.$router.replace("/home");
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.loginContainer {
  border-radius: 5px;
  background-clip: padding-box;
  width: 80%;
  max-width: 450px;
  padding: 5px 40px 5px 40px;
}

.loginTitle {
  margin: 20px auto 20px auto;
  text-align: center;
  font-size: 26px;
}

.submitBtn {
  width: 100%;
}

.box-card {
  border-radius: 10px;
  background-clip: padding-box;
}

link {
  color: #409eff;
}
.link:visited {
  color: #409eff;
}

.register-prompt {
  text-align: center;
  margin-top: 20px;
  border-radius: 10px;
  max-width: 450px;
  background: #f8f8f8;
  background-clip: padding-box;
  width: 80%;
}
</style>
