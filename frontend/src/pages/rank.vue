<template>
  <div class="rank-list" v-loading="loading" v-show="show">
    <el-radio-group v-model="rankType" @input="handleRankTypeChange">
      <el-radio-button label="count">通过数排名</el-radio-button>
      <el-radio-button label="weighted">加权排名</el-radio-button>
    </el-radio-group>
    <el-table :data="tableData" stripe style="height: 100%">
      <el-table-column label="排名" prop="rank" width="80px"></el-table-column>

      <el-table-column label="用户名" prop="username"></el-table-column>

      <el-table-column
        label="分数"
        prop="score"
        width="100px"
      ></el-table-column>
    </el-table>

    <el-pagination
      :page-size="pageSize"
      :total="itemCount"
      @current-change="getPage"
      background
      element-loading-spinner="el-icon-more-outline"
      id="rank-list-pagination"
      layout="prev, pager, next"
      v-show="itemCount > pageSize"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "rank",
  data() {
    return {
      rankType: "count",
      loading: true,
      tableData: [],
      pageSize: 10,
      pageIndex: 1,
      itemCount: 10,
      show: false,
      leaderboard: [],
    };
  },
  methods: {
    getPage(index) {
      this.pageIndex = index;
      this.tableData = this.leaderboard.slice(
        (index - 1) * this.pageSize,
        index * this.pageSize,
      );
    },
    getPageInfo() {
      this.getRequest(`/api/leaderboard/${this.rankType}`).then((resp) => {
        this.leaderboard = resp.payload.leaderboard;
        this.itemCount = this.leaderboard.length;
        this.getPage(1);
      });
    },
    handleRankTypeChange() {
      this.loading = true;
      setTimeout(() => {
        this.getPageInfo();
        this.loading = false;
      }, 250);
    },
  },
  created() {
    this.getPageInfo();
    this.loading = false;
  },
  mounted() {
    this.show = true;
  },
};
</script>

<style scoped>
.rank-list {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.cursor-pointer {
  cursor: pointer;
}

#rank-list-pagination {
  margin-top: 30px;
}
</style>
