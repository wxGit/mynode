//var express = require('express');
//var router = express.Router();

// var user={
//  	username:'admin',
//  	password:'admin'
// }

/* GET home page. */
// router.get('/', function(req, res, next) {
//    res.render('index', { title: 'Index' });
// });

// router.get('/login', function(req, res, next) {
//    res.render('login', { title: '用户登录' });
// });

// router.post('/login', function(req, res, next) {
   
//    if(req.body.username===user.username && req.body.password===user.password){
// 	    res.redirect('/home');
//    }
//    res.redirect('/login');
// });

// router.get('/logout', function(req, res, next) {
//    res.redirect('/');
// });

// router.get('/home', function(req, res, next) {
//    res.render('home', { title: 'Home',user: user});
// });

exports.index = function(req, res){
res.render('index', { title: 'Index' });
};
exports.login = function(req, res){
res.render('login', { title: '用户登陆'});
};
exports.doLogin = function(req, res){
	var user={
	   username:'admin',
	   password:'admin'
	}

	if(req.body.username===user.username && req.body.password===user.password){
	   res.redirect('/home');
	}else{
	   res.redirect('/login');
	}
};
exports.logout = function(req, res){
    res.redirect('/');
};
exports.home = function(req, res){
	var user={
	username:'admin',
	password:'admin'
	}
    res.render('home', { title: 'Home',user: user});
};


//module.exports = router;
