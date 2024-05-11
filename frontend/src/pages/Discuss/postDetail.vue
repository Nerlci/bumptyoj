<template>
  <div class="post-detail">
    <div class="post-header">
      <h1>{{ post.title }}</h1>
      <div v-if="showPostButtons()">
        <el-button type="text" icon="el-icon-edit" @click="editPost"
          >编辑帖子</el-button
        >
        <el-button type="text" icon="el-icon-delete" @click="deletePost"
          >删除帖子</el-button
        >
      </div>
    </div>
    <div class="post-content">
      <el-tag size="medium" class="info-tag">作者: {{ post.author }}</el-tag>
      <el-tag size="medium" class="info-tag"
        >发布时间:{{ formatDate(post.timestamp) }}</el-tag
      >
      <el-tag size="medium" class="info-tag">板块:{{ post.category }}</el-tag>

      <el-card class="content-card" shadow="hover">
        <div class="collapse-content" v-html="md.render(post.content)"></div>
      </el-card>
    </div>

    <div class="comments">
      <el-card class="comment-input">
        <div slot="header" class="clearfix">
          <span>{{ this.totalComments }} 评论</span>
        </div>
        <el-input
          type="textarea"
          v-model="newComment"
          :rows="3"
          placeholder="发布一条评论..."
          class="new-comment"
        ></el-input>
        <el-button type="primary" @click="submitComment" class="submit-button">
          发布评论
        </el-button>
        <div
          v-for="comment in comments"
          :key="comment.commentId"
          class="comment-card"
        >
          <div class="comment-header">
            <span class="comment-username">{{ comment.author }}</span>
            <span class="comment-time">{{
              formatDate(comment.timestamp)
            }}</span>
            <el-button
              v-if="showCommentButtons(comment)"
              type="text"
              icon="el-icon-delete"
              @click="deleteComment(comment.commentId)"
              style="float: right"
            >
              删除
            </el-button>
          </div>
          <div class="comment-content">{{ comment.content }}</div>
          <hr
            v-if="comment !== comments[comments.length - 1]"
            class="comment-divider"
          />
        </div>
      </el-card>
      <div class="page-control">
        <Pagination
          :currentPage="commentPage"
          :maxPage="maxPage"
          @pre-click="handlePreClick"
          @next-click="handleNextClick"
        ></Pagination>
      </div>
    </div>
    <el-dialog title="编辑帖子" :visible.sync="dialogVisible">
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
    <el-button
      class="back-to-top"
      icon="el-icon-arrow-up"
      circle
      @click="backToTop"
    ></el-button>
  </div>
</template>

<script>
import { getRequest } from "@/utils/request";
import { postRequest } from "@/utils/request";
import { deleteRequest } from "@/utils/request";
import { putRequest } from "@/utils/request";
import Pagination from "../../components/Pagination";
import { DateTime } from "luxon";
import MarkdownIt from "markdown-it";
import markdownItKatex from "markdown-it-katex";

