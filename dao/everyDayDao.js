var dbutile =require('./dbutil');

function insertEveryDay(content,ctime,success){
    var insertSql = 'insert into every_day (`content`,`ctime`) value (?,?)';
    var params = [content,ctime];
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

function queryEveryDay(success){
    var querySql = 'select * from every_day order by id desc limit 1;';
    var params = [];
    var connection = dbutile.createConnection();
    connection.query(querySql,params,function(error,result){
        if(error==null){
            success(result)
        }else{
            throw new Error(error);
        }
    })
    connection.end();
}
module.exports.insertEveryDay = insertEveryDay
module.exports.queryEveryDay = queryEveryDay

