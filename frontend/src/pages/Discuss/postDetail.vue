<template>
  <div class="post-detail">
    <div class="post-content">
      <h1>{{ post.title }}</h1>
      <el-descriptions :column="3" class="post-info">
        <el-descriptions-item label="作者">
          <template #label>作者:</template>
          <el-tag size="medium">{{ post.author }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="时间戳">
          <template #label>时间戳:</template>
          <el-tag size="medium">{{ formatDate(post.timestamp) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="板块">
          <template #label>板块:</template>
          <el-tag size="medium">{{ post.category }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <el-input
        type="textarea"
        v-model="post.content"
        :rows="10"
        readonly
        class="content-textarea"
      ></el-input>
    </div>
    <div class="comments">
      <div class="comment-input">
        <el-input
          type="textarea"
          v-model="newComment"
          placeholder="添加评论..."
          class="new-comment"
          :rows="4"
        ></el-input>
        <el-button type="primary" @click="submitComment" class="submit-button"
          >提交评论</el-button
        >
      </div>
      <el-pagination
        @current-change="handlePageChange"
        :current-page="commentPage"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="totalComments"
        class="pagination"
      ></el-pagination>
      <el-list
        v-for="comment in comments"
        :key="comment.commentId"
        class="comment-list"
      >
        <el-list-item>{{ comment.author }}: {{ comment.content }}</el-list-item>
      </el-list>
    </div>
  </div>
</template>

<script>
import { getRequest } from "@/utils/request";
import { postRequest } from "@/utils/request";
import { DateTime } from "luxon";

export default {
  data() {
    return {
      postId: null,
      post: {},
      comments: [],
      newComment: "",
      commentPage: 1,
      pageSize: 10,
      totalComments: 0,
    };
  },
  created() {
    this.postId = this.$route.params.postId;
    this.fetchPost();
    this.fetchComments();
  },
  methods: {
    fetchPost() {
      getRequest(`/api/discussion/post?postId=${this.postId}`)
        .then((response) => {
          if (response.code === "200") {
            this.post = response.payload;
          } else {
            this.$message.error(response.error.msg);
          }
        })
        .catch((error) => {
          console.error("Error fetching post details:", error);
          this.$message.error("网络错误或服务器异常");
        });
    },
    fetchComments() {
      const offset = (this.commentPage - 1) * this.pageSize;
      getRequest(
        `/api/discussion/comment?count=${this.pageSize}&offset=${offset}&postId=${this.postId}`,
      )
        .then((response) => {
          if (response.code === "200") {
            this.comments = response.payload.comments;
            this.totalComments = response.payload.total;
          } else {
            this.$message.error(response.error.msg);
          }
        })
        .catch((error) => {
          console.error("Error fetching comments:", error);
          this.$message.error("网络错误或服务器异常");
        });
    },
    submitComment() {
      if (!this.newComment.trim()) {
        this.$message.error("评论内容不能为空");
        return;
      }
      postRequest(`/api/discussion/comment`, {
        content: this.newComment,
        postId: this.postId,
      })
        .then((response) => {
          if (response.data.code === "200") {
            this.comments.push(response.payload); // 添加新评论到列表
            this.newComment = ""; // 清空输入框
            this.$message.success("评论成功！");
          } else {
            this.$message.error(response.error.msg);
          }
        })
        .catch((error) => {
          console.error("Error posting comment:", error);
          this.$message.error("网络错误或服务器异常");
        });
    },
    formatDate(timestamp) {
      return DateTime.fromISO(timestamp, { zone: "Asia/Shanghai" }).toFormat(
        "yyyy-MM-dd HH:mm:ss",
      );
    },
  },
};
</script>

<style scoped>
.post-detail {
  margin: 20px;
}
.post-content {
  margin-bottom: 20px;
}
.comments {
  margin-top: 20px;
}
.content-textarea {
  background-color: #f5f5f5; /* 轻微的背景色 */
  border: none;
}
.comment-input {
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* 将提交按钮对齐到右侧 */
}
.new-comment {
  margin-bottom: 10px; /* 添加间隔 */
}
.submit-button {
  width: 100px; /* 固定按钮宽度 */
}
.pagination {
  margin: 20px 0;
}
.comment-list {
  margin-top: 10px;
}
</style>
