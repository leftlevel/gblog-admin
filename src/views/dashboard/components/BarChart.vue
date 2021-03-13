<!--
 * @Author: leftlevel
 * @Date: 2020-12-06 13:29:06
 * @LastEditors: leftlevel
 * @LastEditTime: 2020-12-07 19:05:46
 * @Description: 柱状图
-->
<template>
    <!-- 为Echart准备一个具备宽高的Dom -->
    <div
        ref="main"
        :class="className"
        :style="{ height: height, width: width }"
    ></div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/theme/macarons'
import resize from './mixins/resize'

export default {
    mixins: [resize],
    props: {
        className: {
            type: String,
            default: 'chart',
        },
        width: {
            type: String,
            default: '100%',
        },
        height: {
            type: String,
            default: '400px',
        },
        xAxisData: {
            //x轴显示的数据
            type: Array,
            default: () => ['2022-2', '2022-2', '2022-3', '2022-4', '2022-5', '2022-6'],
        },
        seriesData: {
            //饼图中分配的数据
            type: Array,
            default: () => [10, 52, 200, 334, 390, 330],
        },
    },
    data() {
        return {
            chart: null, //接收echart实例的对象
        }
    },

    components: {},

    mounted() {
        this.$nextTick(() => {
            this.initChart()
        })
    },

    beforeDestroy() {
        if (!this.chart) {
            return
        }
        this.chart.dispose()
        this.chart = null
    },

    methods: {
        initChart() {
            this.chart = echarts.init(this.$refs.main, 'macarons')
            this.chart.setOption({
                // color: ['#3398DB'],
                title: {
                    text: '近六个月发布的文章数',
                    left: 'center',
                },
                tooltip: { //提示框
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'line', // 默认为直线，可选为：'line' | 'shadow'
                    },
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '10%',
                    containLabel: true, //刻度标签
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.xAxisData,
                        axisTick: {
                            alignWithLabel: true,
                        },
                    },
                ],
                yAxis: [
                    {
                        type: 'value',
                    },
                ],
                series: [
                    {
                        name: '发布数',
                        type: 'bar', //柱状图
                        barWidth: '60%', //每个柱子宽度
                        data: this.seriesData,
                    },
                ],
            })
        },
    },
}
</script>

<style scoped>
</style>