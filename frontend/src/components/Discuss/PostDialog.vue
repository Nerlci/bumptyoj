<template>
  <el-dialog :visible.sync="localDialogVisible" title="发布新帖子" width="50%">
    <el-form ref="postForm" :model="postForm" label-width="100px">
      <el-form-item
        label="标题"
        required
        :rules="[{ required: true, message: '请输入标题', trigger: 'blur' }]"
      >
        <el-input v-model="postForm.title" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item
        label="内容"
        required
        :rules="[{ required: true, message: '请输入内容', trigger: 'blur' }]"
      >
        <el-input
          type="textarea"
          v-model="postForm.content"
          rows="5"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="板块"
        required
        :rules="[{ required: true, message: '请选择板块', trigger: 'change' }]"
      >
        <el-select v-model="postForm.category" placeholder="请选择">
          <el-option
            v-for="category in categories"
            :key="category.value"
            :label="category.label"
            :value="category.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogVisible: Boolean,
  },
  data() {
    return {
      localDialogVisible: this.dialogVisible,
      postForm: {
        title: "",
        content: "",
        category: "",
      },
      categories: [
        { value: "1", label: "题目讨论" },
        { value: "2", label: "技术交流" },
        { value: "3", label: "反馈与建议" },
        { value: "4", label: "闲聊灌水" },
      ],
    };
  },
  watch: {
    dialogVisible(newVal) {
      this.localDialogVisible = newVal;
    },
  },
  methods: {
    submitForm() {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          alert("模拟提交: " + JSON.stringify(this.postForm));
          this.closeDialog();
          this.resetForm();
        } else {
          console.log("表单验证失败");
          return false;
        }
      });
    },
    resetForm() {
      this.postForm = {
        title: "",
        content: "",
        category: "",
      };
    },
    closeDialog() {
      this.$emit("update:dialogVisible", false);
    },
  },
};
</script>
