<template>
  <div class="status-detail">
    <el-card class="box-card">
      <el-table v-loading="loading" :data="detailArray" style="width: 100%">
        <el-table-column prop="submissionId" label="评测ID"></el-table-column>
        <el-table-column prop="displayId" label="题目">
          <template slot-scope="scope">
            <span
              @click.stop="handleProblemClick(scope.row.problemId)"
              class="cursor-pointer"
              >{{ scope.row.displayId }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column prop="score" label="分数"></el-table-column>
        <el-table-column prop="username" label="用户"></el-table-column>
        <el-table-column
          prop="time"
          label="运行时间"
          :formatter="formatTime"
        ></el-table-column>
        <el-table-column
          prop="memory"
          label="内存"
          :formatter="formatMemory"
        ></el-table-column>
        <el-table-column
          prop="length"
          label="代码长度"
          :formatter="formatCodeLength"
        ></el-table-column>
        <el-table-column prop="language" label="语言"></el-table-column>
        <el-table-column
          prop="timestamp"
          label="提交时间"
          :formatter="formatTimestamp"
        ></el-table-column>
      </el-table>

      <monaco ref="monaco" :opts="opts" :height="400"> </monaco>
    </el-card>

    <el-table :data="detail.detail" style="width: 100%" stripe>
      <el-table-column prop="testdataId" label="测试用例编号"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column prop="score" label="分数"></el-table-column>
      <el-table-column
        prop="time"
        label="运行时间"
        :formatter="formatTime"
      ></el-table-column>
      <el-table-column
        prop="memory"
        label="内存使用"
        :formatter="formatMemory"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getRequest } from "@/utils/request";
import {
  formatTime,
  formatMemory,
  formatCodeLength,
  formatTimestamp,
} from "@/utils/formatter";

import monaco from "../../components/MonacoEditor.vue";

export default {
  data() {
    return {
      detail: {
        submissionId: null,
        userId: null,
        problemId: null,
        language: "",
        code: "",
        length: 0,
        time: 0,
        memory: 0,
        score: 0,
        status: "",
        timestamp: "",
        detail: [],
      },
      loading: false,
      opts: {
        value: "",
        readOnly: true, // 是否可编辑
        language: "javascript", // 语言类型
        theme: "vs-dark", // 编辑器主题
      },
    };
  },
  components: {
    monaco,
  },
  computed: {
    detailArray() {
      return [this.detail];
    },
  },
  created() {
    this.loading = true;
    this.fetchSubmissionDetail();
  },
  methods: {
    getMemoryUnit(value) {
      const thresholds = {
        B: 1,
        KB: 1024,
        MB: 1024 * 1024,
      };
      let unit = "B";
      for (const [key, threshold] of Object.entries(thresholds)) {
        if (value >= threshold) {
          unit = key;
        } else {
          break;
        }
      }
      return { unit, threshold: thresholds[unit] };
    },
    fillCode(code, language) {
      this.opts.value = code;
      switch (language) {
        case "C++":
          this.opts.language = "cpp";
          break;
        case "Java":
          this.opts.language = "java";
          break;
        case "Python":
          this.opts.language = "python";
          break;
        default:
          this.opts.language = "javascript";
      }
    },
    fetchSubmissionDetail() {
      const submissionId = this.$route.params.submissionId;
      getRequest("/api/submission/submission", { submissionId })
        .then((response) => {
          const promises = [];
          const detail = response.payload;

          promises.push(
            getRequest(`/api/user/user?userId=${detail.userId}`).then(
              (response) => {
                detail.username = response.payload.username;
              },
            ),
          );

          promises.push(
            getRequest(
              `/api/problem/problem?problemId=${detail.problemId}`,
            ).then((response) => {
              detail.displayId = response.payload.metadata.displayId;
            }),
          );

          Promise.all(promises).then(() => {
            this.detail = detail;
            this.fillCode(this.detail.code, this.detail.language);
            this.loading = false;
          });
        })
        .catch((error) => {
          console.error("Failed to fetch submission details:", error);
        });
    },
    handleProblemClick(problemId) {
      this.$router.push({
        name: "problemDetail",
        params: { id: problemId },
      });
    },
    formatTime,
    formatMemory,
    formatCodeLength,
    formatTimestamp,
  },
};
</script>

<style scoped>
.code-input {
  background: #2d2d2d;
  color: #ccc;
  font-family:
    Fira code,
    Fira Mono,
    Consolas,
    Menlo,
    Courier,
    monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

.height-300 {
  height: calc(400 / 19.2 * 1vw);
}

.status-detail {
  margin: 20px;
}
</style>
