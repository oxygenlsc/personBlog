var dbutil = require('./dbutil');
function insertTag(tag,ctime,utime,success){
    var insertTagSql = 'insert into tags (`tag`,`ctime`,`utime`) value(?,?,?)';
    var params = [tag,ctime,utime];
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(insertTagSql,params,function(err,result){
        if(err==null){
            success(result)
        }else{
            console.log(err);
        }
    })
    connection.end();
}


function queryTag(tag,success){
    var queryTagSql = 'select * from tags where tag=? ';
    var params = [tag];
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(queryTagSql,params,function(err,result){
        if(err==null){
            success(result)
        }else{
            console.log(err);
        }
    })
    connection.end();
}
function queryAllTag(success){
    var queryTagSql = 'select * from tags ';
    var params = [];
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(queryTagSql,params,function(err,result){
        if(err==null){
            success(result)
        }else{
            console.log(err);
        }
    })
    connection.end();
}
module.exports.insertTag = insertTag;
module.exports.queryTag = queryTag;
module.exports.queryAllTag = queryAllTag;