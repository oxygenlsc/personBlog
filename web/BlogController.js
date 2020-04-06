var path = new Map();
var BlogDao = require('../dao/BlogDao')
var TagsDao = require('../dao/tagsDao')
var TagBlogDao = require('../dao/tagBlogMapingDao')
var timeUtil = require('../util/TimeUtile')
var url = require('url');
var resputil = require('../util/RespUtil')

function insertBlog(request,response){
    request.on('data',function(data){
        // BlogDao.insertBlog(data.title)
       
        var data = JSON.parse(data.toString())
        console.log(data.title )
        var tags = data.tags.replace(/ /g, "").replace("，" ,"," )
         BlogDao.insertBlog(data.title,data.content,0,tags,timeUtil.getNow(),timeUtil.getNow(),function(result){
            response.send({status:'success',msg:'添加成功',result:1})
            var blogId = result.insertId;
            var tagList = tags.split(',');
            for(var i=0;i<tagList.length;i++){
                if(tagList[i]==''){
                    continue;
                }
                queryTag(tagList[i],blogId)
            }
         })
    })
}
function queryTag(tag,blogId){
    TagsDao.queryTag(tag,function(result){
        if(result==null||result.length==0){
            insertTag(tag,blogId)
        }else{
            insertTagBlogMapping(result[0].id,blogId)
        }
    })
}
function insertTag(tag,blogId){
    TagsDao.insertTag(tag,timeUtil.getNow(),timeUtil.getNow(),function(res){
        insertTagBlogMapping(res.insertId,blogId)
    })
}

function insertTagBlogMapping(tagId,blogId){
    TagBlogDao.insertTagBlogMapping(tagId,blogId,timeUtil.getNow(),timeUtil.getNow(),function(res){
          
    })
}

function queryBlogByPage(request,response){
    var params = url.parse(request.url,true).query
    var page = parseInt( params.page);
    var pagesize =parseInt( params.pageSize);
    BlogDao.queryBlogByPage(page,pagesize,function(result){
        for(var i =0;i<result.length;i++){
            result[i].content=  result[i].content;
            result[i].content = result[i].content.replace(/<img[\w\W]*">/,'')
            result[i].content = result[i].content.replace(/<[\w\W]{1,5}>/g,'')
            result[i].content = result[i].content.replace(/&nbsp;+/g,'')
            result[i].content =  result[i].content.substring(0,300)
        }
        response.send({
            result:1,
            status:'success',
            msg:'查询成功',
            data:result
        })
    })
}
function queryBlogCount(request,response){
    BlogDao.queryBlogCount(function(res){
        response.send({
            result:1,
            status:'success',
            msg:'查询成功',
            count:res
        })
    })
}

function queryBlogById(request,response){
    var params =url.parse(request.url,true).query;
    console.log(params);
    BlogDao.queryBlogById(parseInt(params.bid),function(result){
        response.send(result);
        BlogDao.addView(parseInt(params.bid),function(res){})
    })
}

function getAllBlog(request,response){
    BlogDao.getAllBlog(function(res){
        response.send(res);
    })
}
function queryHotBlog(request,response){
    var params = url.parse(request.url,true).query;
    BlogDao.queryHotBlog(parseInt(params.size),function(res){
        response.send(res);
    })
}
function getBlogByTagName(request,response){
    var params = url.parse(request.url,true).query;
    BlogDao.getBlogIdInMapping(params.tag,parseInt(params.page) ,parseInt(params.pageSize),function(res){
        console.log(res);
        var arr = [];
        for(var i =0 ;i<res.length;i++){
            // console.log(res[i].blog_id)
            BlogDao.queryBlogById(res[i].blog_id,function(result){
                arr.push(result[0]);
            })
        }
        getResult(arr,res.length,response)
    })
}
function getResult(arr,len,response){
    if(arr.length<len){
        setTimeout(function(){
            getResult(arr,len,response)
        },1000)
    }else{
        for(var i =0;i<arr.length;i++){
            arr[i].content=  arr[i].content;
            arr[i].content = arr[i].content.replace(/<img[\w\W]*">/,'')
            arr[i].content = arr[i].content.replace(/<[\w\W]{1,5}>/g,'')
            arr[i].content = arr[i].content.replace(/&nbsp;+/g,'')
            arr[i].content =  arr[i].content.substring(0,300)
        }
        response.send(arr)
    }
    
}
function queryBlogByTagCount(request,response){
    var params = url.parse(request.url,true).query;
    BlogDao.queryBlogByTagCount(params.tag,function(res){
        response.send(res);
    })
}
path.set('/queryBlogByTagCount',queryBlogByTagCount)
path.set('/getBlogByTagName',getBlogByTagName);
path.set('/queryHotBlog',queryHotBlog)
path.set('/getAllBlog',getAllBlog)
path.set('/insertBlog',insertBlog)
path.set('/queryBlogByPage',queryBlogByPage)
path.set('/queryBlogCount',queryBlogCount)
path.set('/queryBlogById',queryBlogById)
module.exports.path = path;