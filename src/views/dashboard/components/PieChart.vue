<!--
 * @Author: leftlevel
 * @Date: 2020-12-06 12:32:12
 * @LastEditors: leftlevel
 * @LastEditTime: 2020-12-11 18:49:20
 * @Description: 饼图
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
//自适应窗口大小改变图表的大小
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
        legendData: {
            //左侧组件接收的数据
            type: Array,
            default: () => ['前端', 'java', '移动端'],
        },
        seriesData: {
            //饼图中分配的数据
            type: Array,
            default: () => [
                { value: 100, name: '前端' },
                { value: 200, name: 'java' },
                { value: 500, name: '移动端' },
            ],
        },
    },

    mounted() {
        //当加载dom后，会调用this.initChart() 来进行初始化echarts实例
        this.$nextTick(() => {
            this.initChart()
        })
    },

    //当组件销毁之前会调用此钩子函数
    beforeDestroy() {
        if (!this.chart) {
            return
        }
        this.chart.dispose() //释放echart实例
        this.chart = null
    },

    data() {
        return {
            chart: null, //接收echart实例的对象
        }
    },

    components: {},

    methods: {
        initChart() {
            this.chart = echarts.init(this.$refs.main, 'macarons')
            this.chart.setOption({
                title: {
                    text: '各技术文章统计',
                    // subtext: '纯属虚构',
                    left: 'center',
                },
                tooltip: { //鼠标放上去的数据格式
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)',
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: this.legendData,
                },
                series: [
                    {
                        name: '统计内容',
                        type: 'pie', //饼状图
                        radius: '55%', //圆大小
                        center: ['50%', '50%'], //饼图位置【左，上】
                        data: this.seriesData,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10, //图形阴影模糊大小
                                shadowOffsetX: 0, //阴影水平方向偏移距离
                                shadowColor: 'rgba(0, 0, 0, 0.5)', //阴影颜色
                            },
                        },
                    },
                ],
            })
        },
    },
}
</script>

<style scoped>
</style>