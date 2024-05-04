<template>
    <div>
        <div class="problem-list">
            <el-table :data="tableData" v-loading="loading" stripe style="height: 100%">
                <el-table-column label="ID" prop="displayId" width="76px"></el-table-column>
                <el-table-column label="题目" prop="title">
                    <template slot-scope="scope">
                        <span @click="showProblem(scope.row.problemId)" class="cursor-pointer">{{scope.row.title}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="AC" prop="acceptedCount" width="76px"></el-table-column>
                <el-table-column label="提交" prop="submissionCount" width="76px"></el-table-column>
                <el-table-column label="通过率" prop="ratio" width="76px"></el-table-column>
                <el-table-column label="创建时间" prop="createdAt" width="120px"></el-table-column>
                <el-table-column label="难度" prop="difficulty" width="76px"></el-table-column>

                <el-table-column label="操作" v-if="this.$store.state.status.type == 0" width="76px">
                    <template slot-scope="scope">
                        <span @click="editProblem(scope.row.problemId)" class="problem-edit">编辑</span>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination class="problem-pagination" :page-size="pageSize" :total="itemCount"
                            @current-change="getPage" background
                            layout="prev, pager, next" v-show="itemCount > pageSize">
            </el-pagination>
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
            tableData: []
        }
    },
    methods: {
        getPage(index) {
            this.loading = true;
            // 调用获取题目列表的API
            this.getRequest("/api/problem/list", {
                offset: (index - 1) * this.pageSize,
                count: this.pageSize
            }).then(response => {
                const problems = response.payload.problems;
                problems.forEach(problem => {
                    if (problem.submissionCount === 0) problem.ratio = '0%'
                    else problem.ratio = Math.round(problem.acceptedCount / problem.submissionCount * 100 * 100) / 100 + '%'
                });
                this.tableData = problems;
                this.loading = false;
            });
            // 调用获取总题目数的API
            this.fetchItemCount();
        },
        fetchItemCount() {
            this.getRequest("/api/problem/count").then(response => {
                if (response.code === "200") {
                    this.itemCount = response.payload.count;
                }
            });
        },
        showProblem(id) {
            this.$router.push({ name: 'problemDetail', params: { id: id } });
        },
        editProblem(id) {
            this.$router.push({ name: 'problemEdit', params: { id: id } });
        },
        getPageInfo() {
            this.getPage(1);
        }
    },
    created() {
        //this.getPageInfo();
    }
}
</script>

<style scoped>
    .problem-list {
        width: 90%;
        height: 100%;
        margin: auto;
        font-weight: bold;
    }

    .cursor-pointer {
        cursor: pointer;
    }

    .problem-edit {
        cursor: pointer;
        color: #52abff;
    }

    .problem-pagination {
        margin-top: 40px;
    }
</style>
