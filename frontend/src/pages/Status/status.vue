<template>
  <div class="status-list" v-loading="loading">
    <el-table :data="tableData" stripe>
      <el-table-column align="center" label="提交ID" prop="id" width="76px">
        <template slot-scope="scope">
          <span
            @click="showStatus(scope.row.id, scope.row.author)"
            class="cursor-pointer"
            >{{ scope.row.id }}</span
          >
        </template>
      </el-table-column>

      <el-table-column align="center" label="题目ID" prop="pid" width="76px">
        <template slot-scope="scope">
          <span @click="showProblem(scope.row.pid)" class="cursor-pointer">{{
            scope.row.pid
          }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户名" prop="author" />

      <el-table-column align="center" label="结果" prop="status">
        <template slot-scope="scope">
          <span
            @click="showStatus(scope.row.id, scope.row.author)"
            class="cursor-pointer"
            :style="GetColor(scope.row.status)"
            >{{ statusResult(scope.row.status) }}</span
          >
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="长度"
        prop="answerLength"
        width="90xp"
      />
      <el-table-column
        align="center"
        label="提交时间"
        prop="submitTime"
        width="100px"
      />
    </el-table>

    <el-pagination
      :page-size="pageSize"
      :total="itemCount"
      @current-change="getPage"
      background
      element-loading-spinner="el-icon-more-outline"
      class="status-list-pagination"
      layout="prev, pager, next"
      v-show="itemCount > pageSize"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getRequest } from '@/utils/request';

export default {
  data() {
    return {
      submissions: [],
      loading: false,
      error: null,
    };
  },
  created() {
    this.fetchSubmissions();
  },
  methods: {
    fetchSubmissions() {
      this.loading = true;
      getRequest('/submission/list', {
        count: 20 
      }).then(response => {
        if (response.code === "200") {
          this.submissions = response.payload.submissions;
        } else {
          this.error = response.error.msg;
        }
      }).catch(error => {
        this.error = error.message || 'Failed to fetch data';
      }).finally(() => {
        this.loading = false;
      });
    }
  }
};
</script>

<style scoped>
.status-list {
  font-weight: bold;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.cursor-pointer {
  cursor: pointer;
}

.status-list-pagination {
  margin-top: 30px;
}
</style>
