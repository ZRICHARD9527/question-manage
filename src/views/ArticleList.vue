<template>
    <div class="block">
        <el-timeline>
            <el-timeline-item
                    v-for="(article, index) in articles"
                    :key="index"
                    :icon="article.complete==true? 'el-icon-document-checked':'el-icon-edit-outline' "
                    :type="article.complete==true? 'primary':'success'"
                    size="large"
                    :timestamp="article.timestamp"
                    placement="top">
                <el-card>
                    <h4>{{article.title}}</h4>
                    <p>{{article.content}}</p>
                </el-card>
            </el-timeline-item>
        </el-timeline>
    </div>
</template>

<script>
    export default {
        name: "ArticleList",
        data() {
            return {
                articles: [
                    {
                        title: "文章的标题",
                        content: "这是一篇文章",
                        timestamp: "2018-04-03 20:46",
                        complete: false,//是否编辑完成
                    },
                    {
                        title: "文章的标题",
                        content: "这是一篇文章",
                        timestamp: "2018-04-03 20:46",
                        complete: true,//是否编辑完成
                    },
                    {
                        title: "文章的标题",
                        content: "这是一篇文章",
                        timestamp: "2018-04-03 20:46",
                        complete: true,//是否编辑完成
                    }
                ]
            }
        },
        created() {
        },
        methods: {}
    }
</script>

<style scoped>

</style>