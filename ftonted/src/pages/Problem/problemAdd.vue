<template>
    <div class="problem-add">
        <h2 id="problem-edit-title">题目添加</h2>
        <!-- 传递初始化好的问题数据结构给ProblemManager -->
        <problem-manager :problem="problem" :operation="'添加'" />
    </div>
</template>

<script>
    import ProblemManager from "../../components/Problem/ProblemManager";
    export default {
        name: "problemAdd",
        components: {ProblemManager},
        data() {
            return {
                // 初始化一个完整的问题对象，包括所有需要的字段
                problem: {
                    displayId: '',  // 题目显示ID
                    title: '',  // 题目标题
                    difficulty: '',  // 难度
                    time: '',  // 时间限制
                    memory: '',  // 内存限制
                    description: '',  // 描述
                    inputFormat: '',  // 输入格式
                    outputFormat: '',  // 输出格式
                    sampleInput: '',  // 样例输入
                    sampleOutput: '',  // 样例输出
                    other: ''  // 其他信息，如数据范围
                }
            }
        }
    }
</script>

<style scoped>
    .problem-add {
        width: 80%;
        margin-left: auto;
        margin-right: auto;
    }

    #problem-edit-title {
        text-align: center;
    }
</style>
