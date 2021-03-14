<template>
    <el-dialog
        :title="title"
        :visible.sync="visible"
        width="500px"
        :before-close="handleClose"
    >
        <el-form
            :rules="rules"
            ref="formData"
            :model="formData"
            label-width="100px"
            label-position="right"
            status-icon
        >
            <el-form-item label="用户名：" prop="username">
                <el-input v-model="formData.username" maxlength="8"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
                <el-input v-model="formData.email" maxlength="23"></el-input>
            </el-form-item>
            <el-form-item label="账号锁定：" prop="isAccountNonLocked">
                <el-radio-group v-model="formData.isAccountNonLocked">
                    <el-radio :label="0" border>未锁定</el-radio>
                    <el-radio :label="1" border>锁定</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    @click="submitForm('formData')"
                    size="small"
                    >确定</el-button
                >
                <el-button type="mini" @click="handleClose" size="small"
                    >取消</el-button
                >
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: '',
        },
        visible: {
            type: Boolean,
            default: false,
        },
        formData: {
            type: Object,
            default: {},
        },
        remoteClose: Function,
    },

    data() {
        return {
            rules: {
                username: [
                    {
                        required: true,
                        message: '用户名不能为空',
                        trigger: ['blur', 'change'],
                    },
                    {
                        min: 2,
                        max: 8,
                        message: '长度在 6 到 8 个字符',
                        trigger: 'blur'
                    }
                ],
                email: [
                    {
                        required: true,
                        message: '邮箱不能为空',
                        trigger: ['blur'],
                    },
                    {
                        type: 'email',
                        message: '请输入正确的邮箱地址',
                        trigger: ['blur', 'change'],
                    },
                ],
                isAccountNonLocked: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: ['change']
                    }
                ]
            },
        }
    },

    components: {},

    methods: {
        submitForm() {
            this.$refs.formData.validate(valid => {
                if (valid) {
                    this.submitForm()
                }
            })
        },
        handleClose() {
            this.$nextTick(() => {
                this.$refs.formData.resetFields()
            })
            this.remoteClose()
        },
    },
}
</script>

<style scoped>
</style>