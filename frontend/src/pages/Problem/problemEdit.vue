<template>
  <div class="problem-edit">
    <h2 id="problem-edit-title">题目编辑</h2>
    <problem-manager :problem="problem" :operation="'更新'" />
  </div>
</template>

<script>
import ProblemManager from "../../components/Problem/ProblemManager";
import { getRequest } from "@/utils/request";
export default {
  name: "problemEdit",
  components: { ProblemManager },
  data() {
    return {
      problem: {},
    };
  },
  methods: {
    fetchProblemData() {
      // 确保使用正确的查询参数名 'problemId' 而非 'id'
      getRequest("/api/problem/problem", {
        problemId: this.$route.params.id,
      })
        .then((response) => {
          if (response.code === "200" && response.payload) {
            // 将响应的payload结构化赋值给problem对象
            this.problem = {
              id: response.payload.metadata.problemId,
              displayId: response.payload.metadata.displayId,
              title: response.payload.metadata.title,
              acceptedCount: response.payload.metadata.acceptedCount,
              submissionCount: response.payload.metadata.submissionCount,
              createdAt: response.payload.metadata.createdAt,
              difficulty: response.payload.metadata.difficulty,
              time: response.payload.metadata.time,
              memory: response.payload.metadata.memory,
              description: response.payload.description,
              inputFormat: response.payload.format.input,
              outputFormat: response.payload.format.output,
              sampleInput: response.payload.sample.input,
              sampleOutput: response.payload.sample.output,
              other: response.payload.other,
            };
          }
        })
        .catch((error) => {
          console.error("Failed to fetch problem data:", error);
        });
    },
  },
  created() {
    this.fetchProblemData();
  },
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
