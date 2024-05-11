<template>
  <div class="class-manage">
    <div class="buttons">
      <el-button type="primary" @click="createClass">创建班级</el-button>
      <delete-class ref="deleteDialog"></delete-class>
      <el-button type="danger" @click="showDeleteDialog">解散班级</el-button>
      <el-button type="primary" @click="showViewMembersDialog"
        >查询班级成员</el-button
      >
      <el-button type="primary" @click="showEditClassDialog"
        >修改班级信息</el-button
      >
      <el-button type="primary" @click="searchClass">查询班级列表</el-button>
      <el-button type="primary" @click="showCountDialog"
        >获取班级总数</el-button
      >
    </div>
    <div class="table-container">
      <el-table :data="classes" style="width: 100%">
        <el-table-column prop="classId" label="班级ID"></el-table-column>
        <el-table-column prop="teacherId" label="教师ID"></el-table-column>
        <el-table-column prop="students" label="学生"></el-table-column>
        <el-table-column prop="className" label="班级名称"></el-table-column>
      </el-table>
    </div>
    <create-class
      ref="createClass"
      @update:dialogVisible="dialogVisible = $event"
      :dialogVisible="dialogVisible"
    ></create-class>
    <edit-class
      ref="editClassDialog"
      @update:classes="classes = $event"
    ></edit-class>
    <el-dialog
      title="请输入班级ID"
      :visible.sync="viewMembersVisible"
      :before-close="resetForm"
    >
      <el-input v-model="classId" placeholder="请输入班级ID"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="fetchClass">确 定</el-button>
        <el-button @click="resetForm">取 消</el-button>
      </span>
    </el-dialog>
    <view-members
      ref="viewMembersDialog"
      :classData="classData"
      v-if="classData"
    ></view-members>
    <count-class ref="countDialog"></count-class>
  </div>
</template>

<script>
import CreateClass from "./CreateClass.vue";
import DeleteClass from "./DeleteClass.vue";
import EditClass from "./EditClass.vue";
import ViewMembers from "./ViewMembers.vue";
import CountClass from "./CountClass.vue";
import { getRequest } from "../../utils/request";

export default {
  components: {
    CreateClass,
    DeleteClass,
    EditClass,
    CountClass,
    ViewMembers,
  },
  data() {
    return {
      dialogVisible: false,
      viewMembersVisible: false,
      classId: "",
      classData: null,
      classes: [
        {
          classId: 1,
          teacherId: 100,
          students: [200, 201, 202],
          className: "一班",
        },
        {
          classId: 2,
          teacherId: 101,
          students: [203, 204, 205],
          className: "二班",
        },
        {
          classId: 3,
          teacherId: 102,
          students: [206, 207, 208],
          className: "三班",
        },
      ],
    };
  },
  methods: {
    showCountDialog() {
      this.$refs.countDialog.dialogVisible = true;
    },
    createClass() {
      this.dialogVisible = true;
    },
    showDeleteDialog() {
      this.$refs.deleteDialog.dialogVisible = true;
    },
    showViewMembersDialog() {
      this.viewMembersVisible = true;
    },
    showEditClassDialog() {
      this.$refs.editClassDialog.dialogVisible = true;
    },
    searchClass() {
      this.$router.push({ name: "SearchClass" });
    },
    resetForm() {
      this.viewMembersVisible = false;
      this.classId = ""; // 重置班级ID输入
    },
    async fetchClass() {
      const response = await getRequest(`/api/class/class`, {
        classId: this.classId,
      });
      if (response.code === "200") {
        this.classData = [response.payload];
        this.resetForm(); // 调用 resetForm 方法来关闭对话框并重置输入
      } else {
        this.classData = null;
      }
    },
  },
};
</script>

<style scoped>
.buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.buttons > .el-button {
  flex-grow: 1;
  margin: 0 40px;
}

.table-container {
  display: flex;
  justify-content: center;
  border: 1px solid lightblue;
  padding: 10px;
}

.el-table {
  width: 100% !important;
}
</style>
