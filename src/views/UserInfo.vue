<template>
    <div>
        <!--:inline="true" class="demo-form-inline"-->
        <el-form style="width: 40%" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"
                 class="demo-ruleForm ">

            <el-form-item lable="头像" prop="img">
                <!--加冒号表示v-bind 绑定数据，为变量；否则为常量-->
                <el-image
                        :src="ruleForm.picpath" :size="120"
                        onerror="this.src='../assets/csustLogo.jpg'"
                ></el-image>
<!--                <img v-if="ruleForm.picpath!=null" :src="ruleForm.picpath" :size="120">-->
<!--                <img v-else src="../assets/csustLogo.jpg" style="border-radius: 10px;" width="120">-->
            </el-form-item>
            <el-form-item label="用户ID" prop="u_id">
                <el-input v-model="ruleForm.u_id" readonly=""></el-input>
            </el-form-item>
            <el-form-item label="学院" prop="college">
                <el-input v-model="ruleForm.college"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="注册时间">
                <template>
                    <div class="block" style="float: left">
                        <el-date-picker
                                v-model="ruleForm.regTime"
                                type="date"
                                placeholder="选择日期"
                                readonly>
                        </el-date-picker>
                    </div>
                </template>
            </el-form-item>


            <el-form-item>
                <el-button type="primary" @click="ban('ruleForm')">上传</el-button>
                <el-button type="danger" @click="delUser()">删除</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import axios from 'axios'

    export default {
        data() {
            return {
                ruleForm: {
                    u_id: null,
                    name: null,
                    regTime: null,
                    picpath: null
                },
                rules: {
                    p_id: [
                        {required: true, message: '不可修改', trigger: 'focus'},
                    ]

                    // img: [
                    //     //{required: true, message: '请选择图片', trigger: 'change'},
                    //     //{type: 'array', required: true, message: '请至少选择一个图片', trigger: 'change'}
                    // ]
                }
            };
        },
        methods: {
            ban() {
                // console.log("1111111111111")
                // console.log(this.ruleForm.u_id, this.ruleForm.activeFlag)
                const _this = this;
                axios.post("http://localhost:8183/userActive", {
                    "u_id": this.ruleForm.u_id,
                    "activeFlag": this.ruleForm.activeFlag
                }).then(function (resp) {
                    if (resp.data.success == true) {

                        _this.$message({
                            type: 'success',
                            message: '执行成功!'
                        });
                        //window.location.reload()
                    }
                })
            },
            delUser() {
                const _this = this;
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.post('http://localhost:8183/delUser', {"u_id": _this.ruleForm.u_id})
                        .then(function (resp) {
                            window.location.reload()
                        })
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    _this.$router.push('/userList')
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        },
        created() {
            // console.log(this.$route.query.id)
            const _this = this;
            // console.log("1111111111111")
            axios.post('http://localhost:8183/findUser', {"u_id": parseInt(this.$route.query.id)})
                .then(function (resp) {
                    console.log(resp)
                    // console.log(resp.data.data[0])
                    _this.ruleForm = resp.data.data[0]

                    console.log(_this.ruleForm.picpath)
                    _this.ruleForm.picpath = 'http://localhost:8183/' + _this.ruleForm.picpath
                    console.log(_this.ruleForm.picpath)

                })
        }
    }
</script>