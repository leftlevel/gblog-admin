<!--
 * @Author: leftlevel
 * @Date: 2020-10-06 18:46:55
 * @LastEditors: leftlevel
 * @LastEditTime: 2021-02-18 11:35:29
 * @Description: 文章管理 
-->
<template>
    <div class="app-container">
        <!-- 表单 -->
        <el-form
            :inline="true"
            :model="query"
            ref="queryForm"
            class="demo-form-inline"
            size="medium"
        >
            <el-form-item prop="title">
                <el-input v-model="query.title" placeholder="文章标题"></el-input>
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="searchArticle()" :disabled="query.title == '' || query.title == null">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reload"
                    >重置</el-button
                >
            </el-form-item>
        </el-form>

        <!-- 表格 -->
        <el-table :data="postList" stripe style="width: 100%" border>
            <el-table-column align="center" prop="id" label="序号" width="60px">
            </el-table-column>
            <el-table-column align="center" label="文章主图" width="150px">
                <template slot-scope="scope">
                    <el-image style="width: 50px; height: 50px" :src="scope.row.banner" :preview-src-list="srcList"></el-image>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="title" label="文章标题" width="250px">
            </el-table-column>
            <el-table-column align="center" prop="summary" label="概述" width="250px">
            </el-table-column>
            <el-table-column align="center" prop="commentsCount" label="评论数量" width="100px">
            </el-table-column>
            <el-table-column align="center" prop="commentsCount" label="状态" width="100px">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status === 0" type="danger">已删除</el-tag>
                    <el-tag v-if="scope.row.status === 1" >未审核</el-tag>
                    <el-tag v-if="scope.row.status === 2" type="success">审核通过</el-tag>
                    <el-tag v-if="scope.row.status === 3" type="warning">审核未通过</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="pubTime" label="发布日期" width="100px">
            </el-table-column>
            <el-table-column align="left" label="操作">
                <template slot-scope="scope">
                    <el-button
                        type="primary"
                        size="mini"
                        @click="openView(scope.row.id)"
                        >查看</el-button
                    >
                    <!-- 审核：只有status===1才显示，其他不显示，删除：只有statis !==0 才显示，其他不显示 -->
                    <el-button
                        v-if="scope.row.status === 1"
                        type="success"
                        size="mini"
                        @click="openAudit(scope.row.id)"
                        >审核</el-button
                    >
                    <el-button
                        v-if="scope.row.status !== 0"
                        type="danger"
                        size="mini"
                        @click="handleDelete(scope.row.id)"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        
        <audit :id="audit.id" :isAudit="audit.isAudit" :title="audit.title" :visible="audit.visible" :remoteClose="remoteClose"></audit>
    </div>
</template>

<script>
import { fetchList, fetchListBySearchWords, deleteArticleById } from '@/api/article'
import Audit from './audit'

export default {
    name: 'Article',
    data() {
        return {
            postList: [],
            srcList: [],
            currPage: 1,
            hasNextPage: false,
            query: {
                title: ''
            },
            
            audit: {
                title: '',
                visible: false,
                id: null, //文章id
                isAudit: true //是否打开的为审核页面，true审核，false是查看
            }
        }
    },

    components: {
        Audit
    },

    created() {
        this.fetchList()
    },

    methods: {
        fetchList() {
            fetchList({currentPage: this.currPage}).then(res => {
                //easy-mock接口 this.postList = res.data.items || []
                this.postList = res.data.list || []
                //easy-mock接口 this.currPage = res.data.page
                this.currPage = res.data.currPage
                this.hasNextPage = res.data.hasNextPage
                this.enlargeBanner()
            }).catch(err => {
                console.log(err)
            })
        },
        searchArticle() {
            fetchListBySearchWords({currentPage: this.currPage, searchWords: this.query.title}).then(res => {
                this.postList = res.data.list || []
                this.currPage = res.data.currPage
                this.hasNextPage = res.data.hasNextPage
                this.enlargeBanner()
            }).catch(error => {
                console.log(err)
            })
        },
        reload() {
            this.query.title = ''
            this.fetchList()
        },
        // 图片放大
        enlargeBanner() {
            this.srcList = []
            for(let i = 0; i < this.postList.length; i++) {
                this.srcList.push(this.postList[i].banner)
            }
        },
        // 审核文章
        openAudit(id) {
            this.audit.id = id,
            this.audit.isAudit = true
            this.audit.title = '审核文章'
            this.audit.visible = true
        },
        // 文章详情
        openView(id) {
            this.audit.id = id,
            this.audit.isAudit = false
            this.audit.title = '文章详情'
            this.audit.visible = true
        },
        //删除文章
        handleDelete(id) {
            this.$confirm('确认删除这个文章吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteArticleById(id).then(res => {
                    this.$message({
                        message: res.message,
                        type: res.flag ? 'success' : 'error'
                    })
                    if (res.flag) {
                        this.fetchList()
                    }
                })
            }).catch(() => {
                //取消
            })
        },
        // 审核框关闭
        remoteClose() {
            this.audit.visible = false
            this.fetchList()
        },
    },
}
</script>

<style scoped>
</style>