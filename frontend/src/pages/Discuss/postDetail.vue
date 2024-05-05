<template>
    <div class="post-detail-page">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{ post.title }}</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="backToList">返回列表</el-button>
        </div>
        <div class="post-content">
          <h3>作者: {{ post.author }}</h3>
          <p>发布日期: {{ post.date }}</p>
          <div class="content">
            <p>{{ post.content }}</p>
          </div>
        </div>
      </el-card>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PostDetails',
    data() {
      return {
        post: null
      };
    },
    methods: {
      fetchPostDetails() {
        const postId = this.$route.params.id;
        // Simulate fetching data
        const fetchedPost = this.$store.state.posts.find(p => p.id === parseInt(postId));
        this.post = fetchedPost;
      },
      backToList() {
        this.$router.push({ name: 'Discuss' });
      }
    },
    created() {
      this.fetchPostDetails();
    }
  }
  </script>
  
  <style scoped>
  .post-detail-page {
    margin: 20px;
  }
  
  .box-card {
    border-radius: 4px;
  }
  
  .post-content h3, .post-content p {
    margin: 10px 0;
  }
  
  .content p {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  </style>
  