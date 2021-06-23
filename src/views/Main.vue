<template xmlns:el="http://www.w3.org/1999/html">
    <el-container style="height: 100%; border: 1px solid #eee">

        <el-aside width="200px" style="background-color: rgb(238, 241, 246);">
            <!-- 菜单默认打开1和2-->
            <el-menu router :default-openeds="['1', '2','3','4']">
                <!--   使用括号获取index，为了使各模块之间的事件独立需要添加一个index属性【+''是因为需要转换为文本】   -->
                <el-submenu v-for="(item,index) in $router.options.routes" :index="index+''" v-if="item.show">
                    <template slot="title"><i class="el-icon-menu" style="margin-left: -60px">{{item.name}}</i>
                    </template>
                    <!--   添加index属性才可以进行操作  index2表示下标，index赋值为path可以跳转页面;$route表示已激活路由，可以获取访问路径  id-active可以添加样式  -->
                    <el-menu-item v-for="(child,child_index) in item.children" :index="child.path"
                                  :class="($route.path===child.path)?'is-active':''" v-if="child.show">{{child.name}}
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>

        <el-container>
            <!--background-color:#E3E3E3;-->
            <el-header style="text-align: left;height: 55px;">
                <img src="../assets/csustLogo02.png" style="float: left;height: 55px;margin-left: -20px">
                <el-dropdown style="float:right ; font-size: 30px ;">
                    <i class="el-icon-setting"></i>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <el:button @click="exit()">退出</el:button>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>

            <el-main>
                <router-view></router-view>
            </el-main>

        </el-container>
    </el-container>
</template>

<script>
    export default {
        email: "",
        methods: {
            exit() {
                localStorage.removeItem("token");//清楚浏览器session
                this.$router.push('/');//返回登录界面
            }
        }
        ,
        created() {
            let token = localStorage.getItem("token")
            console.log("token")
            console.log(token)

            //判断是否有管理员登录，没有的话则跳回登录页面
            if (localStorage.getItem("token") == null) {
                this.$message({
                    type: 'info',
                    message: '访问未授权'
                });
                this.$router.push('/')
            }
        }
    }
</script>

<style scoped>
    .el-header {
        /*background-color: #B3C0D1;*/
        /*color: #333;*/
        background: -webkit-linear-gradient(bottom, hsla(0, 0%, 0%, .15), hsla(0, 0%, 0%, 0), white) no-repeat;
        line-height: 60px;
    }

    .el-aside {
        color: #333;
    }

</style>