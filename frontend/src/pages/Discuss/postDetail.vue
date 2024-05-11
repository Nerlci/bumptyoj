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
      <el-descriptions :column="3" class="post-info">
        <el-descriptions-item>
          <template #label><span class="info-label">作者:</span></template>
          <el-tag size="medium">{{ post.author }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label><span class="info-label">发布时间:</span></template>
          <el-tag size="medium">{{ formatDate(post.timestamp) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label><span class="info-label">板块:</span></template>
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
          placeholder="发布一条评论..."
          class="new-comment"
          :rows="4"
        ></el-input>
        <el-button type="primary" @click="submitComment" class="submit-button"
          >评论</el-button
        >
      </div>
      <el-list
        v-for="comment in comments"
        :key="comment.commentId"
        class="comment-list"
      >
        <el-card class="comment-card" :body-style="{ padding: '20px' }">
          <div slot="header" class="clearfix">
            <span style="float: left">{{ comment.author }}</span>
            <span style="float: right">
              <el-button
                v-if="showCommentButtons(comment)"
                type="text"
                icon="el-icon-delete"
                @click="deleteComment(comment.commentId)"
                >删除</el-button
              >
            </span>
          </div>
          <div>{{ comment.content }}</div>
          <div style="text-align: right; color: #8492a6; margin-top: 10px">
            {{ formatDate(comment.timestamp) }}
          </div>
        </el-card>
      </el-list>
      <div style="display: flex; justify-content: center; margin-top: 20px">
        <el-button
          type="primary"
          @click="handlePreClick"
          :disabled="commentPage <= 1"
          >上一页</el-button
        >
        <span style="margin: 10px 10px">第 {{ commentPage }} 页</span>
        <el-button
          type="primary"
          @click="handleNextClick"
          :disabled="commentPage >= maxPage"
          >下一页</el-button
        >
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
import { DateTime } from "luxon";

export default {
  data() {
    return {
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
    fetchCommentsCount(){
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
  background-color: #f5f5f5;
  border: solid 1px #ccc;
  padding: 10px;
}
.comment-input {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.new-comment {
  margin-bottom: 10px;
  border: solid 1px #ccc;
  padding: 10px;
}
.submit-button {
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
