var mongoose = require("./db.js");

var schema = mongoose.Schema; //模型生成器(表生成器)

//建立表 并且指定字段
var userSchema = new schema({
 username:String,
 userpwd:String,
 type:Number
});

//转成数据模型导出  取名为userinfo 根据userSchem去生成 在mongodb中生成的表为多一个s
//表名会变成userinfos
module.exports = mongoose.model("userinfos", userSchema);