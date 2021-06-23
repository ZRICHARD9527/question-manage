<template>
    <div>
        <el-row>
            <el-col :span="5">
                <template>
                    选择版本：
                    <!--选择版本-->
                    <el-select v-model="version_id" placeholder="请选择" style="width: 100px;" @change="getTableDate">
                        <el-option
                                v-for="item in versionList"
                                :value="item">
                        </el-option>
                    </el-select>

                </template>
            </el-col>

        </el-row>


        <el-table
                ref="singleTable"
                :data="tableData"
                stripe
                highlight-current-row
                height="500px"
                @current-change="handleCurrentChange"
                style="width: 100%">
            <el-table-column
                    fixed
                    type="index"
                    label="序号"
                    width="50"
                    align="center">
            </el-table-column>

            <el-table-column
                    property="user_id"
                    label="用户ID"
                    width="120"
                    align="center"
                    :sortable="true"
                    :sort-method="sortByNum">
            </el-table-column>
            <el-table-column
                    property="college_id"
                    label="学院"
                    width="120"
                    align="center">
            </el-table-column>
            <el-table-column
                    property="user_name"
                    label="姓名"
                    width="120"
                    align="center">
            </el-table-column>
            <el-table-column
                    property="num"
                    label="答题数"
                    width="120"
                    align="center"
                    :sortable="true"
                    :sort-method="sortByNum">
            </el-table-column>
            <el-table-column
                    property="reg_time"
                    label="注册时间"
            >
            </el-table-column>

        </el-table>

        <div style="margin-top: 20px">

            <el-button @click="getLuck()" v-if="show" type="success" plain>随机抽奖</el-button>
            <el-button @click="save()" v-if="show" type="success" plain>保存数据</el-button>

            <el-button @click="save()" v-if="!show" type="primary" plain>确定并保存</el-button>
            <el-button @click="cancel()" v-if="!show" type="danger" plain>取消</el-button>

        </div>

    </div>
</template>

<script>

    export default {
        name: 'rank',
        data() {
            return {
                luckNum: 0,//获奖人数
                version_id: '',//当前版本id
                versionList: [],//版本目录，由近到远
                show: true,//控制按钮展示
                tableData: [],
                currentRow: null
            }
        },
        created() {

            const _this = this
            this.$http.get('/statistics/ranking')
                .then(res => {
                    console.log(res)
                    _this.version_id = res.data.data.version_id
                    _this.tableData = res.data.data.tableData
                })
                .catch((error) => {
                    console.log(error)
                    // _this.$router.push('/')
                })
            //获取历史版本
            this.$http.get('/versions/', {
                params: {
                    "number": 5
                }
            }).then(res => {

                for (let i = 0; i < 5; i++) {
                    _this.versionList.push(res.data.versions[i].version_id)
                    console.log(res.data.versions[i].version_id)
                }
                console.log(_this.versionList)

            })

        },
        methods: {
            //取消保存
            cancel() {
                this.show = true
                const _this = this
                this.$http.get('/statistics/ranking', {
                    params: {
                        "version_id": _this.version_id
                    }
                })
                    .then(res => {
                        console.log(res)
                        _this.version_id = res.data.data.version_id
                        _this.tableData = res.data.data.tableData
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
            ,
            handleCurrentChange(val) {
                this.currentRow = val;
            },
            //抽奖
            getLuck() {
                const _this = this

                this.$prompt('请输入抽奖人数', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^\d+$/,
                    inputErrorMessage: '请输入数字'
                }).then(({value}) => {

                    _this.luckNum = value

                    _this.$http.get('/lottery', {
                        params: {
                            "num": _this.luckNum,
                            "version_id": _this.version_id
                        }
                    }).then(res => {
                        console.log(res)
                        _this.tableData = res.data.data.tableData

                        this.$message({
                            type: 'success',
                            message: '中奖人数为: ' + value
                        });

                        this.show = false;
                    }).catch(err => {
                        console.log(err)

                        this.$message({
                            type: 'info',
                            message: '获取失败,人数超出'
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });


            },
            //保存为excel文件
            save() {
                this.getExcel(this.tableData)
                this.show = true
            },
            getExcel(res) {
                require.ensure([], () => {
                    const {export_json_to_excel} = require('../vendor/Export2Excel.js')
                    const tHeader = ['用户ID', '学院', '姓名', '答题数', '注册时间']
                    const filterVal = ['user_id', 'college_id', 'user_name', 'num', 'reg_time']
                    const list = res
                    const data = this.formatJson(filterVal, list)

                    export_json_to_excel(tHeader, data, this.nowDate() + '获奖名单')
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },


            //获取当前年月，格式为yyyy-MM
            nowDate() {
                let nowDate = new Date();
                let date = {
                    year: nowDate.getFullYear(),
                    month: nowDate.getMonth() + 1,
                }
                if (date.month < 10) {
                    date.month = '0' + date.month
                }
                let systemDate = date.year + '-' + date.month;
                return systemDate;
            },
            sortByNum(obj1, obj2) {
                //自定义的排序逻辑
                let num1 = obj1.num;
                let num2 = obj2.num;
                return num1 - num2;
            },
            //通过版本获取表格数据
            getTableDate() {
                const _this = this
                this.$http.get('/statistics/ranking', {
                    params: {"version_id": this.version_id}
                }).then(res => {
                    console.log(res)
                    _this.tableData = res.data.data.tableData
                })
            }


        }

    }
</script>