<template>
  <div>
    <div class="problem-list">
      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        style="height: 100%"
      >
        <el-table-column label="比赛名称 " prop="title">
          <template slot-scope="scope">
            <span
              @click="showContest(scope.row.problemsetId)"
              class="cursor-pointer"
              >{{ scope.row.title }}</span
            >
          </template>
        </el-table-column>

        <el-table-column
          label="开始时间"
          prop="startTime"
          width="200px"
          :formatter="formatStartTime"
        ></el-table-column>
        <el-table-column
          label="结束时间"
          prop="startTime"
          width="200px"
          :formatter="formatEndTime"
        ></el-table-column>

        <el-table-column
          label="描述"
          prop="description"
          width="360px"
          :formatter="formatLongText"
        ></el-table-column>

        <el-table-column
          label="报名"
          width="76px"
          v-if="this.$store.state.status.isLogin"
        >
          <template slot-scope="scope">
            <span disabled v-if="checkTime(scope.row.endTime)"> 已结束 </span>
            <span disabled v-else-if="scope.row.joined"> 已报名 </span>
            <span disabled v-else-if="checkTime(scope.row.startTime)">
              已开始
            </span>
            <span
              @click="joinContest(scope.row.problemsetId)"
              class="contest-edit"
              v-else
              >报名
            </span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          v-if="this.$store.state.status.type == 0"
          width="76px"
        >
          <template slot-scope="scope">
            <span
              @click="editContest(scope.row.problemsetId)"
              class="contest-edit"
              >编辑</span
            >
          </template>
        </el-table-column>
      </el-table>

      <el-button
        type="primary"
        @click="addContest"
        v-if="this.$store.state.status.type == 0"
        class="add-contest-button"
      >
        新建比赛
      </el-button>

      <el-pagination
        class="contest-pagination"
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
      this.getRequest("/api/problemset/contest", {
        offset: (index - 1) * this.pageSize,
        count: this.pageSize,
      }).then((response) => {
        const contests = response.payload.contests;
        if (this.$store.state.status.isLogin) {
          const promises = contests.map((contest) => {
            return this.getRequest("/api/problemset/contest/status", {
              problemsetId: contest.problemsetId,
            }).then((response) => {
              contest.joined = response.payload.joined;
            });
          });

          Promise.all(promises).then(() => {
            this.tableData = contests;
            this.loading = false;
          });
        } else {
          this.tableData = contests;
          this.loading = false;
        }
      });

      this.fetchItemCount();
    },
    fetchItemCount() {
      this.getRequest("/api/problemset/contest/count").then((response) => {
        this.itemCount = response.payload.count;
      });
    },
    joinContest(id) {
      this.postRequest("/api/problemset/contest", { problemsetId: id }).then(
        (response) => {
          if (response.code === "200") {
            this.$message.success("报名成功！");
            this.tableData.map((contest) => {
              if (contest.problemsetId === id) {
                contest.joined = true;
              }
            });
          } else {
            this.$message.error("报名失败: " + response.error.msg);
          }
        },
      );
    },
    showContest(id) {
      this.$router.push({ name: "contestDetail", params: { id: id } });
    },
    editContest(id) {
      this.$router.push({ name: "contestEdit", params: { id: id } });
    },
    addContest() {
      this.$router.push({ name: "contestAdd" });
    },
    getPageInfo() {
      this.getPage(1);
    },
    checkTime(time) {
      const now = DateTime.now();
      const dt = DateTime.fromISO(time, { zone: "Asia/Shanghai" });
      return dt <= now;
    },
    formatStartTime(value) {
      const dt = DateTime.fromISO(value.startTime, { zone: "Asia/Shanghai" });
      return dt.toFormat("yyyy-MM-dd HH:mm:ss");
    },
    formatEndTime(value) {
      const dt = DateTime.fromISO(value.endTime, { zone: "Asia/Shanghai" });
      return dt.toFormat("yyyy-MM-dd HH:mm:ss");
    },
    formatLongText(value) {
      const desc = value.description;
      return desc.length > 20 ? desc.slice(0, 20) + "..." : desc;
    },
  },
  created() {
    this.getPageInfo();
  },
};
</script>

<style scoped>
.problem-list {
  width: 80%;
  height: 100%;
  margin: auto;
}

.cursor-pointer {
  cursor: pointer;
}

.contest-edit {
  margin-top: 20px;
  /* 添加顶部边距，根据需要调整 */
  cursor: pointer;
  color: #56a1f7;
}
.add-contest-button {
  margin-top: 20px;
  /* 添加顶部边距，根据需要调整 */
  cursor: pointer;
  color: #f4f9fb;
}

.contest-pagination {
  margin-top: 40px;
}
</style>
