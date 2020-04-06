var dbutile =require('./dbutil');
function insertComment(blog_id,parent,parent_name,user_name,comments,email,ctime,utime,success){
    var insertSql = 'insert into comments (`blog_id`,`parent`,`parent_name`,`user_name`,`comments`,`email`,`ctime`,`utime`) value (?,?,?,?,?,?,?,?);';
    var params = [blog_id,parent,parent_name,user_name,comments,email,ctime,utime];
    var connection = dbutile.createConnection();
    connection.query(insertSql,params,function(error,result){
        if(error==null){
            success(result)
        }else{
            throw new Error(error);
        }
    })
    connection.end();
}

function queryCommentsByBlogId(blog_id,success){
    var querySql = 'select * from comments where blog_id = ?'
    var parms = [blog_id];
    var connection = dbutile.createConnection();
    connection.query(querySql,parms,function(error,result){
        if(error==null){
            success(result)
        }else{
            throw new Error(error);
        }
    })
    connection.end();
}
function queryCommentsByBlogIdForMe(page,pageSize,success){
   var querySql = 'select * from comments where blog_id = -1 limit ?,?;' 
   var params = [page*pageSize,pageSize]
   var connection = dbutile.createConnection();
   connection.query(querySql,params,function(error,result){
       if(error==null){
           success(result)
           console.log(result)
       }else{
           throw new Error(error);
       }
   })
   connection.end();
}
function queryMyCount(success){
    var querySql = 'select count(1) as count from comments where blog_id=-1'
    var params = []
    var connection = dbutile.createConnection();
    connection.query(querySql,params,function(error,result){
        if(error==null){
            success(result)
            console.log(result)
        }else{
            throw new Error(error);
        }
    })
    connection.end();
}
function getNewComments(success){
    var querySql = 'select * from comments order by id desc limit ?,?'
    var params = [0,5]
    var connection = dbutile.createConnection();
    connection.query(querySql,params,function(error,result){
        if(error==null){
            success(result)
            // console.log(result)
        }else{
            throw new Error(error);
        }
    })
    connection.end();
}
module.exports.getNewComments = getNewComments;
module.exports.queryCommentsByBlogId = queryCommentsByBlogId;
module.exports.queryCommentsByBlogIdForMe = queryCommentsByBlogIdForMe;
module.exports.insertComment = insertComment;
module.exports.queryMyCount = queryMyCount;