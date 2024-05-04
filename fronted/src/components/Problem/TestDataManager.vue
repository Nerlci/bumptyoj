<template>
    <div class="test-data-manager">
        <h3>当前问题 ID: {{ problemId }}</h3>
        <table>
            <thead>
                <tr>
                    <th>评测数据 ID</th>
                    <th>输入文件名</th>
                    <th>输出文件名</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="data in testData" :key="data.testdataId">
                    <td>{{ data.testdataId }}</td>
                    <td>{{ data.inputFilename }}</td>
                    <td>{{ data.outputFilename }}</td>
                    <td>
                        <button @click="editData(data)">编辑</button>
                        <button @click="deleteData(data.testdataId)">删除</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div>
            <input type="file" @change="handleInputFileChange" />
            <input type="file" @change="handleOutputFileChange" />
            <button @click="addNewData">上传评测数据</button>
        </div>
    </div>
</template>


<script>
import axios from 'axios';

export default {
    name: 'TestDataManager',
    props: {
        problemId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            testData: [],
            inputFile: null,  // 文件上传的输入文件
            outputFile: null  // 文件上传的输出文件
        };
    },
    methods: {
        fetchData() {
            axios.get(`/api/problem/testdata?problemId=${this.problemId}`)
                .then(response => {
                    if (response.data.code === '200') {
                        this.testData = response.data.payload.testdata;
                    } else {
                        alert(response.data.error.msg);
                    }
                })
                .catch(error => {
                    console.error('Error fetching test data:', error);
                });
        },
        editData(data) {
            // 将文件上传表单数据打包
            let formData = new FormData();
            formData.append('inputFile', data.inputFile);
            formData.append('outputFile', data.outputFile);

            axios.post(`/api/problem/testdata?problemId=${this.problemId}`, formData)
                .then(response => {
                    if (response.data.code === '200') {
                        this.fetchData(); // 重新加载数据
                    } else {
                        alert(response.data.error.msg);
                    }
                })
                .catch(error => {
                    console.error('Error updating test data:', error);
                });
        },
        deleteData(testdataId) {
            axios.delete(`/api/problem/testdata?testDataId=${testdataId}`)
                .then(response => {
                    if (response.data.code === '200') {
                        this.testData = this.testData.filter(td => td.testdataId !== testdataId);
                    } else {
                        alert(response.data.error.msg);
                    }
                })
                .catch(error => {
                    console.error('Error deleting test data:', error);
                });
        },
        addNewData() {
            // 创建一个表单数据实例
            let formData = new FormData();
            // 确保文件选择器中有文件被选中
            if (this.inputFile && this.outputFile) {
                formData.append('inputFile', this.inputFile);
                formData.append('outputFile', this.outputFile);

                // 使用 axios 发送 POST 请求上传文件
                axios.post(`/api/problem/testdata?problemId=${this.problemId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then(response => {
                        if (response.data.code === '200') {
                            alert('评测数据上传成功！');
                            this.fetchData(); // 重新加载数据以显示新上传的评测数据
                        } else {
                            alert(`上传失败: ${response.data.error.msg}`);
                        }
                    })
                    .catch(error => {
                        console.error('上传评测数据时出错:', error);
                        alert('上传失败，请检查网络连接或文件大小。');
                    });
            } else {
                alert('请确保输入文件和输出文件都已选择。');
            }
        },
        handleInputFileChange(event) {
            this.inputFile = event.target.files[0]; // 获取选中的文件
        },
        handleOutputFileChange(event) {
            this.outputFile = event.target.files[0]; // 获取选中的文件
        }
    },
    mounted() {
        this.fetchData();
    }
}
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
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}

.add-button {
    background-color: #008CBA;
}

.add-button:hover {
    background-color: #007BAC;
}
</style>
