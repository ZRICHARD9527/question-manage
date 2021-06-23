<template>

    <el-tabs type="border-card" style="margin-top: -10px;height: 620px">
        <el-tab-pane label="添加问题">
            <div>
                <el-form ref="form" :model="form" label-width="80px" style="text-align: left">

                    <el-row style="height: 50px;margin-left: 30px">

                        <template>
                            版本：
                            <!--选择版本-->
                            <el-select v-model="version_id" placeholder="请选择" style="width: 100px;">
                                <el-option
                                        v-for="item in versionList"
                                        :value="item">
                                </el-option>
                            </el-select>

                        </template>

                        <!--                        <el-col>-->
                        <!--                            <el-form-item label="题库版本: ">-->
                        <!--                                <el-input type="text" v-model="version_id" style="width: 100px"></el-input>-->
                        <!--                            </el-form-item>-->
                        <!--                        </el-col>-->
                        <!--                        <el-col>-->
                        <!--                            <el-form-item label="题库名称: ">-->
                        <!--                                <el-input type="text" v-model="version_name" style="width: 100px"></el-input>-->
                        <!--                            </el-form-item>-->
                        <!--                        </el-col>-->
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
                        @click="add">
                    <i class="el-icon-circle-plus-outline"></i>
                    添加
                </el-button>
                <el-button
                        size="small"
                        @click="resetForm">
                    <i class="el-icon-refresh-right"></i>
                    重置
                </el-button>


            </div>
        </el-tab-pane>
        <el-tab-pane label="批量录入">
            <el-row>
                <el-col :span="3">
                    <span style="font-size: 10px">题库版本: </span>
                    <el-input type="test" v-model="version_id"
                              style="width: 80px;height: 25px"
                              size="small"
                    ></el-input>
                </el-col>
                <!--                <el-col :span="3">-->
                <!--                    <span style="font-size: 10px">题库名称: </span>-->
                <!--                    <el-input type="text" v-model="version_name" style="width: 80px;height: 25px"-->
                <!--                              size="small"></el-input>-->
                <!--                </el-col>-->

                <el-col :span="3" style="float: right">
                    <el-button
                            type="primary"
                            size="small"
                            @click="addFileData">
                        <i class="el-icon-finished"></i>
                        确认上传
                    </el-button>
                </el-col>
                <el-col :span="2" style="float: right">
                    <el-button
                            type="primary"
                            size="small"
                            plain
                            @click="getExcel">
                        <i class="el-icon-download"></i>
                        获取模板
                    </el-button>
                </el-col>
                <el-col :span="3" style="float: right">
                    <el-upload
                            class="upload-demo"
                            action="#"
                            :on-change="handleChange"
                            :on-remove="handleRemove"
                            :show-file-list="false"
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                            :auto-upload="false"
                            :multiple="false">
                        <el-button size="small" type="success" plain @click="importf(this)"><i
                                class="el-icon-tickets"></i>选择文件
                        </el-button>
                        <div slot="tip" class="el-upload__tip">注：xlsx/xls文件</div>
                    </el-upload>
                </el-col>

            </el-row>
            <div>
                <el-table
                        :data="showData"
                        border
                        height="470px"
                        tooltip-effect="light">
                    <el-table-column
                            label="序号"
                            width="60"
                            align="center">
                        <template slot-scope="scope">
                            {{(currentPage-1)*perSize+scope.$index+1}}
                        </template>
                    </el-table-column>

                    <el-table-column
                            property="desc"
                            label="问题描述"
                            width="300px"
                            align="center"
                            :show-overflow-tooltip="true"
                    >
                    </el-table-column>

                    <el-table-column
                            property="options[0]"
                            label="选项A"
                            width="200px"
                            align="center"
                            :show-overflow-tooltip="true">
                    </el-table-column>

                    <el-table-column
                            property="options[1]"
                            label="选项B"
                            width="200px"
                            align="center"
                            :show-overflow-tooltip="true">
                    </el-table-column>

                    <el-table-column
                            property="options[2]"
                            label="选项C"
                            width="200px"
                            align="center"
                            :show-overflow-tooltip="true">
                    </el-table-column>

                    <el-table-column
                            property="options[3]"
                            label="选项D"
                            width="200px"
                            align="center"
                            :show-overflow-tooltip="true">
                    </el-table-column>

                    <el-table-column
                            property="answer"
                            label="答案"
                            width="60px"
                            align="center">
                        <template scope="scope">
                            <span v-if="scope.row.answer==0">A</span>
                            <span v-else-if="scope.row.answer==1">B</span>
                            <span v-else-if="scope.row.answer==2">C</span>
                            <span v-else-if="scope.row.answer==3">D</span>
                            <span v-else style="color: red">error</span>
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

        </el-tab-pane>
    </el-tabs>


