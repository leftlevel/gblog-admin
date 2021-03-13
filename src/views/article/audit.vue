<!--
 * @Author: leftlevel
 * @Date: 2020-11-17 13:51:30
 * @LastEditors: leftlevel
 * @LastEditTime: 2021-02-13 19:34:04
 * @Description: 文章审核对话框
-->
<template>
    <div>
        <el-dialog
            :title="title"
            :visible.sync="visible"
            width="70%"
            :before-close="handleClose"
        >
        <el-form ref="formData" :model="formData" label-width="100px">
            <el-form-item label="标题" prop="title">
                <el-input v-model="formData.title" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="标签" prop="tag">
                <el-tag effect="plain" disable-transitions>{{ formData.tag }}</el-tag>
            </el-form-item>
            <el-form-item label="类型" prop="type">
                {{ formData.type }}
            </el-form-item>
            <el-form-item label="热度" prop="viewsCount">
                {{ formData.viewsCount }}
            </el-form-item>
            <el-form-item label="主图" prop="banner">
                <img :src="formData.banner" style="width: 100px; height: 100px; display: block">
            </el-form-item>
            <el-form-item label="概述" prop="summary">
                <el-input type="textarea" v-model="formData.summary" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="content">
                <mavonEditor v-model="formData.content" :editable="false"/>
            </el-form-item>
            <el-form-item align="center" v-if="isAudit">
                <el-button size="medium" type="primary" @click="auditSuccess(formData.id)">审核通过</el-button>
                <el-button size="medium" type="danger" @click="auditFail(formData.id)">审核不通过</el-button>
            </el-form-item>
        </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { getArticleById, auditSuccess, auditFail } from '@/api/article'
import  { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
    props: {
        id: null, //文章id
        isAudit: true, //是否为审核页面
        title: {
            type: String,
            default: ''
        },
        visible: {
            type: Boolean,
            default: false
        },
        remoteClose: Function //用于窗口关闭
    },
    data() {
        return {
            //文章详情数据
            formData: {},
        }
    },

    components: {
        mavonEditor
    },

    methods: {
        //关闭窗口
        handleClose() {
            //触发父组件关闭窗口
            this.remoteClose()
        },
        //查询单个文章详情
        async getArticle() {
            const { data } = await getArticleById(this.id)
            this.formData = data
        },
        //审核通过
        auditSuccess(id) {
            this.$confirm('确认审核通过吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                auditSuccess(id).then(res => {
                    this.$message({
                        message: res.message,
                        type: res.flag ? 'success' : 'error'
                    })
                    if (res.flag) {
                        this.handleClose()
                    }
                })
            }).catch(() => {
                //取消
            })
        },
        //审核不通过
        auditFail(id) {
            this.$confirm('确认审核不通过吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                auditFail(id).then(res => {
                    this.$message({
                        message: res.message,
                        type: res.flag ? 'success' : 'error'
                    })
                    if (res.flag) {
                        this.handleClose()
                    }
                })
            }).catch(() => {
                //取消
            })
        }
    },

    watch: {
        visible(val) {
            if (val) {
                this.getArticle()
            }
        }
    }
}
</script>

<style scoped>
</style>
