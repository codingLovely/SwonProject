const express = require('express');
const router = express.Router();
const dbconfig = require('../config/database.js')();
const connection = dbconfig.init();
const moment = require('moment');

/** S010100140 */

// 상세보기
router.get('/tb_s10_ask010_by_id', (req, res, next) => {

    let type = req.query.type;
    let rNum = req.query.id;
 
    let sql =
        'SELECT ' +
        '   ASK010.ASK_ID' +
        ',  CODE1.CD_V AS "ASK_TP"' +
        ',  ASK010.ASK_DATE AS "ASK_DATE"' +
        ',  CODE2.CD_V AS "ASK_METHOD"' +
        ',  CODE3.CD_V AS "ASK_PATH"' +
        ',  ASK010.ASK_NAME' +
        ',  ASK_INFO ' +
        ',  ASK_CONTENT ' +
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
        '    AND CODE3.ATTRIBUTE2 = "ASK"' +
        ' WHERE ASK_ID = ' + rNum


    
    connection.query(sql,(error,rows) => {  //쿼리문
        if (error){
            setImmediate(() => {
                next(new Error(error))
            })
            //next(error);
        }else{
            res.send({ success: true, rows });
        } 
        
    });
})



// 상담등록
router.post('/insert', (req, res, next) => {

    let sql =
        'INSERT INTO ' +
        'TB_S10_ASK010 ( ASK_TP, ASK_DATE, ASK_METHOD, ASK_PATH, ASK_NAME, ASK_INFO, ASK_CONTENT,CREATED_DATE,CREATED_PROGRAM_ID,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID ) ' +
        'VALUES ( ?, ?, ?, ?, ?, ?, ?, sysdate(),"s010100140",sysdate(),"s010100140")';

    let ask_tp = req.body.modalAskTp;
    let ask_date = req.body.modalAskDate.toString().substring(0, 10);
    let ask_method = req.body.modalAskMethod;
    let ask_path = req.body.modalAskPath;
    let ask_name = req.body.modalAskName;
    let ask_info = req.body.modalAskInfo;
    let ask_content = req.body.modalAskContent;


    let params = [ask_tp, ask_date, ask_method, ask_path, ask_name, ask_info, ask_content];
   
    connection.query(sql, params, (error) => {  //쿼리문
        if (error){
            setImmediate(() => {
                next(new Error(error))
            })
            //next(error);
        }else{
            res.send({ success: true });
        } 
        
    });
})


// 상담수정
router.post('/modify', (req, res, next) => {

    let ask_id = req.body.modalAskId;
    let ask_tp = req.body.modalAskTp;
    let ask_date = req.body.modalAskDate.toString().substring(0, 10);
    let ask_method = req.body.modalAskMethod;
    let ask_path = req.body.modalAskPath;
    let ask_name = req.body.modalAskName;
    let ask_info = req.body.modalAskInfo;
    let ask_content = req.body.modalAskContent;

    let sql =
        'UPDATE ' +
        '   TB_S10_ASK010 ' +
        'SET ASK_TP="' + ask_tp + '",' +
        '   ASK_DATE="' + ask_date + '",' +
        '   ASK_METHOD="' + ask_method + '",' +
        '   ASK_PATH="' + ask_path + '",' +
        '   ASK_NAME="' + ask_name + '",' +
        '   ASK_INFO="' + ask_info + '",' +
        '   ASK_CONTENT="' + ask_content + '",' +
        '   LAST_UPDATE_DATE = sysdate(),' +
        '   LAST_UPDATE_PROGRAM_ID = "s010100140"' +
        ' WHERE ASK_ID=' + ask_id +
        '   LIMIT 1'

    connection.query(sql, (error, rows) => {  //쿼리문
        if (error){
            setImmediate(() => {
                next(new Error(error))
            })
            //next(error);
        }else{
            res.send({ success: true,rows });
        } 
    });

})

// s010100140 selectBox
router.post('/selectTest', (req, res, next) => {
    let firstVal = req.body.firstVal;
    let secondVal = req.body.secondVal;

    let sql = `SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = '${firstVal}' AND ATTRIBUTE2 = '${secondVal}'`;

    connection.query(sql, (error, rows) => {
        if (error){
            setImmediate(() => {
                next(new Error(error))
            })
            //next(error);
        }else{
            res.send({ success: true, rows });
        } 
       
    });
})

 
module.exports = router;