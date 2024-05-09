<template>
  <div class="problem-add">
    <h2 id="problem-edit-title">题目添加</h2>
    <el-form ref="problemForm" :model="problem" label-width="120px">
      <el-form-item label="题目显示ID">
        <el-input v-model="problem.metadata.displayId"></el-input>
      </el-form-item>
      <el-form-item label="题目标题">
        <el-input v-model="problem.metadata.title"></el-input>
      </el-form-item>
      <el-form-item label="难度">
        <el-input v-model="problem.metadata.difficulty"></el-input>
      </el-form-item>
      <el-form-item label="时间限制">
        <el-input
          v-model.number="problem.metadata.time"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="内存限制">
        <el-input
          v-model.number="problem.metadata.memory"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" v-model="problem.description"></el-input>
      </el-form-item>
      <el-form-item label="输入格式">
        <el-input type="textarea" v-model="problem.format.input"></el-input>
      </el-form-item>
      <el-form-item label="输出格式">
        <el-input type="textarea" v-model="problem.format.output"></el-input>
      </el-form-item>
      <el-form-item label="样例输入">
        <el-input type="textarea" v-model="problem.sample.input"></el-input>
      </el-form-item>
      <el-form-item label="样例输出">
        <el-input type="textarea" v-model="problem.sample.output"></el-input>
      </el-form-item>
      <el-form-item label="其他信息">
        <el-input type="textarea" v-model="problem.other"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitProblem">添加题目</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { postRequest } from "@/utils/request";

export default {
  name: "problemAdd",
  data() {
    return {
      problem: {
        metadata: {
          displayId: "",
          title: "",
          difficulty: "",
          time: 0,
          memory: 0,
        },
        description: "",
        format: {
          input: "",
          output: "",
        },
        sample: {
          input: "",
          output: "",
        },
        other: "",
      },
    };
  },
  methods: {
    submitProblem() {
      this.$refs["problemForm"].validate((valid) => {
        if (valid) {
          postRequest("/api/problem/problem", this.problem)
            .then((response) => {
              if (response.code === "200") {
                this.$message({
                  message: "题目添加成功",
                  type: "success",
                });
                // 通常在成功后会跳转到题目列表或显示题目详情
                this.$router.replace("/problems");
              } else {
                this.$message.error("添加失败: " + response.data.error.msg);
              }
            })
            .catch((error) => {
              this.$message.error("添加失败: " + error.message);
            });
        }
      });
    },
  },
};
</script>

<style scoped>
.problem-add {
  width: 80%;
  margin: 50px auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

#problem-edit-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.el-form-item {
  margin-bottom: 15px;
}

.el-button {
  margin-top: 10px;
}
</style>
