<template>
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      @select="handleSelect"
    >
      <el-menu-item index="1">题目讨论</el-menu-item>
      <el-menu-item index="2">技术交流</el-menu-item>
      <el-menu-item index="3">反馈与建议</el-menu-item>
      <el-menu-item index="4">闲聊灌水</el-menu-item>
    </el-menu>
  </template>
  
  <script>
  export default {
    methods: {
      handleSelect(index) {
        this.$emit('select-category', index);
      }
    }
  }
  </script>
  
  <style scoped>
  /* 样式调整 */
  </style>
  