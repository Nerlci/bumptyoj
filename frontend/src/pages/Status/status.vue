<template>
  <div class="status-list">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <div>
        <el-input v-model="problemSearchQuery" placeholder="以题目ID搜索评测记录..." style="width: 200px;" class="search-input"></el-input>
        <el-input v-model="userSearchQuery" placeholder="以用户ID搜索评测记录..." style="width: 200px;" class="search-input"></el-input>
        <el-button type="primary" icon="el-icon-search" circle @click="fetchSubmissions"></el-button>
      </div>
    </div>

    <el-table :data="submissions" style="width: 100%" @row-click="handleRowClick">
      <el-table-column prop="submissionId" label="评测ID"></el-table-column>
      <el-table-column prop="problemId" label="题目"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="formatStatus"></el-table-column>
      <el-table-column prop="score" label="分数"></el-table-column>
      <el-table-column prop="userId" label="用户"></el-table-column>
      <el-table-column prop="time" label="运行时间(ms)"></el-table-column>
      <el-table-column prop="memory" label="内存(MB)" :formatter="formatMemory"></el-table-column>
      <el-table-column prop="length" label="代码长度"></el-table-column>
      <el-table-column prop="language" label="语言"></el-table-column>
      <el-table-column prop="timestamp" label="提交时间" :formatter="formatTimestamp"></el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 15, 20]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<style scoped>
.status-list {
    width: 90%;
    margin: auto;
    /* 与问题列表的宽度设置保持一致 */
}

.search-input {
    margin-right: 8px; /* 确保输入框之间有适当的间隔 */
}
</style>


<script>
import {getRequest} from '@/utils/request';
import moment from 'moment';
export default {
  data() {
    return {
      submissions: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      userSearchQuery: '',
      problemSearchQuery: ''
    };
  },
  mounted() {
    this.fetchSubmissions();
  },
  methods: {
    fetchSubmissions() {
      getRequest(`/api/submission/list?count=${this.pageSize}&userId=${encodeURIComponent(this.userSearchQuery)}&problemId=${encodeURIComponent(this.problemSearchQuery)}`)
        .then(response => {
          this.submissions = response.payload.submissions;
          this.total = response.payload.count; 
        }).catch(error => {
          console.error('Failed to fetch submissions:', error);
        });
    },
    handleRowClick(row) {
      this.$router.push({ name: 'statusDetail', params: { submissionId: row.submissionId } });
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.fetchSubmissions(this.currentPage);
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.fetchSubmissions(newPage);
    },
    formatTimestamp(value) {
      return moment(value).fromNow();
    },
    formatMemory(value) {    
      return (value.memory / 1024 / 1024).toFixed(2); 
    }
  }
};
</script>
