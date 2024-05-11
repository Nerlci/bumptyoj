<template>
  <div class="contest-detail" v-loading="loading" v-show="show">
    <h2 id="contest-detail-title">{{ contest.title }}</h2>
    <p>开始时间: {{ startString }} 结束时间: {{ endString }}</p>
    <p>赛制：{{ contest.contestType === 0 ? "OI" : "ACM" }}</p>
    <el-progress
      class="contest-progress"
      :percentage="percentage"
      :format="() => ''"
    ></el-progress>

    <el-button disabled type="info" v-if="checkTime(contest.endTime)">
      已结束
    </el-button>
    <el-button disabled type="info" v-else-if="contest.joined">
      已报名
    </el-button>
    <el-button disabled type="info" v-else-if="checkTime(contest.startTime)">
      已开始
    </el-button>
    <el-button
      @click="joinContest(contest.problemsetId)"
      class="join-contest-button"
      v-else
      >报名
    </el-button>

    <el-button
      @click="showRank(contest.problemsetId)"
      type="primary"
      class="show-rank-button"
    >
      排行榜
    </el-button>

    <div class="contest-detail-main">
      <contest-info :contest="contest" />
    </div>
  </div>
</template>

<script>
import ContestInfo from "../../components/Contest/ContestInfo";
import { Message } from "element-ui";
import { DateTime } from "luxon";

export default {
  name: "contestDetail",
  components: { ContestInfo },
  data() {
    return {
      show: false,
      loading: true,
      visible: true,
      contest: {
        problemsetId: 0,
        title: "",
        description: "",
        problems: [],
        problemData: [],
        startTime: "",
        endTime: "",
        type: 0,
        contestType: 0,
      },
      joined: false,
      startString: "",
      endString: "",
      percentage: 0,
    };
  },
  methods: {
    updatePro() {
      this.loading = true;
      this.getRequest("/api/problemset/problemset", {
        problemsetId: this.$route.params.id,
      })
        .then((response) => {
          this.contest = {
            ...this.contest,
            ...response.payload,
          };

          this.startString = this.formatTime(this.contest.startTime);
          this.endString = this.formatTime(this.contest.endTime);

          this.percentage = this.getPercentage();

          this.getRequest("/api/problemset/contest/status", {
            problemsetId: this.$route.params.id,
          }).then((response) => {
            this.contest.joined = response.payload.joined;
          });

          this.contest.problems.forEach((problem) => {
            this.getRequest("/api/problem/problem", {
              problemId: problem,
            }).then((response) => {
              this.contest.problemData.push({
                problemId: response.payload.metadata.problemId,
                displayId: response.payload.metadata.displayId,
                title: response.payload.metadata.title,
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
    getPercentage() {
      const now = new Date().getTime();
      const start = new Date(this.contest.startTime).getTime();
      const end = new Date(this.contest.endTime).getTime();
      if (now < start) {
        return 0;
      } else if (now > end) {
        return 100;
      } else {
        return ((now - start) / (end - start)) * 100;
      }
    },
    showRank(problemsetId) {
      this.$router.push({ name: "contestRank", params: { id: problemsetId } });
    },
    checkTime(time) {
      const now = DateTime.now();
      const dt = DateTime.fromISO(time, { zone: "Asia/Shanghai" });
      return dt <= now;
    },
    formatTime(value) {
      const dt = DateTime.fromISO(value, { zone: "Asia/Shanghai" });
      return dt.toFormat("yyyy-MM-dd HH:mm:ss");
    },
  },
  created() {
    this.updatePro();
  },
  mounted() {
    this.show = true;
  },
};
</script>

<style scoped>
.contest-detail {
  width: 80%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
}

#contest-detail-title {
  text-align: center;
  font-weight: bold;
}

.contest-detail-main {
  margin-top: 10px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.contest-progress {
  margin-bottom: 16px;
}
</style>
