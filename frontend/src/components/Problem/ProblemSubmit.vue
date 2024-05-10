<template>
  <div class="problem-submit">
    <div class="problem-submit-answer">
      <!-- 改善选择语言框的位置和样式 -->
      <div class="language-select">
        <el-select v-model="language" placeholder="请选择语言">
          <el-option label="C++" value="C++"></el-option>
          <el-option label="Java" value="Java"></el-option>
          <el-option label="Python" value="Python"></el-option>
        </el-select>
      </div>
      <!-- 增加输入框的行数 -->
      <el-input
        :rows="20"
        type="textarea"
        placeholder="请输入答案"
        v-model="answer"
        class="code-input"
      >
      </el-input>

      <el-button @click="submitAnswer" id="submit-button" type="primary"
        >提交</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "ProblemSubmit",
  props: ["pid"], // 接收题目ID
  data() {
    return {
      answer: "", // 用户编写的代码
      language: "", // 用户选择的编程语言
    };
  },
  methods: {
    submitAnswer() {
      if (!this.$store.state.status.isLogin) {
        this.$message.error("请登录！");
        return;
      }
      if (!this.language) { // 确保语言已经被选择
        this.$message.error("请选择一种编程语言！");
        return;
      }
      // 调整API路径和传输的数据结构
      this.postRequest("/api/submission/submit", {
        problemId: this.pid,
        language: this.language,
        code: this.answer,
      })
        .then((response) => {
          if (response.code !== "200") {
            this.$message.error("提交失败: " + response.error.msg);
          } else {
            this.$message.success("提交成功！");
            this.$router.push({ name: "statusDetail", params: { submissionId: response.payload.submissionId } });
          }
        })
        .catch((error) => {
          console.error(error);
          this.$message.error("网络错误或服务器异常");
        });
    },
  },
};
</script>
<style scoped>
.problem-submit {
  text-align: center;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.problem-submit-answer {
  margin-top: 40px;
}

.code-input {
  margin-bottom: 20px;
}

.language-select {
  margin-bottom: 20px;
  margin-left: 0 auto 20px auto;
}

#submit-button {
  margin-top: 20px;
}
</style>
