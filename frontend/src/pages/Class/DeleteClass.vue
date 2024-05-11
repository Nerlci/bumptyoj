<template>
  <div>
    <el-dialog
      title="解散班级"
      :visible.sync="dialogVisible"
      :before-close="resetForm"
    >
      <el-form>
        <el-form-item label="班级ID">
          <el-input v-model="classId" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteClass">解散班级</el-button>
        <el-button @click="resetForm">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deleteRequest } from "../../utils/request";

export default {
  data() {
    return {
      dialogVisible: false,
      classId: "",
    };
  },
  methods: {
    deleteClass() {
      deleteRequest(`/api/class/class`, { classId: this.classId })
        .then((response) => {
          if (response.code === "200") {
            this.$message.success("班级解散成功");
          } else {
            this.$message.error("解散班级失败: " + response.msg);
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
    },
  },
};
</script>
