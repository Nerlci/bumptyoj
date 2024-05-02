<template>
    <div class="board">
      <h3 class="board-title">{{ boardTitle }}</h3>
      <hr>
      <ul>
        <li v-for="post in posts" :key="post.id">{{ post.title }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        boardTitle: "",
        posts: []
      };
    },
    created() {
      // 根据路由参数加载对应板块的数据
      this.loadBoardData();
    },
    methods: {
      loadBoardData() {
        // 根据路由参数加载不同板块的数据
        const boardName = this.$route.params.boardName;
        // 模拟异步加载数据
        setTimeout(() => {
          this.boardTitle = boardName;
          this.posts = [
            { id: 1, title: "帖子1" },
            { id: 2, title: "帖子2" },
            { id: 3, title: "帖子3" },
            // 其他帖子...
          ];
        }, 1000); // 模拟延迟1秒
      }
    }
  };
  </script>
  
  <style scoped>
  .board {
    padding: 1em;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #fff;
  }
  
  .board-title {
    font-size: 1.2em;
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
  </style>
  