<template>
  <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px" class="demo-ruleForm">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="ruleForm.username" type="text" autocomplete="off" />
    </el-form-item>
    <el-form-item label="密码" prop="userpwd">
      <el-input v-model="ruleForm.userpwd" type="password" autocomplete="off" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router';
import { getRouterStore } from "../stores/counter"
import { login } from "../services/userServices"
import Leave from "./LeaveView.vue"
import Student from "./StudentView.vue"
import AddLeave from "./AddLeave.vue"
import Main from './MainView.vue';
const ruleFormRef = ref<FormInstance>()

const router = useRouter()

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('密码不能为空'))
  } else {
    if (ruleForm.userpwd !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('userpwd', () => null)
    }
    callback()
  }
}

const ruleForm = reactive({
  username: '',
  userpwd: '',
})

const rules = reactive<FormRules<typeof ruleForm>>({
  username: [
    { required: true, message: "用户名不能为空" },
    { pattern: /^[a-z0-9]{2,10}$/i, message: "用户名是2-10的字母或数组", trigger: 'blur' }],
  userpwd: [{ validator: validatePass, required: true, trigger: 'blur' }]
})

let $store = getRouterStore()
let com:any= { 'leave': Leave, 'student': Student, 'addleave': AddLeave }
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      let { data } = await login({ username: ruleForm.username, userpwd: ruleForm.userpwd })
      if (data.code == 200) {
        window.localStorage.setItem('token', data.token)
        router.removeRoute('main')
        router.addRoute({ name: 'main', path: '/main', component: Main })
        if (data.routerList.length) {
          window.localStorage.setItem('router',JSON.stringify(data.routerList))
          let info=data.routerList[0]
          router.addRoute('main', { path: '', component: com[info.com] })
          data.routerList.forEach((item: any) => {
            router.addRoute('main', { path: item.path, name: item.path, component: com[item.com] })
          });
          $store.setRouterMenu(data.routerList)
        }
        router.push('/main')
      } else {
        alert(data.data)
      }
    } else {
      return false
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
