<template>
    <div class="container">
      <div class="search-box">
        <input type="text" placeholder="搜索帖子">
        <el-button class="search-button" type="primary">搜索</el-button>
      </div>
      <div class="board" @click="viewBoard('ProblemDiscussion')">
        <h3 class="board-title">题目讨论</h3>
        <hr>
        <ul>
          <li v-for="post in latestPosts" :key="post.id">{{ post.title }}</li>
        </ul>
      </div>
      <div class="board" @click="viewBoard('TechExchange')">
        <h3 class="board-title">技术交流</h3>
        <hr>
        <ul>
          <li v-for="post in latestPosts" :key="post.id">{{ post.title }}</li>
        </ul>
      </div>
      <div class="board" @click="viewBoard('FeedbackAndSuggestions')">
        <h3 class="board-title">反馈与建议</h3>
        <hr>
        <ul>
          <li v-for="post in latestPosts" :key="post.id">{{ post.title }}</li>
        </ul>
      </div>
      <div class="board" @click="viewBoard('OffTopic')">
        <h3 class="board-title">灌水区</h3>
        <hr>
        <ul>
          <li v-for="post in latestPosts" :key="post.id">{{ post.title }}</li>
        </ul>
      </div>
      <el-button class="post-button" type="success">发帖</el-button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        latestPosts: []
      };
    },
    mounted() {
      this.fetchLatestPosts();
    },
    methods: {
      fetchLatestPosts() {
        // 模拟获取最新帖子数据的异步操作
        setTimeout(() => {
          this.latestPosts = [
            { id: 1, title: "最新帖子1" },
            { id: 2, title: "最新帖子2" },
            { id: 3, title: "最新帖子3" },
            // 其他帖子...
          ];
        }, 1000); // 模拟延迟1秒
      },
      viewBoard(boardName) {
        this.$router.push({ name: boardName });
        console.log("进入板块：" + boardName);
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 将列数修改为两列 */
    gap: 1em; /* 设置网格间距 */
    background-color: #f5f5f5; /* 设置背景颜色 */
    padding: 20px; /* 设置内边距 */
    border-radius: 10px; /* 设置圆角边框 */
  }
  
  .board {
    margin-bottom: 1em;
    padding: 1em;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #fff;
    cursor: pointer; /* 鼠标悬停时显示手型 */
  }
  
  .board-title {
    font-size: 1.2em; /* 缩小板块名称的字体大小 */
    margin-bottom: 0.5em;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  hr {
    border: 0;
    border-top: 1px solid #ddd;
    margin-bottom: 1em;
  }
  
  .search-box {
    grid-column: 1 / -1; /* 搜索框横跨所有列 */
    display: flex;
    align-items: center; /* 垂直居中 */
    justify-content: flex-end; /* 右对齐 */
    margin-bottom: 1em; /* 与板块之间留出一定的间距 */
  }
  
  .search-box input {
    padding: 0.5em;
    margin-right: 0.5em;
    border: 1px solid #ddd;
    border-radius: 5px; /* 圆角边框 */
  }
  
  .search-button {
    margin-right: 0.5em;
  }
  
  .post-button {
    grid-column: 2; /* 发帖按钮只占第二列 */
    justify-self: end; /* 右对齐 */
    margin-top: 1em; /* 添加一些顶部间距 */
  }
  </style>
  