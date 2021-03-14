<!--
 * @Author: leftlevel
 * @Date: 2020-10-06 18:51:32
 * @LastEditors: leftlevel
 * @LastEditTime: 2020-12-17 15:29:56
 * @Description: 标签管理
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
            <el-form-item prop="name">
                <el-input v-model="query.name" placeholder="标签名称"></el-input>
            </el-form-item>
            <el-form-item prop="status">
                <el-select v-model="query.status" placeholder="状态" style="width: 100px">
                    <el-option v-for="item in tagStatus" :label="item.status" :value="item.type" :key="item.type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="searchTags(query)" :disabled="query.name === '' && query.status === ''">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reload" :disabled="query.name === '' && query.status === ''"
                    >重置</el-button
                >
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handledialog">新增</el-button>
            </el-form-item>
        </el-form>

        <!-- 表格 -->
        <el-table :data="list" stripe style="width: 100%" border>
            <el-table-column align="center" type="index" label="序号" width="300px">
            </el-table-column>
            <el-table-column align="center" prop="name" label="标签名称">
                <template slot-scope="scope">
                    <el-tag
                        :type="scope.row.id % 2 == 0 ? '' : 'warning'"
                        disable-transitions
                        >{{ scope.row.name }}</el-tag
                    >
                </template>
            </el-table-column>
            <el-table-column align="center" prop="status" label="标签状态">
                <template slot-scope="scope">
                    <el-tag
                        :type="scope.row.status == 0 ? 'success' : 'danger'"
                        disable-transitions
                        ><span>{{ scope.row.status | tagStatusFilter }}</span></el-tag
                    >
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button
                        type="success"
                        size="mini"
                        @click="handleEdit(scope.row.id)"
                        >编辑</el-button
                    >
                    <el-button
                        type="danger"
                        size="mini"
                        @click="handleDelete(scope.row.id)"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>

        <!-- 对话框 -->
        <el-dialog
            title="标签编辑"
            :visible.sync="dialogFormVisible"
            width="500px"
        >
            <el-form
                :rules="rules"
                ref="pojoForm"
                :model="pojo"
                label-width="100px"
                label-position="right"
                style="width: 400px"
            >
                <el-form-item label="标签名" prop="name">
                    <el-input v-model="pojo.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否禁用标签" prop="status">
                    <el-switch
                        v-model="pojo.status"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                    >
                    </el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="
                        pojo.id === null
                            ? addData('pojoForm')
                            : updateData('pojoForm')
                    "
                    :disabled="!is_form_change"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getTags, getById, update, add, deleteById, search } from '@/api/label'

const tagStatus = [
    { type: 0, status: '开启' },
    { type: 1, status: '禁用' },
]

export default {
    name: 'Label',
    data() {
        return {
            list: [],
            dialogFormVisible: false,
            tagStatus,
            is_form_change: false,
            query: {
                name: '',
                status: ''
            },
            pveForm: {
                id: null,
                name: '',
                status: false,
            },
            pojo: {
                id: null,
                name: '',
                status: false,
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: '标签名不能为空',
                        trigger: ['blur', 'change'],
                    },
                ],
            },
        }
    },

    created() {
        this.fetchData()
    },

    components: {},

    methods: {
        fetchData() {
            getTags().then((res) => {
                this.list = res.data
            })
        },
        handledialog() {
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['pojoForm'].resetFields()
            })
        },
        handleEdit(id) {
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['pojoForm'].clearValidate()
            })
            getById(id).then((res) => {
                this.pojo.id = res.data.id
                this.pojo.name = res.data.name
                this.pveForm.id = res.data.id
                this.pveForm.name = res.data.name
                if(res.data.status === 1) {
                    this.pojo.status = true
                    this.pveForm.status = true
                }else {
                    this.pojo.status = false
                    this.pveForm.status = false
                }
            })
        },
        updateData(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (this.pojo.status) {
                        this.pojo.status = 1
                    } else {
                        this.pojo.status = 0
                    }
                    update(this.pojo).then(res => {
                        if(res.flag) {
                            this.dialogFormVisible = false
                            this.$message.success(res.message)
                            this.fetchData()
                        }
                    })
                } else {
                    return false
                }
            })
        },
        addData(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (this.pojo.status) {
                        this.pojo.status = 1
                    }else {
                        this.pojo.status = 0
                    }
                    add(this.pojo).then(res => {
                        if (res.flag) {
                            this.dialogFormVisible = false
                            this.$message.success(res.message)
                            this.fetchData()
                        }
                    })
                } else {
                    return false
                }
            })
        },
        handleDelete(id) {
            this.$confirm('确认删除这个标签吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                deleteById(id).then(res => {
                    this.$message({
                        message: res.message,
                        type: res.flag ? 'success' : 'error'
                    })
                    if (res.flag) {
                        this.fetchData()
                    }
                })
            }).catch(() => {
                //取消
            })
        },
        searchTags(query) {
            if (query.name === '' && query.status === '') {
                this.fetchData()
            } else {
                search(query).then(res => {
                    this.list = res.data
                })
                // async let { data } = await search(query)
                // this.list = data
            }
        },
        reload() {
            // this.query = {}
            this.$refs.queryForm.resetFields()
            this.fetchData()
        },
    },

    filters: {
        //标签状态过滤器
        tagStatusFilter(type) {
            const tagStatusObj = tagStatus.find((obj) => type === obj.type)
            return tagStatusObj ? tagStatusObj.status : null
        },
    },

    watch: {
        'pojo': {
            deep: true,
            handler(newVal, oldVal) {
               for(let i in this.pojo) {
                   if (newVal[i] != this.pveForm[i] ) {
                       this.is_form_change = true
                       break
                   } else {
                       this.is_form_change = false
                   }
               }
            }
        }
    },
}
</script>

<style scoped>
</style>