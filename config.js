var fs = require('fs');
var path = require('path')
var globConfig = {};
var conf = fs.readFileSync(path.join(__dirname,'./server.config'));
var configArr = conf.toString().split('\n');
for (let i = 0; i < configArr.length; i++) {
    globConfig[configArr[i].split('=')[0].trim()] = configArr[i].split('=')[1].trim();
}
module.exports = globConfig;