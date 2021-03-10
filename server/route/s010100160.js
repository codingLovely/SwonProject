const express = require('express');
const router = express.Router();

const dbconfig = require('../config/database.js')();
const connection = dbconfig.init();

router.post('/contractTp',(req,res)=>{
    let sql = 'SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = "CONTRACT_TP"';

    connection.query(sql, (error, rows) => {//쿼리문
        if (error){
            setImmediate(()=>{
                next(new Error(error));
            })
        }else{
            res.send({ success: true, rows });
        }
       
    });
})

router.post('/contractSt',(req,res)=>{
    let sql = 'SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = "CONTRACT_ST"';

    connection.query(sql, (error, rows) => {//쿼리문
        if (error){
            setImmediate(()=>{
                next(new Error(error));
            })
        }else{
            res.send({ success: true, rows });
        }
      
    });
})

router.post('/search',(req,res)=>{
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    let contractTp = req.body.contractTp;
    let contractSt = req.body.contractSt;
    

    let sql =  'SELECT '+
                        'MEM.MEMBER_NM, '+
                        'MEM.REG_NO,'+
                        'CODE1.CD_V "MEMBER_TP",'+   
                        'CON.CONTRACT_ID,'+
                        'DATE_FORMAT(CON.END_DATE,"%y.%m.%d") AS "END_DATE", '+
                        'DATE_FORMAT(CON.CONTRACT_DATE,"%y.%m.%d") AS "CONTRACT_DATE", '+
                        'CODE2.CD_V_MEANING AS "MEMBER_ST",  '+
                        'CODE3.CD_V_MEANING AS"CONTRACT_TP",   '+
                        'CODE5.CD_V_MEANING AS "CONTRACT_LOCKER", '+  
                        'CODE4.CD_V_MEANING AS "CONTRACT_ROOM",  '+ 
                        'CON.CONTRACT_TERM, '+
                        'CON.PAY_DATE, '+
                        'CON.MONTHLY_FEE, '+     
                        '(SELECT CD_V_MEANING '+
                        '   FROM TB_S10_CODE'+
                        '  WHERE CD_TP = "CONTRACT_ST"'+
                        '    AND CD_V = CON.END_FLAG )CONTRACT_ST, '+  
                        'CON.MONTHLY_FEE, '+ 
                        'DATE_FORMAT(CON.START_DATE,"%y.%m.%d") AS "START_DATE" '+
                'FROM TB_S10_MEMBER010 MEM  '+  
                        'INNER JOIN TB_S10_CONTRACT010 CON   '+   
                        'ON MEM.MEMBER_ID = CON.MEMBER_ID   '+ 
                        'LEFT OUTER JOIN TB_S10_CODE code1 ON MEM.MEMBER_TP = CODE1.CD_V '+     
                        'AND CODE1.CD_TP = "MEMBER_TP"  '+  
                        'LEFT OUTER JOIN TB_S10_CODE code2 ON MEM.MEMBER_ST = CODE2.CD_V '+     
                        'AND CODE2.CD_TP = "MEMBER_ST" '+ 
                        'LEFT OUTER JOIN TB_S10_CODE CODE3 ON CON.CONTRACT_TP = CODE3.CD_V  '+    
                        'AND CODE3.CD_TP = "CONTRACT_TP" AND CODE3.ATTRIBUTE1 = "CONTRACT" '+  
                        'LEFT OUTER JOIN TB_S10_CODE code4 ON CON.CONTRACT_ROOM = CODE4.CD_V '+     
                        'LEFT OUTER JOIN TB_S10_CODE code5 ON CON.CONTRACT_LOCKER = CODE5.CD_V '+     
                        'AND CODE5.CD_TP = "L"'+
                        'WHERE CON.CONTRACT_DATE BETWEEN DATE_FORMAT("' + startDate + '","%y.%m.%d") AND  DATE_FORMAT("' + endDate + '","%y.%m.%d")'
                       
                if (contractTp != null && contractTp != "" && contractTp != "전체")// null아니고 전체가 아닐 때, null 아니고 공백이 아닐때
                sql += ' AND CON.CONTRACT_TP = "' + contractTp + '" '
                if (contractSt != null && contractSt != "" && contractSt != "전체" && contractSt != "Y")
                sql += ' AND MEM.MEMBER_ST = "' + contractSt + '" AND CON.END_FLAG = "N"'
                if (contractSt == "Y") 
                sql += ' AND CON.END_FLAG ="Y"'

    connection.query(sql, (error, rows) => {//쿼리문
        if (error){
            setImmediate(()=>{
                next(new Error(error));
            })
        }else{
            res.send({ success: true, rows });
        }
      
    });
})




module.exports = router;