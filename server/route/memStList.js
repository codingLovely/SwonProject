const express = require('express');
const router = express.Router();

const dbconfig = require('../config/database.js')();
const connection = dbconfig.init();


// 회원현황

// 회원구분 selectBox
router.get('/selectMemberTp', (req, res) => {

    let sql = 'SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = "MEMBER_TP"';

    connection.query(sql, (error, rows) => {
        if (error) throw error;
        res.send({ success: true, rows });
    });
})

// 회원상태 selectBox
router.get('/selectMemberSt', (req, res) => {
    let sql = 'SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = "MEMBER_ST"';

    connection.query(sql, (error, rows) => {
        if (error) throw error;
        res.send({ success: true, rows })
    })
})

// 회원현황 조회
router.post('/searchMember', (req, res) => {

    let memberNm = req.body.memberNm;
    let regNo = req.body.regNo;
    let name = req.body.name;
    let memberTp = req.body.memberTp;
    let contractStatus = req.body.contractStatus;
    let memberSt = req.body.memberSt;

    let sql =
            'SELECT member010.MEMBER_ID '+ 
            '       , member010.REG_NO '+
            '       , member010.MEMBER_NM '+ 
            '       , (select CD_V_MEANING '+
            '           from TB_S10_CODE '+
            '           where CD_TP = "MEMBER_TP" '+
            '           and cd_v = member010.MEMBER_TP)  AS MEMBER_TP '+
            '       , (select CD_V_MEANING '+
            '           from TB_S10_CODE '+
            '           where CD_TP = MEMBER_ST '+
            '           and cd_v = member010.MEMBER_ST) AS MEMBER_ST '+
            '       , emp010.NAME '+
            '       , emp010.EMP_HP '+
            '       , emp010.EMP_EMAIL '+ 
            '       , (select  case when count(distinct(con.end_flag)) = 2 '+ 
            '                       then "N" '+
            '                       when count(distinct(con.end_flag)) = 1 and con.end_flag = "Y" '+
            '                       then "Y" '+
            '                       when count(distinct(con.end_flag)) = 1 and con.end_flag = "N" '+
            '                       then "N" '+
            '                       end '+
            '           from TB_S10_CONTRACT010 con '+
            '       where con.MEMBER_ID = member010.MEMBER_ID) as END_FLAG '+
            '   FROM TB_S10_MEMBER010 member010 '+
            '           INNER JOIN TB_S10_EMP010 emp010 '+
            '               ON member010.CEO_ID = emp010.EMP_ID '+
            '       WHERE  MEMBER_ST != "D"' ;

    if (memberTp != null && memberTp != "" && memberTp != "전체")
        sql += ' AND member010.MEMBER_TP = "' + memberTp + '"';
    if (contractStatus != null && contractStatus != "" && contractStatus != "전체")
        sql += ' AND contract010.END_FLAG = "' + contractStatus + '"';
    if (memberSt != null && memberSt != "" && memberSt != "전체")
        sql += ' AND member010.MEMBER_ST = "' + memberSt + '"';
    if (memberNm != null && memberNm != ""&& memberNm != "전체")
        sql += ' AND member010.MEMBER_NM LIKE "%' + memberNm + '%"';
    if (regNo != null && regNo != ""&& regNo != "전체")
        sql += ' AND member010.REG_NO LIKE "%' + regNo + '%"';
    if (name != null && name != ""&& name != "전체")
        sql += ' AND emp010.NAME LIKE "%' + name + '%"';

    sql += ' ORDER BY member010.MEMBER_ID DESC';
    connection.query(sql, (error, rows) => {
        if (error) throw error;
        res.send({ success: true, rows })
    })

})


// s01010010 selectBox
router.post('/selectTest', (req, res) => {
    let firstVal = req.body.firstVal;
    let secondVal = req.body.secondVal;

    let sql = `SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = '${firstVal}' AND ATTRIBUTE2 = '${secondVal}'`;

    connection.query(sql, (error, rows) => {
        res.send({ success: true, rows });
    });
})

router.post('/accessPath', (req, res) => {

    let sql = 'SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = "ACCESS_PATH" AND ATTRIBUTE1 ="CONTRACT"';

    connection.query(sql, (error, rows) => {  //쿼리문
        if (error) throw error;
        res.send({ success: true, rows });
        //console.log(rows);
    });
})

