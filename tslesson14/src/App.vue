

<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useRouter } from 'vue-router';
import { getRouterStore } from "./stores/counter"
import Leave from "./views/LeaveView.vue"
import Student from "./views/StudentView.vue"
import AddLeave from "./views/AddLeave.vue"
import Main from './views/MainView.vue';
let routerlist = window.localStorage.getItem('router')
const router = useRouter()
let $store = getRouterStore()
let com:any= { 'leave': Leave, 'student': Student, 'addleave': AddLeave }
if (routerlist) {
  let routerList=JSON.parse(routerlist)
  let info = routerList[0]
  router.removeRoute('main')
  router.addRoute({ name: 'main', path: '/main', component: Main })
  router.addRoute('main', { path: '', component: com[info.com] })
  routerList.forEach((item: any) => {
    router.addRoute('main', { path: item.path, name: item.path, component: com[item.com] })
  });
  $store.setRouterMenu(routerList)
  router.push(window.location.hash.split('#')[1])
}

</script>