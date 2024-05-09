<template>
  <div class="problem-manager" v-loading="loading">
    <el-form
      :model="problem"
      label-position="right"
      label-width="auto"
      ref="form"
    >
      <el-form-item label="题目ID" prop="displayId">
        <el-input v-model="problem.displayId" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="标题" prop="title">
        <el-input v-model="problem.title"></el-input>
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input
          v-model="problem.description"
          :autosize="{ minRows: 12, maxRows: 25 }"
          type="textarea"
          placeholder="输入题目描述，可包含简单的Markdown或HTML"
        ></el-input>
      </el-form-item>

      <el-form-item label="输入格式" prop="inputFormat">
        <el-input
          v-model="problem.inputFormat"
          :autosize="{ minRows: 4, maxRows: 8 }"
          type="textarea"
          placeholder="描述输入格式"
        ></el-input>
      </el-form-item>

      <el-form-item label="输出格式" prop="outputFormat">
        <el-input
          v-model="problem.outputFormat"
          :autosize="{ minRows: 4, maxRows: 8 }"
          type="textarea"
          placeholder="描述输出格式"
        ></el-input>
      </el-form-item>

      <el-form-item label="样例输入" prop="sampleInput">
        <el-input
          v-model="problem.sampleInput"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
        ></el-input>
      </el-form-item>

      <el-form-item label="样例输出" prop="sampleOutput">
        <el-input
          v-model="problem.sampleOutput"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
        ></el-input>
      </el-form-item>

      <el-form-item label="其他信息" prop="other">
        <el-input
          v-model="problem.other"
          :autosize="{ minRows: 3, maxRows: 6 }"
          type="textarea"
          placeholder="例如数据范围、限制等"
        ></el-input>
      </el-form-item>

            <el-form-item>
                <el-button @click="update" type="primary">更新题目</el-button>


                <!-- 根据 operation 显示删除按钮 -->
                <el-button @click="deleteProblem" type="danger"
                    style="margin-left: 10px;">删除题目</el-button>
                <el-button  @click="manageTestData" type="info"
                    style="margin-left: 10px;">评测数据管理</el-button>
                <h3>当前问题 ID: {{ this.problem.id }}</h3>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {  putRequest, deleteRequest } from '@/utils/request';
export default {
    name: "ProblemManager",
    props: ['problem', 'operation'],
    data() {
        return {
            loading: false
        }
    },
    methods: {
        update() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    const requestData = {
                        metadata: {
                            displayId: this.problem.displayId,
                            title: this.problem.title,
                            difficulty: this.problem.difficulty,
                            time: this.problem.time,
                            memory: this.problem.memory
                        },
                        description: this.problem.description,
                        format: {
                            input: this.problem.inputFormat,
                            output: this.problem.outputFormat
                        },
                        sample: {
                            input: this.problem.sampleInput,
                            output: this.problem.sampleOutput
                        },
                        other: this.problem.other
                    };

                    putRequest(`/api/problem/problem?problemId=${this.problem.id}`, requestData).then(response => {
                        if (response.code === "200") {
                            this.$message({
                                showClose: true,
                                message: '更新成功',
                                type: 'success',
                                duration: 2000
                            });
                            this.$router.replace('/problems');
                        } else {
                            this.$message.error('更新失败: ' + response.error.msg);
                        }
                    })
                }
            });
        },
        deleteProblem() {
            // 调用删除API
            this.$confirm('确定要删除这个题目吗？操作不可恢复!', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteRequest(`/api/problem/problem?problemId=${this.problem.id}`).then(response => {
                    if (response.code === "200") {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.$router.replace('/problems');
                    } else {
                        this.$message.error('删除失败: ' + response.error.msg);
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        manageTestData() {
            // 跳转到评测数据管理页面
            this.$router.push({ name: 'problemTestData', params: { id: this.problem.id } });
        }
    }
}
</script>

<style scoped>
.problem-manager {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}
</style>
