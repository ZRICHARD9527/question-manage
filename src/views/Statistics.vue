<template>
    <div>
        <span style="color:#0DB9F2;font-size: 18px;position: relative;right: -380px">{{version_id}}分段统计</span>
        <div id="chartPie" class="pie-wrap" ref="chartPie"></div>

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
        name: "statistics",
        data() {
            return {
                version_id: null,
                chartPie: null,
                chartLine: null,
                monthData: [
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
                versionList: [
                    202009, 202010, 202011, 202012, 202013
                ],//时间节点，记录五个，如果没有的话对应数据为0

            }
        },
        created() {
            this.$nextTick(() => {
                this.drawPieChart();
                this.drawLineChart();
            })
        },
        methods: {
            drawPieChart() {

                const _this = this
                console.log("statistics :\n")
                //获取当月情况图
                this.$http.get('/statistics/number')
                    .then(res => {
                        _this.monthData = res.data.data.stageData
                        _this.version_id = res.data.data.version_id

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
                        _this.chartPie = echarts.init(document.getElementById('chartPie'), 'macarons');
                        _this.chartPie.setOption({
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
                                    center: ['80%', '40%'],
                                    data: [
                                        {value: _this.monthData[4], name: '30及以上'},
                                        {value: _this.monthData[3], name: '20~29'},
                                        {value: _this.monthData[2], name: '10~19'},
                                        {value: _this.monthData[1], name: '5~9'},
                                        {value: _this.monthData[0], name: '小于5'}
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
                    }).catch(err => {

                })
            },
            drawLineChart() {
                const _this = this;
                _this.$http.get('/statistics/number/list',{
                    params:{
                        "number":5
                    }
                }).then(res=>{
                    _this.versionList=res.data.data.versions_id.reverse()
                    _this.hData.join=res.data.data.hData.join.reverse()
                    _this.hData.qualified=res.data.data.hData.qualified.reverse()
                    _this.hData.unqualified=res.data.data.hData.unqualified.reverse()

                    // console.log(res)
                    // console.log( _this.versionList)
                    // console.log(res.data.data.versions_id)
                    // console.log( _this.hData)

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
                    _this.chartPie = echarts.init(document.getElementById('chartLine'), 'macarons');
                    _this.chartPie.setOption({
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
                                data: _this.versionList
                                // data: [_this.versionList[0], _this.versionList[1], _this.versionList[2], _this.versionList[3], _this.versionList[4]]
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
                })

            }
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