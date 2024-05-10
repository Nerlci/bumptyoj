<template>
  <div class="post-detail">
    <div class="post-content">
      <h1>{{ post.title }}</h1>
      <div>{{ post.content }}</div>
      <div>{{ post.author }} - {{ post.timestamp }}</div>
    </div>
    <div class="comments">
      <el-input type="textarea" v-model="newComment" placeholder="添加评论..."></el-input>
      <el-button type="primary" @click="submitComment">提交评论</el-button>
      <el-list v-for="comment in comments" :key="comment.commentId">
        <el-list-item>{{ comment.author }}: {{ comment.content }}</el-list-item>
      </el-list>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      post: {},
      comments: [],
      newComment: ''
    };
  },
  methods: {
    fetchPost() {
      // API call to fetch post details
    },
    fetchComments() {
      // API call to fetch comments
    },
    submitComment() {
      // API call to submit a new comment
    }
  }
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
</style>
