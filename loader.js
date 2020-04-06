var fs = require('fs');
var globConfig = require('./config');
var path = require('path')
var controllerSet = [];
var pathMap = new Map();
var files = fs.readdirSync(path.join(__dirname,globConfig['web_path']) );
for (let i = 0; i < files.length; i++) {
  var temp = require('./'+globConfig['web_path']+'/'+files[i]);
  if(temp.path){
      for (const [k,v] of temp.path) {
          if(pathMap.get(k)==null){
              pathMap.set(k,v);
          }else {
              throw new Error('接口名重复'+k)
          }
         
      }
      controllerSet.push(temp);
  }
}
module.exports = pathMap;