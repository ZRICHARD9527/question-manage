<template>
    <div style="margin-top: -20px">
        <div>
            <el-card class="filter-container" shadow="hover">

                <div style="margin-bottom: -25px;margin-top: -10px">
                    <el-form :inline="true" size="small" label-width="120px">
                        <span style="float: left">

                            <el-button
                                    size="small"
                                    type="success"
                                    plain
                                    @click="drawerShow = true">
                            <i class="el-icon-document"></i>
                                    版本：{{version_id}}
                            </el-button>

                            <el-button
                                    size="small"
                                    type="primary"
                                    :plain="version_id==currentVersion ? false: true"
                                    @click="setVersion">
                            <i class="el-icon-document"></i>
                                    设置为题库
                            </el-button>


                        </span>

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

                        <el-form-item label="问题编号：">
                            <el-input style="width: 200px" v-model="problem_id" placeholder="问题编号"></el-input>
                        </el-form-item>
                        <el-form-item label="输入搜索：">
                            <el-input style="width: 200px" v-model="desc" placeholder="内容搜索"></el-input>
                        </el-form-item>


                    </el-form>
                </div>
            </el-card>


            <el-table
                    :data="tableData"
                    border
                    height="510px"
                    tooltip-effect="light">
                <el-table-column
                        fixed
                        property="index"
                        label="序号"
                        width="50"
                        align="center">
                    <template slot-scope="scope">
                        {{(currentPage-1)*perSize+scope.$index+1}}
                    </template>
                </el-table-column>
                <el-table-column
                        property="problem_id"
                        label="问题ID"
                        width="100px"
                        align="center">
                </el-table-column>
                <el-table-column
                        property="version_id"
                        label="版本ID"
                        width="100px"
                        align="center">
                </el-table-column>

                <el-table-column
                        property="desc"
                        label="问题描述"
                        width="250px"
                        align="center"
                        :show-overflow-tooltip="true">
                </el-table-column>

                <el-table-column
                        property="options[0]"
                        label="选项A"
                        width="150px"
                        align="center"
                        :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                        property="options[1]"
                        label="选项B"
                        width="150px"
                        align="center"
                        :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                        property="options[2]"
                        label="选项C"
                        width="150px"
                        align="center"
                        :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                        property="options[3]"
                        label="选项D"
                        width="150px"
                        align="center"
                        :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                        property="answer"
                        label="答案"
                        width="50px"
                        align="center"
                        :formatter="anFormat">
                </el-table-column>


                <!--fixed="right"-->
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="130"
                        align="center">
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.row)" type="primary" icon="el-icon-edit" size="small">
                        </el-button>
                        <el-button @click="deleteProblem(scope)" type="danger" icon="el-icon-delete" size="small">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--     分页展示     -->
            <div class="block">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-sizes="[20, 25, 50, 100]"
                        :page-size="perSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>

            </div>

        </div>

        <!--    抽屉选择历史版本    -->
        <el-drawer
                title="题库版本"
                :visible.sync="drawerShow"
                direction="rtl"
                size="300px">
            <el-table
                    :data="versionData"
                    @row-click="selectVersion"
                    stripe height="600px">
                <el-table-column property="version_id" label="版本ID" width="150"></el-table-column>
                <el-table-column property="version_name" label="版本名" width="150"></el-table-column>
            </el-table>
        </el-drawer>

    </div>

