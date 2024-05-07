<template>
  <el-table :data="posts" @row-click="handleRowClick">
    <el-table-column prop="title" label="标题"></el-table-column>
    <el-table-column prop="author" label="作者"></el-table-column>
    <el-table-column prop="date" label="日期"></el-table-column>
  </el-table>
</template>

<script>
export default {
  props: ["posts"],
  methods: {
    handleRowClick(row) {
      this.$router.push({ name: "PostDetails", params: { id: row.id } });
    },
  },
};
</script>
