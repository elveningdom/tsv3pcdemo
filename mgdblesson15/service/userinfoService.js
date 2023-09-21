let userModel=require("../model/userinfos")
module.exports={
    query:(params)=>{
        return userModel.find(params)
    },
    add:(data)=>{
        return userModel.insertMany([data])
    },
    addmany:(list)=>{
        return userModel.insertMany(list)
    },
    update:(params,data)=>{
        return userModel.updateMany(params,data)
    },
    deletemany:(id)=>{
        return userModel.remove(id)
    }
}