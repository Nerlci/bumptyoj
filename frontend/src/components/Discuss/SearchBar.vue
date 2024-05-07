<template>
  <el-input
    v-model="searchQuery"
    placeholder="请输入搜索内容"
    @keyup.enter="handleSearch"
    clearable
  >
    <template slot="append">
      <el-button icon="el-icon-search" @click="handleSearch"
        >搜索帖子</el-button
      >
    </template>
  </el-input>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
    };
  },
  methods: {
    handleSearch() {
      this.$emit("search", this.searchQuery);
    },
  },
};
</script>

<style scoped>
/* 可以添加一些CSS样式调整搜索框的外观 */
</style>
