var express = require('express');
var router = express.Router();
var crypto = require('crypto')
var jwt = require('jsonwebtoken')
var leaveService = require('../service/leaveService.js');
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.post('/addleave', function (req, res, next) {
  let token = req.headers.token
  let { reason, start, end, extend } = req.body
  jwt.verify(token, '2306', async (err, info) => {
    if (!err && info.type == 2) {
      let result = await leaveService.add({
        userid: info.id,
        username: info.username,
        reason: reason,
        start: start,
        end: end,
        extend: extend,
        type: 1,//1待审批 2同意 3拒绝
      })
      res.json({
        code: 200,
        msg: "添加成功",
        data: result
      })
    } else {
      res.json({
        code: 201,
        msg: 'token错误,请重新登录'
      })
    }
  })
})
router.get('/leavelist', function (req, res, next) {
  let token = req.headers.token
  jwt.verify(token, '2306', async (err, info) => {
    if (!err && info.type == 2) {
      let result = await leaveService.query({ username: info.username })
      res.json({
        code: 200,
        msg: '查询成功',
        data: result
      })
    } else {
      res.json({
        code: 201,
        msg: "token异常,请重新登录"
      })
    }
  })
})
router.get('/leavealllist', function (req, res, next) {
  let token = req.headers.token
  let {pagesize,showindex,key,type}=req.query
  console.log(pagesize);
  jwt.verify(token, '2306', async (err, info) => {
    if (!err && info.type == 1) {
      let params={}
      if(key){params.username=new RegExp(key)}
      if(type){params.type=type}
      let result = await leaveService.selectquery(params,skip=2*(showindex-1),pagesize*1)
      let result1 = await leaveService.count(params)
      res.json({
        code: 200,
        msg: '查询成功',
        data: result,
        total:result1
      })
    } else {
      res.json({
        code: 201,
        msg: "token异常,请重新登录"
      })
    }
  })
})
router.patch('/leavesupdate', function (req, res, next) {
  let token = req.headers.token
  let { id, type } = req.body
  jwt.verify(token, '2306', async (err, info) => {
    if (!err && info.type == 1) {
      let result = await leaveService.update({ _id: id }, { type })
      if (result.nModified) {
        res.json({
          code: 200,
          msg: "修改成功",
          data: result.nModified
        })
      } else {
        res.json({
          code: 203,
          msg: "修改失败",
        })
      }
    } else {
      res.json({
        code: 201,
        msg: "token异常,重新登录"
      })
    }
  })
})

module.exports = router;