<template>
    <div class="status-detail" v-loading="loading" v-show="show">
        <h2 id="solution-title">代码查看 - {{ solution.title }}</h2>
        
        <div class="metadata">
            <span><i class="el-icon-timer"></i>提交时间&nbsp;{{ solution.submitTime }}</span>&nbsp;|&nbsp;
            <span :style="gao(solution.status)"><i class="el-icon-hot-water"></i>状态&nbsp;{{ solution.status }}</span>
            <span>语言: {{ solution.language }}</span>&nbsp;|&nbsp;
            <span>内存使用: {{ solution.memory }}</span>&nbsp;|&nbsp;
            <span>执行时间: {{ solution.time }}</span>&nbsp;|&nbsp;
            <span>得分: {{ solution.score }}</span>
        </div>

        <el-button id="clip-button" size="large" v-clipboard:copy="solution.answer"
                   v-clipboard:error="onCopyError" v-clipboard:success="onCopySuccess"
                   type="primary">复制代码
        </el-button>

        <el-card class="solution-answer" shadow="always">
            <pre>{{ solution.answer }}</pre>
        </el-card>
    </div>
</template>


<script>
export default {
    name: "statusDetail",
    data() {
        return {
            loading: true,
            show: false,
            solution: {}
        }
    },
    methods: {
        gao(status) {
            if (status === "AC") return "color: green"
            else return "color: darkred"
        },
        getSolution() {
            this.loading = true;
            this.getRequest(`/api/submission/submission?submissionId=${this.$route.params.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Your User Agent'
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.code === "200") {
                        this.solution = {
                            title: data.payload.problemId,  
                            submitTime: data.payload.timestamp,
                            status: data.payload.status,
                            answer: data.payload.code,
                            language: data.payload.language,
                            length: data.payload.length,
                            time: data.payload.time,
                            memory: data.payload.memory,
                            score: data.payload.score,
                            detail: data.payload.detail
                        };
                        this.show = true;
                    } else {
                        this.$message.error(data.error.msg || "数据加载错误");
                    }
                    this.loading = false;
                })
                .catch(error => {
                    console.error('Error fetching solution:', error);
                    this.$message.error("无法加载解决方案数据");
                    this.loading = false;
                });
        },
        onCopyError() {
            this.$message.error("复制失败")
        },
        onCopySuccess() {
            this.$message.success("复制成功")
        }
    },
    created() {
        this.getSolution()
    },
    mounted() {
        this.show = true
    }
}
</script>

<style scoped>
.status-detail {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
}

.metadata {
    margin-top: 20px;
    margin-bottom: 30px;
}

#clip-button {
    margin-bottom: 30px;
}

.solution-answer {
    text-align: left;
}
</style>