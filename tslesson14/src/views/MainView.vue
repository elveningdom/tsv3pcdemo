<template>
    <div>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
            @select="handleSelect">
            <el-menu-item index="0">LOGO</el-menu-item>
            <div class="flex-grow" />
            <el-menu-item :index="index+1" v-for="(i, index) in routerMenu "
                :key="index">
                <RouterLink :to="'/main/' + i.path">{{ i.msg }}
                </RouterLink>
            </el-menu-item>
            <el-sub-menu index="2">
                <template #title>个人中心</template>
                <el-menu-item index="2-1">item one</el-menu-item>
                <el-menu-item index="2-2">item two</el-menu-item>

            </el-sub-menu>
        </el-menu>
        <RouterView></RouterView>
    </div>
</template>
<script setup lang="ts">
import { ref ,onMounted} from 'vue'
import { useRoute } from 'vue-router';
import { getRouterStore } from '../stores/counter'
let $store = getRouterStore()
const activeIndex = ref(1)
const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
let routerMenu=$store.routerMenu.map((item:any,index:any)=>{
    return {
        id:index+1,
        ...item
    }
})
let router=useRoute()
onMounted(()=>{
    let currentroute=router.path
    console.log(currentroute);
    console.log(routerMenu.filter((item:any)=>('/main/'+item.path)==currentroute)[0]);
    activeIndex.value=routerMenu.filter((item:any)=>('/main/'+item.path)==currentroute)[0]?routerMenu.filter((item:any)=>('/main/'+item.path)==currentroute)[0].id:1
})
</script>

<style scoped></style>