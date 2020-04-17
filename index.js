var express = require('express');
var globalConfig = require('./config');
var loader = require('./loader');
console.log(loader)
var app = new express();
app.use(express.static('./page/'))
app.post('/editEveryDay',loader.get('/editEveryDay'))
app.get('/queryEveryDay',loader.get('/queryEveryDay'))
app.post('/insertBlog',loader.get('/insertBlog'))
app.get('/queryBlogByPage',loader.get('/queryBlogByPage'))
app.get('/queryBlogCount',loader.get('/queryBlogCount'))
app.get('/queryAllTag',loader.get('/queryAllTag'))
app.get('/queryBlogById',loader.get('/queryBlogById'))
app.get('/addComment',loader.get('/addComment'))
app.get('/queryRandomCode',loader.get('/queryRandomCode'))
app.get('/queryCommentsByBlogId',loader.get('/queryCommentsByBlogId'))
app.get('/queryCommentsByBlogIdForMe',loader.get('/queryCommentsByBlogIdForMe'))
app.get('/queryMyCount',loader.get('/queryMyCount'))
app.get('/getAllBlog',loader.get('/getAllBlog'))
app.get('/getNewComments',loader.get('/getNewComments'))
app.get('/queryHotBlog',loader.get('/queryHotBlog'))
app.get('/getBlogByTagName',loader.get('/getBlogByTagName'))
app.get('/queryBlogByTagCount',loader.get('/queryBlogByTagCount'))
app.post('/updateBlogById',loader.get('/updateBlogById'))

















app.listen(globalConfig.port,function(){
    console.log('服务器已启动')
})