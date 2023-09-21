<template>
    <div>
        <el-button text @click="dialogFormVisible = true">
            新增请假
        </el-button>
        <el-dialog v-model="dialogFormVisible" title="新增请假">
            <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px"
                class="demo-ruleForm">
                <el-form-item label="请假原因" prop="reason">
                    <el-input v-model="ruleForm.reason" type="text" autocomplete="off" />
                </el-form-item>
                <el-form-item label="开始时间" prop="start">
                    <el-date-picker v-model="ruleForm.start" type="datetime" placeholder="开始时间" />
                </el-form-item>
                <el-form-item label="结束时间" prop="end">
                    <el-date-picker v-model="ruleForm.end" type="datetime" placeholder="结束时间" />
                </el-form-item>
                <el-form-item label="附件" prop="extend">
                    <el-upload v-model:file-list="fileList" name="filename" action="api/uploads" list-type="picture-card"
                        :auto-upload="false" :limit="3" ref="uploadRef" :on-success="success">
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </el-upload>

                    <el-dialog v-model="dialogVisible">
                        <img w-full :src="dialogImageUrl" alt="Preview Image" />
                    </el-dialog>
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
            <el-table-column prop="reason" label="原因" />
            <el-table-column prop="start" label="开始时间">
                <template #default="scope">
                    <el-button link type="primary" size="small">{{ dayjs(scope.row.start).format('YYYY-MM-DD')
                    }}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="end" label="结束时间">
                <template #default="scope">
                    <el-button link type="primary" size="small">{{ dayjs(scope.row.end).format('YYYY-MM-DD')
                    }}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="extend" label="附件">
                <!-- <template #default="scope">
                    
                </template> -->
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <span v-if="scope.row.type == 1">
                        <el-button text type="warning" size="small">待审批</el-button>
                    </span>
                    <span v-if="scope.row.type == 2">
                        <el-button text type="success" size="small">已同意</el-button>
                    </span>
                    <span v-if="scope.row.type == 3">
                        <el-button text type="danger" size="small">已拒绝</el-button>
                    </span>

                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { addleave, leavelist } from '../services/leaveServices'
import { dayjs } from 'element-plus';
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile, UploadInstance } from 'element-plus'
const dialogFormVisible = ref(false)
const ruleFormRef = ref()
const ruleForm = reactive({
    reason: '',
    start: "",
    end: "",
    extend: '',
})
const rules = reactive({
    reason: [
        { required: true, message: "用户名不能为空", trigger: 'blur' }
    ],
    start: [
        { required: true, message: "开始时间不能为空", trigger: 'blur' }
    ],
    end: [
        { required: true, message: "结束时间不能为空", trigger: 'blur' }
    ],
})
let tableData: any = ref([])
let successlist: any = ref([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const uploadRef = ref<UploadInstance>()
const submitForm = (formEl: any) => {
    if (!formEl) return
    formEl.validate(async (valid: any) => {
        if (valid) {
            if (ruleForm.start >= ruleForm.end) {
                alert("开始时间要小于结束时间")
            } else {
                if (fileList.value.length) {
                    console.log(fileList.value);
                    uploadRef.value!.submit()

                    alert('有图片')
                } else {
                    let res = await addleave(ruleForm)
                    if (res.data.code == 200) {
                        tableData.value.push(res.data.data[0])
                    }
                }
            }
            resetForm(formEl)

        } else {
            return false
        }
    })
}
let fileList = ref<UploadUserFile[]>([])


const success = async (res: any) => {
    console.log("11");
    console.log(res);
    successlist.value.push(res.url)
    console.log(successlist.value, fileList.value);
    console.log(successlist.value.length == fileList.value.length);

    if (successlist.value.length == fileList.value.length) {
        console.log("11");
        let res = await addleave({
            ...ruleForm,
            extend: successlist.value.join(",")
        })
        if (res.data.code == 200) {
            tableData.value.push(res.data.data[0])
        }
    }
}

const resetForm = (formEl: any) => {
    if (!formEl) return
    formEl.resetFields()
    dialogFormVisible.value = false
    successlist.value = []
    fileList.value = []
}

onMounted(async () => {
    let res = await leavelist({})
    if (res.data.code == 200) {
        tableData.value = res.data.data
    }
})
let handleClick = () => {

}


</script>

<style scoped></style>