</template>
<script>

    export default {
        name: "QuestionInfo",

        data() {
            return {
                drawerShow: false,//控制抽屉
                currentVersion: null,//当前使用版本,由后台返回
                version_id: null,//显示版本
                problem_id: null,//搜索参数：问题id
                desc: null,//搜索参数：问题描述
                perSize: 25,//每页大小
                total: 100,//总条数
                currentPage: 1,//当前页数
                tableData: null
                // [
                //     {
                //         problem_id: 12312345,
                //         version_id: 123456,
                //         desc: "好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题",
                //         options: [
                //             "好好答案好答案好答案好答案好答案答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案",
                //             "好好答案好答案好答案好答案好答案答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案",
                //             "好好答案好答案好答案好答案好答案答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案",
                //             "好好答案好答案好答案好答案好答案答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案",
                //         ],
                //         answer: 0
                //     }
                // ]
                ,//题目列表

                versionData: [
                    {
                        version_id: 202011,
                        version_name: '11版'
                    },
                    {
                        version_id: 202010,
                        version_name: '10版'
                    },
                    {
                        version_id: 202009,
                        version_name: '09版'
                    }
                ],//版本信息

            };
        },
        created() {
            const _this = this
            this.$http.get("/problems/" + 1 + '/' + _this.perSize)
                .then(res => {
                    console.log(res)
                    _this.tableData = res.data.data
                    if (res.data.version_id == null) {
                        this.currentVersion = res.data.data[0].version_id
                    } else {
                        this.currentVersion = res.data.version_id
                    }
                    this.version_id = this.currentVersion
                }).catch(err => {

            })

            //获取版本列表
            this.$http.get('/versions/', {
                params: {
                    "number": 10
                }
            }).then(res => {
                _this.versionData = res.data.versions
                console.log(res)
            })

            _this.getTotal()//获取总数
        },
        methods: {
            //获取总数
            getTotal() {
                const _this = this
                this.$http.get('problems/numbers', {
                    params: {
                        "version_id": _this.version_id
                    }
                }).then(res => {
                    console.log(res)
                    _this.total = res.data.total
                })
            },
            //点击搜索
            search() {
                const _this = this
                let data = {}
                data.desc = _this.desc
                data.problem_id = _this.problem_id

                console.log(data)

                if (data.desc != null && (data.problem_id == null || data.problem_id == "")) {
                    _this.$http.get('/problems/search', {
                        params: {
                            "desc": data.desc,
                            "version_id": _this.version_id
                        }
                    }).then(res => {
                        console.log(res)
                        _this.total = res.data.data.total
                        _this.tableData = res.data.data.tableData
                        _this.perSize = _this.total
                    })
                } else if ((data.desc == null || data.desc == "") && data.problem_id != null) {
                    _this.$http.get('/problems/search', {
                        params: {
                            "problem_id": data.problem_id,
                            "version_id": _this.version_id
                        }
                    }).then(res => {
                        console.log(res)
                        _this.total = res.data.data.total
                        _this.tableData = res.data.data.tableData
                        _this.perSize = _this.total

                    })
                } else if (data.desc != null && data.problem_id != null && data.desc.trim() != "" && data.problem_id.trim() != "") {
                    _this.$http.get('/problems/search', {
                        params: {
                            "problem_id": data.problem_id,
                            "desc": data.desc,
                            "version_id": _this.version_id,
                        }
                    }).then(res => {
                        console.log(res)
                        _this.total = res.data.data.total
                        _this.tableData = res.data.data.tableData
                        _this.perSize = _this.total

                    })
                } else {
                    this.$message({
                        type: 'info',
                        message: '请输入内容'
                    });
                }

            },
            //重置
            resetForm() {
                this.problem_id = null;
                this.desc = null;
                const _this = this
                _this.perSize = 25
                _this.currentPage = 1
                this.$http.get("/problems/" + 1 + '/' + _this.perSize)
                    .then(res => {
                        console.log(res)
                        _this.tableData = res.data.data
                        this.currentVersion = res.data.data[0].version_id
                        this.version_id = this.currentVersion
                    }).catch(err => {
                })
                _this.getTotal()
            },
            //点击历史版本后选择版本
            selectVersion(row, event, column) {
                this.version_id = row.version_id //选择版本设置为显示版本

                this.drawerShow = false
                const _this = this
                _this.currentPage = 1
                _this.perSize = 25

                this.$http.get("/problems/" + _this.currentPage + '/' + _this.perSize, {
                    params: {
                        "version_id": _this.version_id
                    }
                }).then(res => {
                    console.log(res)
                    _this.tableData = res.data.data
                }).catch(err => {
                    _this.tableData = null
                    this.$message({
                        type: 'info',
                        message: '暂无数据'
                    });
                })
                _this.getTotal()//获取总数

            },
            //点击编辑按钮跳转到问题详情页面
            edit(row) {
                sessionStorage.setItem("problem_id", row.problem_id)
                sessionStorage.setItem("desc", row.desc)
                sessionStorage.setItem("options", row.options)
                sessionStorage.setItem("answer", row.answer)
                sessionStorage.setItem("version_id", row.version_id)

                this.$router.push({
                    path: '/detail',
                })
                return null;
            },
            deleteProblem(scope) {
                const _this = this
                this.$confirm('此操作将永久删除该题目, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.$http.delete('/problems/', {
                        params: {
                            "problem_id": scope.row.problem_id
                        }
                    }).then(res => {
                        _this.tableData.splice(scope.$index, 1)
                        _this.total--
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch(err => {
                        this.$message({
                            type: 'info',
                            message: '删除失败'
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //每页条数发生改变
            handleSizeChange(perSize) {
                const _this = this
                this.perSize = perSize
                //页数重置为第一页
                this.currentPage = 1

                this.$http.get("/problems/" + 1 + '/' + this.perSize)
                    .then(res => {
                        console.log(res)
                        _this.tableData = res.data.data
                    }).catch(err => {

                })
                this.$message({
                    type: 'success',
                    message: '每页条数' + this.perSize
                });

            },
            //页面改变，发送请求
            handleCurrentChange(currentPage) {
                console.log(currentPage)
                const _this = this
                _this.currentPage = currentPage
                this.$http.get("/problems/" + currentPage + '/' + _this.perSize)
                    .then(res => {
                        console.log(res)
                        _this.tableData = res.data.data
                    }).catch(err => {
                })
            },
            //答案内容转换，将数字转为字符
            anFormat(row) {
                if (row.answer == 0 || row.answer == 'A' || row.answer == 'a') {
                    return 'A'
                } else if (row.answer == 1 || row.answer == 'B' || row.answer == 'b') {
                    return 'B'
                } else if (row.answer == 2 || row.answer == 'C' || row.answer == 'c') {
                    return 'C'
                } else if (row.answer == 3 || row.answer == 'D' || row.answer == 'd') {
                    return 'D'
                }
            },
            //将次版本设置为当前题库
            setVersion() {
                const _this = this
                if (_this.currentVersion != _this.version_id) {

                    this.$confirm('此操作将改变当前使用题库版本, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {

                        if (_this.total == 0) {
                            _this.$message({
                                type: 'warning',
                                message: '该版本没有数据，修改失败! 当前版本为' + _this.currentVersion
                            });
                        } else {
                            _this.$http.put('/versions/update?version_id=' + _this.version_id)
                                .then(res => {
                                    _this.$message({
                                        type: 'success',
                                        message: '修改成功!当前题库版本为 ' + _this.version_id
                                    });
                                    _this.currentVersion = _this.version_id

                                }).catch(err => {
                                _this.$message({
                                    type: 'info',
                                    message: '修改失败!当前题库版本为 ' + _this.currentVersion
                                });
                            })
                        }

                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消修改'
                        });
                    });
                } else {
                    this.$message({
                        type: 'success',
                        message: '当前版本为' + _this.currentVersion
                    });
                }

            }

        }
    }
</script>
<style>
    /*去掉打开抽屉时自动选中标题时的蓝色边框*/
    .el-drawer__header span:focus {
        outline: 0;
    }

    body .el-table th.gutter {
        display: table-cell !important
    }
</style>