</template>

<script>

    export default {
        name: "AddQuestion",
        data() {
            return {
                perSize: 25,//每页大小
                currentPage: 1,//当前页面
                total: 0,//总条数
                version_id: null,//版本信息
                versionList: [],//版本列表
                //version_name: null,//版本名称
                form: {
                    desc: '',
                    options: [],
                    answer: null
                },
                fileData: [],//文件中的内容，进行展示
                showData: [
                    // {
                    //     desc: "好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题好问题",
                    //     options: [
                    //         "好好答案好答案好答案好答案好答案答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案",
                    //         "好好答案好答案好答案好答案好答案答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案",
                    //         "好好答案好答案好答案好答案好答案答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案",
                    //         "好好答案好答案好答案好答案好答案答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案好答案",
                    //     ],
                    //     answer: '1'
                    // }
                ],//展示的内容，fileList的一部分
                errorCount: 0,//错误行
            }
        },
        methods: {
            //添加一个问题
            add() {
                const _this = this
                this.$http.post('/problems/',
                    {
                        "version_id": parseInt(_this.version_id),
                        "desc": _this.form.desc,
                        "options": _this.form.options,
                        "answer": _this.form.answer
                    }
                ).then(res=>{
                    console.log(res)
                })
            },
            //重置
            resetForm() {
                this.form.desc = ''
                this.form.option = []
                this.form.answer = null
                this.errorCount = 0
                this.showData = []
                this.fileData = []
                this.currentPage = 1
            },
            nowDate() {
                let nowDate = new Date();
                let date = {
                    year: nowDate.getFullYear(),
                    month: nowDate.getMonth() + 1,
                }
                if (date.month < 10) {
                    date.month = '0' + date.month
                }
                return date.year + '' + date.month;
            },

            //文件确认上传
            addFileData() {
                // console.log(this.fileData)
                const _this = this
                if (_this.version_id == null || _this.version_id.trim() == "" || _this.fileData == null || _this.fileData.length == 0) {
                    _this.$message({
                        type: 'warning',
                        message: '请正确填写信息'
                    })
                } else {
                    if (this.errorCount !== 0) {
                        this.$message.error("含有 " + this.errorCount + " 处错误！")
                    } else {
                        console.log("上传问题列表")
                        this.$http.post('/problems/list', {
                            "version_id": parseInt(_this.version_id),
                            "file_data": _this.fileData
                        }).then(res => {
                            console.log(res)
                            if (res.status === 200) {
                                _this.$message({
                                    type: 'success',
                                    message: "上传成功 " + _this.total + " 条!",
                                })
                            }
                        }).catch(err => {
                            _this.$message({
                                type: 'warning',
                                message: "上传失败!",
                            })
                        })
                    }
                }


            },
            handleChange(file, fileList) {
                this.fileTemp = file.raw
                // 判断上传文件格式
                if (this.fileTemp) {
                    if ((this.fileTemp.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || (this.fileTemp.type === 'application/vnd.ms-excel')) {
                        this.importf(this.fileTemp)
                    } else {
                        this.$message({
                            type: 'warning',
                            message: '附件格式错误，请删除后重新上传！'
                        })
                    }
                    // 文件大小限制为10M
                    const fileLimit = file.size / 1024 / 1024 < 10;
                    if (!fileLimit) {
                        this.$message.error('上传文件大小不超过10M！');
                    }
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请上传附件！'
                    })
                }
            },
            // 移除excel表
            handleRemove(file, fileList) {
                this.fileTemp = null
            },

            importf(obj) {
                let _this = this;
                this.resetForm(); //重置数据
                this.file = event.currentTarget.files[0];
                let rABS = false; //是否将文件读取为二进制字符串
                let f = this.file;
                let reader = new FileReader();
                //if (!FileReader.prototype.readAsBinaryString) {
                FileReader.prototype.readAsBinaryString = function (f) {
                    let binary = "";
                    let rABS = false; //是否将文件读取为二进制字符串
                    let pt = this;
                    let wb; //读取完成的数据
                    let outdata;
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        let bytes = new Uint8Array(reader.result);
                        let length = bytes.byteLength;

                        for (let i = 0; i < length; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        let XLSX = require('xlsx');

                        if (rABS) {
                            wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
                                type: 'base64'
                            });
                        } else {
                            wb = XLSX.read(binary, {
                                type: 'binary'
                            });
                        }

                        // outdata 是 excel导入的数据
                        outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
                        // excel 数据再处理
                        let arr = []
                        outdata.map(v => {
                            let obj = {}
                            obj.desc = v.问题描述
                            obj.options = [
                                v.选项一,
                                v.选项二,
                                v.选项三,
                                v.选项四
                            ]
                            obj.answer = v.答案

                            if (obj.desc != null && obj.options[0] != null && obj.options[1] != null) {
                                //如果问题属性不为空则添加
                                obj.answer = _this.getAnswer(obj.answer)
                                arr.push(obj)
                            }
                        })
                        //与数据进行绑定
                        _this.fileData = [...arr];
                        //将总数设置为列表长度
                        _this.total = _this.fileData.length
                        //将展示内容设置为第一段
                        _this.showData = _this.fileData.slice(0, _this.perSize)
                        console.log("fileData : \n")
                        console.log(_this.fileData)

                    }

                    reader.readAsArrayBuffer(f);

                }
                if (rABS) {
                    reader.readAsArrayBuffer(f);
                } else {
                    reader.readAsBinaryString(f);
                }
            },
            //从文件读取的答案进行内容转化
            getAnswer(val) {
                switch (val) {
                    case '1':
                    case 'A':
                    case 'a':
                        val = 0;
                        break;
                    case '2':
                    case 'B':
                    case 'b':
                        val = 1;
                        break;
                    case '3':
                    case 'C':
                    case 'c':
                        val = 2;
                        break;
                    case '4':
                    case 'D':
                    case 'd':
                        val = 3;
                        break;
                    default :
                        val = -1;
                        this.errorCount += 1;
                        break;
                }
                return val;
            },
            //每页条数发生改变
            handleSizeChange(perSize) {
                this.perSize = perSize
                //页数重置为第一页
                this.currentPage = 1
                this.showData = this.fileData.slice(0, this.perSize)
                // console.log(this.showData)
                this.$message({
                    type: 'success',
                    message: '每页条数' + this.perSize
                });
            },
            //页面改变，改变展示内容
            handleCurrentChange(currentPage) {
                const start = (currentPage - 1) * this.perSize
                const end = start + this.perSize
                this.showData = this.fileData.slice(start, end)
            },
            //获取excel模板
            getExcel() {
                require.ensure([], () => {
                    const {export_json_to_excel} = require('../vendor/Export2Excel.js')
                    const tHeader = ['问题描述', '选项一', '选项二', '选项二', '选项三', '答案']
                    export_json_to_excel(tHeader, [], this.nowDate() + '题库录入模板')

                })
            }
        },
        created() {

            const _this = this
            //获取历史版本
            this.$http.get('/versions/', {
                params: {
                    "number": 5
                }
            }).then(res => {

                for (let i = 0; i < 5; i++) {
                    _this.versionList.push(res.data.versions[i].version_id)
                }
            })

        }
    }
</script>

<style lang="css">
    .el-tooltip__popper {
        font-size: 14px;
        max-width: 400px;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    input[type='number'] {
        -moz-appearance: textfield;
    }

</style>