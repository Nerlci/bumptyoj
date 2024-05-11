<template>
  <div class="status-list">
    <div class="search-bar">
      <div>
        <el-input
          v-model="problemSearchQuery"
          placeholder="以题目ID搜索评测记录..."
          class="search-input"
        ></el-input>
        <el-input
          v-model="userSearchQuery"
          placeholder="以用户ID搜索评测记录..."
          class="search-input"
        ></el-input>
        <el-button
          type="primary"
          icon="el-icon-search"
          circle
          @click="
            fetchTotal();
            fetchSubmissions();
          "
        ></el-button>
      </div>
    </div>

    <el-table
      :data="submissions"
      style="width: 100%"
      stripe
      @row-click="handleRowClick"
    >
      <el-table-column prop="submissionId" label="评测ID"></el-table-column>
      <el-table-column prop="problemId" label="题目"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column prop="score" label="分数"></el-table-column>
      <el-table-column prop="userId" label="用户"></el-table-column>
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

    <div style="display: flex; justify-content: center; margin-top: 20px">
      <Pagination
        :currentPage="currentPage"
        :maxPage="maxPage"
        @pre-click="handlePreClick"
        @next-click="handleNextClick"
      ></Pagination>
    </div>
  </div>
</template>

<style scoped>
.status-list {
  width: 90%;
  margin: auto;
}

.search-input {
  margin-right: 8px;
}
</style>

<script>
import { getRequest } from "@/utils/request";
import { DateTime } from "luxon";
import Pagination from "../../components/Pagination";

export default {
  components: {
    Pagination,
  },
  data() {
    return {
      maxPage: 0,
      submissions: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      userSearchQuery: "",
      problemSearchQuery: "",
      maxId: null, // 用于“下一页”的请求
      minId: null, // 用于“上一页”的请求
    };
  },
  mounted() {
    this.fetchTotal();
    this.fetchSubmissions();
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
    fetchTotal() {
      let url = "/api/submission/count";
      const allEmpty =
        !this.problemSearchQuery &&
        !this.userSearchQuery &&
        !parseInt(this.problemSearchQuery) &&
        !parseInt(this.userSearchQuery);
      if (!allEmpty && (this.problemSearchQuery || this.userSearchQuery)) {
        url += "?";
      }
      if (this.problemSearchQuery && parseInt(this.problemSearchQuery))
        url += `&problemId=${encodeURIComponent(this.problemSearchQuery)}`;
      if (this.userSearchQuery && parseInt(this.userSearchQuery))
        url += `&userId=${encodeURIComponent(this.userSearchQuery)}`;

      getRequest(url)
        .then((response) => {
          this.total = response.payload.count;
          this.maxPage = Math.ceil(this.total / this.pageSize);
        })
        .catch((error) => {
          console.error("Failed to fetch total count:", error);
        });
    },
    fetchSubmissions(direction) {
      let url = `/api/submission/list?count=${this.pageSize}`;
      if (this.problemSearchQuery)
        url += `&problemId=${encodeURIComponent(this.problemSearchQuery)}`;
      if (this.userSearchQuery)
        url += `&userId=${encodeURIComponent(this.userSearchQuery)}`;

      if (direction === "next" && this.maxId) {
        url += `&maxId=${this.minId}`;
      } else if (direction === "prev" && this.minId) {
        url += `&minId=${this.maxId}`;
      }

      getRequest(url)
        .then((response) => {
          this.submissions = response.payload.submissions;
          if (this.submissions.length > 0) {
            this.maxId = Math.max(
              ...this.submissions.map((sub) => sub.submissionId),
            );
            this.minId = Math.min(
              ...this.submissions.map((sub) => sub.submissionId),
            );
          }
        })
        .catch((error) => {
          console.error("Failed to fetch submissions:", error);
        });
    },
    handleRowClick(row) {
      this.$router.push({
        name: "statusDetail",
        params: { submissionId: row.submissionId },
      });
    },
    handlePreClick() {
      if (this.currentPage > 1) {
        this.fetchSubmissions("prev");
        this.currentPage -= 1;
      } else {
        this.$message.error("已经是第一页了！");
      }
    },
    handleNextClick() {
      if (this.currentPage < Math.ceil(this.total / this.pageSize)) {
        this.fetchSubmissions("next");
        this.currentPage += 1;
      } else {
        this.$message.error("已经是最后一页了！");
      }
    },
    formatTimestamp(value) {
      const dt = DateTime.fromISO(value.timestamp, { zone: "Asia/Shanghai" });
      return dt.toRelative();
    },
    formatTime(value) {
      if (value.time > 1000) {
        return `${(value.time / 1000).toFixed(2)} s`;
      } else {
        return `${value.time} ms`;
      }
    },
    formatMemory(value) {
      let length = value.memory;
      const { unit, threshold } = this.getMemoryUnit(length);
      length = length / threshold;
      return `${unit === "B" ? length : length.toFixed(2)} ${unit}`;
    },
    formatCodeLength(value) {
      let length = value.length;
      const { unit, threshold } = this.getMemoryUnit(length);
      length = length / threshold;
      return `${unit === "B" ? length : length.toFixed(2)} ${unit}`;
    },
  },
};
</script>

<style scoped>
.status-list {
  width: 90%;
  margin: auto;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  width: 200px;
}
</style>
