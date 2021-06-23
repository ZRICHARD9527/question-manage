<template>
    <div style="margin-top: -20px">

        <el-card class="filter-container" shadow="hover">


            <div style="margin-bottom: -25px;margin-top: -10px">
                <el-form :inline="true" size="small" label-width="120px">

                    <span style="float: right">
                            <el-button
                                    type="primary"
                                    size="small"
                                    @click="search">
                                <i class="el-icon-search"></i>
                                查询
                            </el-button>
                            <el-button
                                    size="small"
                                    @click="resetForm">
                                <i class="el-icon-refresh-right"></i>
                                重置
                            </el-button>
                        </span>

                    <el-form-item label="用户id：">
                        <el-input style="width: 203px" v-model="user_id" placeholder="用户id"></el-input>
                    </el-form-item>
                    <el-form-item label="用户姓名：">
                        <el-input style="width: 203px" v-model="name" placeholder="用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="所属学院：">
                        <el-select v-model="college_id" placeholder="请选择学院">
                            <el-option v-for="item in collegeList"
                                       :key="item.id"
                                       :value="item.id"
                                       :label="item.name"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>


                </el-form>
            </div>

        </el-card>


        <el-table
                :data="tableData"
                border
                style="width: 100%">
            <el-table-column
                    fixed
                    type="index"
                    label="序号"
                    width="50"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="user_id"
                    label="用户ID"
                    width="150"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="college"
                    label="所属学院"
                    width="200"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="username"
                    label="用户名"
                    width="150"
                    align="center">
            </el-table-column>

            <el-table-column
                    prop="picPath"
                    label="用户头像"
                    width="150"
                    align="center">
                　　
                <template slot-scope="scope">
                    <img v-if="scope.row.picpath!=null" :src=" baseUrl+scope.row.picpath"
                         width="65" height="70"
                         class="head_pic"/>
                    <img v-else src="../assets/csustLogo.jpg" width="80" height="80" class="head_pic"/>
                </template>
            </el-table-column>

            <el-table-column
                    prop="reg_time"
                    label="注册时间"
                    width="200"
                    align="center">
            </el-table-column>

            <!--            <el-table-column-->
            <!--                    label="激活"-->
            <!--                    width="120"-->
            <!--                    align="center"-->
            <!--                    readonly>-->
            <!--                <template slot-scope="scope">-->
            <!--                    <el-checkbox v-model="scope.row.activeFlag"></el-checkbox>-->
            <!--                </template>-->
            <!--            </el-table-column>-->


            <!--fixed="right"-->
            <el-table-column
                    label="操作"
                    width="150"
                    align="center">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" type="primary" icon="el-icon-view" size="small">
                    </el-button>
                    <el-button @click="deleteUser(scope.row)" type="danger" icon="el-icon-delete" size="small">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页展示-->
        <div class="block">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[20, 25, 50, 100]"
                    :page-size="perSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>

        </div>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        data() {
            return {
                college_id: null,
                collegeList: [
                    {
                        id: 1,
                        name: "计算机与通信学院"
                    },
                    {
                        id: 2,
                        name: "能源与动力学院"
                    },
                    {
                        id: 3,
                        name: "化学学院"
                    }
                ],
                user_id: null,
                username: null,
                total: 100,
                tableData: [
                    {
                        user_id: 20185080232,
                        college: "计算机与通信工程学院",
                        username: "周锐淇",
                        picPath: null,
                        reg_time: "2020-10-09"
                    }
                ],
                baseImg: "../assets/csustLogo.jpg",
                perSize: 25,//当前页面
            }
        },
        created() {
            const _this = this
            //起始进入时直接获取第一页5个数据
            axios.post('http://localhost:8183/userPage/', {"page": 1, "size": _this.perSize})
                .then(function (resp) {
                    console.log(resp)
                    _this.tableData = resp.data.content;
                    _this.total = resp.data.totalElements;
                    _this.reload()
                })
        },
        methods: {
            deleteUser(row) {
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.post('http://localhost:8183/delUser', {"user_id": row.user_id})
                        .then(function (resp) {
                            window.location.reload()
                        })
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            edit(row) {
                //跳转到编辑页面
                this.$router.push({
                    path: '/userInfo',
                    query: {
                        id: row.user_id,//用户id
                    }
                })
                return null;
            },
            //每页条数发生改变
            handleSizeChange(perSize) {
                this.$message({
                    type: 'success',
                    message: '每页条数' + perSize
                });

            },
            //页面改变，发送请求
            handleCurrentChange(currentPage) {
                const _this = this

            },
            search() {
                const _this = this
                console.log('搜索标记')
                console.log(_this.user_id + _this.name + _this.sex);
                axios.post('http://localhost:8183/findUser', {
                    "user_id": _this.user_id,
                    "name": _this.name,
                    "sex": _this.sex
                })
                    .then(function (resp) {
                        console.log('搜索标记')
                        _this.tableData = resp.data.data
                        console.log(_this.tableData)
                        //去除数据库中空数据
                        for (let i = 0; i < _this.tableData.length; i++) {
                            if (_this.tableData[i] == null) {
                                delete _this.tableData[i];
                            }
                        }
                        console.log(_this.tableData)
                    })
            },
            resetForm() {
                this.user_id = null;
                this.name = null;
                this.sex = null;
            }
        }

    }
</script>