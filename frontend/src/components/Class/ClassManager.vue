<template>
  <div class="class-manager" v-loading="loading">
    <el-form
      :model="class_"
      label-position="right"
      label-width="auto"
      ref="form"
    >
      <el-form-item label="班级名称" prop="title">
        <el-input v-model="class_.className"></el-input>
      </el-form-item>

      <el-form-item label="教师用户 ID" prop="title">
        <el-input v-model="class_.teacherId" disabled></el-input>
      </el-form-item>

      <el-form-item label="学生">
        <el-input
          class="student-input"
          placeholder="学生用户 ID"
          v-model="studentId"
        ></el-input>
        <el-button type="primary" class="add-student" @click="addStudent">
          添加学生
        </el-button>

        <el-table :data="class_.studentData">
          <el-table-column
            prop="userId"
            width="100px"
            label="学生用户 ID"
          ></el-table-column>

          <el-table-column prop="username" label="学生用户名"></el-table-column>
          <el-table-column
            label="操作"
            width="76px"
            fixed="right"
            align="center"
          >
            <template slot-scope="scope">
              <span
                @click="deleteStudent(scope.row.userId)"
                class="student-delete"
              >
                删除
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button @click="update" type="primary">更新班级</el-button>

        <!-- 根据 operation 显示删除按钮 -->
        <el-button @click="deleteClass" type="danger" style="margin-left: 10px">
          删除班级
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { putRequest, deleteRequest } from "@/utils/request";
export default {
  name: "ClassManager",
  props: ["class_", "operation"],
  data() {
    return {
      loading: false,
      studentId: "",
    };
  },
  methods: {
    update() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const requestData = {
            classId: this.class_.classId,
            className: this.class_.className,
            teacherId: this.class_.teacherId,
            students: this.class_.students,
          };

          putRequest(
            `/api/class/class?classId=${this.class_.classId}`,
            requestData,
          ).then((response) => {
            if (response.code === "200") {
              this.$message({
                showClose: true,
                message: "更新成功",
                type: "success",
                duration: 2000,
              });
              this.$router.replace("/class");
            } else {
              this.$message.error("更新失败: " + response.error.msg);
            }
          });
        }
      });
    },
    addStudent() {
      const studentId = parseInt(this.studentId);
      if (this.class_.students.includes(studentId)) {
        this.$message.error("学生已存在");
        return;
      }
      this.class_.students.push(studentId);
      this.getRequest(`/api/user/user?userId=${studentId}`).then((response) => {
        this.class_.studentData.push({
          userId: response.payload.userId,
          username: response.payload.username,
        });
      });
    },
    deleteClass() {
      // 调用删除API
      this.$confirm("确定要删除这个班级吗？操作不可恢复!", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteRequest(`/api/class/class?classId=${this.class_.classId}`).then(
            (response) => {
              if (response.code === "200") {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                this.$router.replace("/class");
              } else {
                this.$message.error("删除失败: " + response.error.msg);
              }
            },
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    deleteStudent(studentId) {
      this.class_.students = this.class_.students.filter(
        (student) => student !== studentId,
      );
      this.class_.studentData = this.class_.studentData.filter(
        (student) => student.userId !== studentId,
      );
    },
  },
};
</script>

<style scoped>
.class-manager {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.student-input {
  width: 87%;
  margin-right: 10px;
}

.add-student {
  margin-left: 10px;
}

.student-delete {
  margin-top: 20px;
  /* 添加顶部边距，根据需要调整 */
  cursor: pointer;
  color: #56a1f7;
}
</style>
