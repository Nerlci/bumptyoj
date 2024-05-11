<template>
  <div class="contest-manager" v-loading="loading">
    <el-form
      :model="contest"
      label-position="right"
      label-width="auto"
      ref="form"
    >
      <el-form-item :label="contest.type == 0 ? '比赛标题' : '作业名称'">
        <el-input v-model="contest.title"></el-input>
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input
          v-model="contest.description"
          :autosize="{ minRows: 12, maxRows: 25 }"
          type="textarea"
          placeholder="输入题目描述，可包含简单的Markdown或HTML"
        ></el-input>
      </el-form-item>

      <el-form-item label="起止时间">
        <el-date-picker
          v-model="contest.time"
          type="datetimerange"
          @change="onchange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="赛制">
        <el-radio v-model="contest.contestType" :label="0">OI</el-radio>
        <el-radio v-model="contest.contestType" :label="1">ACM</el-radio>
      </el-form-item>

      <el-form-item label="题目列表">
        <el-input
          class="problem-input"
          placeholder="题目ID"
          v-model="problemId"
        ></el-input>
        <el-button type="primary" class="add-problem" @click="addProblem">
          添加题目
        </el-button>

        <el-table :data="contest.problemData">
          <el-table-column
            prop="problemId"
            width="76px"
            label="题目 ID"
          ></el-table-column>

          <el-table-column prop="title" label="题目标题"></el-table-column>
          <el-table-column
            label="操作"
            width="76px"
            fixed="right"
            align="center"
          >
            <template slot-scope="scope">
              <span
                @click="deleteProblem(scope.row.problemId)"
                class="contest-delete"
              >
                删除
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button @click="update" type="primary">更新比赛</el-button>

        <!-- 根据 operation 显示删除按钮 -->
        <el-button
          @click="deleteContest"
          type="danger"
          style="margin-left: 10px"
          >删除比赛
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { putRequest, deleteRequest } from "@/utils/request";
export default {
  name: "ContestManager",
  props: ["contest", "operation"],
  data() {
    return {
      loading: false,
      problemId: "",
    };
  },
  methods: {
    update() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          console.log(this.contest.startTime);
          const requestData = {
            problemsetId: this.contest.problemsetId,
            title: this.contest.title,
            problems: this.contest.problems,
            startTime: this.contest.startTime,
            endTime: this.contest.endTime,
            description: this.contest.description,
            contestType: this.contest.contestType,
            type: this.contest.type,
          };

          putRequest(
            `/api/problemset/problemset?problemsetId=${this.contest.problemsetId}`,
            requestData,
          ).then((response) => {
            if (response.code === "200") {
              this.$message({
                showClose: true,
                message: "更新成功",
                type: "success",
                duration: 2000,
              });
              this.$router.replace("/contest");
            } else {
              this.$message.error("更新失败: " + response.error.msg);
            }
          });
        }
      });
    },
    addProblem() {
      const problemId = parseInt(this.problemId);
      if (this.contest.problems.includes(problemId)) {
        this.$message.error("题目已存在");
        return;
      }
      this.contest.problems.push(problemId);
      this.getRequest(`/api/problem/problem?problemId=${problemId}`).then(
        (response) => {
          this.contest.problemData.push({
            problemId: response.payload.metadata.problemId,
            displayId: response.payload.metadata.displayId,
            title: response.payload.metadata.title,
          });
        },
      );
    },
    deleteContest() {
      // 调用删除API
      this.$confirm("确定要删除这个比赛吗？操作不可恢复!", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteRequest(
            `/api/problemset/problemset?problemsetId=${this.contest.problemsetId}`,
          ).then((response) => {
            if (response.code === "200") {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.$router.replace("/contest");
            } else {
              this.$message.error("删除失败: " + response.error.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    deleteProblem(problemId) {
      this.contest.problems = this.contest.problems.filter(
        (problem) => problem !== problemId,
      );
      this.contest.problemData = this.contest.problemData.filter(
        (problem) => problem.problemId !== problemId,
      );
    },
    onchange(value) {
      if (value) {
        this.contest.startTime = value[0];
        this.contest.endTime = value[1];
      } else {
        this.contest.startTime = "";
        this.contest.endTime = "";
      }
    },
  },
};
</script>

<style scoped>
.contest-manager {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.problem-input {
  width: 87%;
  margin-right: 10px;
}

.add-problem {
  margin-left: 10px;
}

.contest-delete {
  margin-top: 20px;
  /* 添加顶部边距，根据需要调整 */
  cursor: pointer;
  color: #56a1f7;
}
</style>
