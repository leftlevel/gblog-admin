<!--
 * @Author: leftlevel
 * @Date: 2020-10-06 19:02:37
 * @LastEditors: leftlevel
 * @LastEditTime: 2021-03-13 11:32:31
 * @Description: 用户管理
-->
<template>
    <div class="app-container">
        <el-card class="box-card" shadow="hover">
            <!-- 表单 -->
            <el-form
                :inline="true"
                :model="query"
                ref="queryForm"
                class="demo-form-inline"
                size="small"
            >
                <el-form-item prop="username">
                    <el-input
                        v-model.trim="query.username"
                        placeholder="用户名"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input
                        v-model.trim="query.email"
                        placeholder="邮箱"
                    ></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button
                        type="primary"
                        icon="el-icon-search"
                        @click="searchArticle()"
                        :disabled="query.username === '' && query.email === ''"
                        >查询</el-button
                    >
                    <el-button icon="el-icon-refresh" @click="reload"
                        :disabled="query.username === '' && query.email === ''"
                        >重置</el-button
                    >
                    <el-button
                        type="primary"
                        icon="el-icon-circle-plus-outline"
                        @click="openAdd"
                        >新增</el-button
                    >
                </el-form-item>
            </el-form>
        </el-card>
        <!-- 表格 -->
        <el-table :data="list" stripe style="width: 100%" border>
            <el-table-column align="center" type="index" label="序号">
            </el-table-column>
            <el-table-column
                align="center"
                prop="remark"
                label="头像"
                width="75px"
            >
                <template slot-scope="scope">
                    <el-avatar
                        :size="50"
                        :src="scope.row.avatar"
                        @error="errorHandler"
                        >User</el-avatar
                    >
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="username"
                label="用户名"
                width="120px"
            >
            </el-table-column>
            <el-table-column
                align="center"
                prop="password"
                label="加密密码"
                width="150px"
            >
            </el-table-column>
            <el-table-column
                align="center"
                prop="email"
                label="邮箱地址"
                width="170px"
            >
            </el-table-column>
            <el-table-column
                align="center"
                prop="isAccountNonLocked"
                label="账号锁定"
                width="100px"
            >
                <template slot-scope="scope">
                    <el-tag
                        v-if="scope.row.isAccountNonLocked === 0"
                        type="success"
                        >正常</el-tag
                    >
                    <el-tag
                        v-else-if="scope.row.isAccountNonLocked === 1"
                        type="danger"
                        >锁定</el-tag
                    >
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="role"
                label="当前角色"
                width="100px"
            >
                <template slot-scope="scope">
                    <el-tag
                        v-if="scope.row.role === 0"
                        :style="{ color: 'gray' }"
                        >游客</el-tag
                    >
                    <el-tag v-else-if="scope.row.role === 1">用户</el-tag>
                    <el-tag
                        v-else-if="scope.row.role === 2"
                        :style="{ color: 'red' }"
                        >管理员</el-tag
                    >
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="isEnabled"
                label="是否可用"
                width="100px"
            >
                <template slot-scope="scope">
                    <el-tag
                        v-if="scope.row.isEnabled === 0"
                        type="danger"
                        >删除</el-tag
                    >
                    <el-tag
                        v-else-if="scope.row.isEnabled === 1"
                        type="success"
                        >可用</el-tag
                    >
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button
                        type="primary"
                        size="mini"
                        @click="handleEdit(scope.row.id)"
                        :disabled="scope.row.isEnabled === 0"
                        >编辑</el-button
                    >
                    <el-button
                        type="danger"
                        size="mini"
                        @click="handleDelete(scope.row.id)"
                        :disabled="scope.row.isEnabled === 0"
                        >删除</el-button
                    >
                    <el-button
                        type="success"
                        size="mini"
                        @click="handleRole(scope.row.id)"
                        :disabled="scope.row.isEnabled === 0"
                        >设置角色</el-button
                    >
                    <el-button
                        type="success"
                        size="mini"
                        @click="handlePwd(scope.row.id)"
                        :disabled="scope.row.isEnabled === 0"
                        >密码修改</el-button
                    >
                </template>
            </el-table-column>
        </el-table>

        <edit :title="edit.title" :formData="edit.formData" :visible="edit.visible" :remoteClose="remoteClose" />
    </div>
</template>

<script>
import { getUserAll } from '@/api/user.js'
import Edit from '@/views/user/edit'

export default {
    name: 'User',
    data() {
        return {
            list: [],
            query: {
                username: '',
                email: '',
            },
            edit: {
                title: '',
                visible: false,
                formData: {}
            }
        }
    },

    components: {
        Edit
    },

    created() {
        this.fetchData()
    },

    methods: {
        async fetchData() {
            const { data } = await getUserAll()
            this.list = data
        },
        // 重置表单
        reload() {
            this.$refs['queryForm'].resetFields()
            this.fetchData()
        },
        // 头像出错的回调
        errorHandler() {
            return true
        },
        // 用户编辑
        handleEdit(id) {},
        // 用户删除
        handleDelete(id) {},
        // 设置角色
        handleRole(id) {},
        // 密码修改
        handlePwd(id) {},
        // 打开编辑窗口
        openAdd() {
            this.edit.title = '新增用户——默认密码为邮箱'
            this.edit.visible = true
        },
        // 关闭弹窗
        remoteClose() {
            this.edit.visible = false
            this.fetchData()
        }
    },
}
</script>

<style scoped>
.box-card {
    margin: 0 0 15px 0;
}
</style>