<template>
    <div class="markdown-container">
        <div class="container">

            <mavon-editor
                    v-model="content"
                    ref="md"
                    @imgAdd="$imgAdd"
                    @change="change"
                    style="min-height: 550px"/>
            <el-row justify="right">
                <!--                <el-col :span="4">-->
                <!--                    <span class="title">编辑器</span>-->
                <!--                </el-col>-->
                <el-col>
                    <el-button class="editor-btn" type="success" size="small" plain="" @click="submit">提交</el-button>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
    //该组件中注释掉的代码为局部注册的方式。
    import {mavonEditor} from "mavon-editor";
    import "mavon-editor/dist/css/index.css";
    import axios from "axios";

    export default {
        name: "ArticalEdit",
        data() {
            return {
                content: "",
                html: "",
                configs: {}
            };
        },
        components: {
            mavonEditor
        },
        created() {
            this.html = ""
        },
        methods: {
            // 将图片上传到服务器，返回地址替换到md中
            $imgAdd(pos, $file) {
                var formdata = new FormData();
                formdata.append("file", $file);
                //将下面上传接口替换为你自己的服务器接口
                axios({
                    url: "/common/upload",
                    method: "post",
                    data: formdata,
                    headers: {"Content-Type": "multipart/form-data"}
                }).then(url => {
                    this.$refs.md.$img2Url(pos, url);
                });
            },
            change(value, render) {
                // render 为 markdown 解析后的结果
                this.html = render;
            },
            submit() {
                console.log(this.content);
                console.log(this.html);
                this.$message.success("提交成功！");
            }
        }
    };
</script>
<style lang="scss">
    .markdown-container {
        .editor-btn {
            margin-top: 20px;
        }

        .title {
            padding-bottom: 30px;
            text-align: center;
            font-size: 20px;
            letter-spacing: 1px;
            color: #333;
            font-weight: 600;
        }
    }
</style>
