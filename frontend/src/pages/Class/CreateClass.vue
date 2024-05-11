<template>
  <div class="create-class">
    <el-dialog :visible.sync="dialogVisible" title="创建新班级" width="30%">
      <el-form ref="classForm" :model="classForm" label-width="100px">
        <el-form-item label="班级名称">
          <el-input
            v-model="classForm.className"
            placeholder="默认为000"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="教师ID"
          :rules="[
            { required: true, message: '请输入教师ID', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model.number="classForm.teacherId"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="学生ID"
          :rules="[
            {
              required: true,
              message: '请输入至少一个学生ID',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model="studentsInput"
            placeholder="输入学生ID，用逗号分隔"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { postRequest } from "../../utils/request";

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      classForm: {
        className: "",
        teacherId: null,
        students: [],
      },
      studentsInput: "",
    };
  },
  watch: {
    dialogVisible(newVal) {
      if (!newVal) {
        this.closeDialog();
      }
    },
  },
  methods: {
    closeDialog() {
      this.$refs.classForm.resetFields(); // 重置表单
      this.studentsInput = ""; // 重置学生ID输入
      this.classForm.className = ""; // 重置班级名称输入
      this.classForm.teacherId = null; // 重置教师ID输入
      this.$emit("update:dialogVisible", false);
    },
    submitForm() {
      if (!this.classForm.className) {
        this.classForm.className = "000";
      }
      this.classForm.students = this.studentsInput.split(",").map(Number);
      this.$refs.classForm.validate((valid) => {
        if (valid) {
          postRequest("/api/class/class", this.classForm)
            .then((response) => {
              if (response && response.code === "200") {
                this.$message.success("班级创建成功");
                this.closeDialog();
              } else {
                this.$message.error(
                  "班级创建失败: " + (response.msg || "未知错误"),
                );
              }
            })
            .catch((error) => {
              this.$message.error("请求失败: " + (error.message || "未知错误"));
            });
        } else {
          console.log("表单验证失败");
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.create-class {
  position: absolute;
  right: 20px;
  top: 20px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
