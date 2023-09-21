import axios from "../model/axios";

export const addleave=(data:any)=>{
return axios({
    method:"post",
    url:"api/leaves/addleave",
    data,
    headers:{
        token:window.localStorage.getItem("token")
    }

})
}
export const leavelist=(params:any)=>{
    return axios({
        method:"get",
        url:"api/leaves/leavelist",
        params,
        headers:{
            token:window.localStorage.getItem("token")
        }
    })
}

export const leavealllist=(params:any)=>{
    return axios({
        method:"get",
        url:"api/leaves/leavealllist",
        params,
        headers:{
            token:window.localStorage.getItem("token")
        }
    })
}

export const leavesupdate=(data:any)=>{
    return axios({
        method:"patch",
        url:"api/leaves/leavesupdate",
        data,
        headers:{
            token:window.localStorage.getItem("token")
        }
    })
}