router.post('/contHier', (req, res) => {
    let contractTp = req.body.contractTpBody;

    let sql = 'SELECT ' +
        'CODE1.CD_V,CODE1.CD_V_MEANING ' +
        'FROM TB_S10_CODE CODE1 ' +
        'INNER JOIN TB_S10_CODE CODE2 ' +
        'ON CODE1.CD_TP = CODE2.CD_V ' +
        'WHERE CODE2.CD_V = "' + contractTp + '"'

    connection.query(sql, (error, rows) => {//쿼리문
        if (error) throw error;
        res.send({ success: true, rows })


    });

})

router.post('/roomLockerHier', (req, res) => {

    //console.log(firstVal);
    let sql = 'SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP ="L"';

    connection.query(sql, (error, rows) => {  //쿼리문
        if (error) throw error;
        res.send({ success: true, rows });
    });
})

router.post('/monthlyMoney', (req, res) => {

    let cdTpRoom = req.body.contractTpBody;
    console.log(cdTpRoom);
    let sql = 'SELECT ATTRIBUTE3 FROM TB_S10_CODE WHERE CD_TP = "' + cdTpRoom + '"';

    connection.query(sql, (error, rows) => {//쿼리문
        if (error) throw error;
        res.send({ success: true, rows })
    });

})





