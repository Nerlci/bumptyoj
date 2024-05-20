<template>
  <div>
    <div class="container">
      <el-descriptions border :column="2">
        <template slot="title">
          <p class="title">用户信息</p>
        </template>
        <template slot="extra">
          <el-button @click="showDialog">修改信息</el-button>
        </template>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-info"></i>
            用户ID
          </template>
          {{ this.$store.state.status.userId }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-message"></i>
            邮箱
          </template>
          {{ this.$store.state.status.email }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            用户名
          </template>
          {{ this.$store.state.status.username }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-more-outline"></i>
            用户类型
          </template>
          {{ formatType(this.$store.state.status) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-position"></i>
            提交数
          </template>
          {{ this.statistics.submissionCount }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-check"></i>
            通过数
          </template>
          {{ this.statistics.acceptedCount }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-document-checked"></i>
            通过题目数
          </template>
          {{ this.statistics.problemCount }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-document"></i>
            最近通过题目
          </template>
          <span v-for="problem in this.statistics.problems" :key="problem.id">
            <span class="user-edit" @click="showProblem(problem.id)">
              {{ problem.displayId }}
            </span>
            <el-divider direction="vertical"></el-divider>
          </span>
        </el-descriptions-item>
      </el-descriptions>

      <div v-show="this.$store.state.status.type == 0">
        <p class="title">用户管理</p>
        <el-table :data="userData" v-loading="loading" stripe>
          <el-table-column
            label="用户ID"
            prop="userId"
            min-width="60px"
          ></el-table-column>
          <el-table-column
            label="用户名"
            prop="username"
            min-width="120px"
          ></el-table-column>
          <el-table-column
            label="邮箱"
            prop="email"
            min-width="180px"
          ></el-table-column>
          <el-table-column
            label="类别"
            prop="type"
            :formatter="formatType"
            min-width="60px"
          ></el-table-column>

          <el-table-column label="操作" min-width="60px">
            <template slot-scope="scope">
              <span @click="editUser(scope.row.userId)" class="user-edit">
                编辑
              </span>
              <span @click="deleteUser(scope.row.userId)" class="user-delete">
                删除
              </span>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          class="user-pagination"
          :page-size="pageSize"
          :total="itemCount"
          @current-change="getPage"
          background
          layout="prev, pager, next"
          v-show="itemCount > pageSize"
        >
        </el-pagination>
      </div>

      <el-dialog title="修改信息" :visible.sync="dialogVisible">
        <el-form :model="postForm" :rules="rules" ref="postForm">
          <el-form-item label="用户ID">
            <el-input disabled v-model="postForm.userId"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="postForm.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="postForm.email"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input
              v-model="postForm.password"
              type="password"
              placeholder="留空则不修改"
            ></el-input>
          </el-form-item>
          <el-form-item label="重复新密码" prop="repassword">
            <el-input
              v-model="postForm.repassword"
              type="password"
              placeholder="留空则不修改"
            ></el-input>
          </el-form-item>
          <el-form-item label="当前用户密码" prop="checkPassword">
            <el-input
              v-model="postForm.checkPassword"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item label="类别">
            <el-radio-group
              v-model="postForm.type"
              :disabled="this.$store.state.status.type != 0"
            >
              <el-radio :label="0">管理员</el-radio>
              <el-radio :label="1">普通用户</el-radio>
              <el-radio :label="2">教师</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitUser('postForm')"
            >修改</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    let validatePass = (rule, value, callback) => {
      if (value !== "") {
        if (this.postForm.repassword !== "") {
          this.$refs.postForm.validateField("repassword");
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (this.postForm.password !== "" && value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.postForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    let validateName = async (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      }
    };

    return {
      dialogVisible: false,
      postForm: {
        userId: 0,
        username: "",
        email: "",
        password: "",
        repassword: "",
        checkPassword: "",
        size: "",
        type: 0,
      },
      statistics: {
        submissionCount: 0,
        acceptedCount: 0,
        problemCount: 0,
        problems: [],
      },
      userData: [],
      loading: false,
      pageSize: 10,
      itemCount: 0,
      rules: {
        username: [
          { validator: validateName, trigger: "blur", required: true },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { validator: validatePass, trigger: "blur" },
          {
            min: 3,
            max: 32,
            message: "长度在 3 到 32 个字符",
            trigger: "blur",
          },
        ],
        repassword: [
          { validator: validatePass2, trigger: "blur" },
          {
            min: 3,
            max: 32,
            message: "长度在 3 到 32 个字符",
            trigger: "blur",
          },
        ],
        checkPassword: [
          {
            type: "string",
            required: true,
            message: "请输入当前用户密码",
            trigger: "blur",
          },
        ],
        email: [
          {
            type: "email",
            required: true,
            message: "请输入邮箱",
            trigger: "change",
          },
        ],
      },
    };
  },
  mounted() {
    if (!this.$store.state.status.isLogin) {
      this.$message.error("请先登录");
      this.$router.push("/login");
    }
    if (this.$store.state.status.type == 0) {
      this.getCount();
      this.getPage(1);
    }
    this.getStatistics();
  },
  methods: {
    async getStatistics() {
      const response = await this.getRequest("/api/submission/statistics");
      this.statistics = response.payload;
    },
    async getPage(page) {
      if (this.$store.state.status.type != 0) {
        return;
      }
      const response = await this.getRequest("/api/user/list", {
        count: this.pageSize,
        offset: this.pageSize * (page - 1),
      });
      this.userData = response.payload.users;
    },
    async getCount() {
      if (this.$store.state.status.type != 0) {
        return;
      }
      const response = await this.getRequest("/api/user/count");
      this.itemCount = response.payload.count;
    },
    editUser(userId) {
      this.postForm = this.userData.find((item) => item.userId == userId);
      this.dialogVisible = true;
    },
    deleteUser(userId) {
      this.$confirm("确认删除该用户吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await this.deleteRequest(`/api/user/user?userId=${userId}`);
        this.$message.success("删除成功");
        this.userData = this.userData.filter((item) => item.userId != userId);
        this.itemCount -= 1;
      });
    },
    showDialog() {
      this.postForm = {
        ...this.$store.state.status,
      };
      delete this.postForm.isLogin;
      this.dialogVisible = true;
    },
    submitUser(userForm) {
      this.$refs[userForm].validate(async (valid) => {
        if (valid) {
          this.putRequest(
            `/api/user/user?userId=${this.postForm.userId}`,
            this.postForm,
          ).then(() => {
            this.$message.success("修改成功");
            this.dialogVisible = false;
          });
        } else {
          this.Message.error("表单验证失败");
          return false;
        }
      });
    },
    showProblem(id) {
      this.$router.push({ name: "problemDetail", params: { id: id } });
    },
    formatType(value) {
      if (value.type == 0) {
        return "管理员";
      } else if (value.type == 1) {
        return "普通用户";
      } else if (value.type == 2) {
        return "教师";
      }
    },
  },
};
</script>

<style scoped>
.title {
  font-size: 26px;
  font-weight: 500;
  text-align: left;
}

.container {
  width: 90%;
  margin: auto;
}

.box-card {
  text-align: left;
}

.username-text {
  word-break: break-all;
}

.email-text {
  word-break: break-all;
}

.user-edit {
  margin-top: 20px;
  /* 添加顶部边距，根据需要调整 */
  cursor: pointer;
  color: #56a1f7;
}

.user-delete {
  margin-top: 20px;
  /* 添加顶部边距，根据需要调整 */
  cursor: pointer;
  color: #f56c6c;
}

.user-pagination {
  margin-top: 40px;
}
</style>
