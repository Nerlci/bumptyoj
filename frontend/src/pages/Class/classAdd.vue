<template>
  <div class="class-add">
    <h2 id="class-edit-title">创建班级</h2>
    <el-form ref="classForm" :model="class_" label-width="120px">
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
        <el-button type="primary" @click="submitClass"> 创建班级 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getRequest, postRequest } from "@/utils/request";

export default {
  name: "contestAdd",
  data() {
    return {
      class_: {
        className: "",
        teacherId: this.$store.state.status.userId,
        students: [],
        studentData: [],
      },
      time: [],
      studentId: "",
    };
  },
  methods: {
    submitClass() {
      this.$refs["classForm"].validate((valid) => {
        if (valid) {
          let class_ = this.class_;
          delete class_.studentData;
          postRequest("/api/class/class", class_)
            .then((response) => {
              if (response.code === "200") {
                this.$message({
                  message: "比赛添加成功",
                  type: "success",
                });
                // 通常在成功后会跳转到比赛列表或显示比赛详情
                this.$router.replace("/contest");
              } else {
                this.$message.error("添加失败: " + response.data.error.msg);
              }
            })
            .catch((error) => {
              this.$message.error("添加失败: " + error.message);
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
      getRequest(`/api/user/user?userId=${studentId}`).then((response) => {
        this.class_.studentData.push({
          userId: response.payload.userId,
          username: response.payload.username,
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
.class-add {
  width: 80%;
  margin: 50px auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

#class-edit-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.el-form-item {
  margin-bottom: 15px;
}

.el-button {
  margin-top: 10px;
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
