var mongodb = require('./db');
var markdown = require('markdown').markdown;

function Post(name,title,post){
	this.name = name;
	this.title = title;
	this.post = post;
}

module.exports = Post;


//存储一篇文章及其相关信息
Post.prototype.save = function(callback){
   var date = new Date();
   //存储各种时间格式，方便以后扩展
   var time = {
   	   date:date,
   	   year:date.getFullYear(),
   	   month:date.getFullYear() + "-" + (date.getMonth() + 1),
   	   day:date.getFullYear() + "-" + (date.getMonth() + 1) + "-" +date.getDate(),
   	   minute:date.getFullYear() + "-" +(date.getMonth() + 1) + "-" + date.getDate() + " " +date.getHours() + ":" + (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes())
   };

   //要存入数据库的文档
   var post = {
   	  name:this.name,
   	  time:time,
   	  title:this.title,
   	  post:this.post
   };

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
         //将文档插入posts集合
         collection.insert(post,{
         	safe:true
         },function(err){
            mongodb.close();
            if(err){
               return callback(err);
            }
            callback(null);
         });
      });
   });
};


//读取文章及其相关信息
Post.getAll = function(name,callback){
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
      	 var query = {};
      	 if(name){
             query.name = name;
      	 }
      	 //根据query对象查询文章
      	 collection.find(query).sort({
      	 	 time:-1
      	 }).toArray(function(err,docs){
      	 	 mongodb.close();
      	 	 if(err){
                return callback(err);
      	 	 }

             //解析markdown为html
             docs.forEach(function(doc){
               doc.post = markdown.toHTML(doc.post);
             });
      	 	 callback(null,docs);
      	 });
      });
   });
}

//获取某一篇文章
Post.getOne = function(name,day,minute,title,callback){
   //打开数据
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
         //根据用户名、发表日期及文章名进行查询
         collection.findOne({
            "name":name,
            "time.day":day,
            "time.minute":minute,
            "title":title
         },function(err,doc){
            mongodb.close();
            if(err){
               return callback(err);
            }

            //解析markdown 为Html
            doc.post = markdown.toHTML(doc.post);
            callback(null,doc);
         });
      });
   });
}

//文章编辑
Post.edit = function(name,day,minute,title,callback){
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
         //根据用户名、发表日期及文章名进行查询
         collection.findOne({
            "name":name,
            "time.day":day,
            "time.minute":minute,
            "title":title
         },function(err,doc){
            mongodb.close();
            if(err){
               return callback(err);
            }
            callback(null,doc); //返回查询到的这篇文章
         });
      });
   });
}

//更新一篇文章及其相关信息
Post.update = function(name,day,minute,title,post,callback){
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
         //更新文章内容
         collection.update({
            "name":name,
            "time.day":day,
            "time.minute":minute,
            "title":title
         },{
            $set:{post:post}
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


//删除一篇文章
Post.remove = function(name,day,minute,title,callback){
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
         //根据用户名、日期和标题查找并删除一篇文章
         collection.remove({
            "name":name,
            "time.day":day,
            "time.minute":minute,
            "title":title
         },{
            w:1
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



