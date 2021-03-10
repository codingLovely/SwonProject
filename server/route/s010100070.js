const express = require('express');
const router = express.Router();

const dbconfig = require('../config/database.js')();
const connection = dbconfig.init();

// 납부 현황

router.post('/list', (req, res) => {

    let startDate = req.body.startDate.toString().substring(0, 10);;
    let endDate = req.body.endDate.toString().substring(0, 10);;
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


    if (userName != null && userName != "" && userName != "undefined")//null아니고 전체가 아닐때 때, null 아니고 공백이 아닐때
        sql += ' AND MEM.MEMBER_NM LIKE "%' + userName + '%" ';
    if (paymentStatus != null && paymentStatus != "" && userName != "undefined")
        sql += ' AND CON2.PAYED_FLAG = "' + paymentStatus + '"';

    sql += ' ORDER BY CON2.CONTRACT_ID DESC';

    connection.query(sql, (error, rows) => {
        if (error) {
            setImmediate(() => {
                next(new Error(error));
            })
        } else {
            res.send({ success: true, rows });
        }
        //console.log('전체조회rows:' + rows);
    });

})


router.get('/insert/tb_s10_contract020_by_id', (req, res) => {

    let type = req.query.type;
    let dataContracId = req.query.id;

    let sql =
        'SELECT EMP.NAME, EMP.EMP_HP, EMP.EMP_EMAIL, ' +
        '       MEM.MEMBER_NM, CODE1.CD_V_MEANING AS "MEMBER_ST", ' +
        '       DATE_FORMAT(CON.START_DATE,"%y-%m-%d") AS "START_DATE",' +
        '       DATE_FORMAT(CON.END_DATE,"%y-%m-%d" ) AS "END_DATE",' +
        '       DATE_FORMAT(PCON.PAYED_DATE,"%y-%m-%d") AS "PAYED_DATE",' +
        '       CON.COMMENT, ' +
        '       CON.CONTRACT_TERM, ' +
        '       CON.PAY_METHOD,' +
        '       (SELECT CD_V_MEANING ' +
        ' FROM TB_S10_CODE ' +
        ' WHERE CD_TP = "PAY_METHOD" AND CD_V = CON.PAY_METHOD) AS "PAY_METHOD_M",' +
        '       DATE_FORMAT(PCON.PAY_PLAN_DATE,"%y-%m-%d") AS "PAY_PLAN_DATE", ' +
        '       PCON.CONTRACT_ID, ' +
        '       PCON.PAYED_FLAG, ' +
        '       PCON.CONTRACT_COMMENT ' +
        'FROM TB_S10_EMP010 EMP ' +
        'INNER JOIN TB_S10_MEMBER010 MEM ' +
        'ON EMP.EMP_ID = MEM.CEO_ID ' +
        'INNER JOIN TB_S10_CONTRACT010 CON ' +
        'ON MEM.MEMBER_ID = CON.MEMBER_ID ' +
        'INNER JOIN TB_S10_CONTRACT020 PCON ' +
        'ON CON.CONTRACT_ID = PCON.CONTRACT_ID ' +
        'LEFT JOIN TB_S10_CODE CODE1  ' +
        'ON MEM.MEMBER_ST = CODE1.CD_V  ' +
        'AND CODE1.CD_TP ="MEMBER_ST"  ' +
        'WHERE PCON.CONTRACT_ID = ' + dataContracId;

    connection.query(sql, (error, rows) => {//쿼리문
        //console.log(rows);
        if (error) {
            setImmediate(() => {
                next(new Error(error));
            })
        } else {
            res.send({ success: true, rows });
        }

    });

})


