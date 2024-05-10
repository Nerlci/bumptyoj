<template>
  <div class="discussion">
    <div class="sidebar">
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        @select="handleSelect"
      >
        <el-menu-item index="1">题目讨论</el-menu-item>
        <el-menu-item index="2">技术交流</el-menu-item>
        <el-menu-item index="3">反馈与建议</el-menu-item>
        <el-menu-item index="4">闲聊灌水</el-menu-item>
      </el-menu>
    </div>
    <div class="content">
      <el-button type="primary" @click="openPostDialog">发布帖子</el-button>
      <el-table :data="posts" style="width: 100%" @row-click="goToPostDetail">
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="author" label="作者"></el-table-column>
        <el-table-column prop="timestamp" label="发布时间" :formatter="formatTimestamp"></el-table-column>
      </el-table>
      <div style="display: flex; justify-content: center; margin-top: 20px">
        <el-button
          type="primary"
          @click="handlePreClick"
          :disabled="currentPage <= 1"
          >上一页</el-button
        >
        <span style="margin: 10px 10px">第 {{ currentPage }} 页</span>
        <el-button
          type="primary"
          @click="handleNextClick"
          :disabled="currentPage >= maxPage"
          >下一页</el-button
        >
      </div>
    </div>
    <el-dialog title="发布新帖子" :visible.sync="dialogVisible">
      <el-form :model="postForm">
        <el-form-item label="板块">
          <el-select v-model="postForm.category" placeholder="请选择">
            <el-option label="题目讨论" value="题目讨论"></el-option>
            <el-option label="技术交流" value="技术交流"></el-option>
            <el-option label="反馈与建议" value="反馈与建议"></el-option>
            <el-option label="闲聊灌水" value="闲聊灌水"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="postForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            type="textarea"
            v-model="postForm.content"
            rows="5"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="submitPost">发布</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRequest } from "@/utils/request";
import { postRequest } from "@/utils/request";
import { DateTime } from 'luxon';

export default {
  data() {
    return {
      dialogVisible: false,
      postForm: {
        title: "",
        category: "",
        content: "",
      },
      posts: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      maxPage: 1,
      currentCategory: "题目讨论",
    };
  },
  created() {
    this.fetchTotalCount();
    this.fetchPosts();
  },
  methods: {
    fetchPosts() {
      const offset = (this.currentPage - 1) * this.pageSize;
      getRequest("/api/discussion/list", {
        params: {
          category: this.currentCategory,
          count: this.pageSize,
          offset: offset,
        },
      })
        .then((response) => {
          if (response.code === "200") {
            this.posts = response.payload.posts;
          } else {
            this.$message.error(response.error.msg);
          }
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
        });
    },
    fetchTotalCount() {
      getRequest("/api/discussion/count")
        .then((response) => {
          if (response.code === "200") {
            this.total = response.payload.count;
            this.maxPage = Math.ceil(this.total / this.pageSize);
          } else {
            this.$message.error(response.error.msg);
          }
        })
        .catch((error) => {
          console.error("Error fetching post count:", error);
        });
    },
    handleSelect(index) {
      this.currentCategory = this.mapIndexToCategory(index);
      this.currentPage = 1;
      this.fetchTotalCount();
      this.fetchPosts();
    },
    handlePreClick() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchPosts();
      }
    },
    handleNextClick() {
      if (this.currentPage < this.maxPage) {
        this.currentPage++;
        this.fetchPosts();
      }
    },
    goToPostDetail(row) {
      this.$router.push({ name: "PostDetail", params: { postId: row.postId } });
    },
    openPostDialog() {
      this.dialogVisible = true;
    },
    resetForm() {
      this.postForm.title = "";
      this.postForm.category = "";
      this.postForm.content = "";
    },
    submitPost() {
      // 检查是否登录
      if (!this.$store.state.status.isLogin) {
        this.$message.error("请登录！");
        return;
      }
      if (
        !this.postForm.title ||
        !this.postForm.category ||
        !this.postForm.content
      ) {
        this.$message.error("请填写完整信息！");
        return;
      }
      postRequest("/api/discussion/post", {
        title: this.postForm.title,
        category: this.postForm.category,
        content: this.postForm.content,
      })
        .then((response) => {
          if (response.code === "200") {
            this.$message.success("发布成功！");
            this.dialogVisible = false;
            this.resetForm();
            this.fetchTotalCount();
            this.fetchPosts();
          } else {
            this.$message.error("发布失败: " + response.error.msg);
          }
        })
        .catch((error) => {
          console.error("Error posting:", error);
          this.$message.error("网络错误或服务器异常");
        });
    },
    mapIndexToCategory(index) {
      const categories = ["题目讨论", "技术交流", "反馈与建议", "闲聊灌水"];
      return categories[index - 1];
    },
    formatTimestamp(value) {
      const dt = DateTime.fromISO(value.timestamp, { zone: 'Asia/Shanghai' });
      return dt.toRelative();
    },
  },
};
</script>

<style scoped>
.discussion {
  display: flex;
}
.sidebar {
  width: 200px;
}
.content {
  flex: 1;
}
.el-dialog {
  --el-input-width: 300px; 
}

.el-input--textarea {
  width: 100%; 
}
</style>
