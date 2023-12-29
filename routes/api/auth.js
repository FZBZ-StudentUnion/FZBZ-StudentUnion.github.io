var express = require('express');
const md5 = require('md5');

var router = express.Router();

var UserModel = require('../../models/UserModel');

router.post('/reg', (req, res)=>{
  UserModel.create({...req.body, password: md5(req.body.password)})
  .then((data)=>{
    console.log(data)
    res.json({
      "code": '0000',
      "msg": "注册成功",
      "data": data
    })
  })
  .catch(result=>{
    console.log(result);
    res.json({
      "code": '2001',
      "msg": "注册失败",
      "data": null
    })
  })
})

router.post('/login', (req, res)=>{
  UserModel.findOne({username: req.body.username, password: md5(req.body.password)})
  .then((data)=>{
    if(!data){
      return res.json({
        "code": '2003',
        "msg": '用户名或密码错误',
        "data": null
      })
    }else{
      req.session.tel = data.tel;
      req.session.username = data.username;
      req.session._id = data._id;

      res.json({
        "code": '0000',
        "msg": '登录成功',
        "data": data._id
      })
    }
  })
  .catch(result=>{
    res.json({
      "code": '2002',
      "msg": '读取失败',
      "data": null
    })
    return;
  })
})
// 防止CSRF跨站请求
router.post('/logout', (req, res)=>{
  req.session.destroy((err)=>{
    res.json({
      "code": '0000',
      "msg": '退出成功',
      "data": null
    })
  })
})

module.exports = router;

