<template>
  <div>
    <div class="problem-list">
      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        style="height: 100%"
      >
        <el-table-column
          label="ID"
          prop="displayId"
          width="76px"
        ></el-table-column>
        <el-table-column label="题目" prop="title">
          <template slot-scope="scope">
            <span
              @click="showProblem(scope.row.problemId)"
              class="cursor-pointer"
              >{{ scope.row.title }}</span
            >
          </template>
        </el-table-column>

        <el-table-column
          label="AC"
          prop="acceptedCount"
          width="76px"
        ></el-table-column>
        <el-table-column
          label="提交"
          prop="submissionCount"
          width="76px"
        ></el-table-column>
        <el-table-column
          label="通过率"
          prop="ratio"
          width="76px"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          prop="createdAt"
          :formatter="formatTimestamp"
          width="120px"
        ></el-table-column>
        <el-table-column
          label="难度"
          prop="difficulty"
          width="76px"
        ></el-table-column>

        <el-table-column
          label="操作"
          v-if="
            this.$store.state.status.type == 0 ||
            this.$store.state.status.type == 2
          "
          width="76px"
        >
          <template slot-scope="scope">
            <span @click="editProblem(scope.row.problemId)" class="problem-edit"
              >编辑</span
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 新建题目按钮 -->
      <el-button
        type="primary"
        @click="addProblem"
        v-if="
          this.$store.state.status.type == 0 ||
          this.$store.state.status.type == 2
        "
        class="add-problem-button"
      >
        新建题目
      </el-button>

      <el-pagination
        class="problem-pagination"
        :page-size="pageSize"
        :total="itemCount"
        @current-change="getPage"
        background
        layout="prev, pager, next"
        v-show="itemCount > pageSize"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { DateTime } from "luxon";

export default {
  name: "problems",
  data() {
    return {
      loading: true,
      itemCount: 0,
      pageSize: 15,
      tableData: [],
    };
  },
  methods: {
    getPage(index) {
      this.loading = true;
      // 调用获取题目列表的API
      this.getRequest("/api/problem/list", {
        offset: (index - 1) * this.pageSize,
        count: this.pageSize,
      }).then((response) => {
        const problems = response.payload.problems;
        problems.forEach((problem) => {
          if (problem.submissionCount === 0) problem.ratio = "0%";
          else
            problem.ratio =
              Math.round(
                (problem.acceptedCount / problem.submissionCount) * 100 * 100,
              ) /
                100 +
              "%";
        });
        this.tableData = problems;
        this.loading = false;
      });
      // 调用获取总题目数的API
      this.fetchItemCount();
    },
    fetchItemCount() {
      this.getRequest("/api/problem/count").then((response) => {
        if (response.code === "200") {
          this.itemCount = response.payload.count;
        }
      });
    },
    showProblem(id) {
      this.$router.push({ name: "problemDetail", params: { id: id } });
    },
    editProblem(id) {
      this.$router.push({ name: "problemEdit", params: { id: id } });
    },
    addProblem() {
      this.$router.push({ name: "problemAdd" });
    },
    getPageInfo() {
      this.getPage(1);
    },
    formatTimestamp(value) {
      const dt = DateTime.fromISO(value.createdAt, { zone: "Asia/Shanghai" });
      return dt.toISODate();
    },
  },
  created() {
    this.getPageInfo();
  },
};
</script>

<style scoped>
.problem-list {
  width: 90%;
  height: 100%;
  margin: auto;
}

.problem-edit {
  margin-top: 20px;
  /* 添加顶部边距，根据需要调整 */
  cursor: pointer;
  color: #56a1f7;
}
.add-problem-button {
  margin-top: 20px;
  /* 添加顶部边距，根据需要调整 */
  cursor: pointer;
  color: #f4f9fb;
}

.problem-pagination {
  margin-top: 40px;
}
</style>
