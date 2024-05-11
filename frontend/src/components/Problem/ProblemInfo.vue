<template>
  <div class="problem-info">
    <el-collapse v-model="activeName">
      <el-collapse-item name="1">
        <template slot="title">
          <div class="collapse-title">题目描述</div>
        </template>
        <el-card class="box-card" shadow="hover">
          <div
            class="collapse-content"
            v-html="md.render(problem.description)"
          ></div>
        </el-card>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <div class="collapse-title">输入格式</div>
        </template>
        <el-card class="box-card" shadow="hover">
          <div
            class="collapse-content"
            v-html="md.render(problem.inputFormat)"
          ></div>
        </el-card>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          <div class="collapse-title">输出格式</div>
        </template>
        <el-card class="box-card" shadow="hover">
          <div
            class="collapse-content"
            v-html="md.render(problem.outputFormat)"
          ></div>
        </el-card>
      </el-collapse-item>
      <el-collapse-item name="4">
        <template slot="title">
          <div class="collapse-title">样例输入和输出</div>
        </template>
        <el-card class="box-card" shadow="hover">
          <div class="collapse-content">
            <b>输入:</b> {{ problem.sampleInput }}
          </div>
          <div class="collapse-content">
            <b>输出:</b> {{ problem.sampleOutput }}
          </div>
        </el-card>
      </el-collapse-item>
      <el-collapse-item name="5">
        <template slot="title">
          <div class="collapse-title">其他信息</div>
        </template>
        <el-card class="box-card" shadow="hover">
          <div class="collapse-content" v-html="md.render(problem.other)"></div>
        </el-card>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import MarkdownIt from "markdown-it";
import markdownItKatex from "markdown-it-katex";

export default {
  name: "ProblemInfo",
  props: ["problem"],
  data() {
    return {
      md: new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
      }).use(markdownItKatex),
      activeName: ["1", "2", "3", "4", "5"],
    };
  },
};
</script>

<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css");
</style>

<style scoped>
.problem-info {
  height: 100%;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.collapse-title {
  font-size: 25px;
  font-weight: bold;
  color: #2c3e50;
}

.collapse-hint {
  font-size: 20px;
  font-weight: bold;
}

.collapse-content {
  text-align: left;
}

.box-card {
  margin-top: 30px;
  border: 1px solid #52abff;
}

.collapse-content {
  font-size: 14px;
}
</style>
