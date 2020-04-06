var dbutil = require('./dbutil');
function insertTagBlogMapping(tagId,blogId,ctime,utime,success){
    var insertSql = 'insert into tag_blog_mapping (`tag_id`,`blog_id`,`ctime`,`utime`) value(?,?,?,?)';
    var params = [tagId,blogId,ctime,utime];
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(insertSql,params,function(err,result){
        if(err==null){
            success(result)
        }else{
            console.log(err);
        }
    })
    connection.end();
}
module.exports.insertTagBlogMapping = insertTagBlogMapping;