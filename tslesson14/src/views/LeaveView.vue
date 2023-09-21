<template>
    <div>
        <el-row>
            <el-col :span="12">
                <el-input v-model="key" placeholder="Please input" />
            </el-col>
            <el-col :span="12">
                <el-select v-model="value" clearable placeholder="Select">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-col>
        </el-row>
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
                    <el-button link type="primary" size="small">{{ dayjs(scope.row.start).format('YYYY-MM-DD')
                    }}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <span v-if="scope.row.type == 1">
                        <el-button text type="success" size="small" @click="changetype(scope.row, 2)">同意</el-button>
                        <el-button text type="danger" size="small" @click="changetype(scope.row, 3)">拒绝</el-button>
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
        <el-pagination style="margin-top: 10px;" :page-size="pagesize" v-model:current-page="showindex" @current-change="currentchange"
            background layout="prev, pager, next" :total="total" class="mt-4" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { dayjs } from 'element-plus';
import { leavealllist, leavesupdate } from '../services/leaveServices'
let tableData: any = ref([])
let search = async () => {
    let res = await leavealllist({ showindex: showindex.value, pagesize: pagesize.value, key: key.value ,type:value.value})
    if (res.data.code == 200) {
        tableData.value = res.data.data
        total.value = res.data.total
    }
}
onMounted(() => {
    search()
})
let handleClick = () => {

}
let changetype = async (item: any, type: any) => {
    let res = await leavesupdate({
        id: item._id,
        type
    })
    if (res.data.code == 200) {
        item.type = type
    }

}
let pagesize = ref(2)
let showindex = ref(1)
let total = ref()
let currentchange = () => {
    search()
}
let key = ref('')
const value = ref('')
const options = [
  {
    value: 1,
    label: '待审批',
  },
  {
    value: 2,
    label: '已同意',
  },
  {
    value: 3,
    label: '已拒绝',
  },
]
watch([key,value], () => {
    showindex.value = 1
    search()
})
</script>

<style scoped>
.el-row {
    margin-bottom: 20px;
}

.el-row:last-child {
    margin-bottom: 0;
}

.el-col {
    border-radius: 4px;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}
</style>