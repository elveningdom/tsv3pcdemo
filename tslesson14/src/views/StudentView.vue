<template>
    <div>
        <div style="display: flex;justify-content: space-between;">
            <el-button text @click="dialogFormVisible = true">
                新增学生
            </el-button>
            <el-button text @click="down">
                下载模版
            </el-button>
            <div class="btn" style="width: 100px;">
                <el-button text @click="down" class="elbtn">
                    批量新增
                </el-button>
                <input class="btninput" type="file" accept=".xlsx" name="" id="" @change="getData">
            </div>
        </div>
        <br>

        <el-dialog v-model="dialogFormVisible" title="新增学生">
            <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px"
                class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="ruleForm.username" type="text" autocomplete="off" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm(ruleFormRef)">添加</el-button>
                    <el-button @click="resetForm(ruleFormRef)">重置</el-button>
                </el-form-item>
            </el-form>

        </el-dialog>

        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="_id" label="编号" />
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="userpwd" label="密码" />
            <el-table-column label="操作">
                <template #default>
                    <el-button link type="primary" size="small" @click="handleClick">Detail</el-button>
                    <el-button link type="primary" size="small">Edit</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { importsExcel } from "../until/excel.js"
import { addstudent, studentlist, addmany } from "../services/userServices"
const dialogFormVisible = ref(false)
const ruleFormRef = ref()
const ruleForm = reactive({
    username: '',
})
const rules = reactive({
    username: [
        { required: true, message: "用户名不能为空" },
        { pattern: /^[a-z0-9]{2,10}$/i, message: "用户名是2-10的字母或数组", trigger: 'blur' }],
})
const submitForm = (formEl: any) => {
    if (!formEl) return
    formEl.validate(async (valid: any) => {
        if (valid) {
            let res = await addstudent({
                username: ruleForm.username,
                userpwd: '123456',
                type: 2
            })
            alert(res.data.msg)
            resetForm(formEl)
        } else {
            return false
        }
    })
}
const resetForm = (formEl: any) => {
    if (!formEl) return
    formEl.resetFields()
    dialogFormVisible.value = false
}

//
const handleClick = () => {
    console.log('click')
}

let tableData = ref([])
onMounted(async () => {
    let res = await studentlist({
        type: 2
    })
    if (res.data.code == 200) {
        tableData.value = res.data.data

    }
})
//
//下载模版
let down = () => {
    let url = 'api/file/学生模版.xlsx'
    let a = document.createElement('a')
    a.href = url
    a.click()
    a.remove()
}

//导入数据
let getData = async (e: any) => {
    let list = await importsExcel(e)
    let { data } = await addmany({ list })
    let info: [] = data.data
    tableData.value.push(...info)
}
</script>
<style scoped>
.el-button--text {
    margin-right: 15px;
}

.el-select {
    width: 300px;
}

.el-input {
    width: 300px;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}

.btn {
    position: relative;
}

.elbtn {
    position: absolute;
    top: 0;
    left: 0;
}

.btninput {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: 999;
}</style>