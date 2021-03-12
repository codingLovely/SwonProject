const express = require('express');
const app = express();
const router = express.Router();
const dbconfig = require('../config/database.js')();
const connection = dbconfig.init();
const bcrypt = require('bcrypt');                                                    

let session = require('express-session');  
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let MySQLStore = require('express-mysql-session')(session); 
let options ={                                                
  host: 'localhost',
        port: '3306',
        user: 'root', 
        password: '1234',  
        database: 'tb'   
};


let sessionStore = new MySQLStore(options);                   

router.use(session({                                              
  secret:"asDsFGdfasf!!@fdas",
  resave:false,
  saveUninitialized:true,
  store:sessionStore                                      
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

   let pwdSql = 'SELECT PWD, COUNT(*)AS COUNT FROM Tb_S10_EMP010 WHERE EMP_EMAIL = "'+ email+'"';
      
    connection.query(pwdSql, (error, row) => {
        if (error) throw error;
        //console.log('row',row);
        // 가입회원이 없는 경우
        if(row[0].COUNT === 0){
          //console.log('row[0]가입회원없음',row[0]); 
          return res.send({loginResult:false});

        }else if(row[0].COUNT === 1 && PWD === null){
          
          console.log('비밀번호 맞지 않음',row[0]);
          return res.send({pwdResult:false});
        
        }else{
        
        let hashPwd = row[0].PWD;

        bcrypt.compare(password, hashPwd, function(err, result) {  
           
          if (error) throw error;
          
          if(result == true) {
            let loginInfo = 'SELECT EMP_EMAIL,CEO_FLAG,MEMBER_ID FROM TB_S10_EMP010 WHERE EMP_EMAIL = "'+ email+'" AND PWD = "'+hashPwd+'"';

                    connection.query(loginInfo, (error, row) => {
                              if (error) throw error;
                              console.log('row',row[0].CEO_FLAG);
                             
            
                              req.session.CEO_FLAG = row[0].CEO_FLAG;
                              req.session.MEMBER_ID = row[0].MEMBER_ID;
                              req.session.isLogined = true;
            
                              req.session.save(()=>{
                                res.send({loginResult:true, cf:req.session.CEO_FLAG, mI:req.session.MEMBER_ID});
                              })
                             
                          });
                       
          }else if(result == false){
               return res.send({loginResult:false});
          }          
          
      });
    }
    });
  


})



// passport.serializeUser(function(user, done) {
//   console.log("serializeUser ", user)
//   done(null, user.ID);
// });

// passport.deserializeUser(function(id, done) {
//     console.log("deserializeUser id ", id)
//     let userinfo;
//     let sql = 'SELECT * FROM TB_S10_EMP010 WHERE ID=?';
//     connection.query(sql , [id], function (err, result) {
//       if(err) console.log('mysql 에러');     
     
//       console.log("deserializeUser mysql result : " , result);
//       let json = JSON.stringify(result[0]);
//       userinfo = JSON.parse(json);
//       done(null, userinfo);
//     })    
// });



// passport.use(new LocalStrategy({
//   usernameField: 'email',
//   passwordField: 'password'
//   },
//   function(username, password, done){
//     console.log('ggggggggggggggggg1');
    
//     let sql = 'SELECT EMP_EMAIL,CEO_FLAG,MEMBER_ID FROM TB_S10_EMP010 WHERE EMP_EMAIL = ? AND PWD = ?';
//     params = [username, password]
//     connection.query(sql ,  params, function (err, result) {
//       if(err) console.log('mysql 에러');  
//       console.log('gggggggggggggggg2g');
//       // 입력받은 ID와 비밀번호에 일치하는 회원정보가 없는 경우   
//       if(result.length === 0){
//         console.log("결과 없음");
//         console.log('ggggggggggggggg3gg');
//         return done(null, false, { message: 'Incorrect' });
//       }else{
//         console.log(result);
//         console.log('gggggggggggggggg4g');
//         let json = JSON.stringify(result[0]);
//         let userinfo = JSON.parse(json);
//         console.log("userinfo " + userinfo);
//         return done(null, userinfo);  // result값으로 받아진 회원정보를 return해줌
//       }
//     })






//   }
// ))






router.post('/userLogout', (req, res) => {

  req.session.destroy(function(err){
    if(err){
       console.log(err);
    }else{
      req.session = null;
      res.send({logoutResult: true});
    }
 });

})

router.post('/findPwd', (req, res) => {

  let email = req.body.email;
  let fstResidentRegiNum = req.body.fstResidentRegiNum;
  let sndResidentRegiNum = req.body.sndResidentRegiNum;

  let countSql = 'SELECT COUNT(*) AS "COUNT" FROM TB_S10_EMP010 WHERE EMP_EMAIL="'+email+'" AND REG_NUMBER1 = '+fstResidentRegiNum+' AND REG_NUMBER2 = '+sndResidentRegiNum;
  console.log('countSql',countSql);
  connection.query(countSql, (error, rows) => {
    if(error) throw error;
    console.log(rows);
    if(rows[0].COUNT === 1){
      let sql = 'DELETE FROM TB_S10_EMP010 WHERE EMP_EMAIL="'+email+'" AND REG_NUMBER1 = '+fstResidentRegiNum+' AND REG_NUMBER2 = '+sndResidentRegiNum;

      connection.query(sql, function(err, rows){          
              res.send({success:true})
             })
    }else{
      res.send({ success: false, rows });
    }
  });
  

  })
  
module.exports = router;