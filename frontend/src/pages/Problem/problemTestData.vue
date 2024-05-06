<template>
    <div class="problem-test-data">
        <h2>评测数据管理</h2>
        <!-- 将 problemId 传递给 TestDataManager 组件 -->
        <test-data-manager :problem-id="problemId"></test-data-manager>
    </div>
</template>

<script>
// 引入你的 TestDataManager 组件
import TestDataManager from "../../components/Problem/TestDataManager";

export default {
    name: 'ProblemTestData',
    components: {
        TestDataManager // 注册组件
    },
    data() {
        return {
            // 从路由参数获取 problemId
            problemId: this.$route.params.id
        };
    }
}
</script>

<style scoped>
.problem-test-data {
    width: 80%;
    margin: auto;
    padding-top: 20px;
}
h2 {
    text-align: center;
}
</style>
