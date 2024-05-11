<template>
  <div class="contest-add">
    <h2 id="contest-edit-title">
      {{ $route.query.type == 0 ? "比赛添加" : "作业添加" }}
    </h2>
    <el-form ref="contestForm" :model="contest" label-width="120px">
      <el-form-item
        :label="$route.query.type == 0 ? '比赛标题' : '作业名称'"
        prop="title"
      >
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
          v-model="time"
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
        <el-button type="primary" @click="submitContest">
          {{ $route.query.type == 0 ? "添加比赛" : "添加作业" }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getRequest, postRequest } from "@/utils/request";

export default {
  name: "contestAdd",
  data() {
    return {
      contest: {
        title: "",
        description: "",
        problems: [],
        problemData: [],
        startTime: "",
        endTime: "",
        type: 0,
        contestType: 0,
      },
      time: [],
      problemId: "",
    };
  },
  methods: {
    submitContest() {
      this.$refs["contestForm"].validate((valid) => {
        if (valid) {
          let contest = this.contest;
          contest.type = parseInt(this.$route.query.type);
          delete contest.problemData;
          postRequest("/api/problemset/problemset", contest)
            .then((response) => {
              this.$message({
                message: "比赛添加成功",
                type: "success",
              });
              // 通常在成功后会跳转到比赛列表或显示比赛详情

              if (this.$route.query.type == 0) {
                this.$router.replace("/contest");
              } else {
                postRequest("/api/problemset/homework", {
                  classIds: [parseInt(this.$route.query.classId)],
                  problemsetId: response.payload.problemsetId,
                  startTime: this.contest.startTime,
                  endTime: this.contest.endTime,
                }).then(() => {
                  this.$router.push({
                    name: "classDetail",
                    params: { id: parseInt(this.$route.query.classId) },
                  });
                });
              }
            })
            .catch((error) => {
              this.$message.error("添加失败: " + error.message);
            });
        }
      });
    },
    addProblem() {
      const problemId = parseInt(this.problemId);
      if (!problemId) {
        this.$message.error("无效的题目ID");
        return;
      }
      if (this.contest.problems.includes(problemId)) {
        this.$message.error("题目已存在");
        this.problemId = "";
        return;
      }
      getRequest(`/api/problem/problem?problemId=${problemId}`).then(
        (response) => {
          this.contest.problems.push(problemId);
          this.contest.problemData.push({
            problemId: response.payload.metadata.problemId,
            displayId: response.payload.metadata.displayId,
            title: response.payload.metadata.title,
          });
          this.problemId = "";
        },
      );
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
      this.contest.startTime = value[0];
      this.contest.endTime = value[1];
    },
  },
};
</script>

<style scoped>
.contest-add {
  width: 80%;
  margin: 50px auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

#contest-edit-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.el-form-item {
  margin-bottom: 15px;
}

.el-button {
  margin-top: 10px;
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
