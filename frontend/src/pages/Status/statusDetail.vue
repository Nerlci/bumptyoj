<template>
  <div class="status-detail">
    <el-card class="box-card">
      <el-table :data="detailArray" style="width: 100%">
        <el-table-column prop="submissionId" label="评测ID"></el-table-column>
        <el-table-column prop="problemId" label="题目"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column prop="score" label="分数"></el-table-column>
        <el-table-column prop="userId" label="用户"></el-table-column>
        <el-table-column
          prop="time"
          label="运行时间"
          :formatter="formatRunTime"
        ></el-table-column>
        <el-table-column
          prop="memory"
          label="内存"
          :formatter="formatMemory"
        ></el-table-column>
        <el-table-column prop="length" label="代码长度"></el-table-column>
        <el-table-column prop="language" label="语言"></el-table-column>
        <el-table-column
          prop="timestamp"
          label="提交时间"
          :formatter="formatTimestamp"
        ></el-table-column>
      </el-table>

      <el-descriptions column="1">
        <el-description-item label="代码">
          <el-input
            type="textarea"
            :rows="10"
            v-model="detail.code"
            auto-complete="off"
            readonly
          ></el-input>
        </el-description-item>
      </el-descriptions>
    </el-card>

    <el-table :data="detail.detail" style="width: 100%" stripe>
      <el-table-column prop="testdataId" label="测试用例编号"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column prop="score" label="分数"></el-table-column>
      <el-table-column
        prop="time"
        label="运行时间"
        :formatter="formatRunTime"
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
import { getRequest } from '@/utils/request';
import {DateTime} from 'luxon';

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
    };
  },
  computed: {
    detailArray() {
      return [this.detail];
    },
  },
  created() {
    this.fetchSubmissionDetail();
    console.log(this.detail);
  },
  methods: {
    fetchSubmissionDetail() {
      const submissionId = this.$route.params.submissionId;
      getRequest("/api/submission/submission", { submissionId })
        .then((response) => {
          if (response.code === "200" && response.payload) {
            this.detail = response.payload;
          }
        })
        .catch((error) => {
          console.error("Failed to fetch submission details:", error);
        });
    },
    formatTimestamp(value) {
      const dt = DateTime.fromISO(value.timestamp, { zone: 'Asia/Shanghai' });
      return dt.toRelative();
    },
    formatMemory(value) {
      console.log(value);
      return (value.memory / 1024 / 1024).toFixed(2) + " MB";
    },
    formatRunTime(value) {
      return value.time + " ms";
    },
  },
};
</script>

<style scoped>
.status-detail {
  margin: 20px;
}
</style>