export default {
  components: {
    Pagination,
  },
  data() {
    return {
      md: new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
      }).use(markdownItKatex),
      dialogVisible: false,
      postForm: {
        title: "",
        category: "",
        content: "",
      },
      postId: null,
      post: {},
      comments: [],
      newComment: "",
      commentPage: 1,
      pageSize: 10,
      totalComments: 0,
      maxPage: 0,
    };
  },
  created() {
    this.postId = this.$route.params.postId;
    this.fetchPost();
    this.fetchCommentsCount();
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
    showPostButtons() {
      return (
        this.post.author === this.$store.state.status.username ||
        this.$store.state.status.type === 0
      );
    },
    editPost() {
      this.postForm.title = this.post.title;
      this.postForm.category = this.post.category;
      this.postForm.content = this.post.content;
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
      const putData = {
        title: this.postForm.title,
        category: this.postForm.category,
        content: this.postForm.content,
      };
      putRequest(`/api/discussion/post?postId=${this.postId}`, putData)
        .then((response) => {
          if (response.code === "200") {
            this.$message.success("编辑成功！");
            this.dialogVisible = false;
            this.resetForm();
            this.fetchPost();
          } else {
            this.$message.error("编辑失败: " + response.error.msg);
          }
        })
        .catch((error) => {
          console.error("Error posting:", error);
          this.$message.error("网络错误或服务器异常");
        });
    },
    deletePost() {
      this.$confirm("确认删除这篇帖子吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteRequest(`/api/discussion/post?postId=${this.postId}`)
            .then((response) => {
              if (response.code === "200") {
                this.$message.success("帖子已删除");
                this.$router.push("/discuss");
              } else {
                this.$message.error(response.error.msg);
              }
            })
            .catch((error) => {
              console.error("Error deleting post:", error);
              this.$message.error("网络错误或服务器异常");
            });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    fetchCommentsCount() {
      getRequest(`/api/discussion/comment/count?postId=${this.postId}`)
        .then((response) => {
          if (response.code === "200") {
            this.totalComments = response.payload.count;
            this.maxPage = Math.ceil(this.totalComments / this.pageSize);
          } else {
            this.$message.error(response.error.msg);
          }
        })
        .catch((error) => {
          console.error("Error fetching comments count:", error);
          this.$message.error("网络错误或服务器异常");
        });
    },
    fetchComments(direction) {
      if (direction === "prev") {
        this.commentPage -= 1;
      } else if (direction === "next") {
        this.commentPage += 1;
      }
      const offset = (this.commentPage - 1) * this.pageSize;
      getRequest(
        `/api/discussion/comment?count=${this.pageSize}&offset=${offset}&postId=${this.postId}`,
      )
        .then((response) => {
          if (response.code === "200") {
            this.comments = response.payload.comments;
          } else {
            this.$message.error(response.error.msg);
          }
        })
        .catch((error) => {
          console.error("Error fetching comments:", error);
          this.$message.error("网络错误或服务器异常");
        });
    },
    showCommentButtons(comment) {
      return (
        comment.author === this.$store.state.status.username ||
        this.$store.state.status.type === 0
      );
    },
    deleteComment(commentId) {
      // 确认删除
      this.$confirm("确认删除这条评论吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 发送删除请求
          deleteRequest(`/api/discussion/comment?commentId=${commentId}`)
            .then((response) => {
              if (response.code === "200") {
                // 如果删除成功，从本地列表中移除这条评论
                this.comments = this.comments.filter(
                  (comment) => comment.commentId !== commentId,
                );
                this.$message.success("评论已删除");
              } else {
                // 如果删除失败，显示错误消息
                this.$message.error(response.error.msg);
              }
            })
            .catch((error) => {
              // 处理网络或其他错误
              console.error("Error deleting comment:", error);
              this.$message.error("网络错误或服务器异常");
            });
        })
        .catch(() => {
          // 取消删除
          this.$message.info("已取消删除");
        });
    },
    handlePreClick() {
      if (this.commentPage > 1) {
        this.fetchComments("prev");
      } else {
        this.$message.error("已经是第一页了！");
      }
    },
    handleNextClick() {
      if (this.commentPage < this.maxPage) {
        this.fetchComments("next");
      } else {
        this.$message.error("已经是最后一页了！");
      }
    },
    submitComment() {
      if (!this.newComment.trim()) {
        this.$message.error("评论内容不能为空");
        return;
      }
      if (!this.$store.state.status.isLogin) {
        this.$message.error("请先登录");
        return;
      }
      postRequest(`/api/discussion/comment`, {
        content: this.newComment,
        postId: this.postId,
      })
        .then((response) => {
          if (response.code === "200") {
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
    backToTop() {
      window.scrollTo(0, 0);
    },
    backToTop() {
      window.scrollTo(0, 0);
    },
  },
};
</script>

<style scoped>
.comment-divider {
  border: none;
  height: 1px;
  background-color: #ccc;
  margin-top: 10px;
}
.content-card {
  margin-top: 30px;
  border: 1px solid #52abff;
}
.collapse-content {
  font-size: 14px;
  text-align: left;
}
.post-content {
  font-size: 14px;
}
.post-detail {
  margin: 20px;
}
.post-info {
  margin-bottom: 20px;
}
.info-tag {
  margin-right: 10px;
}
.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.comments {
  margin-top: 20px;
}
.comment-username {
  font-size: 14px;
}
.comment-card {
  margin-top: 10px;
}
.comment-username {
  font-weight: bold;
  color: #52abff;
}
.comment-time {
  font-size: 12px;
  color: #666;
}
.comment-content {
  margin-top: 10px;
}
.comment-input {
  display: flex;
  flex-direction: column;
  text-align: left;
}
.submit-button {
  margin-top: 10px;
  width: 100px;
}
.pagination {
  margin: 20px 0;
}
.comment-list {
  margin-top: 10px;
}
.info-label {
  font-weight: bold;
}
.page-control {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
.back-to-top {
  position: fixed;
  right: 20px;
  bottom: 20px;
}
.el-dialog {
  --el-input-width: 300px;
}
.el-input--textarea {
  width: 100%;
}
</style>
