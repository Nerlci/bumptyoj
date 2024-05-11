<template>
  <div class="test-data-manager">
    <h3>当前问题 ID: {{ problemId }}</h3>
    <el-table :data="testData">
      <el-table-column prop="testdataId" label="评测数据 ID"></el-table-column>
      <el-table-column
        prop="inputFilename"
        label="输入文件名"
      ></el-table-column>
      <el-table-column
        prop="outputFilename"
        label="输出文件名"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-upload
            auto-upload="false"
            http-request="noAction"
            :on-change="(file) => handleEditInputFileChange(file, scope.row)"
          >
            <el-button size="small" type="primary">选择输入文件</el-button>
          </el-upload>
          <el-upload
            auto-upload="false"
            http-request="noAction"
            :on-change="(file) => handleEditOutputFileChange(file, scope.row)"
          >
            <el-button size="small" type="primary">选择输出文件</el-button>
          </el-upload>
          <el-button size="small" type="primary" @click="editData(scope.row)"
            >更新测试数据</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="deleteData(scope.row.testdataId)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div>
      <h4>上传新的评测数据</h4>
      <el-upload
        auto-upload="false"
        http-request="noAction"
        :on-change="(file) => handleInputFileChange(file)"
      >
        <el-button size="small" type="primary">选择输入文件</el-button>
      </el-upload>
      <el-upload
        auto-upload="false"
        http-request="noAction"
        :on-change="(file) => handleOutputFileChange(file)"
      >
        <el-button size="small" type="primary">选择输出文件</el-button>
      </el-upload>
      <el-button size="small" type="success" @click="addNewData"
        >上传评测数据</el-button
      >
    </div>
  </div>
</template>

<script>
import {
  putRequest,
  postRequest,
  deleteRequest,
  getRequest,
} from "@/utils/request";

export default {
  name: "TestDataManager",
  props: {
    problemId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      testData: [],
      inputFile: null,
      outputFile: null,
      editInputs: {}, // 存储编辑状态的文件
      editOutputs: {},
    };
  },
  methods: {
    fetchData() {
      getRequest(`/api/problem/testdata?problemId=${this.problemId}`)
        .then((response) => {
          if (response.code === "200") {
            this.testData = response.payload.testdata;
            console.log("Test Data after update:", this.testData);
          } else {
            alert(response.error.msg);
          }
        })
        .catch((error) => {
          console.error("Error fetching test data:", error);
        });
    },
    editData(data) {
      let formData = new FormData();
      if (this.editInputs[data.testdataId]) {
        formData.append("inputFile", this.editInputs[data.testdataId]);
      }
      if (this.editOutputs[data.testdataId]) {
        formData.append("outputFile", this.editOutputs[data.testdataId]);
      }
      putRequest(
        `/api/problem/testdata?testdataId=${data.testdataId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      )
        .then((response) => {
          if (response.code === "200") {
            alert("评测数据更新成功！");
            this.fetchData();
          } else {
            alert(`更新失败: ${response.data.error.msg}`);
          }
        })
        .catch((error) => {
          console.error("Error updating test data:", error);
          alert("更新失败，请检查网络连接或文件大小。");
        });
    },
    deleteData(testdataId) {
      deleteRequest(`/api/problem/testdata?testdataId=${testdataId}`)
        .then((response) => {
          if (response.code === "200") {
            this.testData = this.testData.filter(
              (td) => td.testdataId !== testdataId,
            );
            alert("删除成功！"); // 添加删除成功的提示
          } else {
            alert(response.data.error.msg);
          }
        })
        .catch((error) => {
          console.error("Error deleting test data:", error);
        });
    },
    addNewData() {
      let formData = new FormData();
      formData.append("problemId", this.problemId);
      if (this.inputFile && this.outputFile) {
        formData.append("inputFile", this.inputFile);
        formData.append("outputFile", this.outputFile);

        postRequest(
          `/api/problem/testdata?problemId=${this.problemId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        )
          .then((response) => {
            if (response.code === "200") {
              alert("评测数据上传成功！");
              this.fetchData(); // 重新加载数据
            } else {
              alert(`上传失败: ${response.data.error.msg}`);
            }
          })
          .catch((error) => {
            console.error("上传评测数据时出错:", error);
            alert("上传失败，请检查网络连接或文件大小。");
          });
      } else {
        alert("请确保输入文件和输出文件都已选择。");
      }
    },
    handleInputFileChange(file) {
      this.inputFile = file.raw;
    },
    handleOutputFileChange(file) {
      this.outputFile = file.raw;
    },
    handleEditInputFileChange(file, data) {
      this.editInputs[data.testdataId] = file.raw;
    },
    handleEditOutputFileChange(file, data) {
      this.editOutputs[data.testdataId] = file.raw;
    },
    noAction() {
      // 空方法，用于阻止 el-upload 组件自动上传文件
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.test-data-manager {
  width: 80%;
  margin: 20px auto;
  font-family: Arial, sans-serif;
}

.test-data-manager h3 {
  color: #333;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

table,
th,
td {
  border: 1px solid #ccc;
}

th,
td {
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

button {
  margin-right: 10px;
  padding: 5px 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

input[type="file"] {
  margin-top: 5px;
  margin-bottom: 10px;
}

.add-button {
  background-color: #008cba;
  padding: 5px 20px;
}

.add-button:hover {
  background-color: #007bac;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

.success-message {
  color: green;
  font-size: 14px;
  margin-top: 10px;
}
</style>
