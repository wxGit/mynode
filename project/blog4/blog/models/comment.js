var mongodb = require('./db');

function Comment(name,day,minute,title,comment){
	this.name = name;
	this.day = day;
	this.minute = minute;
	this.title = title;
	this.comment = comment;
}

module.exports = Comment;

//存储一条留言信息
Comment.prototype.save = function(callback){
   var name = this.name,
       day = this.day,
       minute = this.minute,
       title = this.title,
       comment = this.comment;
   
   //打开数据库
   mongodb.open(function(err,db){
      if(err){
      	return callback(err);
      }
      //读取posts集合
      db.collection('posts',function(err,collection){
      	 if(err){
      	 	mongodb.close();
      	 	return callback(err);
      	 }
      	 //通过用户名、时间及标题查找文档，并把一条留言对象添加到该文档comments数组中
      	 collection.update({
      	 	"name":name,
      	 	"time.day":day,
      	 	"time.minute":minute,
      	 	"title":title
      	 },{
      	 	$push:{"comments":comment}
      	 },function(err){
      	 	mongodb.close();
      	 	if(err){
      	 		return callback(err);
      	 	}
      	 	callback(null);
      	 });
      });
   });
}