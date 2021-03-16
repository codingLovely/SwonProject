var mysql = require('mysql');

module.exports = function () {
  return {
    init: function () {
      return mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root', // DB에서 사용하고 있는 user 이름
        password: '1234',   // DB에서 사용하고 있는 user password
        database: 'tb'    // 생성한 데이터베이스 이름
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