var express = require('express');
var users = require('./modules/users');
var md5 = require('blueimp-md5');
var router = express.Router();

router.get('/',function (req,res) {
    // console.log(req.session.isLogin);
    res.render('index.html',{
        user:req.session.isLogin
    });
});

router.get('/login',function (req,res) {
    res.render('login.html');
});

router.post('/login',function (req,res) {
    var body = req.body;
    users.findOne({email:body.email,password:md5(md5(body.password))},function (err,data) {
        if (err) {
            return res.json({
                error:1,
                message:'Server error'
            });
        }
        if (!data) {
            return res.json({
                error:500,
                message:'邮箱或密码错误'
            });
        }
        req.session.isLogin = data;
        return res.json({
            success:true,
            message:'登录成功'
        });
    });

});

router.get('/logout',function (req,res) {
    req.session.isLogin = null;
    res.redirect('/login');
});

router.get('/register',function (req,res) {
    res.render('register.html');
});

router.post('/register',function (req,res) {
    // console.log(req.body);

    //查询注册信息是否重复
    users.findOne({$or:[{email:req.body.email},{nickname:req.body.nickname}]},function (err,data) {
        if (err) {
            return res.json({
                error:1,
                message:'Server error'
            });
        }
        if (data) {
            return res.json({
                error:500,
                message:'用户名或昵称重复'
            });
        }
        req.body.password = md5(md5(req.body.password));
        var user_single = new users(req.body);
        user_single.save(function (err,data) {
            if (err) {
                return res.json({
                    error:1,
                    message:'Server error'
                });
            }
            req.session.isLogin = req.body;
            return res.json({
                success:true,
                message:'注册成功'
            });
        });
    });

});

module.exports = router;
