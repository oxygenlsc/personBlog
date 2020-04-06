var path = new Map();
var commentDao = require('../dao/CommentDao')
var timeUtil = require('../util/TimeUtile')
var url = require('url');
var cpac = require('svg-captcha');//生成验证码的需要安装
function addComment(request,response){
    var params = url.parse(request.url,true).query;
    commentDao.insertComment(parseInt(params.bid),parseInt(params.parent),params.parentName,params.userName,params.content,params.email,timeUtil.getNow(),timeUtil.getNow(),function(res){
        response.send({states:'success',result:1,msg:'评论成功',data:res});
    })
}
path.set('/addComment',addComment);
function queryRandomCode(request,response){
    var img = cpac.create({
        fontSize:50,width:100,height:34
    });
    // console.log(img);
    response.send(img)
}
path.set('/queryRandomCode',queryRandomCode)

function queryCommentsByBlogId(request,response){
    var parasm = url.parse(request.url,true).query;
    commentDao.queryCommentsByBlogId(parasm.bid,function(res){
        response.send(res);
    })
}
path.set('/queryCommentsByBlogId',queryCommentsByBlogId)
function queryCommentsByBlogIdForMe(request,response){
    var parasm = url.parse(request.url,true).query;
    commentDao.queryCommentsByBlogIdForMe(parseInt(parasm.page)-1 ,parseInt(parasm.pageSize) ,function(res){
        response.send(res);
    })
}
path.set('/queryCommentsByBlogIdForMe',queryCommentsByBlogIdForMe)

function queryMyCount(request,response){
    commentDao.queryMyCount(function(res){
        response.send(res);
    })
}
path.set('/queryMyCount',queryMyCount)
function getNewComments(request,response){
    commentDao.getNewComments(function(res){
        response.send(res);
    })
}
path.set('/getNewComments',getNewComments)

module.exports.path = path;