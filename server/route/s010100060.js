const express = require('express');
const router = express.Router();

const dbconfig = require('../config/database.js')();
const connection = dbconfig.init();
const moment = require('moment');
// 납부 현황

router.post('/list', (req, res) => {

    const startDate = moment(req.body.startDate).format('YYYY-MM-DD');
    const endDate = moment(req.body.endDate).format('YYYY-MM-DD');
    let userName = req.body.userName;
    let paymentStatus = req.body.paymentStatus;

    // console.log('startDate', startDate);
    // console.log(' endDate', endDate);
    // console.log(' userName', userName);
    // console.log(' paymentStatus', paymentStatus);



    let sql = 'SELECT     ' +
        '                   MEM.MEMBER_NM, ' +
        '                   date_format(CON2.PAY_PLAN_DATE,"%y.%m.%d") AS "PAY_PLAN_DATE", ' +
        '                   CON2.PAYED_FLAG, ' +
        '                   date_format(CON2.PAYED_DATE,"%y.%m.%d") AS "PAYED_DATE", ' +
        '                   date_format(CON.START_DATE,"%y.%m.%d") AS "START_DATE", ' +
        '                   date_format(CON.END_DATE,"%y.%m.%d") AS "END_DATE", ' +
        '                   EMP.NAME, ' +
        '                   EMP.EMP_HP, ' +
        '                   EMP.EMP_EMAIL, ' +
        '                   CON2.CONTRACT_ID ' +
        '      FROM TB_S10_MEMBER010 MEM ' +
        '           INNER JOIN TB_S10_EMP010 EMP ' +
        '           ON MEM.CEO_ID = EMP.EMP_ID ' +
        '           INNER JOIN TB_S10_CONTRACT010 CON ' +
        '           ON CON.MEMBER_ID = MEM.MEMBER_ID ' +
        '           INNER JOIN TB_S10_CONTRACT020 CON2 ' +
        '           ON CON2.CONTRACT_ID = CON.CONTRACT_ID ' +
        ' WHERE CON2.PAY_PLAN_DATE BETWEEN date_format("' + startDate + '","%y.%m.%d") AND date_format("' + endDate + '","%y.%m.%d") '


    if (userName != null && userName != "" && userName != "undefined")
        sql += ' AND MEM.MEMBER_NM LIKE "%' + userName + '%" ';
    if (paymentStatus != null && paymentStatus != "" && paymentStatus != "undefined"&& paymentStatus != "전체")
        sql += ' AND CON2.PAYED_FLAG = "' + paymentStatus + '"';

    sql += ' AND CON.CONTRACT_ST = "C" ORDER BY CON2.CONTRACT_ID DESC';


    console.log('sql',sql);
    connection.query(sql, (error, rows) => {
        if (error){
            setImmediate(()=>{
                next(new Error(error));
            })
        }else{
            res.send({ success: true, rows });
        }
        //console.log('전체조회rows:' + rows);
    });

})

module.exports = router;
