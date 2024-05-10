<template>
  <div class="problem-introduce" v-loading="loading">
    <h2>题目推荐</h2>
    <el-card class="box-card" shadow="hover">
      <el-table :data="tableData" stripe>
        <el-table-column label="题目" prop="title">
          <template slot-scope="scope">
            <span @click="showProblem(scope.row.id)" class="cursor-pointer">{{
              scope.row.title
            }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ProblemIntroduce",
  data() {
    return {
      loading: true,
      pageSize: 6,
      tableData: [],
    };
  },
  methods: {
    getPage() {
      this.loading = true;
      this.getRequest("/api/problem/list", {
        count: this.pageSize,
        offset: 0,
      }).then((resp) => {
        this.tableData = resp.payload.problems;
        this.loading = false;
      });
    },
    showProblem(id) {
      this.$router.push({ name: "problemDetail", params: { id: id } });
    },
  },
  created() {
    if (window.innerHeight > 1080) this.pageSize = 5;
    this.getPage();
  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.box-card {
  width: 100%;
  border-radius: 10px;
}
</style>
