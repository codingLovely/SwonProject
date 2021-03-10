const express = require('express');
const router = express.Router();
const dbconfig = require('../config/database.js')();
const connection = dbconfig.init();


router.post('/findPwd', (req, res) => {

  let email = req.body.email;
  let fstResidentRegiNum = req.body.fstResidentRegiNum;
  let sndResidentRegiNum = req.body.sndResidentRegiNum;

  let countSql = 'SELECT COUNT(*) AS "COUNT" FROM TB_S10_EMP010 WHERE EMP_EMAIL="'+email+'" AND REG_NUMBER1 = '+fstResidentRegiNum+' AND REG_NUMBER2 = '+sndResidentRegiNum;
  console.log('countSql',countSql);
  connection.query(countSql, (error, rows) => {
    if (error){
        setImmediate(()=>{
            next(new Error(error));
        })
    }else{
        console.log(rows);
        if(rows[0].COUNT === 1){
          let sql = 'DELETE FROM TB_S10_EMP010 WHERE EMP_EMAIL="'+email+'" AND REG_NUMBER1 = '+fstResidentRegiNum+' AND REG_NUMBER2 = '+sndResidentRegiNum;
    
          connection.query(sql, function(err, rows){          
                  res.send({success:true})
                 })
        }else{
          res.send({ success: false, rows });
        }
    }
   
  });
  

  })
  
module.exports = router;