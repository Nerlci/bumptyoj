<template>
  <div>
    <el-dialog
      title="修改班级信息"
      :visible.sync="dialogVisible"
      :before-close="resetForm"
    >
      <el-form>
        <el-form-item label="班级ID">
          <el-input v-model="classId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="教师ID">
          <el-input v-model="teacherId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级名称">
          <el-input v-model="className" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学生ID">
          <el-input
            v-model="studentsInput"
            placeholder="输入学生ID，用逗号分隔"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editClass">保存</el-button>
        <el-button @click="resetForm">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { putRequest } from "../../utils/request";

export default {
  data() {
    return {
      dialogVisible: false,
      classId: "",
      teacherId: "",
      className: "",
      studentsInput: "",
    };
  },
  methods: {
    editClass() {
      const students = this.studentsInput.split(",").map(Number);
      putRequest(`/api/class/class`, {
        classId: this.classId,
        teacherId: this.teacherId,
        className: this.className,
        students: students,
      })
        .then((response) => {
          if (response.code === "200") {
            this.$message.success("班级信息修改成功");
            this.$emit("update:classes", response.payload);
          } else {
            this.$message.error("修改班级信息失败: " + response.msg);
          }
          this.resetForm(); // 调用 resetForm 方法来关闭对话框并重置输入
        })
        .catch((error) => {
          this.$message.error("请求失败: " + error.message);
        });
    },
    resetForm() {
      this.dialogVisible = false;
      this.classId = ""; // 重置班级ID输入
      this.teacherId = ""; // 重置教师ID输入
      this.className = ""; // 重置班级名称输入
      this.studentsInput = ""; // 重置学生ID输入
    },
  },
};
</script>
