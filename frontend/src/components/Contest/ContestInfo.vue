<template>
  <div class="contest-info">
    <el-collapse v-model="activeName">
      <el-collapse-item name="1">
        <template slot="title">
          <div class="collapse-title">描述</div>
        </template>
        <el-card class="box-card" shadow="hover">
          <div
            class="collapse-content"
            v-html="md.render(contest.description)"
          ></div>
        </el-card>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <div class="collapse-title">题目列表</div>
        </template>
        <el-card class="box-card" shadow="hover">
          <el-table :data="contest.problemData" @row-click="handleRowClick">
            <el-table-column
              prop="displayId"
              width="76px"
              label="题目 ID"
            ></el-table-column>
            <el-table-column prop="title" label="题目标题"></el-table-column>
          </el-table>
        </el-card>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import MarkdownIt from "markdown-it";
import markdownItKatex from "markdown-it-katex";

export default {
  name: "ContestInfo",
  props: ["contest"],
  data() {
    return {
      activeName: ["1", "2"],
      problemData: [],
      md: new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
      }).use(markdownItKatex),
    };
  },
  methods: {
    handleRowClick(row) {
      if (!this.contest.joined) {
        this.$message.error("请先报名比赛");
        return;
      }
      this.$router.push({
        name: "problemDetail",
        params: { id: row.problemId },
        query: { problemsetId: this.contest.problemsetId },
      });
    },
  },
};
</script>

<style scoped>
.contest-info {
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
