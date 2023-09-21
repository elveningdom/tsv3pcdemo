import axios from "../model/axios";

export const login=(data:any)=>{
return axios({
    method:"post",
    url:'api/users/login',
    data
})
}

export const addstudent=(data:any)=>{
    return axios({
        method:"post",
        url:"api/users/addstudent",
        data,
        headers:{
            token:window.localStorage.getItem("token")
        }
    })
}

export const studentlist=(data:any)=>{
return axios({
    method:"get",
    url:"api/users/studentlist",
    data,
    headers:{
        token:window.localStorage.getItem("token")
    }
})
}

export const addmany=(data:any)=>{
    return axios({
        method:"post",
        url:"api/users/addmany",
        data,
        headers:{
            token:window.localStorage.getItem("token")
        }
    })
}