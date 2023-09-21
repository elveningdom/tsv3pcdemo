var express = require('express');
var router = express.Router();
var crypto = require('crypto')
var jwt = require('jsonwebtoken')
var userService = require('../service/userinfoService.js');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.get('/list', async function (req, res, next) {
  let result = await userService.query({})
  res.json({
    code: 200,
    result
  })
})
//老师新增学生接口
router.post('/addstudent', function (req, res, next) {
  let token = req.headers.token
  let { username, userpwd, type } = req.body
  console.log(username, userpwd, type);
  let md5 = crypto.createHash('md5')
  userpwd = md5.update(userpwd).digest('hex')
  jwt.verify(token, '2306', async (err, info) => {
    if (err) {
      res.json({
        code: 201,
        msg: "token错误,重新登录"
      })
    } else {
      if (info.type != 1) {
        res.json({
          code: 201,
          msg: "权限错误"
        })
      } else {
        let result = await userService.query({ username })
        console.log(result);
        if (result.length) {
          res.json({
            code: 201,
            msg: "用户已存在",
          })
        } else {
          let result1 = await userService.add({
            username, userpwd, type
          })
          console.log(result1);
          res.json({
            code: 201,
            msg: "添加成功",
            data: result1
          })
        }

      }
    }
  })
})
//老师查询学生接口
router.get('/studentlist', function (req, res, next) {
  let token = req.headers.token
  jwt.verify(token, '2306', async (err, info) => {
    if (!err && info.type == 1) {
      let result = await userService.query({ type: 2 })
      res.json({
        code: 200,
        msg: "查询成功",
        data: result
      })
    } else {
      res.json({
        code: 201,
        msg: "token错误,重新登录"
      })
    }
  })
})
//老师批量新增学生接口
router.post('/addmany',  function (req, res, next) {
  let list = req.body.list
  let token = req.headers.token
  jwt.verify(token, '2306', async(err, info) => {
    if (!err && info.type == 1) {
      if (list.length) {
        let username = list.map(item => item['姓名'])
        let result1 = await userService.query({ username: { $in: username } })
        console.log(res);
        if (result1.length) {
          res.json({
            code: 201,
            msg: "有重复用户名",
            data:result1.map(item=>item.username)
          })
        } else {
          let md5 = crypto.createHash('md5')
          let userpwd = md5.update('123456').digest('hex')
          let infolist = username.map(item => {
            return {
              username:item,
              userpwd,
              type: 2
            }
          })
          let result=await userService.addmany(infolist)
          res.json({
            code: 200,
            msg: "新增成功",
            data: result
          })
        }
      }
    }else{
      res.json({
        code:201,
        msg:"token错误,请重新登录"
      })
    }
  })


})

router.post('/add', async function (req, res, next) {
  let { username, userpwd } = req.body
  let md5 = crypto.createHash('md5')
  userpwd = md5.update(userpwd).digest("hex")
  let result = await userService.add({
    username,
    userpwd,
    type: 1
  })
  res.json({
    code: 200,
    msg: '新增',
    data: result
  })
})

router.post('/login', async function (req, res, next) {
  let { username, userpwd } = req.body
  let md5 = crypto.createHash('md5')
  userpwd = md5.update(userpwd).digest('hex')
  let info = await userService.query({ username, userpwd })
  if (info.length) {
    let studentRouter = [{ path: 'addleave', com: 'addleave', msg: '学生请假' }]
    let tearchRouter = [{ path: 'student', com: 'student', msg: "学生管理" }, { path: 'leave', com: 'leave', msg: '请假管理' },]
    let token = jwt.sign({
      id: info[0]._id,
      username: info[0].username,
      type: info[0].type
    }, '2306', { expiresIn: 1000 * 60 * 60 * 60 * 24 })
    res.json({
      code: 200,
      msg: "登录成功",
      token,
      routerList: info[0].type == 1 ? tearchRouter : studentRouter
    })
  } else {
    res.json({
      code: 201,
      msg: "登录失败",
      data: "用户名和密码不匹配"
    })
  }

})

router.patch('/update', async function (req, res, next) {
  let { username, userage } = req.body
  console.log(username, userage);
  let result = await userService.update({ username }, { userage })
  res.json({
    code: 200,
    result
  })
})
router.delete('/del', async function (req, res, next) {
  let { username } = req.body
  // console.log(id);
  let result = await userService.deletemany({ username })
  res.json({
    code: 200,
    result
  })
})
module.exports = router;
