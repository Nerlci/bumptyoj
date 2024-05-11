<template>
  <div>
    <div>
      <div class="class-cards">
        <el-card
          v-for="item in classes"
          :key="item.classId"
          class="class-card"
          shadow="hover"
        >
          <div slot="header" class="clearfix class-card-header">
            <span>{{ item.className }}</span>
          </div>
          <div class="clearfix class-control">
            <el-button
              icon="el-icon-tickets"
              @click="showClass(item.classId)"
              class="class-detail"
            >
              查看
            </el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="editClass(item.classId)"
              class="class-edit"
              v-if="
                $store.state.status.type == 0 ||
                ($store.state.status.type == 2 &&
                  item.teacherId == $store.state.status.id)
              "
            >
              编辑
            </el-button>
          </div>
        </el-card>
      </div>
      <el-pagination
        @current-change="getPage"
        :current-page="1"
        :page-size="pageSize"
        :total="itemCount"
        layout="prev, pager, next"
        v-show="itemCount > pageSize"
      ></el-pagination>

      <el-button
        type="primary"
        @click="addClass"
        class="add-class-button"
        v-if="$store.state.status.type == 0 || $store.state.status.type == 2"
      >
        新建班级
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "problems",
  data() {
    return {
      loading: true,
      itemCount: 0,
      pageSize: 15,
      classes: [],
    };
  },
  methods: {
    getPage(index) {
      this.loading = true;
      // 调用获取题目列表的API
      this.getRequest("/api/class/list", {
        offset: (index - 1) * this.pageSize,
        count: this.pageSize,
      }).then((response) => {
        const classes = response.payload.classes;
        this.classes = classes;
      });

      this.fetchItemCount();
    },
    fetchItemCount() {
      this.getRequest("/api/problemset/contest/count").then((response) => {
        this.itemCount = response.payload.count;
      });
    },
    showClass(id) {
      this.$router.push({ name: "classDetail", params: { id: id } });
    },
    editClass(id) {
      this.$router.push({ name: "classEdit", params: { id: id } });
    },
    addClass() {
      this.$router.push({ name: "classAdd" });
    },
    getPageInfo() {
      this.getPage(1);
    },
  },
  created() {
    this.getPageInfo();
  },
};
</script>

<style scoped>
.class-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 80%;
  height: 100%;
  margin: auto;
}

.class-card {
  width: 49%;
  margin-bottom: 20px;
}

.class-control {
  float: right;
  padding: 10px 0;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.add-class-button {
  margin-top: 20px;
  /* 添加顶部边距，根据需要调整 */
  cursor: pointer;
  color: #f4f9fb;
}
</style>
