let leaveModel=require("../model/leaveTable")
module.exports={
    query:(params)=>{
        return leaveModel.find(params)
    },
    selectquery:(params,skip,limit)=>{
        return leaveModel.find(params).skip(skip).limit(limit)
    },
    count:(params)=>{
        return leaveModel.find(params).count()
    },
    add:(data)=>{
        return leaveModel.insertMany([data])
    },
    update:(params1,params2)=>{
        return leaveModel.updateOne(params1,params2)
    }
}