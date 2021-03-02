const express = require('express');
const router = express.Router();

const dbconfig = require('../config/database.js')();
const connection = dbconfig.init();


router.post('/userLogin', (req, res) => {
  
    let email = req.body.email;
    let password = req.body.password;

    let sql = 'SELECT COUNT(*) AS USER FROM TB_S10_EMP010 WHERE EMP_EMAIL = "'+ email+'" AND PWD = "'+password+'"';
    console.log(sql);
    connection.query(sql, (error, rows) => {//쿼리문
      if(error) throw error;
      console.log(rows)
      if(rows[0].USER == 1){
        return res.send({loginResult:true});
      }else{
        return res.send({loginResult:false});
      }
    })

    
    // let email = req.body.email;
    // let password = req.body.password;

    // let sql = 'SELECT COUNT(EMP_EMAIL) AS "EMP_EMAIL",COUNT(PWD) AS "EMP_PWD" FROM TB_S10_EMP010 WHERE EMP_EMAIL = "'+ email+'" OR PWD = "'+password+'"';
    // console.log(sql);
    // connection.query(sql, (error, rows) => {//쿼리문
    //   if(error) throw error;
    //   console.log(rows);
    //   console.log(rows[0].EMP_EMAIL);

    //   console.log('rows[0].EMP_EMAIL && rows[0].PWD',rows[0].EMP_EMAIL && rows[0].PWD);
    //   if((rows[0].EMP_EMAIL== 1 && rows[0].PWD) == 1){
    //     return res.send({loginResult:true});

    //   }else if(rows[0].EMP_EMAIL == 1 && rows[0].PWD == 0){
    //     return res.send({loginResult:'nonePwd'});

    //   }else if(!rows[0].EMP_EMAIL == 0 && rows[0].PWD == 1){        
    //     return res.send({loginResult:'noneEmail'});

    //   }else{
    //     return res.send({loginResult:false});
    //   }
    // })

})

// router.post('/userLogin',(req,res)=>{

//   let EMP_EMAIL = req.body; 
//   let PWD =req.body;
//     bcrypt.hash(PW1, null, null, function(err, hash){     

//       let sql ='INSERT INTO TB_S10_EMP010(EMP_EMAIL,PWD) VALUES (?,?)';
//       let params =[EMP_EMAIL,PWD]; 

//       connection.query(sql, params, function(err, rows){          
//       res.send({success:true})
//      })
//    })
// })




module.exports = router;