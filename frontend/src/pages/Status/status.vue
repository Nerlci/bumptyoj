<template>
  <div class="status-list">
    <div class="search-bar">
      <div>
        <el-input
          v-model.number="problemSearchQuery"
          placeholder="以题目ID搜索评测记录..."
          class="search-input"
          oninput="value=value.replace(/[^0-9.]/g,'')"
        ></el-input>
        <el-input
          v-model.number="userSearchQuery"
          placeholder="以用户ID搜索评测记录..."
          class="search-input"
          oninput="value=value.replace(/[^0-9.]/g,'')"
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
      v-loading="loading"
      :data="submissions"
      style="width: 100%"
      stripe
      @row-click="handleRowClick"
    >
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
import {
  formatTime,
  formatMemory,
  formatCodeLength,
  formatTimestamp,
} from "@/utils/formatter";
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
      loading: false,
      maxId: null, // 用于“下一页”的请求
      minId: null, // 用于“上一页”的请求
    };
  },
  mounted() {
    this.loading = true;
    this.fetchTotal();
    this.fetchSubmissions();
  },
  methods: {
    fetchTotal() {
      let url = "/api/submission/count";
      if (
        this.problemSearchQuery ||
        this.userSearchQuery ||
        this.$route.query.problemsetId
      ) {
        url += "?";
      }
      if (this.problemSearchQuery)
        url += `&problemId=${encodeURIComponent(this.problemSearchQuery)}`;
      if (this.userSearchQuery)
        url += `&userId=${encodeURIComponent(this.userSearchQuery)}`;
      if (this.$route.query.problemsetId)
        url += `&problemsetId=${this.$route.query.problemsetId}`;

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
      if (this.$route.query.problemsetId)
        url += `&problemsetId=${this.$route.query.problemsetId}`;

      if (direction === "next" && this.maxId) {
        url += `&maxId=${this.minId}`;
      } else if (direction === "prev" && this.minId) {
        url += `&minId=${this.maxId}`;
      }

      getRequest(url)
        .then((response) => {
          if (direction === "prev") {
            response.payload.submissions =
              response.payload.submissions.reverse();
          }

          this.submissions = response.payload.submissions;
          if (this.submissions.length > 0) {
            this.maxId = this.submissions[0].submissionId;
            this.minId =
              this.submissions[this.submissions.length - 1].submissionId;
          }
          this.loading = false;
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
    handleProblemClick(problemId) {
      this.$router.push({
        name: "problemDetail",
        params: { id: problemId },
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
    formatTime,
    formatMemory,
    formatCodeLength,
    formatTimestamp,
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
