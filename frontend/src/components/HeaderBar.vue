<template>
  <div class="nav-bar">
    <link
      rel="shortcut icon"
      type="image/x-icon"
      href="../../public/image/favicon.ico"
    />
    <el-row>
      <el-col :span="4">
        <div class="nav_bar_name">
          <a :href="'/home'" class="no-decoration">Bumpty OJ</a>
        </div>
      </el-col>
      <el-col :span="15">
        <el-menu
          :default-active="activeIndex"
          mode="horizontal"
          ref="rootMenu"
          router
        >
          <el-menu-item index="/home">
            <i class="el-icon-house"></i><span class="head-tag">首页</span>
          </el-menu-item>
          <el-menu-item index="/problems">
            <i class="el-icon-files"></i><span class="head-tag">题目</span>
          </el-menu-item>
          <el-menu-item index="/status">
            <i class="el-icon-coffee-cup"></i><span class="head-tag">状态</span>
          </el-menu-item>
          <el-menu-item index="/rank">
            <i class="el-icon-trophy"></i><span class="head-tag">排名</span>
          </el-menu-item>
          <el-menu-item index="/contest">
            <i class="el-icon-s-flag"></i><span class="head-tag">比赛</span>
          </el-menu-item>
          <el-menu-item index="/discuss">
            <i class="el-icon-chat-line-square"></i
            ><span class="head-tag">讨论</span>
          </el-menu-item>
          <el-menu-item index="/class">
            <i class="el-icon-user-solid el-icon--right"></i
            ><span class="head-tag">班级</span>
          </el-menu-item>
        </el-menu>
      </el-col>

      <el-col :span="5">
        <UserBar></UserBar>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import UserBar from "./UserBar";
export default {
  name: "HeaderBar",
  components: { UserBar },
  methods: {
    handleSelect(key, value) {
      console.log(key, value);
    },
  },
  data() {
    return {
      activeIndex: this.$route.path,
    };
  },
  watch: {
    $route(to) {
      this.$refs.rootMenu.activeIndex = to.path;
    },
  },
};
</script>

<style scoped>
.nav-bar {
  height: 60px;
  border-bottom: solid 1px #52abff;
}

.nav_bar_name {
  text-align: left;
  color: #52abff;
  font-size: 22px;
  margin-top: 21px;
  margin-left: 30%;
}

.no-decoration {
  text-decoration: none;
  color: #52abff;
}

@media (max-width: 840px) {
  .head-tag {
    display: none;
  }
  .el-menu-item {
    padding: 0 15px;
  }
}

@media (max-width: 720px) {
  .el-menu-item {
    padding: 0 5px;
  }
}
</style>