//신규계약
router.post('/detailNewContract_by_id', (req, res) => {

    let memberIdForNew = req.body.memberIdForNew;
    let contractTp = req.body.contractTp;
    let contractTpVal = req.body.contractTpVal;
    let roomLockerTp = req.body.roomLockerTp;
    let contractMoney = req.body.contractMoney;
    let contractTerm = req.body.contractTerm;
    let startDate = req.body.startAsk_date;
    let endDate = req.body.endDate;
    let payDate = req.body.payDate;
    let payMethod = req.body.payMethod;
    let contractPath = req.body.contractPath;
    let comment = req.body.comment;

    connection.beginTransaction(function (error) {
    //각 계약에 해당하는 start_date,end_date -> 우선 없는 것처럼 해야한다.
    let sql =
        'INSERT INTO ' +
        'TB_S10_CONTRACT010(CONTRACT_TP,CONTRACT_ROOM,CONTRACT_LOCKER,CONTRACT_MONEY,CONTRACT_TERM,START_DATE,END_DATE,' +
        'PAY_DATE,PAY_METHOD,CONTRACT_PATH,CREATED_DATE,CONTRACT_DATE,COMMENT,MEMBER_ID,LAST_UPDATE_DATE) ' +
        'VALUES (?,?,?,?,?,?,?,?,?,?,SYSDATE(),?,?,?,SYSDATE())';

    let contractParams = [contractTp, contractTpVal, roomLockerTp, contractMoney, contractTerm, startDate, endDate, payDate, payMethod, contractPath, startDate, comment, memberIdForNew];

    //방금생성한 CONTRACT_ID 가져오기
    connection.query(sql, contractParams, (error, row) => {//쿼리문
        if (error) {
            connection.rollback(function () {
                console.log('payContractSql.error');
                throw error;
            });
        }
 
                let dateToString = startDate.toString().substring(0, 10);
                let wasteDateDay = dateToString.substring(7, 10);
                let wasteContracMonthDay = dateToString.substring(5, 7);
                let wasteContractYearDay = dateToString.substring(0, 4);

               
                let contractDateDay = parseInt(wasteDateDay);
                let wasteMonth = parseInt(wasteContracMonthDay);
                let contractYearDay = parseInt(wasteContractYearDay);

                let finalDate = '';
                let contractMonthDay = wasteMonth;

                //계약시작일자가 납부일보다 크면 
                if (contractDateDay > parseInt(payDate)) {
                    contractMonthDay = wasteMonth + 1;       
                    finalDate = contractYearDay + '-' + contractMonthDay + '-' + payDate;
                } else if (contractDateDay <= parseInt(payDate)) {
                    finalDate = contractYearDay + '-' + contractMonthDay + '-' + payDate;
                }


                let payContractSql = '';
                let payContractParams = [];

                let recentContractId ='SELECT CONTRACT_ID FROM TB_S10_CONTRACT010 ORDER BY CONTRACT_ID DESC LIMIT 1';

                connection.query(recentContractId, (error, row) => {//쿼리문
                    if (error) {
                        connection.rollback(function () {
                            console.log('recentContractId.error');
                            throw error;
                        });
                    }
                    
                //console.log('contract_id',row);
                for (let i = 1; i <= contractTerm; i++) {

                    while (contractMonthDay > 12) {
                        contractYearDay += 1;
                        contractMonthDay -= 12;
                    }

                    finalDate = contractYearDay + '-' + contractMonthDay + '-' + payDate;

                    payContractSql = 'INSERT INTO ' +
                        'TB_S10_CONTRACT020(CONTRACT_ID,PAY_PLAN_DATE,CREATED_DATE,PAYED_PLAN_MONEY,LAST_UPDATE_DATE) ' +
                        'VALUES(?,?,SYSDATE(),?,SYSDATE())';

                    payContractParams = [row[0].CONTRACT_ID,finalDate, contractMoney];

                    console.log("--------------------------------");
                    console.log('payContractParams', payContractParams);
                    console.log("--------------------------------");

                    contractMonthDay++;

                    connection.query(payContractSql, payContractParams, function (error, result) {  //쿼리문
                        //console.log('payContractSql :' + result);

                        if (error) {
                            connection.rollback(function () {
                                console.log('payContractSql.error');
                                throw error;
                            });
                        }

                        connection.commit(function (err) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }
                        });//commit
                    });//payContract
                }
                //일단 빼놓음
                console.log('success!');
                res.send({ success: true });
            });//contract
            });//contract
        })//memberId
    })

    //가계약 -> 확정
    router.post('/modifymemberSt', (req, res) => {
        let rNum = req.body.rNum;
    
        let sql =
            'UPDATE TB_S10_MEMBER010 MEM INNER JOIN TB_S10_CONTRACT010 CON ' +
            ' SET MEM.MEMBER_ST = "C" ' +
            ' WHERE CON.CONTRACT_ID =' + rNum
    
        connection.query(sql, (error, rows) => {
            if (error) throw error;
            res.send({ success: true, rows })
        })
    
    
    })

    router.post('/contractModify/dateChangeSt', (req, res) => {
        let dateChangeChk = req.body.dateChangeChk;
        let contractTpVal = req.body.contractTpVal;
        console.log('dateChangeChk', dateChangeChk);
        console.log('contractTpVal', contractTpVal);
    
        //각 계약에 해당하는 start_date,end_date -> 우선 없는 것처럼 해야한다.
        let sql = 'SELECT START_DATE, END_DATE, CONTRACT_TERM FROM TB_S10_CONTRACT010 WHERE CONTRACT_ID = "' + dateChangeChk + '" AND CONTRACT_ROOM ="' + contractTpVal + '"';
    
    
        connection.query(sql, (error, row) => {//쿼리문
            if (error) throw error;
            res.send({ success: true, row })
            // console.log('이용기간 기존데이터',row);
        });
    
    })

    //contractId계약정보
    router.get('/tb_s10_contract010_by_id', (req, res) => {

        let type = req.query.type
        let contractId = req.query.id
        console.log(contractId);
        console.log(req.query.id);
    
        if(contractId != 'undefined'){
            console.log(contractId != undefined && contractId != null);
            console.log(contractId);
        let sql =
            'SELECT EMP.NAME, EMP.EMP_HP, EMP.EMP_EMAIL, EMP.ADDRESS,EMP.ZIP_CODE,EMP.DETAIL_ADDRESS,' +
            '   MEM.MEMBER_NM, MEM.REG_NO, CODE1.CD_V AS "MEMBER_TP", CODE1.CD_V_MEANING AS "MEMBER_TP_M", CODE2.CD_V AS "MEMBER_ST",' +
            '   MEM.CEO_IMAGE_ID, MEM.CEO_IMAGE_REGISTER,' +
            '       CODE2.CD_V_MEANING AS "MEMBER_ST_M",CON.CONTRACT_ID, CON.CONTRACT_DATE, CON.CONTRACT_MONEY, CODE3.CD_V AS "CONTRACT_TP" , ' +
            '       CODE3.CD_V_MEANING AS "CONTRACT_TP_M" , CON.START_DATE, CON.END_DATE, ' +
            '       CON.END_FLAG ,' +
            '       CON.PAY_DATE,' +
            '       CODE6.CD_V AS"CONTRACT_ROOM", CODE6.CD_V_MEANING AS"CONTRACT_ROOM_M",' +
            '       CODE7.CD_V AS"CONTRACT_LOCKER", CODE7.CD_V_MEANING AS"CONTRACT_LOCKER_M",' +
            '       CON.COMMENT,' +
            '       CON.CONTRACT_TERM,' +
            '       PCON.PAYED_PLAN_MONEY,' +
            '       CON.PAY_METHOD,' +
            '       CODE4.CD_V AS "PAY_METHOD",CODE4.CD_V_MEANING AS "PAY_METHOD_M",' +
            '       CODE5.CD_V AS "CONTRACT_PATH",' +
            '       CODE5.CD_V_MEANING AS "CONTRACT_PATH_M" ' +
            'FROM TB_S10_EMP010 EMP ' +
            'INNER JOIN TB_S10_MEMBER010 MEM ' +
            'ON EMP.EMP_ID = MEM.CEO_ID ' +
            'INNER JOIN TB_S10_CONTRACT010 CON ' +
            'ON MEM.MEMBER_ID = CON.MEMBER_ID ' +
            'INNER JOIN TB_S10_CONTRACT020 PCON ' +
            'ON CON.CONTRACT_ID = PCON.CONTRACT_ID ' +
            'LEFT JOIN TB_S10_CODE CODE1  ' +
            'ON MEM.MEMBER_TP = CODE1.CD_V  ' +
            'AND CODE1.CD_TP ="MEMBER_TP"  ' +
            'LEFT JOIN TB_S10_CODE CODE2  ' +
            'ON MEM.MEMBER_ST = CODE2.CD_V  ' +
            'AND CODE2.CD_TP ="MEMBER_ST"  ' +
            'LEFT JOIN TB_S10_CODE CODE3  ' +
            'ON CON.CONTRACT_TP = CODE3.CD_V  ' +
            'AND CODE3.CD_TP ="CONTRACT_TP"  ' +
            'AND CODE3.ATTRIBUTE1 = "CONTRACT"  ' +
            'LEFT JOIN TB_S10_CODE CODE4  ' +
            'ON CON.PAY_METHOD = CODE4.CD_V  ' +
            'AND CODE4.CD_TP ="PAY_METHOD"  ' +
            'LEFT JOIN TB_S10_CODE CODE5  ' +
            'ON CON.CONTRACT_PATH = CODE5.CD_V  ' +
            'AND CODE5.CD_TP ="ACCESS_PATH" ' +
            'LEFT JOIN TB_S10_CODE code6 ON CON.CONTRACT_ROOM = CODE6.CD_V   ' +
            'LEFT OUTER JOIN TB_S10_CODE code7 ON CON.CONTRACT_LOCKER = CODE7.CD_V   ' +
            'AND CODE7.CD_TP = "L" ' +
            'WHERE CON.CONTRACT_ID =' + contractId;
        //console.log(sql);
        
    
        connection.query(sql, (error, rows) => {//쿼리문
            //console.log(rows);
            if (error) throw error;
            //console.log(rows);
            res.send({ success: true, rows });
    
        });
    }
    
    })


    //memberId 이용계약서
    router.get('/insert/tb_s10_contract010_by_id', (req, res) => {

        let type = req.query.type
        let memberId = req.query.id
        //console.log(memberId);
    
        let sql =
            'SELECT ' +
            '   EMP.NAME, EMP.EMP_HP, EMP.EMP_EMAIL, EMP.ADDRESS,EMP.ZIP_CODE,EMP.DETAIL_ADDRESS, ' +
            '   MEM.MEMBER_NM, MEM.REG_NO, CODE1.CD_V AS "MEMBER_TP" ' +
            'FROM TB_S10_EMP010 EMP ' +
            ' INNER JOIN TB_S10_MEMBER010 MEM ' +
            ' ON EMP.EMP_ID = MEM.CEO_ID ' +
            ' LEFT JOIN TB_S10_CODE CODE1  ON MEM.MEMBER_TP = CODE1.CD_V ' +
            ' AND CODE1.CD_TP = "MEMBER_TP" ' +
            ' WHERE MEM.MEMBER_ID =' + memberId
        //console.log(sql);
    
        connection.query(sql, (error, rows) => {//쿼리문
            //console.log(rows);
            if (error) throw error;
            //console.log(rows);
            res.send({ success: true, rows });
    
        });
    
    })

    


    // 이용계약서 수정
    router.post('/detailModifyContracId', (req, res) => {

        let payPlanDateModifySql;
    
        connection.beginTransaction(function (error) {
    
            let modifyDataNum = req.body.modifyDataNum;
            let comment = req.body.comment;
            let contractTp = req.body.contractTp;
            let contractTpVal = req.body.contractTpVal;
            let roomLockerTp = req.body.roomLockerTp;
            let contractTerm = req.body.contractTerm;
            let startDate = req.body.startAsk_date;
    
            let endDate = req.body.endDate;
            let payDate = req.body.payDate;
            let payMethod = req.body.payMethod;
            let contractPath = req.body.contractPath;
            let contractMoney = req.body.contractMoney;
    
            //     let modifyDataNum = req.body.modifyDataNum;
            //     let contractTp = req.body.contractTp;
            //     let contractTpVal = req.body.contractTpVal;
            //     let roomLockerTp = req.body.roomLockerTp;
            //     let contractMoney = req.body.contractMoney;
            //     let contractTerm = req.body.contractTerm;
            //     let startAsk_date = req.body.startDate;
            //     let endDate = req.body.dateEnd;
            //     let payDate = req.body.payDate;
            //     let payMethod = req.body.payMethod;
            //     let contractPath = req.body.contractPath;
            //     let comment = req.body.comment;
    
    
            let modifySql = 'UPDATE TB_S10_CONTRACT010 CON '+
                            '   INNER JOIN TB_S10_CONTRACT020 CON2 ON CON.CONTRACT_ID = CON2.CONTRACT_ID ' +
                            'SET ' +
                            '    CON.COMMENT =  "' + comment + '",' +
                            '    CON.CONTRACT_TP =  "' + contractTp + '",' +
                            '    CON.CONTRACT_ROOM = "' + contractTpVal + '",' +
                            '    CON.CONTRACT_LOCKER = "' + roomLockerTp + '",' +
                            '    CON.CONTRACT_TERM = ' + contractTerm + ',' +
                            '    CON.START_DATE = "' + startDate + '",' +
                            '    CON.END_DATE = "' + endDate + '",' +
                            '    CON.PAY_DATE = ' + payDate + ',' +
                            '    CON.CONTRACT_PATH = "' + contractPath + '",' +
                            '    CON.PAY_METHOD = "' + payMethod + '",' +
                            '    CON.CONTRACT_PATH = "' + contractPath + '",' +
                            '    CON.CONTRACT_DATE = "' + startDate + '",' +
                            '    CON2.PAYED_PLAN_MONEY = "' + contractMoney + '"' +
                            'WHERE CON.CONTRACT_ID = ' + modifyDataNum;
                
    
            let bringDateSql = ' SELECT DATE_FORMAT(PAY_PLAN_DATE,"%y-%m-%d") AS "PAY_PLAN_DATE" FROM TB_S10_CONTRACT020 ' +
                ' WHERE CONTRACT_ID =' + modifyDataNum;
    
            connection.query(bringDateSql, function (error, rows) {
                console.log('memberSql: ' + rows);
                if (error) {
                    connection.rollback(function () {
                        console.log('bringDateSql.error');
                        throw error;
                    });
    
                }
    
                let termCountSql = 'SELECT CONTRACT_TERM FROM TB_S10_CONTRACT010 WHERE CONTRACT_ID = ' + modifyDataNum;
                //console.log(termCountSql);    
                connection.query(termCountSql, function (error, termCountRow) {
    
                    if (error) {
                        connection.rollback(function () {
                            console.log('termCountSql.error');
                            throw error;
                        });
                    }
                    //console.log('contract_term',termCountRow);
    
                    connection.query(modifySql, function (error, result) {
                        console.log('memberSql: ' + result);
                        if (error) {
                            connection.rollback(function () {
                                console.log('modifySql.error');
                                throw error;
                            });
                        }
    
                        if (termCountRow[0].CONTRACT_TERM == contractTerm) {
    
                            //console.log('termCountRow[0].CONTRACT_TERM', termCountRow[0].CONTRACT_TERM);
                            //console.log('contractTerm', contractTerm);
    
                        
                            let dateToString = startDate.toString().substring(0, 10);
                            let wasteDateDay = dateToString.substring(7, 10);
                            let wasteContracMonthDay = dateToString.substring(5, 7);
                            let wasteContractYearDay = dateToString.substring(0, 4);
    
    
                            //날 01
                            let contractDateDay = parseInt(wasteDateDay);
                            let wasteMonth = parseInt(wasteContracMonthDay);
                            let contractYearDay = parseInt(wasteContractYearDay);
    
                            let finalDate = '';
                            let contractMonthDay = wasteMonth;
                            // console.log('dateToString: ' + dateToString);
                            // console.log('dateToString: ' + dateToString);
                            // console.log('contractDateDay: ' + contractDateDay);
                            // console.log('contractMonthDay: ' + contractMonthDay);
                            // console.log('contractYearDay: ' + contractYearDay);
    
                            //계약시작일자가 납부일보다 크면 
                            if (contractDateDay > parseInt(payDate)) {
                                contractMonthDay = wasteMonth + 1;
                                //console.log(contractMonthDay);
                                //// console.log('납부일보다크면 contractMonthDay:' + contractMonthDay);
                                //// console.log('납부일보다크면typeOf contractMonthDay:' , typeof contractMonthDay);
                                //// console.log('납부일보다크면typeOf contractMonthDay:' , typeof 1);
                                //// console.log('납부일보다크면 contractMonthDay:' + contractMonthDay + 1);
    
                                finalDate = contractYearDay + '-' + contractMonthDay + '-' + payDate;
    
                            } else if (contractDateDay <= parseInt(payDate)) {
    
                                finalDate = contractYearDay + '-' + contractMonthDay + '-' + payDate;
    
                            }
    
                            for (let i = 0; i < contractTerm; i++) {
                                //console.log(contractTerm);
                                while (contractMonthDay > 12) {
                                    contractYearDay += 1;
                                    contractMonthDay -= 12;
                                }
    
                                finalDate = contractYearDay + '-' + contractMonthDay + '-' + payDate;
                                //console.log(finalDate);
    
                                payPlanDateModifySql = 'UPDATE TB_S10_CONTRACT020' +
                                    ' SET PAY_PLAN_DATE = "' + finalDate + '" ' +
                                    ' WHERE CONTRACT_ID = ' + modifyDataNum + ' AND PAY_PLAN_DATE ="' + rows[i].PAY_PLAN_DATE + '"';
    
                                contractMonthDay++;
                                //console.log('payPlanDateModifySql', payPlanDateModifySql);
    
                                connection.query(payPlanDateModifySql, function (error, result) {  //쿼리문
                                    console.log('contractSql: ' + result);
    
                                    if (error) {
                                        connection.rollback(function () {
                                            console.log('payPlanDateModifySql.error');
                                            throw error;
                                        });
                                    }
                                    connection.commit(function (err, result) {
                                        if (err) {
                                            connection.rollback(function () {
                                                throw err;
                                            });
                                            console.log('SUCCESS!');
    
                                        }
                                    });//commit
                                });//payPlanDateModifySql
                            }//for문
                            res.send({ success: true });
                           
                        } else if (termCountRow[0].CONTRACT_TERM != contractTerm) {
                           
                            let dateToString = startDate.toString().substring(0, 10);
                            let wasteDateDay = dateToString.substring(7, 10);
                            let wasteContracMonthDay = dateToString.substring(5, 7);
                            let wasteContractYearDay = dateToString.substring(0, 4);
    
                            // //날 01
                            let contractDateDay = parseInt(wasteDateDay);
                            let wasteMonth = parseInt(wasteContracMonthDay);
                            let contractYearDay = parseInt(wasteContractYearDay);
    
                            let finalDate = '';
                            let contractMonthDay = wasteMonth;
    
                            // console.log('dateToString: ' + dateToString);
                            // console.log('dateToString: ' + dateToString);
                            // console.log('contractDateDay: ' + contractDateDay);
                            // console.log('contractMonthDay: ' + contractMonthDay);
                            // console.log('contractYearDay: ' + contractYearDay);
                            // //계약시작일자가 납부일보다 크면 29 1
                            if (contractDateDay > parseInt(payDate)) {
                                contractMonthDay = wasteMonth + 1;
                                //console.log(contractMonthDay);
                                //// console.log('납부일보다크면 contractMonthDay:' + contractMonthDay);
                                //// console.log('납부일보다크면typeOf contractMonthDay:' , typeof contractMonthDay);
                                //// console.log('납부일보다크면typeOf contractMonthDay:' , typeof 1);
                                //// console.log('납부일보다크면 contractMonthDay:' + contractMonthDay + 1);
                                finalDate = contractYearDay + '-' + contractMonthDay + '-' + payDate;
                            } else if (contractDateDay <= parseInt(payDate)) {
                                finalDate = contractYearDay + '-' + contractMonthDay + '-' + payDate;
                            }
    
                            let delPayPlanDateSql = 'DELETE FROM TB_S10_CONTRACT020 WHERE CONTRACT_ID=' + modifyDataNum;
    
                            connection.query(delPayPlanDateSql, function (error, result) {  //쿼리문
                                console.log('delPayPlanDateSql: ' + result);
                                if (error) {
                                    connection.rollback(function () {
                                        console.log('delPayPlanDateSql.error');
                                        throw error;
                                    });
                                }
    
                                //for문 돌려서 날짜에 맞게 update 하고 나서 
                                for (let i = 0; i < contractTerm; i++) {
                                    //console.log(contractTerm);
                                    while (contractMonthDay > 12) {
                                        contractYearDay += 1;
                                        contractMonthDay -= 12;
                                    }
    
                                    finalDate = contractYearDay + '-' + contractMonthDay + '-' + payDate;
                                    //console.log(finalDate);
    
                                    // payPlanDateModifySql = 'UPDATE TB_S10_CONTRACT020' +
                                    //     ' SET PAY_PLAN_DATE = "' + finalDate + '" ' +
                                    //     ' WHERE CONTRACT_ID = ' + modifyDataNum + ' AND PAY_PLAN_DATE ="' + rows[i].PAY_PLAN_DATE + '"';
    
                                    let insertPlanDateSql = 'INSERT INTO TB_S10_CONTRACT020(CONTRACT_ID,PAY_PLAN_DATE,CREATED_DATE,LAST_UPDATE_DATE) VALUES (?,?,SYSDATE(),SYSDATE())';
                                    let planDateParams = [modifyDataNum, finalDate];
    
                                    contractMonthDay++;
                                    console.log('insertPlanDateSql', insertPlanDateSql);
    
                                    //실행후
                                    connection.query(insertPlanDateSql, planDateParams, function (error, result) {  //쿼리문
                                        console.log('insertPlanDateSql: ' + result);
                                        if (error) {
                                            connection.rollback(function () {
                                                console.log('insertPlanDateSql.error');
                                                throw error;
                                            });
                                        }
    
                                        // //pay_plan_date 의 갯수
                                        // let dateCountSql = 'SELECT COUNT(PAY_PLAN_DATE) FROM TB_S10_CONTRACT020'; 
    
                                        // connection.query(dateCountSql, function (error, row) {  //쿼리문
                                        //         console.log('dateCountSql: ' + row);
                                        //         if (error) {
                                        //             connection.rollback(function () {
                                        //                 console.log('dateCountSql.error');
                                        //                 throw error;
                                        //             });
                                        //         }
    
                                        //     if(row == 0){
                                        //         let sql = 'INSERT INTO (CONTRACT_ID,PAY_PLAN_DATE) VALUES ?,?';
                                        //         let params = [modifyDataNum,finalDate];
                                        //     }
    
                                        connection.commit(function (err, result) {
                                            if (err) {
                                                connection.rollback(function () {
                                                    throw err;
                                                });
                                                console.log('SUCCESS!');
                                            }
                                        });//commit
                                        // });//commit
                                    });//payPlanDateModifySql
                                }//for문
                                res.send({ success: true });
                            });//commit
                        }//elseif
                    });//commit
    
                });//commit
            });//modifySql
        })//transaction
    })
    
    // 종료처리
    router.post('/endFlag', (req, res) => {
        //요청된 이메일을 데이터베이스에서 있는지 찾는다.
        let contractId = req.body.rNum;
        let sql = 'UPDATE TB_S10_CONTRACT010 ' +
            'SET END_FLAG ="Y"' +
            'WHERE CONTRACT_ID = ' + contractId;
        +
            connection.query(sql, (error, rows) => {//쿼리문
                if (error) throw error;
                //console.log(rows)
                res.send({ success: true })
            })
    })

    // 삭제
    router.post('/memberDelete_by_id', (req, res) => {
        let contractId = req.query.id;
    
        let sql = ' UPDATE TB_S10_MEMBER010 ' +
            ' SET MEMBER_ST = "D" ' +
            ' WHERE MEMBER_ID = (SELECT MEMBER_ID FROM TB_S10_CONTRACT010 WHERE CONTRACT_ID = ' + contractId + ')';
        connection.query(sql, (error, rows) => {
            if (error) throw error;
            res.send({ success: true })
        })
    
    })


    // 중복확인 

    let regNoChkNum;
    router.post('/regNoCheck', (req, res) => {

    let firstRegNo = req.body.firstRegNo;
    let secondRegNo = req.body.secondRegNo;
    let thirdRegNo = req.body.thirdRegNo;
    // console.log("firstRegNo: " + firstRegNo);
    // console.log("secondRegNo: " + secondRegNo);
    // console.log("thirdRegNo: " + thirdRegNo);
    // console.log(firstRegNo + secondRegNo + thirdRegNo);
    let RegNo = firstRegNo + "-" + secondRegNo + "-" + thirdRegNo;

    let regNoChkSql = 'SELECT COUNT(REG_NO) AS RowNum  ' +
        ' FROM TB_S10_MEMBER010 MEM010 ' +
        '        WHERE MEM010.REG_NO= "' + RegNo + '"';

    connection.query(regNoChkSql, (error, number) => {//쿼리문
        if (error) throw error;
        res.send({ success: true, number })
        regNoChkNum = number[0].RowNum;
        //console.log(number[0].RowNum);
        //console.log(number.RowDataPacket.RowNum);
    });

})

