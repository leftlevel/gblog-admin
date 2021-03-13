<!--
 * @Author: leftlevel
 * @Date: 2020-10-06 10:40:43
 * @LastEditors: leftlevel
 * @LastEditTime: 2020-12-12 11:46:47
 * @Description: dashboard
-->
<template>
    <div class="dashboard-container">
        <!-- 面板统计组件 -->
        <panel-group :userTotal="userTotal" :articleTotal="articleTotal" :commentTotal="commentTotal"/>
        <el-row :gutter="40">
            <el-col :xs="24" :sm="24" :lg="12">
                <el-card shadow="hover">
                    <pie-chart v-if="pieChartFlag" :legendData="pieChartLegendData" :seriesData="pieChartseriesData"/>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="12">
                <el-card shadow="hover">
                    <bar-chart />
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import echarts from 'echarts'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import PanelGroup from './components/PanelGroup'
import { getUserNumber } from '@/api/user'
import { getArticleNumber, getCommentNumber, getArticleBelongTagNumber } from '@/api/article'

export default {
    name: 'Dashboard',
    components: { PieChart, BarChart, PanelGroup },
    data() {
        return {
            userTotal: 0,
            articleTotal: 0,
            commentTotal: 0,
            pieChartLegendData: [],
            barChartLegendData: [],
            pieChartseriesData: [],
            barChartseriesData: [],
            pieChartFlag: false,
            barChartFlag: false
        }
    },
    created() {
        this.getTotal()
        this.getInitData()
    },
    mounted() {
    },
    methods: {
        async getTotal() {
            //总用户
            const { data: {userNumber} } = await getUserNumber()
            this.userTotal = userNumber
            //总文章
            const { data: {articleNumber} } = await getArticleNumber()
            this.articleTotal = articleNumber
            //总评论
            const { data: {commentNumber} } = await getCommentNumber()
            this.commentTotal = commentNumber
        },
        getInitData() {
            getArticleBelongTagNumber().then(res => {
                if (res.flag) {
                    // console.log(res.data)
                    let nameAndNumberList = res.data.nameAndNumberList
                    this.pieChartLegendData = res.data.nameList
                    for (var i = 0; i < nameAndNumberList.length; i++) {
                        let obj = {}
                        obj.value = nameAndNumberList[i].number
                        obj.name = nameAndNumberList[i].name
                        this.pieChartseriesData.push(obj)
                    }
                    // console.log(this.pieChartLegendData)
                    // console.log(this.pieChartseriesData)
                    this.pieChartFlag = true
                }
            })
        }
    },
}
</script>

<style lang="scss" scoped>
.dashboard {
    &-container {
        margin: 30px;
    }
    &-text {
        font-size: 30px;
        line-height: 46px;
    }
}
</style>
