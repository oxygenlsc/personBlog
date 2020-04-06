var mysql = require('mysql');
function createConnection(){
    var connection = mysql.createConnection({
        host:'47.100.23.14',
        port:'3306',
        user:'lsc',
        password:'695288',
        database:'MyWeb'
    })
    return connection;
}
module.exports.createConnection = createConnection;