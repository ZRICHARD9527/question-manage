<template>

    <div style="height: 600px">

        <el-form ref="form" :model="form" label-width="80px" style="text-align: left">

            <el-row>
                <el-form-item label="题库版本: ">
                    <el-input type="text" v-model="form.version_id" style="width: 100px"></el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="问题内容: ">
                    <el-input type="textarea" v-model="form.desc" style="width: 830px"></el-input>
                </el-form-item>
            </el-row>


            <el-row type="flex" class="row-bg" justify="left">
                <el-col :span="10">
                    <el-form-item label="选项A: ">
                        <el-input type="textarea" v-model="form.options[0]" style="width: 300px"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="选项B: ">
                        <el-input type="textarea" v-model="form.options[1]" style="width: 300px"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row type="flex" class="row-bg" justify="left">
                <el-col :span="10">
                    <el-form-item label="选项C: ">
                        <el-input type="textarea" v-model="form.options[2]" style="width: 300px"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="选项D: ">
                        <el-input type="textarea" v-model="form.options[3]" style="width: 300px"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <!--            <div>-->
            <!--                答案-->
            <!--            </div>-->
            <el-form-item label="答案: ">
                <el-radio-group v-model="form.answer">
                    <el-radio :label="0">选项A</el-radio>
                    <el-radio :label="1">选项B</el-radio>
                    <el-radio :label="2">选项C</el-radio>
                    <el-radio :label="3">选项D</el-radio>
                </el-radio-group>
            </el-form-item>

        </el-form>

        <el-button
                type="primary"
                size="small"
                @click="up">
            <i class="el-icon-upload"></i>
            修改
        </el-button>
        <el-button
                size="small"
                @click="resetForm">
            <i class="el-icon-refresh-right"></i>
            重置
        </el-button>
        <el-button
                size="small"
                type="danger"
                @click="deleteProblem">
            <i class="el-icon-delete"></i>
            删除
        </el-button>
    </div>
</template>

<script>
    export default {
        name: "QuestionInfo",
        data() {
            return {
                form: {
                    version_id: null,
                    desc: '',
                    options: [],
                    answer: null
                }
            }
        },
        methods: {
            //更新问题
            up() {
                const _this = this
                console.log(this.form)
                this.$http.put('/problems/', {
                    "problem_id": sessionStorage.getItem("problem_id"),
                    "version_id": _this.form.version_id,
                    "desc": _this.form.desc,
                    "options": _this.form.options,
                    "answer": _this.form.answer
                }).then(res => {
                        console.log(res)
                        _this.$message({
                            type: 'success',
                            message: "更新成功"
                        })
                    })
                    .catch(err => {
                        _this.$message({
                            type: 'danger',
                            message: "更新失败"
                        })
                    })
            },
            //重置
            resetForm() {
                this.form.desc = ''
                this.form.options = []
                this.form.answer = null
                this.form.version_id=null
            },
            //删除
            deleteProblem() {
                const _this = this
                this.$confirm('此操作将永久删除该题目, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.$http.delete('/problems/', {
                        params: {
                            "problem_id": sessionStorage.getItem("problem_id")
                        }
                    }).then(res => {
                        _this.resetForm()
                        sessionStorage.clear()
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                         _this.$router.push('/questionList')
                    }).catch(err => {
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        },
        created() {
            this.form.version_id = sessionStorage.getItem("version_id")
            this.form.desc = sessionStorage.getItem("desc")
            this.form.options = sessionStorage.getItem("options").split(',')
            this.form.answer = parseInt(sessionStorage.getItem("answer"))
            this.$message({
                type: 'success',
                message: "获取成功"
            })
        }
    }
</script>


<style scoped>

</style>