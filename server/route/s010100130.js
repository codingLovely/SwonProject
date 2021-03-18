const express = require('express');
const router = express.Router();
const dbconfig = require('../config/database.js')();
const connection = dbconfig.init();




// 검색하기
router.post('/search', (req, res, next) => {
   
    let startDate = req.body.startAsk_date.toString().substring(0, 10);
    let endDate = req.body.endAsk_date.toString().substring(0, 10);
    let ask_tp = req.body.ask_tp;
    let searchName = req.body.ask_name;


    let sql =
        'SELECT ' +
        '   ASK010.ASK_ID' +
        ',  CODE1.CD_V_MEANING AS "ASK_TP"' +
        ',  DATE_FORMAT(ASK010.ASK_DATE,"%y-%m-%d") AS "ASK_DATE"' +
        ',  CODE2.CD_V_MEANING AS "ASK_METHOD"' +
        ',  CODE3.CD_V_MEANING AS "ASK_PATH"' +
        ',  ASK010.ASK_NAME' +
        ',  ASK_INFO ' +
        'FROM TB_S10_ASK010 ASK010' +
        '   LEFT JOIN TB_S10_CODE CODE1' +
        '   ON ASK010.ASK_TP = CODE1.CD_V' +
        '   AND CODE1.CD_TP = "CONTRACT_TP"' +
        '   AND CODE1.ATTRIBUTE2 = "ASK"' +
        '   LEFT OUTER JOIN TB_S10_CODE CODE2' +
        '   ON ASK010.ASK_METHOD = CODE2.CD_V' +
        '   AND CODE2.CD_TP = "ASK_METHOD"' +
        '   LEFT OUTER JOIN TB_S10_CODE CODE3' +
        '   ON ASK010.ASK_PATH = CODE3.CD_V' +
        '   AND CODE3.CD_TP = "ACCESS_PATH"' +
        '   AND CODE3.ATTRIBUTE2 = "ASK"' +
        'WHERE ASK010.ASK_DATE BETWEEN DATE_FORMAT("' + startDate + '","%y-%m-%d") AND  DATE_FORMAT("' + endDate + '" ,"%y-%m-%d")'+
        'AND ASK010.LAST_DELETE_FLAG IS NULL ';

    if (ask_tp != null && ask_tp != "" && ask_tp != "전체")// null아니고 전체가 아닐 때, null 아니고 공백이 아닐때
        sql += ' AND ASK010.ASK_TP= "' + ask_tp + '" ';
    if (searchName != null && searchName != "")
        sql += ' AND ASK010.ASK_NAME LIKE "%' + searchName + '%"'
        
        sql += ' ORDER BY ASK010.ASK_ID DESC';

    connection.query(sql, (error, rows) => {
        if (error){
            setImmediate(()=>{
                next(new Error(error));
            })
        }else{
            res.send({ success: true, rows });
        }
    })
})


// 문의구분
router.post('/ask_tp', (req, res, next) => {
    
    let sql = 'SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = "CONTRACT_TP" AND ATTRIBUTE2="ASK"';
    connection.query(sql, (error, rows) => {  
        if (error){
            setImmediate(()=>{
                next(new Error(error));
            })
        }else{
            res.send({ success: true, rows });
        }
        
    });
})



// 삭제하기
router.post('/delete', (req, res, next) => {
    let askIdArray = req.body;
    let sql = '';
   
    // 배열에 담겨있는 숫자 분리해서 넣기
    for (let i = 0; i < askIdArray.length; i++) {

        sql =
            'UPDATE ' +
            ' TB_S10_ASK010 ' +
            'SET LAST_DELETE_FLAG = "*",' +
            ' LAST_DELETE_DATE = sysdate(),' +
            ' LAST_UPDATE_DATE = sysdate(),' +
            ' LAST_UPDATE_PROGRAM_ID = "s010100130"' +
            'WHERE ASK_ID=' + askIdArray[i] +
            ' LIMIT 1';

        connection.query(sql, (error) => {
            if (error){
                setImmediate(()=>{
                    next(new Error(error));
                })
                
            }else{
                
                if((askIdArray[askIdArray.length - 1] === askIdArray[i])){
                    res.send({ success: true })    
                }
            }
        });

    }
   

})

module.exports = router;