<template>

    <div class="login-container" style="height: 100%">
        <img src="../assets/csust.jpg" width="100%" height="100%" style="margin-top: -10px" alt=""/>

        <div class="login-box">

            <el-form :model="ruleForm" :rules="rules"
                     status-icon
                     ref="ruleForm"
                     label-position="left"
                     label-width="0px"
                     class="demo-ruleForm login-page">

                <img src="../assets/csustLogo.jpg" style="margin-top: -20px;height: 50px" alt="">
                <h3 class="title" style="align-content: center">知识竞答管理系统</h3>

                <el-form-item prop="account">
                    <el-input type="text"
                              v-model="ruleForm.account"
                              auto-complete="off"
                              placeholder="账号">
                        <el-button slot="prepend" icon="el-icon-user"></el-button>
                    </el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input type="password"
                              v-model="ruleForm.password"
                              auto-complete="off"
                              placeholder="密码"
                              @keyup.enter.native="handleSubmit('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-key"></el-button>
                    </el-input>
                </el-form-item>

                <el-form-item style="width:100%;">
                    <el-button type="primary" style="width:100%;" @click="handleSubmit('ruleForm')"
                    >登录
                    </el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>


</template>

<script>
    import {mapMutations} from 'vuex';

    export default {
        data() {
            return {
                ruleForm: {
                    account: null,
                    password: null,
                },
                rules: {
                    account: [
                        {required: true, message: '请输入账号', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            ...mapMutations(['changeLogin']),

            //登录
            handleSubmit(event) {
                this.$refs[event].validate((valid) => {
                        if (valid) {
                            const _this = this;
                            let data = new FormData();
                            data.append("username", _this.ruleForm.account)
                            data.append("password", _this.ruleForm.password)
                            this.$http({
                                url: '/login/access-token',//请求的地址
                                method: 'post',//请求的方式,
                                data: data
                            }).then(resp => {
                                console.log(resp)
                                let access_token = 'Bearer '+resp.data.access_token
                                _this.changeLogin({token: access_token});//将token存入
                                _this.$notify({
                                    title: '登录成功',
                                    message: '欢迎使用',
                                    type: 'success'
                                });
                                _this.$router.push('/statistics');//跳转,如果登录成功,则进入管理页面

                            }).catch(() => {
                                _this.$alert('账号或密码错误,请重新登录', '登录失败', {
                                    confirmButtonText: 'ok'
                                })
                            })
                        } else {
                            return false;
                        }
                    }
                )
            }
        },
        created() {
            localStorage.clear();
        }
    };
</script>

<style scoped>
    .login-container {
        width: 100%;
        height: 100%;
    }

    .login-page {
        -webkit-border-radius: 5px;
        border-radius: 5px;
        margin: 100px auto;
        width: 350px;
        padding: 35px 35px 15px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }

    label.el-checkbox.rememberme {
        margin: 0px 0px 15px;
        text-align: left;
    }


</style>
