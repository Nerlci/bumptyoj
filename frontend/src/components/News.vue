<template>
    <div class="new-course">
        <el-carousel class="news-carousel">
            <el-carousel-item :key="item.id" class="carousel-item" v-for="item in data">
                <div class="carousel-item-container">
                    <div class="carousel-item-title">{{ item.title }}</div>
                    <div class="carousel-item-content">{{ item.content }}</div>
                </div>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
    export default {
        name: "News",
        data() {
            return {
                loading: false,
                data: [
                { id: 1, title: '新功能发布', content: '我们很高兴地宣布，我们的在线评测系统已经发布了一些新功能，包括更快的评测速度，更准确的评分，以及更友好的用户界面。' },
                { id: 2, title: '系统维护通知', content: '为了提供更好的服务，我们的在线评测系统将在下周二晚上10点至次日早上6点进行系统维护。在此期间，系统将无法使用。我们对任何给您带来的不便表示歉意。' },
                { id: 3, title: '用户反馈活动', content: '我们正在进行用户反馈活动。如果您有任何关于我们在线评测系统的建议或反馈，欢迎通过我们的反馈表单提交。每位参与的用户都有机会获得我们的小礼品。' },
                ]
            }
        },
        //动态获取新闻，目前采用静态方式
        // methods: {
        //     getNews() {
        //         this.getRequest('/news').then(resp => {
        //             this.data = resp
        //             this.loading = false
        //         })
        //     }
        // },
        // created() {
        //     //this.getNews()
        // }
    }
</script>

<style scoped>
    .new-course {
        background-color: #f8f9fa;  
        border-radius: 15px;  
        height: auto;
        width: auto;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);  
        transition: 0.3s;  
    }

    .new-course:hover {
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);  
    }

    .carousel-item {
        color: #343a40;  
        text-align: center;
        font-size: 18px;  
    }

    .carousel-item-container {
        height: 100%;
        width: 80%;
        margin: auto;
        padding: 20px;  
    }
</style>