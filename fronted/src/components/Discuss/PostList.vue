<template>
    <el-table
      :data="posts"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="author"
        label="作者"
        width="180">
      </el-table-column>
    </el-table>
  </template>
  
  <script>
  export default {
    props: {
      posts: Array
    }
  }
  </script>
  