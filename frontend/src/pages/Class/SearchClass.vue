<template>
  <div class="search-class">
    <el-table :data="classes" style="width: 100%">
      <el-table-column prop="classId" label="班级ID"></el-table-column>
      <el-table-column prop="className" label="班级名称"></el-table-column>
      <el-table-column prop="teacherId" label="教师ID"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getRequest } from "../../utils/request";

export default {
  data() {
    return {
      classes: [
        { classId: 1, teacherId: 100, className: "一班" },
        { classId: 2, teacherId: 101, className: "二班" },
        { classId: 3, teacherId: 102, className: "三班" },
      ],
    };
  },
  async created() {
    const response = await getRequest("/api/class/list", { count: 10 });
    if (response.code === "200") {
      this.classes = response.payload.classes;
    } else {
      this.$message.error(response.error.msg);
    }
  },
};
</script>

<style scoped>
.search-class {
  padding: 20px;
}
</style>
