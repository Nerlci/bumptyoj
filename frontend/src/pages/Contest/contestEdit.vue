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
