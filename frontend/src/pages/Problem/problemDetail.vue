<template>
  <div class="problem-detail" v-loading="loading" v-show="show">
    <h2 id="problem-set-title" v-if="$route.query.problemsetId">
      {{ problemsetTitle }}
    </h2>
    <h2 id="problem-detail-title">
      {{ problem.displayId }}: {{ problem.title }}
    </h2>
    <div class="problem-metadata">
      <span id="problem-metadata-solve"
        ><i class="el-icon-circle-check"></i>解决&nbsp;
        {{ problem.acceptedCount }}</span
      >&nbsp;|&nbsp;
      <span id="problem-metadata-submit"
        ><i class="el-icon-notebook-2"></i>提交&nbsp;
        {{ problem.submissionCount }}</span
      >
    </div>

    <div class="problem-detail-main">
      <problem-info :problem="problem" />
    </div>
    <div class="problem-submit">
      <problem-submit :pid="problem.problemId" :psetid="problemsetId" />
    </div>
  </div>
</template>

<script>
import ProblemInfo from "../../components/Problem/ProblemInfo";
import ProblemSubmit from "../../components/Problem/ProblemSubmit";
import { Message } from "element-ui";
export default {
  name: "problemDetail",
  components: { ProblemSubmit, ProblemInfo },
  data() {
    return {
      show: false,
      loading: true,
      problemsetTitle: "测试",
      problemsetId: 0,
      problem: {
        problemId: 0,
        displayId: "",
        title: "",
        acceptedCount: 0,
        submissionCount: 0,
        createdAt: "",
        difficulty: "",
        time: 0,
        memory: 0,
        description: "",
        inputFormat: "",
        outputFormat: "",
        sampleInput: "",
        sampleOutput: "",
        other: "",
      },
    };
  },
  methods: {
    updatePro() {
      this.loading = true;
      this.getRequest("/api/problem/problem", {
        problemId: this.$route.params.id,
      })
        .then((response) => {
          const data = response.payload.metadata;
          const format = response.payload.format;
          const sample = response.payload.sample;
          this.problem = {
            problemId: data.problemId,
            displayId: data.displayId,
            title: data.title,
            acceptedCount: data.acceptedCount,
            submissionCount: data.submissionCount,
            createdAt: data.createdAt,
            difficulty: data.difficulty,
            time: data.time,
            memory: data.memory,
            description: response.payload.description,
            inputFormat: format.input,
            outputFormat: format.output,
            sampleInput: sample.input,
            sampleOutput: sample.output,
            other: response.payload.other,
          };
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          console.log(error);
          Message.error("未登录或无权限查看");
        });
    },
  },
  created() {
    if (this.$route.query.problemsetId) {
      this.problemsetId = Number(this.$route.query.problemsetId);
      this.getRequest("/api/problemset/problemset", {
        problemsetId: this.$route.query.problemsetId,
      })
        .then((response) => {
          this.problemsetTitle =
            (response.payload.type == 0 ? "比赛" : "作业") +
            ": " +
            response.payload.title;
        })
        .catch((error) => {
          console.log(error);
        });
    }
    this.updatePro();
  },
  mounted() {
    this.show = true;
  },
};
</script>

<style scoped>
.problem-detail {
  width: 80%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
}

#problem-set-title {
  text-align: center;
  font-weight: bold;
  color: #56799c;
}

#problem-detail-title {
  text-align: center;
  font-weight: bold;
}

.problem-metadata {
  margin-bottom: 20px;
  font-size: 16px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

#problem-metadata-solve {
  color: #42b983;
}

#problem-metadata-submit {
  color: #6c682a;
}

.problem-detail-main {
  margin-top: 10px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.problem-submit {
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
}
</style>
