const express = require('express');
const router = express.Router();

const dbconfig = require('../config/database.js')();
const connection = dbconfig.init();


/** S010100130  */

// 문의구분
router.post('/ask_tp', (req, res) => {
    
    let sql = 'SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = "CONTRACT_TP" AND ATTRIBUTE2="ASK"';
    connection.query(sql, (error, rows) => {  
        if (error) throw error;
        res.send({ success: true, rows });
    });
})

// 검색하기
router.post('/search', (req, res) => {
   
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
        '   AND ASK010.LAST_DELETE_FLAG IS NULL ';

    if (ask_tp != null && ask_tp != "" && ask_tp != "전체")// null아니고 전체가 아닐 때, null 아니고 공백이 아닐때
        sql += ' AND ASK010.ASK_TP= "' + ask_tp + '" ';
    if (searchName != null && searchName != "")
        sql += ' AND ASK010.ASK_NAME LIKE "%' + searchName + '%"'
        
        sql += ' ORDER BY ASK010.ASK_ID DESC';

    connection.query(sql, (error, rows) => {
        if (error) throw error;

        res.send({ success: true, rows });
    })
})

// 삭제하기
router.post('/delete', (req, res) => {
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
            if (error) throw error;
        });

    }
    res.send({ success: true })

})




/** S010100140 */

// 상세보기
router.get('/tb_s10_ask010_by_id', (req, res) => {

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

    connection.query(sql, (error, rows) => {//쿼리문
        if (error) throw error;
        res.send({ success: true, rows });
        
    });

})



// 상담등록
router.post('/insert', (req, res) => {

    let sql =
        'INSERT INTO ' +
        'TB_S10_ASK010 ( ASK_TP, ASK_DATE, ASK_METHOD, ASK_PATH, ASK_NAME, ASK_INFO, ASK_CONTENT,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID ) ' +
        'VALUES ( ?, ?, ?, ?, ?, ?, ?, sysdate(),"s010100140")';

    let ask_tp = req.body.modalAskTp;
    let ask_date = req.body.modalAskDate.toString().substring(0, 10);
    let ask_method = req.body.modalAskMethod;
    let ask_path = req.body.modalAskPath;
    let ask_name = req.body.modalAskName;
    let ask_info = req.body.modalAskInfo;
    let ask_content = req.body.modalAskContent;


    let params = [ask_tp, ask_date, ask_method, ask_path, ask_name, ask_info, ask_content];

    connection.query(sql, params, (error) => {  //쿼리문
        if (error) throw error;
        res.send({ success: true });
    });
})


// 상담수정
router.post('/modify', (req, res) => {

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
        if (error) throw error;
        res.send({ success: true, rows });
    });

})

// s010100140 selectBox
router.post('/selectTest', (req, res) => {
    let firstVal = req.body.firstVal;
    let secondVal = req.body.secondVal;

    let sql = `SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = '${firstVal}' AND ATTRIBUTE2 = '${secondVal}'`;

    connection.query(sql, (error, rows) => {
        res.send({ success: true, rows });
    });
})

// //<2-3.상담현황(s010100130) 조회
// app.get('/api/s010100130', (req, res) => {

//     let sql =
//         'SELECT ' +
//         'ASK010.ASK_ID' +
//         ', CODE1.CD_V_MEANING AS "ASK_TP"' +
//         ', DATE_FORMAT(ASK010.ASK_DATE,"%y-%m-%d") AS "ASK_DATE"' +
//         ', CODE2.CD_V_MEANING AS "ASK_METHOD"' +
//         ', CODE3.CD_V_MEANING AS "ASK_PATH"' +
//         ', ASK010.ASK_NAME' +
//         ', ASK_INFO ' +
//         'FROM TB_S10_ASK010 ASK010' +
//         ' LEFT JOIN TB_S10_CODE CODE1' +
//         ' ON ASK010.ASK_TP = CODE1.CD_V' +
//         ' AND CODE1.CD_TP = "CONTRACT_TP"' +
//         ' AND CODE1.ATTRIBUTE2 = "ASK"' +
//         ' LEFT OUTER JOIN TB_S10_CODE CODE2' +
//         ' ON ASK010.ASK_METHOD = CODE2.CD_V' +
//         ' AND CODE2.CD_TP = "ASK_METHOD"' +
//         ' LEFT OUTER JOIN TB_S10_CODE CODE3' +
//         ' ON ASK010.ASK_PATH = CODE3.CD_V' +
//         ' AND CODE3.CD_TP = "ACCESS_PATH"' +
//         ' AND CODE3.ATTRIBUTE2 = "ASK"' +
//         ' WHERE ASK010.ASK_DATE BETWEEN DATE_FORMAT("2021/01/24","%y-%m-%d") AND DATE_FORMAT("2021/01/24","%y-%m-%d") ';

//     //상담등록(TB_S10_ASK010 에 들어있는 모든 데이터 가져오기)
//     connection.query(sql, (error, rows) => {
//         if (error) throw error;
//         res.send({ success: true, rows });
//         console.log('전체조회rows:' + rows);
//     });

// })
// //2-3끝>


module.exports = router;