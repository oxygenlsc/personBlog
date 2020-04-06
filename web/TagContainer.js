
var path = new Map();
var TagsDao = require('../dao/tagsDao')
var TagBlogDao = require('../dao/tagBlogMapingDao')
var timeUtil = require('../util/TimeUtile')
var url = require('url');
function queryAllTag(request,response){
    // console.log(request.ip.match(/\d+\.\d+\.\d+\.\d+/)[0])
    TagsDao.queryAllTag(function(result){
        response.send(result)
    })
}
path.set('/queryAllTag',queryAllTag);
module.exports.path = path;