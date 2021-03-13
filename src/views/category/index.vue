<template>
    <div class="app-container">
        <!-- 表单 -->
        <el-form
            :inline="true"
            ref="queryForm"
            class="demo-form-inline"
            size="medium"
        >
            <el-form-item>
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handledialog">新增</el-button>
            </el-form-item>
        </el-form>

        <!-- 表格 -->
        <el-table :data="list" stripe style="width: 100%" border>
            <el-table-column align="center" type="index" label="序号" >
            </el-table-column>
            <el-table-column align="center" prop="name" label="分类名称">
            </el-table-column>
            <el-table-column align="center" prop="remark" label="备注">
            </el-table-column>
            <el-table-column align="center" prop="rank" label="排序">
            </el-table-column>
            <el-table-column align="center" prop="status" label="分类状态">
                <template slot-scope="scope">
                    <el-tag
                        :type="scope.row.status == 0 ? 'success' : 'danger'"
                        disable-transitions
                        ><span>{{ scope.row.status | typeStatusFilter }}</span></el-tag
                    >
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button
                        type="primary"
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
            title="类型编辑"
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
                <el-form-item label="分类名" prop="name">
                    <el-input v-model="pojo.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="pojo.status">
                        <el-radio :label="0">开启</el-radio>
                        <el-radio :label="1">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="排序" prop="rank">
                    <el-input-number v-model="pojo.rank" :min="1" :max="20" label="描述文字" style="width: 300px"></el-input-number>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="pojo.remark"></el-input>
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
import { getTypes, getById, update, add, deleteById } from '@/api/category'

const typeStatus = [
    { type: 0, status: '开启' },
    { type: 1, status: '禁用' },
]

export default {
    name: 'Category',
    data() {
        return {
            list: [],
            dialogFormVisible: false,
            pojo: {
                id: null,
                name: '',
                status: 0,
                remark: '',
                rank: 1
            },
            pveForm: {
                id: null,
                name: '',
                status: 0,
                remark: '',
                rank: 1
            },
            is_form_change: false,
            rules: {
                name: [
                    {
                        required: true,
                        message: '类型不能为空',
                        trigger: ['blur', 'change'],
                    },
                ],
                status: [
                    {
                        required: true,
                        message: '类型不能为空',
                        trigger: 'change'
                    },
                ],
                rank: [
                    {
                        required: true,
                        message: '请输入排序号',
                        trigger: ['blur', 'change'],
                    },
                ]
            }
        }
    },
    
    created() {
        this.fetchData()
    },

    components: {},

    methods: {
        fetchData() {
            getTypes().then(res => {
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
            this.handledialog()
            getById(id).then((res) => {
                this.pojo.id = res.data.id
                this.pojo.name = res.data.name
                this.pojo.status = res.data.status
                this.pojo.rank = res.data.rank
                this.pojo.remark = res.data.remark
                this.pveForm.id = res.data.id
                this.pveForm.name = res.data.name
                this.pveForm.status = res.data.status
                this.pveForm.rank = res.data.rank
                this.pveForm.remark = res.data.remark
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
        updateData(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
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
    },

    filters: {
        //分类状态过滤器
        typeStatusFilter(type) {
            const typeStatusObj = typeStatus.find((obj) => type === obj.type)
            return typeStatusObj ? typeStatusObj.status : null
        }
    },

    watch: {
        'pojo': {
            deep: true,
            handler(newVal, oldVal) {
               for(let i in this.pojo) {
                   if (newVal[i] != this.pveForm[i]) {
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