router.post('/paymentCancel', (req, res) => {

    let modalContractId = req.body.modalContractId;

    //체크된 값들
    // let newChecked = req.body.newChecked;
    let newChecked = req.body.checked;

    console.log('newChecked', newChecked);


    for (let i = 0; i < newChecked.length; i++) {
        //체크된 값 분리
        let newCheckedList = newChecked[i].split(",");
        //console.log('newCheckedList', newCheckedList);

        let chkPayPlanDate = newCheckedList[0];
        let chkPayDate = newCheckedList[1];
        let chkConComment = newCheckedList[2];
        //console.log('chkPayPlanDate', chkPayPlanDate);
        //console.log('chkPayDate', chkPayDate);
        //console.log('chkConComment', chkConComment);

        let sql =
            ' UPDATE TB_S10_CONTRACT020  ' +
            '        SET ' +
            '        PAYED_DATE ="0000-00-00", ' +
            '        PAYED_FLAG = "N", ' +
            '            LAST_UPDATE_DATE = SYSDATE(), ' +
            '            LAST_UPDATE_PROGRAM_ID = "S01010070", ' +
            '            PAYED_MONEY = PAYED_PLAN_MONEY, ' +
            '            CONTRACT_COMMENT = ""' +
            '         WHERE CONTRACT_ID =' + modalContractId + ' AND PAY_PLAN_DATE ="' + chkPayPlanDate + '"';

        connection.query(sql, function (error, rows) {  //쿼리문
            //console.log('payContractSql :' + result);
            //console.log(rows);
            if (error) {
                if (newChecked[newChecked.length - 1] === newChecked[i]) {
                    setImmediate(() => {
                        next(new Error(error));
                    })
                }
            } else {
                if (newChecked[newChecked.length - 1] === newChecked[i]) {
                    res.send({ success: true, rows });
                }
            }

            //console.log(rows);

        });//payContract
    }

})




//let payFlagNum;
router.post('/paymentUpdate', (req, res) => {

    let modalContractId = req.body.modalContractId;

    //체크된 값들
    // let newChecked = req.body.newChecked;
    let newChecked = req.body.checked;

    console.log('newChecked', newChecked);

    for (let i = 0; i < newChecked.length; i++) {
        //체크된 값 분리
        let newCheckedList = newChecked[i].split(",");
        //console.log('newCheckedList', newCheckedList);

        let chkPayPlanDate = newCheckedList[0];
        let chkPayDate = newCheckedList[1];
        let chkConComment = newCheckedList[2];
        //console.log('chkPayPlanDate', chkPayPlanDate);
        //console.log('chkPayDate', chkPayDate);
        //console.log('chkConComment', chkConComment);

        let sql =
            ' UPDATE TB_S10_CONTRACT020  ' +
            '        SET ' +
            '        PAYED_DATE ="' + chkPayDate + '", ' +
            '        PAYED_FLAG = "Y", ' +
            '            LAST_UPDATE_DATE = SYSDATE(), ' +
            '            LAST_UPDATE_PROGRAM_ID = "S01010070", ' +
            '            PAYED_MONEY = PAYED_PLAN_MONEY, ' +
            '            CONTRACT_COMMENT = "' + chkConComment + '"' +
            '         WHERE CONTRACT_ID =' + modalContractId + ' AND PAY_PLAN_DATE ="' + chkPayPlanDate + '"';

        connection.query(sql, function (error, rows) {  //쿼리문
            //console.log('payContractSql :' + result);

            if (error) {
                if(newChecked[newChecked.length-1] === newChecked[i]){
                    setImmediate(() => {
                        next(new Error(error));
                    })
                }
            }else{
                if(newChecked[newChecked.length-1] === newChecked[i]){
                    res.send({ success: true, rows })
                }
            }
            
        });//payContract

    }

    // 마지막 납부완료시 종료(end_flag= 'Y')처리
    //     let countPayFlag = 'SELECT COUNT(PAYED_FLAG)AS ENDFLAGNUM FROM TB_S10_CONTRACT020 '+
    //                        'WHERE CONTRACT_ID = '+modalContractId+' AND PAYED_FLAG = "N"';

    //             connection.query(countPayFlag, (error, row) => {
    //                 if (error) {
    //                     connection.rollback(function () {
    //                         console.log('countPayFlag.error');
    //                         if (error){
    //                             setImmediate(()=>{
    //                                 next(new Error(error));
    //                             })
    //                         }
    //                     });
    //                 }

    //                 if(row[0].ENDFLAGNUM === 0){
    //                     // console.log('a완료되었습니ㅏㄷ.');
    //                     let endFlagSql = 'UPDATE TB_S10_CONTRACT010 ' +
    //                             'SET END_FLAG = "Y" ' +
    //                             'WHERE CONTRACT_ID = '+ modalContractId;

    //                     connection.query(endFlagSql, (error, rows) => {
    //                         if (error){
    //                             setImmediate(()=>{
    //                                 next(new Error(error));
    //                             })
    //                         }
    //                     });
    //                 }

    //                 connection.commit(function (err) {
    //                     if (err) {
    //                         connection.rollback(function () {
    //                             if (error){
    //                                 setImmediate(()=>{
    //                                     next(new Error(error));
    //                                 })
    //                             }
    //                         });
    //                     }else{
    //                         res.send({success:true,rows})
    //                     }
    //          });//commit

    //     });


})

module.exports = router;