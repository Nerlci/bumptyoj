<template>
  <el-dialog title="班级总数" :visible.sync="dialogVisible">
    <p>当前班级总数：{{ count }}</p>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getRequest } from "../../utils/request";

export default {
  data() {
    return {
      dialogVisible: false,
      count: 0,
    };
  },
  methods: {
    async getCount() {
      const response = await getRequest("/api/class/count");
      if (response.code === "200") {
        this.count = response.payload.count;
      } else {
        this.$message.error(response.error.msg);
      }
    },
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.getCount();
      }
    },
  },
};
</script>
