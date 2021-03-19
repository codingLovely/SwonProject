const express = require('express');
const app = express();
const router = express.Router();
const dbconfig = require('../config/database.js')();
const connection = dbconfig.init();
const moment = require('moment');
const bcrypt = require('bcrypt');

let session = require('express-session');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let MySQLStore = require('express-mysql-session')(session);
let options = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '1234',
  database: 'tb'
};


let sessionStore = new MySQLStore(options);

router.use(session({
  secret: "asDsFGdfasf!!@fdas",
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}))
let passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
const { convertCompilerOptionsFromJson } = require('typescript');

app.use(passport.initialize());
app.use(passport.session());



// router.post('/userLogin', (req, res, next) => {

//     let email = req.body.email;
//     let password = req.body.password;

//     let sql = 'SELECT COUNT(*) AS USER FROM TB_S10_EMP010 WHERE EMP_EMAIL = "'+ email+'" AND PWD = "'+password+'"';
//     // console.log(sql);
//     connection.query(sql, (error, rows) => {// 쿼리문
//       if(error) throw error;
//        console.log(rows[0].USER )
//       if(rows[0].USER == 1){

//         let loginInfo = 'SELECT EMP_EMAIL,CEO_FLAG,MEMBER_ID FROM TB_S10_EMP010 WHERE EMP_EMAIL = "'+ email+'" AND PWD = "'+password+'"';

//         connection.query(loginInfo, (error, row) => {
//                   if (error) throw error;
//                   console.log('row',row[0].CEO_FLAG);


//                   req.session.CEO_FLAG = row[0].CEO_FLAG;
//                   req.session.MEMBER_ID = row[0].MEMBER_ID;
//                   req.session.isLogined = true;

//                   req.session.save(()=>{
//                     res.send({loginResult:true, cf:req.session.CEO_FLAG, mI:req.session.MEMBER_ID});
//                   })

//               });

//       }else{
//         return res.send({loginResult:false});
//       }

//     })

// })

router.post('/userLogin', (req, res, next) => {

  let email = req.body.email;
  let password = req.body.password;

  let pwdSql = 'SELECT PWD, COUNT(*)AS COUNT FROM Tb_S10_EMP010 WHERE EMP_EMAIL = "' + email + '"';

  connection.query(pwdSql, (error, row) => {

    // 쿼리 에러시
    if (error) {
      setImmediate(() => {
        next(new Error(error));
      })
    // 아닐 경우
    }else{
      // pwdSql결과 / 회원이 없을 때(count : 0)
      if (row[0].COUNT === 0) {
        // 에러시
        if (error) {
          setImmediate(() => {
            next(new Error(error));
          })
        // 아닐시
        }else {
          return res.send({ loginResult: false })
        }
      // pwdSql결과 /회원이 있을 때 /비밀번호 틀렸을 때    
      } else if (row[0].COUNT === 1 && row[0].PWD === null) {
        console.log('비밀번호 맞지 않음', row[0]);
        //에러시
        if (error) {
          setImmediate(() => {
            next(new Error(error));
          })
        //아닐시 pwdResult false
        } else {
          return res.send({ pwdResult: false });
        }
      // 회원이 있는 경우 
      }else {
        // DB에 저장된 암호화된 비밀번호 가져오기
        let hashPwd = row[0].PWD;

        // 입력한 암호화된 비밀번호와, DB 해시함수 비교
        bcrypt.compare(password, hashPwd, function (error, result) {
          // 에러시
          if (error) {
            setImmediate(() => {
              next(new Error(error));
            });
          }

          // true -> 일치하는 경우
          if (result == true) {
            let loginInfo = 'SELECT EMP_EMAIL,CEO_FLAG,MEMBER_ID FROM TB_S10_EMP010 WHERE EMP_EMAIL = "' + email + '" AND PWD = "' + hashPwd + '"';
            //세션에 사용자 값 저장
            connection.query(loginInfo, (error, row) => {
              // 에러시
              if (error) {
                setImmediate(() => {
                  next(new Error(error));
                });
              }else{
                req.session.CEO_FLAG = row[0].CEO_FLAG;
                req.session.MEMBER_ID = row[0].MEMBER_ID;
                req.session.isLogined = true;

                req.session.save(() => {
                  res.send({ loginResult: true, cf: req.session.CEO_FLAG, mI: req.session.MEMBER_ID });
                })
              }
            });//connectionQuery
          // 일치하지 않을 경우 
          } else if (result == false) {
            // 에러시
            if (error) {
              setImmediate(() => {
                next(new Error(error));
              });
            // 아닌경우
            }else{
              return res.send({ loginResult: false });
            }
          }
        });// bycrpt.compare
      }// 회원있는경우 else
    }// 쿼리에러아닐시 else
  });// connection.query
})


router.post('/userLogout', (req, res) => {

  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      req.session = null;
      res.send({ logoutResult: true });
    }
  });

})

router.post('/findPwd', (req, res) => {

  let email = req.body.email;
  let fstResidentRegiNum = req.body.fstResidentRegiNum;
  let sndResidentRegiNum = req.body.sndResidentRegiNum;

  let countSql = 'SELECT COUNT(*) AS "COUNT" FROM TB_S10_EMP010 WHERE EMP_EMAIL="' + email + '" AND REG_NUMBER1 = ' + fstResidentRegiNum + ' AND REG_NUMBER2 = ' + sndResidentRegiNum;
 
  connection.query(countSql, (error, rows) => {
    if (error) throw error;
    console.log(rows);
    if (rows[0].COUNT === 1) {
      let sql = 'DELETE FROM TB_S10_EMP010 WHERE EMP_EMAIL="' + email + '" AND REG_NUMBER1 = ' + fstResidentRegiNum + ' AND REG_NUMBER2 = ' + sndResidentRegiNum;

      connection.query(sql, function (err, rows) {
        res.send({ success: true })
      })
    } else {
      res.send({ success: false, rows });
    }
  });
})



module.exports = router;