let empHpChkNum;
router.post('/empHpCheck', (req, res) => {

    let firstEmpHp = req.body.firstEmpHp;
    let secondEmpHp = req.body.secondEmpHp;
    let thirdEmpHp = req.body.thirdEmpHp;

    let EmpHp = firstEmpHp + "-" + secondEmpHp + "-" + thirdEmpHp;

    let empHpChkSql =
        'SELECT  COUNT(EMP_HP) AS RowNum  ' +
        ' FROM TB_S10_EMP010 EMP010 ' +
        '        WHERE EMP010.EMP_HP= "' + EmpHp + '"';

    connection.query(empHpChkSql, (error, number) => {//쿼리문
        if (error) throw error;
        res.send({ success: true, number })
        empHpChkNum = number[0].RowNum;
        //console.log(number[0].RowNum);
        //console.log(number.RowDataPacket.RowNum);
    });
})

let dateChkNum;

router.post('/dateCheck', (req, res) => {

    let contractTp = req.body.contractTp;
    let contractTpVal = req.body.contractTpVal;
    let roomLockerTp = req.body.roomLockerTp;
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    let modalMemberId = req.body.modalMemberId;
    let contractId = req.body.contractId;

    let contractIdDateChk;
  

    //contract_id의 같은 호실과 날짜를 제외하고 count 
    //계약id로 넘어가는 경우
    if (contractId != null && contractId != '') {
        contractIdDateChk = 'SELECT COUNT(START_DATE) AS STARTENDDATE ' +
        ' FROM TB_S10_CONTRACT010 CON ' +
        ' WHERE ("' + startDate + '" <= CON.END_DATE AND "' + endDate + '">= CON.START_DATE)' +
        ' AND CON.CONTRACT_ROOM ="' + contractTpVal + '"' +
        ' AND CONTRACT_ID !=' + contractId;
    }


    let dateChkSql = 'SELECT COUNT(START_DATE) AS STARTENDDATE ' +
        ' FROM TB_S10_CONTRACT010 CON ' +
        ' WHERE ("' + startDate + '" <= CON.END_DATE AND "' + endDate + '">= CON.START_DATE)' +
        ' AND CON.CONTRACT_ROOM ="' + contractTpVal + '"'

    if (contractId != null && contractId != '') {
        connection.query(contractIdDateChk, (error, number) => {//쿼리문
            if (error) throw error;
            res.send({ success: true, number })
            dateChkNum = number[0].STARTENDDATE;
            //console.log('dateChkNum',dateChkNum);
        });
    }else {
        connection.query(dateChkSql, (error, number) => {//쿼리문
            if (error) throw error;
            res.send({ success: true, number })
            dateChkNum = number[0].STARTENDDATE;
            //console.log('dateChkNum',dateChkNum);
        });
    }
})

module.exports = router;