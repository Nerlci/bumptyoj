<template>
  <div class="register" :style="backgroundStyle">
    <el-form
      :model="registerForm"
      :rules="rules"
      ref="registerForm"
      v-loading="loading"
      element-loading-text="正在提交信息..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="registerContainer"
    >
      <p class="registerTitle">注册新用户</p>

      <el-card class="box-card" shadow="hover">
        <el-form-item prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="用户名"
            prefix-icon="el-icon-s-custom"
          ></el-input>
        </el-form-item>

        <el-form-item prop="email">
          <el-input
            type="email"
            v-model="registerForm.email"
            placeholder="邮箱"
            prefix-icon="el-icon-message"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="密码"
            v-model="registerForm.password"
            prefix-icon="el-icon-key"
          ></el-input>
        </el-form-item>

        <el-form-item prop="repassword">
          <el-input
            type="password"
            placeholder="确认密码"
            v-model="registerForm.repassword"
            @keydown.enter.native="submitForm('registerForm')"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>

        <el-form-item style="margin: 0">
          <el-button
            type="primary"
            @click="submitForm('registerForm')"
            class="submitBtn"
            size="medium"
            >注册</el-button
          >
        </el-form-item>
      </el-card>
    </el-form>

    <el-card class="login-prompt" shadow="hover">
      已有帐户？<router-link to="/login" class="link">登录</router-link>
    </el-card>
  </div>
</template>

<script>
import { Message } from "element-ui";
import { postRequest } from "@/utils/request";
export default {
  name: "register",
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.registerForm.repassword !== "") {
          this.$refs.registerForm.validateField("repassword");
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    let validateName = async (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      }
    };

    return {
      loading: false,
      registerForm: {
        username: "",
        password: "",
        email: "",
        repassword: "",
      },
      rules: {
        username: [
          { validator: validateName, trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { validator: validatePass, trigger: "blur" },
          {
            min: 3,
            max: 32,
            message: "长度在 3 到 32 个字符",
            trigger: "blur",
          },
        ],
        repassword: [
          { validator: validatePass2, trigger: "blur" },
          {
            min: 3,
            max: 32,
            message: "长度在 3 到 32 个字符",
            trigger: "blur",
          },
        ],
        email: [
          {
            type: "email",
            required: true,
            message: "请输入邮箱",
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    document.title = "Bumpty OJ 注册";
  },
  methods: {
    submitForm(registerForm) {
      this.$refs[registerForm].validate((valid) => {
        if (valid) {
          this.loading = true;
          postRequest("/api/user/register", this.registerForm)
            .then((resp) => {
              this.loading = false;
              // 首先确认resp不为空，且有code属性
              if (resp && resp.code === "200") {
                console.log("注册成功！");
                this.$router.replace("/login");
              } else {
                // 如果error对象和msg都存在，则显示错误信息，否则显示通用错误信息
                Message.error(
                  resp && resp.error && resp.error.msg
                    ? resp.error.msg
                    : "注册失败，未知错误",
                );
              }
            })
            .catch((error) => {
              this.loading = false;
              Message.error("网络请求异常");
              console.log(error);
            });
        } else {
          console.log("表单验证失败");
          Message.error("表单验证失败");
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
body {
  margin: 0;
}

.register {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.registerContainer {
  border-radius: 5px;
  background-clip: padding-box;
  width: 80%;
  max-width: 450px;
  padding: 5px 40px 5px 40px;
}

.registerTitle {
  margin: 20px auto 20px auto;
  text-align: center;
  font-size: 26px;
}

.submitBtn {
  width: 100%;
}

link {
  color: #409eff;
}
.link:visited {
  color: #409eff;
}

.login-prompt {
  text-align: center;
  margin-top: 20px;
  border-radius: 10px;
  max-width: 450px;
  background: #f8f8f8;
  background-clip: padding-box;
  width: 80%;
}
</style>
