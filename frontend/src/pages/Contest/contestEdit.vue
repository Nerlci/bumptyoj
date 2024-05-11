<template>
  <div class="contest-edit">
    <h2 id="contest-edit-title">
      {{ contest.type == 0 ? "比赛" : "作业" }}编辑
    </h2>
    <contest-manager :contest="contest" :operation="'更新'" />
  </div>
</template>

<script>
import ContestManager from "../../components/Contest/ContestManager.vue";

export default {
  name: "contestEdit",
  components: { ContestManager },
  data() {
    return {
      contest: {
        problemsetId: 0,
        title: "",
        description: "",
        problems: [],
        problemData: [],
        startTime: "",
        endTime: "",
        time: [],
      },
    };
  },
  methods: {
    fetchContestData() {
      this.getRequest("/api/problemset/problemset", {
        problemsetId: this.$route.params.id,
      })
        .then((response) => {
          this.contest = {
            ...this.contest,
            ...response.payload,
          };

          this.contest.time = [
            new Date(this.contest.startTime),
            new Date(this.contest.endTime),
          ];

          this.contest.problems.forEach((problem) => {
            this.getRequest("/api/problem/problem", {
              problemId: problem,
            }).then((response) => {
              console.log(response);
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
        });
    },
  },
  created() {
    this.fetchContestData();
  },
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
