var mysql = require('mysql');

module.exports = function () {
  return {
    init: function () {
      return mysql.createConnection({
        host: 'localhost',
        port: '3306', 
        user: 'root', //이 DB에서 사용하고 있는 user의 이름
        password: '1234',   //이 DB에서 사용하고 있는 user의 password
        database: 'tb'    //내가 생성한 데이터베이스 이름
      })
    },
    
    test_open: function (con) {
      con.connect(function (err) {
        if (err) {
          console.log('mysql connection error :' + err);
        } else {
          console.log('mysql is connected successfully.');
        }
      })
    }
  }
};