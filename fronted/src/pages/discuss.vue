<template>
  <div class="discussion-page">
    <!-- 搜索和发布按钮 -->
    <div class="top-bar">
      <search-bar @search="handleSearch" />
      <post-button @post="handlePost" />
    </div>

    <!-- 板块分类和帖子列表 -->
    <div class="main-content">
      <category-list @select-category="handleCategorySelect" />
      <post-list :posts="filteredPosts" />
    </div>

    <!-- 分页 -->
    <pagination :total="totalPosts" @change-page="handleChangePage" />

    <!-- 弹出窗口用于发布帖子 -->
    <post-dialog v-model="dialogVisible" @submit-success="handleSubmitSuccess" />
  </div>
</template>

<script>
import SearchBar from '../components/Discuss/SearchBar.vue';
import PostButton from '../components/Discuss/PostButton.vue';
import CategoryList from '../components/Discuss/CategoryList.vue';
import PostList from '../components/Discuss/PostList.vue';
import Pagination from '../components/Discuss/Pagination.vue';
import PostDialog from '../components/Discuss/PostDialog.vue'; 

export default {
  components: {
    SearchBar,
    PostButton,
    CategoryList,
    PostList,
    Pagination,
    PostDialog 
  },
  data() {
    return {
      posts: [],
      filteredPosts: [],
      totalPosts: 0,
      currentCategory: null,
      searchQuery: '',
      dialogVisible: false 
    };
  },
  methods: {
    handleSearch(query) {
      this.searchQuery = query;
      this.filterPosts();
    },
    handlePost() {
      // 打开发布帖子的对话框
      this.dialogVisible = true;
    },
    handleCategorySelect(category) {
      this.currentCategory = category;
      this.filterPosts();
    },
    handleChangePage(page) {
      console.log('Page changed to:', page);
    },
    filterPosts() {
      this.filteredPosts = this.posts.filter(post => {
        return (this.currentCategory ? post.category === this.currentCategory : true) &&
               (this.searchQuery ? post.title.includes(this.searchQuery) : true);
      });
    },
    handleSubmitSuccess() {
      // 处理帖子提交成功后的逻辑，例如重新加载帖子列表
      this.dialogVisible = false;
      console.log('Post submitted successfully.');
    }
  },
  mounted() {
    this.posts = [
      { id: 1, title: 'Vue.js Basics', author: 'Alice', category: '1', date: '2022-01-01' },
      { id: 2, title: 'Advanced Vue Techniques', author: 'Bob', category: '1', date: '2022-01-02' },
      { id: 3, title: 'Introduction to Vuex', author: 'Carol', category: '2', date: '2022-01-03' }
    ];
    this.totalPosts = this.posts.length;
    this.filteredPosts = this.posts;
  }
}
</script>

<style scoped>
.discussion-page {
  margin: 20px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.main-content {
  display: flex;
}
</style>
