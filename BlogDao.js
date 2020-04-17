var dbutile =require('./dbutil');
function insertBlog(title,content,views,tags,ctime,utime,success){
    var insertSql = 'insert into blog (`title`,`content`,`views`,`tags`,`ctime`,`utime`) value (?,?,?,?,?,?)';
    var params = [title,content,views,tags,ctime,utime];
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
function queryBlogByPage(page,pageSize,success){
    var querySql = 'select * from blog order by id desc limit ?,?;'
    var params = [page*pageSize,pageSize]
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
function queryBlogCount(success){
    var querySql = 'select count(1) as count from blog';
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
function queryBlogById(id,success){
    var querySql = 'select * from blog where id=?;'
    // console.log(id)
    var params = [id]
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
function getAllBlog(success){
    var querySql = 'select * from blog order by id desc;'
    // console.log(id)
    var params = []
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
function addView(id,success){
    var querySql = 'update blog set views = views +1 where id = ?;'
    var params = [id]
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
function queryHotBlog(size,success){
    var querySql = 'select * from blog order by views desc limit ?'
    var params = [size]
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
// function getBlogByTagName(tag,page,pageSize,success){
//     var querySql = 'select * from blog order by views desc limit ?;'
//     var params = [size]
//     var connection = dbutile.createConnection();
//     connection.query(querySql,params,function(error,result){
//         if(error==null){
//             success(result)
//         }else{
//             throw new Error(error);
//         }
//     })
//     connection.end();
// }
function getTagIdByTag(tag,page,pageSize,success){
    var querySql = 'select * from tags where tag=?;'
    var params = [tag]
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
function getBogIdByTagId(tgid,page,pageSize,success){
    var querySql = 'select * from tag_blog_mapping where tag_id =? limit ?,?;'
    var params = [tgid,page*pageSize,pageSize]
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
function getBlogIdInMapping(tag,page,pageSize,success){
    getTagIdByTag(tag,page,pageSize,function(res){
        getBogIdByTagId(res[0].id,page,pageSize,function(rest){
            success(rest)
        })
    })
}
function selectTagId(tag,success){
    var querySql = 'select * from tags where tag=?;'
    var params = [tag]
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
function getCountWhatEver(tgid,success){
    var querySql = 'select count(1) as count from tag_blog_mapping where tag_id =?;'
    var params = [tgid]
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
function queryBlogByTagCount(tag,success){
    selectTagId(tag,function(res){
        getCountWhatEver(res[0].id,function(res){
            success(res)
        })
    })
}
function updateBlogById(id,content,utime,success){
    
    var querySql = 'update blog set content=?,utime=? where id=?'
    var params = [content,utime,id]
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
module.exports.updateBlogById = updateBlogById;
module.exports.queryBlogByTagCount = queryBlogByTagCount;
module.exports.getBlogIdInMapping = getBlogIdInMapping;
module.exports.queryHotBlog = queryHotBlog;
module.exports.addView = addView;
module.exports.getAllBlog = getAllBlog;
module.exports.insertBlog = insertBlog;
module.exports.queryBlogByPage = queryBlogByPage;
module.exports.queryBlogCount = queryBlogCount;
module.exports.queryBlogById = queryBlogById;



