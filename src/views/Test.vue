<template>
    <div>
        <span style="color:#0DB9F2;font-size: 18px;position: relative;right: -380px">{{version_id}}分段统计</span>
        <div id="chartPie" class="pie-wrap"></div>

        <!--        <el-button size="small" type="success" plain @click="save(this)"-->
        <!--                   style="position:relative;right: -520px;bottom: -30px">-->
        <!--            <i class="el-icon-tickets"></i>保存数据-->
        <!--        </el-button>-->

        <div id="chartLine" class="line-wrap"></div>

    </div>

</template>
<script>
    import * as echarts from 'echarts';

    require('echarts/theme/macarons');//引入主题

    export default {
        data() {
            return {
                version_id: 202011,
                chartPie: null,
                chartLine: null,
                stageData: [
                    132,
                    46,
                    12,
                    65,
                    122
                ],//当月分段数据
                hData: {
                    qualified: [
                        0,
                        0,
                        45,
                        12,
                        12,
                    ],
                    unqualified: [
                        0,
                        0,
                        21,
                        45,
                        42,
                    ],
                    join: [
                        0,
                        0,
                        132,
                        89,
                        122
                    ]
                },//历史数据，显示三条，大于三十，小于三十，参与人数，
                hDate: [
                    202009, 202010, 202011, 202012, 202013
                ],//时间节点，记录五个，如果没有的话对应数据为0

            }
        },
        created() {
            const _this = this
            console.log("statistics :\n")
            this.$http.get('/statistics')
                .then(res => {
                    console.log(res)
                    _this.hDate = res.data.hDate
                    console.log(res.data.hDate)
                    console.log(_this.hDate)
                })

        },
        mounted() {
            this.$nextTick(() => {
                this.drawPieChart();
                this.drawLineChart();
            })
        },
        methods: {
            drawPieChart() {
                let mytextStyle = {
                    color: "#333",
                    fontSize: 18,
                };
                let mylabel = {
                    show: true,
                    position: "right",
                    offset: [30, 40],
                    formatter: '{b} : {c} ({d}%)',
                    textStyle: mytextStyle
                };
                this.chartPie = echarts.init(document.getElementById('chartPie'), 'macarons');
                this.chartPie.setOption({
                    // title: {
                    //     text: 'CSUST',
                    //     subtext: '当月答题分段表',
                    //     right: 'center',
                    //     // marginRight:-30,
                    //     // textStyle: {
                    //     //     color: '#0DB9F2',        //颜色
                    //     //     fontStyle: 'normal',     //风格
                    //     //     fontWeight: 'normal',    //粗细
                    //     //     fontFamily: 'Microsoft yahei',   //字体
                    //     //     fontSize: 14,     //大小
                    //     //     padding:[0,0],
                    //     // },
                    // },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a}<br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        right: 'right',
                        data: ['小于5', '5~9', '10~19', '20~29', '30及以上']
                    },
                    series: [
                        {
                            name: '分段人数',
                            type: 'pie',
                            radius: '55%',
                            center: ['80%', '30%'],
                            data: [
                                {value: this.stageData[4], name: '30及以上'},
                                {value: this.stageData[3], name: '20~29'},
                                {value: this.stageData[2], name: '10~19'},
                                {value: this.stageData[1], name: '5~9'},
                                {value: this.stageData[0], name: '小于5'}
                            ],
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]

                });
            },
            drawLineChart() {
                const _this = this;
                let mytextStyle = {
                    color: "#333",
                    fontSize: 18,
                };
                let mylabel = {
                    show: true,
                    position: "right",
                    offset: [30, 40],
                    formatter: '{b} : {c} ({d}%)',
                    textStyle: mytextStyle
                };
                this.chartPie = echarts.init(document.getElementById('chartLine'), 'macarons');
                this.chartPie.setOption({
                    title: {
                        text: '历史统计图'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data: ['参加人数', '达标人数', '未达标数']
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '10%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: _this.hDate
                            // data: [_this.hDate[0], _this.hDate[1], _this.hDate[2], _this.hDate[3], _this.hDate[4]]
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '未达标数',
                            type: 'line',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    color: '#000000'
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: '#EEAD0E'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#EEAD0E', //改变折线点的颜色
                                    lineStyle: {
                                        color: '#EEAD0E' //改变折线颜色
                                    }
                                }
                            },
                            data: _this.hData.unqualified
                        },
                        {
                            name: '达标人数',
                            type: 'line',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    color: '#000000'
                                }
                            },
                            areaStyle: {
                                normal: {
                                    show: true,
                                    color: '#40E0D0'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#40E0D0', //改变折线点的颜色
                                    lineStyle: {
                                        color: '#40E0D0' //改变折线颜色
                                    }
                                }
                            },
                            data: _this.hData.qualified
                        },
                        {
                            name: '参加人数',
                            type: 'line',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: '#009ACD'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#009ACD'
                                }
                            },
                            data: _this.hData.join
                        }
                    ]
                })
            },
            // //保存历史数据文件
            // save(){
            //   this.getExcel(this.)
            // },
            // getExcel(res) {
            //     require.ensure([], () => {
            //         const {export_json_to_excel} = require('../vendor/Export2Excel.js')
            //         const tHeader = ['时间', '达标人数', '未达标人数', '参与人数']
            //         const filterVal = ['user_id', 'college_id', 'user_name', 'num', 'reg_time']
            //         const list = res
            //         const data = this.formatJson(filterVal, list)
            //
            //         export_json_to_excel(tHeader, data, this.nowDate() + '获奖名单')
            //     })
            // },
            // formatJson(filterVal, jsonData) {
            //     return jsonData.map(v => filterVal.map(j => v[j]))
            // },

        }
    }
</script>

<style lang='less' scope>
    .pie-wrap {
        width: 100%;
        height: 280px;
        text-align: right;
    }

    .line-wrap {
        width: 100%;
        height: 300px;
    }
</style>