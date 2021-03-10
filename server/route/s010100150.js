const express = require('express');
const app = express();
const router = express.Router();
const dbconfig = require('../config/database.js')();
const connection = dbconfig.init();

let session = require('express-session');   
let FileStore = require('session-file-store')(session);    
let fileStoreOptions = {}; 

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

router.post('/userLogin', (req, res) => {
  
    let email = req.body.email;
    let password = req.body.password;

    let sql = 'SELECT COUNT(*) AS USER FROM TB_S10_EMP010 WHERE EMP_EMAIL = "'+ email+'" AND PWD = "'+password+'"';
    // console.log(sql);

    connection.query(sql, (error, rows) => {// 쿼리문
      if(error) throw error;
      // console.log(rows)
      if(rows[0].USER == 1){

        let loginInfo = 'SELECT EMP_EMAIL,CEO_FLAG,MEMBER_ID FROM TB_S10_EMP010 WHERE EMP_EMAIL = "'+ email+'" AND PWD = "'+password+'"';

        connection.query(loginInfo, (error, row) => {
                  if (error) throw error;

                  req.session.CEO_FLAG = row[0].CEO_FLAG;
                  req.session.MEMBER_ID = row[0].MEMBER_ID;
                  req.session.isLogined = true;

                  req.session.save(()=>{
                  res.send({loginResult:true, cf:req.session.cf, mI:req.session.MEMBER_ID});
                  
                  })
                 
              });
        
      }else{
        return res.send({loginResult:false});
      }

    })
   
})



router.post('/session', (req, res) => {

  if (error) {
    setImmediate(() => {
      next(new Error(error));
    })
  } else{

    let loginInfo = 'SELECT EMP_EMAIL,CEO_FLAG,MEMBER_ID FROM TB_S10_EMP010 WHERE EMP_EMAIL = "' + email + '" AND PWD = "' + password + '"';

    connection.query(loginInfo, (error, row) => {
      if (error) {
        setImmediate(() => {
          next(new Error(error));
        })
      } else {
        res.send({ success: true, rows });


        req.session.CEO_FLAG = row[0].CEO_FLAG;
        req.session.MEMBER_ID = row[0].MEMBER_ID;
        req.session.isLogined = true;

        req.session.save(() => {
          res.send({ loginResult: true, cf: req.session.cf, mI: req.session.MEMBER_ID });

        })
      }

    });

  }

})

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