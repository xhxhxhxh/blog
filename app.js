var express = require('express');
var fs = require('fs');
var path = require('path');
var router = require('./routes');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();

app.engine('html', require('express-art-template'));

app.use('/public/',express.static(path.join(__dirname,'public')));
app.use('/node_modules/',express.static(path.join(__dirname,'node_modules')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(router);

//配置404中间件
app.use(function (req,res) {
    res.render('404.html');
});

app.listen(3000,function () {
    console.log('服务已启动');
});