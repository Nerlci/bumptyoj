<template>
    <div class="pagination-wrapper">
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="10"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      total: Number
    },
    data() {
      return {
        currentPage: 1
      };
    },
    methods: {
      handlePageChange(newPage) {
        this.$emit('change-page', newPage);
      }
    }
  }
  </script>
  
  <style scoped>
  .pagination-wrapper {
    margin: 20px 0;
  }
  </style>
  