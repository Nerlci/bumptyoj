<template>
  <div class="status-detail" v-loading="loading" v-show="show">
    <h2 id="solution-title">代码查看 - {{ solution.title }}</h2>

    <div class="metadata">
      <span
        ><i class="el-icon-timer"></i>提交时间&nbsp;{{
          solution.submitTime
        }}</span
      >&nbsp;|&nbsp;
      <span :style="gao(solution.status)"
        ><i class="el-icon-hot-water"></i>状态&nbsp;{{ solution.status }}</span
      >
      <span>语言: {{ solution.language }}</span
      >&nbsp;|&nbsp; <span>内存使用: {{ solution.memory }}</span
      >&nbsp;|&nbsp; <span>执行时间: {{ solution.time }}</span
      >&nbsp;|&nbsp;
      <span>得分: {{ solution.score }}</span>
    </div>

    <el-button
      id="clip-button"
      size="large"
      v-clipboard:copy="solution.answer"
      v-clipboard:error="onCopyError"
      v-clipboard:success="onCopySuccess"
      type="primary"
      >复制代码
    </el-button>

    <el-card class="solution-answer" shadow="always">
      <pre>{{ solution.answer }}</pre>
    </el-card>
  </div>
</template>

<script>
import { getRequest } from '@/utils/request';

export default {
  data() {
    return {
      detail: null,
      loading: false,
      error: null,
    };
  },
  created() {
    this.fetchSubmissionDetail();
  },
  methods: {
    fetchSubmissionDetail() {
      const submissionId = this.$route.params.submissionId; // 获取路由参数中的 submissionId
      this.loading = true;
      getRequest('/submission/submission', {
        submissionId // 传递 submissionId 作为参数
      }).then(response => {
        if (response.code === "200") {
          this.detail = response.payload;
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
.status-detail {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.metadata {
  margin-top: 20px;
  margin-bottom: 30px;
}

#clip-button {
  margin-bottom: 30px;
}

.solution-answer {
  text-align: left;
}
</style>
