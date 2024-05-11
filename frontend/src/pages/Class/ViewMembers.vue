<template>
  <div>
    <el-table :data="classData" style="width: 100%">
      <el-table-column prop="classId" label="班级ID"></el-table-column>
      <el-table-column prop="teacherId" label="教师ID"></el-table-column>
      <el-table-column prop="students" label="学生"></el-table-column>
      <el-table-column prop="className" label="班级名称"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    classData: Array,
  },
};
</script>
