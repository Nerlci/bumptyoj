<template>
  <div>
    <div>
      <h2 id="class-name">{{ class_.className }}</h2>
    </div>

    <div class="teacher-info">
      <h3 style="margin-top: 20px; text-align: left">教师信息</h3>
      <p>教师用户名: {{ teacherName }}</p>
    </div>

    <div class="student-list">
      <h3 style="margin-top: 20px; text-align: left">学生列表</h3>
      <el-table
        :data="class_.studentData"
        v-loading="loading"
        stripe
        style="height: 100%"
      >
        <el-table-column label="学生 ID" prop="userId"></el-table-column>
        <el-table-column label="学生用户名" prop="username"></el-table-column>
      </el-table>
    </div>

    <div class="homework-list">
      <h3 style="margin-top: 20px; text-align: left">作业列表</h3>
      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        style="height: 100%"
      >
        <el-table-column label="作业名称" prop="title">
          <template slot-scope="scope">
            <span
              @click="showHomework(scope.row.problemsetId)"
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
          label="操作"
          v-if="
            this.$store.state.status.type == 0 ||
            this.$store.state.status.type == 2
          "
          width="76px"
        >
          <template slot-scope="scope">
            <span
              @click="editHomework(scope.row.problemsetId)"
              class="homework-edit"
              >编辑</span
            >
          </template>
        </el-table-column>
      </el-table>

      <el-button
        type="primary"
        @click="addHomework"
        v-if="
          this.$store.state.status.type == 0 ||
          this.$store.state.status.type == 2
        "
        class="add-homework-button"
      >
        新建作业
      </el-button>

      <el-pagination
        class="homework-pagination"
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
import { Message } from "element-ui";
import { DateTime } from "luxon";

export default {
  name: "classDetail",
  data() {
    return {
      pageSize: 15,
      index: 1,
      class_: {
        className: "",
        students: [],
        studentData: [],
        teacher: 0,
      },
      teacherName: "",
      tableData: [],
    };
  },
  methods: {
    updatePro() {
      this.loading = true;
      this.getRequest("/api/class/class", {
        classId: this.$route.params.id,
      })
        .then((response) => {
          this.class_ = {
            ...this.class_,
            ...response.payload,
          };

          this.getRequest("/api/user/user", {
            userId: this.class_.teacherId,
          }).then((response) => {
            this.teacherName = response.payload.username;
          });

          this.class_.students.forEach((studentId) => {
            this.getRequest("/api/user/user", {
              userId: studentId,
            }).then((response) => {
              this.class_.studentData.push({
                userId: response.payload.userId,
                username: response.payload.username,
              });
            });
          });

          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          console.log(error);
          Message.error("未登录或无权限查看");
        });
    },
    getPage(index) {
      this.loading = true;
      // 调用获取题目列表的API
      this.getRequest("/api/problemset/homework", {
        classId: this.$route.params.id,
        offset: (index - 1) * this.pageSize,
        count: this.pageSize,
      }).then((response) => {
        const homeworks = response.payload.homeworkSets;
        console.log(homeworks);
        this.tableData = homeworks;
        this.loading = false;
      });

      this.fetchItemCount();
    },
    fetchItemCount() {
      this.getRequest("/api/problemset/homework/count", {
        classId: this.$route.params.id,
      }).then((response) => {
        this.itemCount = response.payload.count;
      });
    },
    getPageInfo() {
      this.getPage(1);
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
    showHomework(id) {
      this.$router.push({ name: "contestDetail", params: { id: id } });
    },
    editHomework(id) {
      this.$router.push({ name: "contestEdit", params: { id: id } });
    },
    addHomework() {
      this.$router.push({
        name: "contestAdd",
        query: { type: 1, classId: this.$route.params.id },
      });
    },
  },
  created() {
    this.updatePro();
    this.getPageInfo();
  },
  mounted() {
    this.show = true;
  },
};
</script>

<style scoped>
.teacher-info {
  width: 80%;
  height: 100%;
  margin: auto;
}

.cursor-pointer {
  cursor: pointer;
}

.student-list {
  width: 80%;
  height: 100%;
  margin: auto;
}

.homework-list {
  width: 80%;
  height: 100%;
  margin: auto;
}

.add-homework-button {
  margin-top: 20px;
  /* 添加顶部边距，根据需要调整 */
  cursor: pointer;
  color: #f4f9fb;
}

.homework-edit {
  margin-top: 20px;
  /* 添加顶部边距，根据需要调整 */
  cursor: pointer;
  color: #56a1f7;
}
</style>
