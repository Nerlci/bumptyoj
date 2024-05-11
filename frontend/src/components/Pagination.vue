<template>
    <div>
      <el-button
        type="primary"
        @click="handlePreClick"
        :disabled="currentPage <= 1"
      >上一页</el-button>
      <span style="margin: 10px 10px">第 {{ currentPage }} 页</span>
      <el-button
        type="primary"
        @click="handleNextClick"
        :disabled="currentPage >= maxPage"
      >下一页</el-button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      currentPage: {
        type: Number,
        required: true
      },
      maxPage: {
        type: Number,
        required: true
      }
    },
    methods: {
      handlePreClick() {
        this.$emit('pre-click');
      },
      handleNextClick() {
        this.$emit('next-click');
      }
    }
  }
  </script>
  