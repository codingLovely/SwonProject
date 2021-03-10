const express = require('express');
const app = express();
const router = express.Router();
const dbconfig = require('../config/database.js')();
const connection = dbconfig.init();

const multer = require('multer');
let upload = multer({ dest: './src/uploads' });
app.use('/image', express.static('./src/uploads'));


// s01010010 selectBox
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
            res.send({ success: true,rows });
        } 
        
    });
})

router.post('/accessPath', (req, res, next) => {

    let sql = 'SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = "ACCESS_PATH" AND ATTRIBUTE1 ="CONTRACT"';

    connection.query(sql, (error, rows) => {  //쿼리문
        if (error){
            setImmediate(() => {
                next(new Error(error))
            })
            //next(error);
        }else{
            res.send({ success: true,rows });
        } 
       
        //console.log(rows);
    });
})

router.post('/contHier', (req, res, next) => {
    let contractTp = req.body.contractTpBody;

    let sql =
        'SELECT  DISTINCT(CODE1.CD_V),CODE1.CD_V_MEANING ' +
        '  FROM TB_S10_CODE CODE1   ' +
        'INNER JOIN TB_S10_CODE CODE2  ' +
        'ON CODE1.CD_TP = CODE2.CD_V  ' +
        'LEFT JOIN TB_S10_CONTRACT010 CON ' +
        'ON CODE1.CD_V = CON.CONTRACT_ROOM  ' +
        'WHERE (CON.CONTRACT_ID IS NULL OR CON.END_FLAG = "Y") AND CODE2.CD_V= "' + contractTp + '" ORDER BY CODE1.CD_V';

    connection.query(sql, (error, rows) => {//쿼리문
        if (error){
            setImmediate(() => {
                next(new Error(error))
                console.log(error);
            })
            //next(error);
        }else{
            res.send({ success: true,rows });
        }

    });

})

router.post('/roomLockerHier', (req, res, next) => {

    //console.log(firstVal);
    let sql = ' SELECT DISTINCT(CODE1.CD_V),CODE1.CD_V_MEANING ' +
              '   FROM TB_S10_CODE CODE1 ' +
             '   INNER JOIN TB_S10_CODE CODE2 ON CODE1.CD_TP = CODE2.CD_V ' +
              '   LEFT JOIN TB_S10_CONTRACT010 CON  ON CODE1.CD_V = CON.CONTRACT_LOCKER ' +
              '  WHERE (CON.CONTRACT_ID IS NULL OR CON.END_FLAG = "Y") AND CODE1.CD_TP LIKE "L"';
  
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

router.post('/monthlyMoney', (req, res, next) => {

    let cdTpRoom = req.body.contractTpBody;
    console.log(cdTpRoom);
    let sql = 'SELECT ATTRIBUTE3 FROM TB_S10_CODE WHERE CD_TP = "' + cdTpRoom + '"';

    connection.query(sql, (error, rows) => {//쿼리문
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





// 신규계약
router.post('/detailNewContract_by_id', (req, res,next) => {
    // let memberSt = req.body.memberSt;
    let memberIdForNew = req.body.memberIdForNew;
    let contractTp = req.body.contractTp;
    let contractTpVal = req.body.contractTpVal;
    let roomLockerTp = req.body.roomLockerTp;
    let contractMoney = req.body.contractMoney;
    let contractTerm = req.body.contractTerm;
    let startDate = req.body.startAsk_date;
    let endDate = req.body.endDate;
    let payDate = req.body.startAsk_date.toString().substring(7, 10);
    let payMethod = req.body.payMethod;
    let contractPath = req.body.contractPath;
    let comment = req.body.comment;
    let selectedOption = req.body.selectedOption;

    connection.beginTransaction(function (error) {

        let sql =
            'INSERT INTO ' +
            'TB_S10_CONTRACT010(CONTRACT_TP,CONTRACT_ROOM,CONTRACT_LOCKER,MONTHLY_FEE,CONTRACT_TERM,START_DATE,END_DATE,' +
            'PAY_DATE,PAY_METHOD,CONTRACT_PATH,CREATED_DATE,CONTRACT_DATE,COMMENT,MEMBER_ID,LAST_UPDATE_DATE) ' +
            'VALUES (?,?,?,?,?,?,?,?,?,?,SYSDATE(),?,?,?,SYSDATE())';

        let contractParams = [contractTp, contractTpVal, roomLockerTp, contractMoney, contractTerm, startDate, endDate, payDate, payMethod, contractPath, startDate, comment, memberIdForNew];

        // let newContractsql = 'UPDATE TB_S10_MEMBER010 ' +
        //     'SET MEMBER_ST ="' + memberSt + '"' +
        //     'WHERE MEMBER_ID =' + memberIdForNew;

        //방금생성한 CONTRACT_ID 가져오기
        connection.query(sql, contractParams, (error, row) => {//쿼리문
            if (error) {
                connection.rollback(function () {
                    console.log('payContractSql.error');
                    throw error;
                });
            }


            let recentContractId = 'SELECT CONTRACT_ID FROM TB_S10_CONTRACT010 ORDER BY CONTRACT_ID DESC LIMIT 1';

            connection.query(recentContractId, (error, row) => {//쿼리문
                if (error) {
                    connection.rollback(function () {
                        console.log('recentContractId.error');
                        throw error;
                    });
                }


                let dateToString = startDate.toString().substring(0, 10);
                let wasteDateDay = dateToString.substring(7, 10);
                let wasteContracMonthDay = dateToString.substring(5, 6);
                let wasteContractYearDay = dateToString.substring(0, 4);


                console.log('dateToString', dateToString);
                console.log('wasteDateDay', wasteDateDay);
                console.log('wasteContracMonthDay', wasteContracMonthDay);
                console.log('wasteContractYearDay', wasteContractYearDay);

                let contractDateDay = parseInt(wasteDateDay);
                let wasteMonth = parseInt(wasteContracMonthDay);
                let contractYearDay = parseInt(wasteContractYearDay);

                let finalDate = '';
                let originDate = '';


                let payContractSql = '';
                let payContractParams = [];

                // 월납
                if (payMethod === 'MO') {

                    for (let i = 0; i < contractTerm; i++) {

                        finalDate = contractYearDay + '-' + (wasteMonth + i) + '-' + contractDateDay;
                        originDate = contractYearDay + '-' + (wasteMonth) + '-' + contractDateDay;
                        // console.log('finalDate',finalDate);
                        let updatePayedDate;
                        // 납부여부-네
                        if (selectedOption === 'Y') {

                            payContractSql =
                                'INSERT INTO TB_S10_CONTRACT020 ' +
                                '(CONTRACT_ID,PAY_PLAN_DATE,CREATED_DATE,CREATED_PROGRAM_ID,PAYED_PLAN_MONEY,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID) ' +
                                'VALUES(' +
                                '?,?,SYSDATE(),"s010100010",?,SYSDATE(),"s010100010")';

                            payContractParams = [row[0].CONTRACT_ID, finalDate, contractMoney];


                            updatePayedDate = 'UPDATE TB_S10_CONTRACT020 ' +
                                '   SET PAYED_FLAG="' + selectedOption + '",PAYED_DATE="' + originDate + '"' +
                                ' WHERE CONTRACT_ID ="' + row[0].CONTRACT_ID + '"' +
                                ' AND PAY_PLAN_DATE="' + originDate + '"'

                            // 납부여부-아니오
                        } else if (selectedOption === 'N') {

                            payContractSql =
                                'INSERT INTO TB_S10_CONTRACT020 ' +
                                '(CONTRACT_ID,PAY_PLAN_DATE,CREATED_DATE,CREATED_PROGRAM_ID,PAYED_PLAN_MONEY,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID) ' +
                                'VALUES' +
                                '(?,?,SYSDATE(),"s010100010",?,SYSDATE(),"s010100010")';

                            payContractParams = [row[0].CONTRACT_ID, finalDate, contractMoney];

                        }

                        console.log("--------------------------------");
                        console.log('payContractParams', payContractParams);
                        console.log("--------------------------------");

                        // contractMonthDay++;

                        connection.query(payContractSql, payContractParams, function (error, result) {  //쿼리문
                            console.log('payContractSql :' + result);

                            if (error) {
                                connection.rollback(function () {
                                    console.log('payContractSql.error');
                                    // res.send({ success: false, message: "TB_S10_CONTRACT020 최초 등록 오류 : " + error });
                                    throw error;
                                });
                            }
                            if ((payMethod === 'MO' && selectedOption === 'Y')) {

                                connection.query(updatePayedDate, function (error, result) {  //쿼리문
                                    console.log('payContractSql :' + result);

                                    if (error) {
                                        connection.rollback(function () {
                                            console.log('payContractSql.error');
                                            // res.send({ success: false, message: "TB_S10_CONTRACT020 최초 등록 오류 : " + error });
                                            throw error;
                                        });
                                    }
                                    connection.commit(function (err) {
                                        if (err) {
                                            connection.rollback(function () {
                                                // res.send({ success: false, message: "COMMIT 오류 : " + error });
                                                throw err;
                                            });
                                        }
                                    });//commit
                                });
                            } else {
                                connection.commit(function (err) {
                                    if (err) {
                                        connection.rollback(function () {
                                            // res.send({ success: false, message: "COMMIT 오류 : " + error });
                                            throw err;
                                        });
                                    }
                                });//commit
                            }

                        });//payContract


                    }
                    console.log('success!');
                    res.send({ success: true });


                    // 일시불    
                } else if (payMethod === 'SI') {

                    for (let i = 0; i < contractTerm; i++) {

                        finalDate = contractYearDay + '-' + (wasteMonth + i) + '-' + contractDateDay;
                        originDate = contractYearDay + '-' + (wasteMonth) + '-' + contractDateDay;
                        // console.log('finalDate',finalDate);

                        // 납부여부-네
                        if (selectedOption === 'Y') {

                            payContractSql =
                                'INSERT INTO TB_S10_CONTRACT020 ' +
                                '(CONTRACT_ID,PAY_PLAN_DATE,CREATED_DATE,CREATED_PROGRAM_ID,PAYED_PLAN_MONEY,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID,PAYED_FLAG,PAYED_DATE) ' +
                                'VALUES' +
                                '(?,?,SYSDATE(),"s010100010",?,SYSDATE(),"s010100010",?,?)';

                            payContractParams = [row[0].CONTRACT_ID, finalDate, contractMoney, selectedOption, originDate];

                            // 납부여부-아니오
                        } else if (selectedOption === 'N') {

                            payContractSql =
                                'INSERT INTO TB_S10_CONTRACT020 ' +
                                '(CONTRACT_ID,PAY_PLAN_DATE,CREATED_DATE,CREATED_PROGRAM_ID,PAYED_PLAN_MONEY,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID) ' +
                                'VALUES' +
                                '(?,?,SYSDATE(),"s010100010",?,SYSDATE(),"s010100010")';

                            payContractParams = [row[0].CONTRACT_ID, finalDate, contractMoney];

                        }

                        console.log("--------------------------------");
                        console.log('payContractParams', payContractParams);
                        console.log("--------------------------------");

                        // contractMonthDay++;

                        connection.query(payContractSql, payContractParams, function (error, result) {  //쿼리문
                            console.log('payContractSql :' + result);

                            if (error) {
                                connection.rollback(function () {
                                    console.log('payContractSql.error');
                                    // res.send({ success: false, message: "TB_S10_CONTRACT020 최초 등록 오류 : " + error });
                                    throw error;
                                });
                            }


                            connection.commit(function (err) {
                                if (err) {
                                    connection.rollback(function () {
                                        // res.send({ success: false, message: "COMMIT 오류 : " + error });
                                        throw err;
                                    });
                                }
                            });//commit
                        });//payContract

                    }// for
                    console.log('success!');
                    res.send({ success: true });
                }

            });//contract
        });//contract
    })//memberId
})

//가계약 -> 확정
router.post('/modifymemberSt', (req, res,next) => {
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


// contractId 계약정보
router.get('/tb_s10_contract010_by_id', (req, res,next) => {

    let type = req.query.type
    let contractId = req.query.id
    // console.log(contractId);
    // console.log(req.query.id);

    if (contractId != 'undefined') {
        // console.log(contractId != undefined && contractId != null);
        // console.log(contractId);

        let sql =
            'SELECT EMP.NAME, EMP.EMP_HP, EMP.EMP_EMAIL, EMP.ADDRESS,EMP.ZIP_CODE,EMP.DETAIL_ADDRESS,' +
            '   MEM.MEMBER_NM, MEM.REG_NO, CODE1.CD_V AS "MEMBER_TP", CODE1.CD_V_MEANING AS "MEMBER_TP_M", CODE2.CD_V AS "MEMBER_ST",' +
            '   MEM.CEO_IMAGE_ID, MEM.CEO_IMAGE_REGISTER,' +
            '       CODE2.CD_V_MEANING AS "MEMBER_ST_M", CON.CONTRACT_ID,  DATE_FORMAT(CON.CONTRACT_DATE,"%y-%m-%d")AS CONTRACT_DATE, CON.MONTHLY_FEE, CODE3.CD_V AS "CONTRACT_TP" , ' +
            '       CODE3.CD_V_MEANING AS "CONTRACT_TP_M" , CON.START_DATE, DATE_FORMAT(CON.END_DATE,"%y-%m-%d")AS END_DATE, ' +
            '       CON.END_FLAG ,' +
            '       CON.PAY_DATE,' +
            '       CODE6.CD_V AS"CONTRACT_ROOM", CODE6.CD_V_MEANING AS"CONTRACT_ROOM_M",' +
            '       CODE7.CD_V AS"CONTRACT_LOCKER", CODE7.CD_V_MEANING AS"CONTRACT_LOCKER_M",' +
            '       CON.COMMENT,' +
            '       CON.CONTRACT_TERM,' +
            '       PCON.PAYED_PLAN_MONEY,' +
            '       PCON.PAYED_FLAG,' +
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


        connection.query(sql, (error, rows) => {//쿼리문
            //console.log(rows);
            if (error) throw error;
            // console.log(rows);
            res.send({ success: true, rows });

        });
    }
})


//memberId 이용계약서
router.get('/insert/tb_s10_contract010_by_id', (req, res,next) => {

    let type = req.query.type
    let memberId = req.query.id
    //console.log(memberId);

    let sql =
        'SELECT ' +
        '   EMP.NAME, EMP.EMP_HP, EMP.EMP_EMAIL, EMP.ADDRESS,EMP.ZIP_CODE,EMP.DETAIL_ADDRESS, ' +
        '   MEM.MEMBER_NM, MEM.REG_NO, CODE1.CD_V AS "MEMBER_TP", MEM.CEO_IMAGE_ID ,MEM.CEO_IMAGE_REGISTER ' +
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
router.post('/detailModifyContracId', (req, res,next) => {

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
        let payDate = req.body.startAsk_date.toString().substring(7, 10);
        let payMethod = req.body.payMethod;
        let contractPath = req.body.contractPath;
        let contractMoney = req.body.contractMoney;
        let selectedOption = req.body.selectedOption;

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


        let modifySql = 'UPDATE TB_S10_CONTRACT010 CON ' +
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
            '    CON2.PAYED_PLAN_MONEY = "' + contractMoney + '",' +
            '    CON2.PAYED_FLAG = "' + selectedOption + '",' +
            '    CON.LAST_UPDATE_DATE = SYSDATE(),' +
            '    CON.LAST_UPDATE_PROGRAM_ID = "S010100010",' +
            '    CON2.LAST_UPDATE_DATE = SYSDATE(),' +
            '    CON2.LAST_UPDATE_PROGRAM_ID = "S010100010"' +
            'WHERE CON.CONTRACT_ID = ' + modifyDataNum


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

                    // 계약기간이 같으면
                    if (termCountRow[0].CONTRACT_TERM == contractTerm) {

                        let dateToString = startDate.toString().substring(0, 10);

                        // let wasteDateDay = dateToString.substring(7, 10);
                        // let wasteContracMonthDay = dateToString.substring(6, 8);
                        // let wasteContractYearDay = dateToString.substring(0, 4);
                        let wasteDateDay = dateToString.substring(6, 8);
                        let wasteContracMonthDay = dateToString.substring(3, 5);
                        let wasteContractYearDay = dateToString.substring(0, 2);


                        // //날 01
                        let contractDateDay = parseInt(wasteDateDay);
                        let wasteMonth = parseInt(wasteContracMonthDay);
                        let contractYearDay = parseInt(wasteContractYearDay);

                        console.log(contractDateDay);
                        console.log(wasteMonth);
                        console.log(contractYearDay);


                        let finalDate = '';
                        let originDate = '';



                        let payPlanDateModifySql = '';

                        // 월납
                        if (payMethod === 'MO') {

                            for (let i = 0; i < contractTerm; i++) {

                                finalDate = contractYearDay + '-' + (wasteMonth + i) + '-' + contractDateDay;
                                originDate = contractYearDay + '-' + (wasteMonth) + '-' + contractDateDay;
                                // console.log('finalDate',finalDate);
                                let updatePayedDate;
                                let initPayedDate;


                                // 납부여부-네
                                if (selectedOption === 'Y') {


                                    payPlanDateModifySql = 'UPDATE TB_S10_CONTRACT020' +
                                        ' SET PAY_PLAN_DATE = "' + finalDate + '" ' +
                                        ' WHERE CONTRACT_ID = ' + modifyDataNum + ' AND PAY_PLAN_DATE ="' + rows[i].PAY_PLAN_DATE + '"';

                                    initPayedDate = 'UPDATE TB_S10_CONTRACT020' +
                                        ' SET PAYED_DATE = "", PAYED_FLAG ="N" ' +
                                        ' WHERE CONTRACT_ID = ' + modifyDataNum + ' AND PAY_PLAN_DATE ="' + rows[i].PAY_PLAN_DATE + '"';


                                    updatePayedDate = 'UPDATE TB_S10_CONTRACT020 ' +
                                        '   SET PAYED_FLAG="' + selectedOption + '",PAYED_DATE="' + originDate + '"' +
                                        ' WHERE CONTRACT_ID = ' + modifyDataNum + ' AND PAY_PLAN_DATE="' + originDate + '"';

                                    console.log('updatePayedDate', updatePayedDate);
                                    // 납부여부-아니오
                                } else if (selectedOption === 'N') {


                                    payPlanDateModifySql = 'UPDATE TB_S10_CONTRACT020' +
                                        ' SET PAY_PLAN_DATE = "' + finalDate + '", ' +
                                        ' PAYED_DATE = "", ' +
                                        ' PAYED_FLAG = "N" ' +
                                        ' WHERE CONTRACT_ID = ' + modifyDataNum + ' AND PAY_PLAN_DATE ="' + rows[i].PAY_PLAN_DATE + '"';

                                }
                                // contractMonthDay++;

                                connection.query(payPlanDateModifySql, function (error, result) {  //쿼리문
                                    console.log('payPlanDateModifySql:' + result);

                                    if (error) {
                                        connection.rollback(function () {
                                            console.log('payPlanDateModifySql.error');
                                            // res.send({ success: false, message: "TB_S10_CONTRACT020 최초 등록 오류 : " + error });
                                            throw error;
                                        });
                                    }
                                    if ((payMethod === 'MO' && selectedOption === 'Y')) {
                                        connection.query(initPayedDate, function (error, result) {  //쿼리문
                                            console.log('payPlanDateModifySql:' + result);

                                            if (error) {
                                                connection.rollback(function () {
                                                    console.log('payPlanDateModifySql.error');
                                                    // res.send({ success: false, message: "TB_S10_CONTRACT020 최초 등록 오류 : " + error });
                                                    throw error;
                                                });
                                            }

                                            connection.query(updatePayedDate, function (error, result) {  //쿼리문
                                                console.log('updatePayedDate:' + result);

                                                if (error) {
                                                    connection.rollback(function () {
                                                        console.log('payContractSql.error');
                                                        // res.send({ success: false, message: "TB_S10_CONTRACT020 최초 등록 오류 : " + error });
                                                        throw error;
                                                    });
                                                }
                                                connection.commit(function (err) {
                                                    if (err) {
                                                        connection.rollback(function () {
                                                            // res.send({ success: false, message: "COMMIT 오류 : " + error });
                                                            throw err;
                                                        });
                                                    }
                                                });//commit
                                            });
                                        });
                                    } else {
                                        connection.commit(function (err) {
                                            if (err) {
                                                connection.rollback(function () {
                                                    // res.send({ success: false, message: "COMMIT 오류 : " + error });
                                                    throw err;
                                                });
                                            }
                                        });//commit
                                    }

                                });
                            }
                            console.log('success!');
                            res.send({ success: true });


                            // 일시불    
                        } else if (payMethod === 'SI') {

                            for (let i = 0; i < contractTerm; i++) {

                                finalDate = contractYearDay + '-' + (wasteMonth + i) + '-' + contractDateDay;
                                originDate = contractYearDay + '-' + (wasteMonth) + '-' + contractDateDay;
                                // console.log('finalDate',finalDate);

                                // 납부여부-네
                                if (selectedOption === 'Y') {

                                    payPlanDateModifySql = 'UPDATE TB_S10_CONTRACT020' +
                                        ' SET PAY_PLAN_DATE = "' + finalDate + '", ' +
                                        ' PAYED_FLAG = "Y", PAYED_DATE="' + originDate + '" ' +
                                        ' WHERE CONTRACT_ID = ' + modifyDataNum + ' AND PAY_PLAN_DATE ="' + rows[i].PAY_PLAN_DATE + '"';

                                    // 납부여부-아니오
                                } else if (selectedOption === 'N') {

                                    payPlanDateModifySql = 'UPDATE TB_S10_CONTRACT020' +
                                        ' SET PAY_PLAN_DATE = "' + finalDate + '", ' +
                                        ' PAYED_DATE = "", ' +
                                        ' PAYED_FLAG = "N" ' +
                                        ' WHERE CONTRACT_ID = ' + modifyDataNum + ' AND PAY_PLAN_DATE ="' + rows[i].PAY_PLAN_DATE + '"';

                                }

                                // contractMonthDay++;

                                connection.query(payPlanDateModifySql, function (error, result) {  //쿼리문
                                    console.log(' payPlanDateModifySql :' + result);

                                    if (error) {
                                        connection.rollback(function () {
                                            console.log(' payPlanDateModifySql.error');
                                            // res.send({ success: false, message: "TB_S10_CONTRACT020 최초 등록 오류 : " + error });
                                            throw error;
                                        });
                                    }


                                    connection.commit(function (err) {
                                        if (err) {
                                            connection.rollback(function () {
                                                // res.send({ success: false, message: "COMMIT 오류 : " + error });
                                                throw err;
                                            });
                                        }
                                    });//commit
                                });//payContract

                            }// for
                            console.log('success!');
                            res.send({ success: true });
                        }

                        // 계약기간이 다르면
                    } else if (termCountRow[0].CONTRACT_TERM != contractTerm) {

                        let dateToString = startDate.toString().substring(0, 10);

                        // let wasteDateDay = dateToString.substring(7, 10);
                        // let wasteContracMonthDay = dateToString.substring(6, 8);
                        // let wasteContractYearDay = dateToString.substring(0, 4);
                        let wasteDateDay = dateToString.substring(6, 8);
                        let wasteContracMonthDay = dateToString.substring(3, 5);
                        let wasteContractYearDay = dateToString.substring(0, 2);

                        console.log(startDate.toString().substring(0, 10));
                        // //날 01
                        let contractDateDay = parseInt(wasteDateDay);
                        let wasteMonth = parseInt(wasteContracMonthDay);
                        let contractYearDay = parseInt(wasteContractYearDay);

                        console.log(contractDateDay);
                        console.log(wasteMonth);
                        console.log(contractYearDay);


                        let finalDate = '';
                        let originDate = '';

                        let insertPlanDateSql = '';
                        let planDateParams = '';

                        let delPayPlanDateSql = 'DELETE FROM TB_S10_CONTRACT020 WHERE CONTRACT_ID=' + modifyDataNum;

                        connection.query(delPayPlanDateSql, function (error, result) {  //쿼리문
                            console.log('delPayPlanDateSql: ' + result);
                            if (error) {
                                connection.rollback(function () {
                                    console.log('delPayPlanDateSql.error');
                                    throw error;
                                });
                            }

                            if (payMethod === 'MO') {

                                for (let i = 0; i < contractTerm; i++) {

                                    finalDate = contractYearDay + '-' + (wasteMonth + i) + '-' + contractDateDay;
                                    originDate = contractYearDay + '-' + (wasteMonth) + '-' + contractDateDay;
                                    // console.log('finalDate',finalDate);
                                    let updateDate = '';
                                    // 납부여부-네
                                    if (selectedOption === 'Y') {


                                        insertPlanDateSql = 'INSERT INTO TB_S10_CONTRACT020(CONTRACT_ID,PAY_PLAN_DATE,CREATED_DATE,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID,PAYED_FLAG) VALUES (?,?,SYSDATE(),SYSDATE(),"S010100010","N")';
                                        planDateParams = [modifyDataNum, finalDate];

                                        updateDate = 'UPDATE TB_S10_CONTRACT020' +
                                            ' SET PAYED_DATE = "' + originDate + '", PAYED_FLAG ="Y"' +
                                            ' WHERE CONTRACT_ID = ' + modifyDataNum + ' AND PAY_PLAN_DATE ="' + rows[i].PAY_PLAN_DATE + '"';

                                        // 납부여부-아니오
                                    } else if (selectedOption === 'N') {

                                        insertPlanDateSql = 'INSERT INTO TB_S10_CONTRACT020(CONTRACT_ID,PAY_PLAN_DATE,CREATED_DATE,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID,PAYED_FLAG) VALUES (?,?,SYSDATE(),SYSDATE(),"S010100010","N")';
                                        planDateParams = [modifyDataNum, finalDate];

                                    }

                                    // contractMonthDay++;

                                    connection.query(insertPlanDateSql, planDateParams, function (error, result) {  //쿼리문
                                        console.log('insertPlanDateSql :' + result);

                                        if (error) {
                                            connection.rollback(function () {
                                                console.log('payPlanDateModifySql.error');
                                                // res.send({ success: false, message: "TB_S10_CONTRACT020 최초 등록 오류 : " + error });
                                                throw error;
                                            });
                                        }
                                        if ((payMethod === 'MO' && selectedOption === 'Y')) {

                                            connection.query(updateDate, function (error, result) {  //쿼리문
                                                console.log('updateDate:' + result);

                                                if (error) {
                                                    connection.rollback(function () {
                                                        console.log('updateDate.error');
                                                        // res.send({ success: false, message: "TB_S10_CONTRACT020 최초 등록 오류 : " + error });
                                                        throw error;
                                                    });
                                                }
                                                connection.commit(function (err) {
                                                    if (err) {
                                                        connection.rollback(function () {
                                                            // res.send({ success: false, message: "COMMIT 오류 : " + error });
                                                            throw err;
                                                        });
                                                    }
                                                });//commit
                                            });
                                        } else {
                                            connection.commit(function (err) {
                                                if (err) {
                                                    connection.rollback(function () {
                                                        // res.send({ success: false, message: "COMMIT 오류 : " + error });
                                                        throw err;
                                                    });
                                                }
                                            });//commit
                                        }

                                    });//payContract


                                }
                                console.log('success!');
                                res.send({ success: true });


                                // 일시불    
                            } else if (payMethod === 'SI') {

                                for (let i = 0; i < contractTerm; i++) {

                                    finalDate = contractYearDay + '-' + (wasteMonth + i) + '-' + contractDateDay;
                                    originDate = contractYearDay + '-' + (wasteMonth) + '-' + contractDateDay;
                                    // console.log('finalDate',finalDate);

                                    // 납부여부-네
                                    if (selectedOption === 'Y') {


                                        insertPlanDateSql = 'INSERT INTO TB_S10_CONTRACT020(CONTRACT_ID,PAY_PLAN_DATE,CREATED_DATE,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID,PAYED_FLAG,PAYED_DATE) VALUES (?,?,SYSDATE(),SYSDATE(),"S010100010","Y",?)';
                                        planDateParams = [modifyDataNum, finalDate, originDate];



                                        // 납부여부-아니오
                                    } else if (selectedOption === 'N') {

                                        insertPlanDateSql = 'INSERT INTO TB_S10_CONTRACT020(CONTRACT_ID,PAY_PLAN_DATE,CREATED_DATE,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID,PAYED_FLAG) VALUES (?,?,SYSDATE(),SYSDATE(),"S010100010","N")';
                                        planDateParams = [modifyDataNum, finalDate];

                                    }


                                    connection.query(insertPlanDateSql, planDateParams, function (error, result) {  //쿼리문
                                        console.log('payPlanDateModifySql :' + result);

                                        if (error) {
                                            connection.rollback(function () {
                                                console.log('payPlanDateModifySql.error');
                                                // res.send({ success: false, message: "TB_S10_CONTRACT020 최초 등록 오류 : " + error });
                                                throw error;
                                            });
                                        }


                                        connection.commit(function (err) {
                                            if (err) {
                                                connection.rollback(function () {
                                                    // res.send({ success: false, message: "COMMIT 오류 : " + error });
                                                    throw err;
                                                });
                                            }
                                        });//commit
                                    });//payContract

                                }// for
                                console.log('success!');
                                res.send({ success: true });
                            }
                        });// delete sql
                    }//elseif
                });//commit

            });//commit
        });//modifySql
    })//transaction
})

// 종료처리
router.post('/endFlag', (req, res ,next) => {
    
    let contractId = req.body.rNum;
    let memberId = req.body.memberId;

    let conEndFlagsql = 'UPDATE TB_S10_CONTRACT010 ' +
        'SET END_FLAG ="Y"' +
        'WHERE CONTRACT_ID = ' + contractId;

    connection.query(conEndFlagsql, (error, rows) => {//쿼리문
        if (error) throw error;
        //console.log(rows)
        res.send({ success: true })
    })

    let memberConRowChcksql = 'SELECT COUNT(*) AS CONTRACTNUM ' +
        'FROM TB_S10_CONTRACT010 ' +
        'WHERE MEMBER_ID = (SELECT MEMBER_ID FROM TB_S10_CONTRACT010 WHERE CONTRACT_ID = ' + contractId + ') ' +
        'AND END_FLAG = "N"';

    connection.query(memberConRowChcksql, (error, rows) => {//쿼리문
        if (error) throw error;
        console.log(rows[0].CONTRACTNUM);

        if (rows[0].CONTRACTNUM == 0) {
            let memberStEndsql = 'UPDATE TB_S10_MEMBER010 ' +
                'SET MEMBER_ST = "F"' +
                'WHERE MEMBER_ID = (SELECT MEMBER_ID FROM TB_S10_CONTRACT010 WHERE CONTRACT_ID = ' + contractId + ')';

            connection.query(memberStEndsql, (error, rows) => {//쿼리문
                if (error) throw error;
                //console.log(rows)
            });
        }
    })
})

// 삭제
router.post('/memberDelete_by_id', (req, res ,next) => {
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
router.post('/regNoCheck', (req, res ,next) => {

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


router.post('/empHpCheck', (req, res ,next) => {

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

router.post('/dateCheck', (req, res ,next) => {

    let contractTp = req.body.contractTp;
    let contractTpVal = req.body.contractTpVal;
    let roomLockerTp = req.body.roomLockerTp;
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    let modalMemberId = req.body.modalMemberId;
    let contractId = req.body.contractId;


    //contract_id의 같은 호실과 날짜를 제외하고 count 
    //계약id로 넘어가는 경우
    let contractIdDateChk;
    let dateChkSql;

    if (contractId != null && contractId != '') {
        // console.log('계약수정');
        contractIdDateChk = 'SELECT COUNT(START_DATE) AS STARTENDDATE ' +
            ' FROM TB_S10_CONTRACT010 CON ' +
            ' WHERE ("' + startDate + '" <= CON.END_DATE AND "' + endDate + '">= CON.START_DATE)' +
            ' AND CON.CONTRACT_ROOM ="' + contractTpVal + '"' +
            ' AND CON.END_FLAG = "N"' +
            ' AND CONTRACT_ID !=' + contractId;

        // console.log('계약수정');
        connection.query(contractIdDateChk, (error, number) => {//쿼리문
            if (error) throw error;
            res.send({ success: true, number })
            dateChkNum = number[0].STARTENDDATE;
            // console.log('dateChkNum',dateChkNum);
        });
    } else {
        // console.log('신규계약 /기존신규계약');
        dateChkSql = 'SELECT COUNT(START_DATE) AS STARTENDDATE ' +
            ' FROM TB_S10_CONTRACT010 CON ' +
            ' WHERE ("' + startDate + '" <= CON.END_DATE AND "' + endDate + '">= CON.START_DATE)' +
            ' AND CON.END_FLAG = "N"' +
            ' AND CON.CONTRACT_ROOM ="' + contractTpVal + '"';

        console.log('dateChkSql',dateChkSql);    
        // console.log('신규계약 /기존신규계약');
        connection.query(dateChkSql, (error, number) => {//쿼리문
            if (error) throw error;
            res.send({ success: true, number })
            dateChkNum = number[0].STARTENDDATE;
            // console.log('dateChkNum',dateChkNum);
        });
    }

})



router.post('/insertMember010', upload.fields([{ name: 'idCardFile', maxCount: 3 }, { name: 'registCardFile', maxCount: 5 }]), (req, res ,next) => {

    connection.beginTransaction(function (error) {

        /** TB_S10_EMP010  */

        // 대표자 이름
        let empIdName = req.body.empIdName;
 
        // 대표자 연락처
        let firstEmpHp = req.body.firstEmpHp;
        let secondEmpHp = req.body.secondEmpHp;
        let thirdEmpHp = req.body.thirdEmpHp;
        let empHp = firstEmpHp + "-" + secondEmpHp + "-" + thirdEmpHp;

        // 대표자 이메일
        let empEmailId = req.body.empEmailId;
        let domainAddress = req.body.domainAddress;
        let empEmail = empEmailId + "@" + domainAddress;
        // console.log('empEmail: ' + empEmail);

        // 대표자 주소
        let zipcode = req.body.zipcode;
        let empAddress = req.body.empAddress;
        let empDetailAddress = req.body.empDetailAddress;
       

        //insert .. from tb_s10_emp010;
        let empSql = 'INSERT INTO TB_S10_EMP010 ' +
            '(CREATED_DATE,CREATED_PROGRAM_ID, NAME, EMP_HP, EMP_EMAIL,' +
            'ZIP_CODE,ADDRESS,DETAIL_ADDRESS,CEO_FLAG,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID,EMP_LEVEL,EMP_TP,APPROVAL_FLAG,PWD) ' +
            'VALUES (SYSDATE(), "s010100010", ?, ?, ?, ?, ?, ?, "Y", SYSDATE(), "s010100010","CEO","R","Y","1234")';

        let empParams = [empIdName, empHp, empEmail, zipcode, empAddress, empDetailAddress];

        /** TB_S10_MEMBER010  */

        // 회원명
        let memberNm = req.body.memberNm;
      

        // 사업자 번호
        let firstRegNo = req.body.firstRegNo;
        let secondRegNo = req.body.secondRegNo;
        let thirdRegNo = req.body.thirdRegNo;
        let regNo = firstRegNo + "-" + secondRegNo + "-" + thirdRegNo;

        // 회원구분(법인,개인,프리랜서)
        let memberTp = req.body.memberTp;

        // 확정 - 가계약 
        let forMemberStatus = req.body.forMemberStatus;

        let idCardimageAddr;
        let idCardFilename;
        let idCardFilePath;

        let registCardimageAddr;
        let registCardFilename;
        let registCardFilePath;


        // 첨부파일 존재 유무
        let existingIdCard = req.files['idCardFile'];
        let existingRegistCard = req.files['registCardFile'];

        // 첨부파일
        if (existingIdCard != null || existingIdCard != undefined) {
            idCardimageAddr = '/image/' + req.files['idCardFile'][0].filename;
            idCardFilename = req.files['idCardFile'][0].originalname;
            idCardFilePath = req.files['idCardFile'][0].path;
        }

        if (existingRegistCard != null || existingRegistCard != undefined) {
            registCardimageAddr = '/image/' + req.files['registCardFile'][0].filename;
            registCardFilename = req.files['registCardFile'][0].originalname;
            registCardFilePath = req.files['registCardFile'][0].path;
        }

        let memberSql;
        let memberParams;

        //기존에 회원정보가 있는 경우에는 MEMBER_ID가 없는 곳에 새로운 정보 INSERT하기
        if (existingIdCard && existingRegistCard) {
            memberSql =
                'INSERT INTO TB_S10_MEMBER010 ' +
                    '(MEMBER_NM, REG_NO, MEMBER_TP,CREATED_DATE,CREATED_PROGRAM_ID,MEMBER_ST,CEO_ID,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID,' +
                    'CEO_IMAGE_ID,CEO_IMAGE_ID_SERVER,CEO_IMAGE_REGISTER,CEO_IMAGE_REGISTER_SERVER,CEO_IMAGE_ID_PATH,CEO_IMAGE_REGIST_PATH )  ' +
                'VALUES ' +
                '   (?, ?, ?, SYSDATE(), "s010100010", ?, ' +
                '   (SELECT EMP_ID FROM TB_S10_EMP010 WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '" AND MEMBER_ID IS NULL), ' +
                '   SYSDATE(), "s010100010", ?, ?, ?, ?, ?, ?)'

            memberParams = [memberNm, regNo, memberTp, forMemberStatus, idCardFilename, idCardimageAddr, registCardFilename, registCardimageAddr, idCardFilePath, registCardFilePath];


        // 대표자신분증이 없을 경우 
        } else if ((existingIdCard != null || existingIdCard != undefined) && (existingRegistCard == null || existingRegistCard === undefined)) {

            memberSql =
                'INSERT INTO TB_S10_MEMBER010 ' +
                    '(MEMBER_NM, REG_NO, MEMBER_TP,CREATED_DATE,CREATED_PROGRAM_ID,MEMBER_ST,CEO_ID,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID,' +
                    'CEO_IMAGE_ID,CEO_IMAGE_ID_SERVER,CEO_IMAGE_REGISTER,CEO_IMAGE_REGISTER_SERVER,CEO_IMAGE_ID_PATH,CEO_IMAGE_REGIST_PATH )  ' +
                'VALUES ' +
                '   (?, ?, ?, SYSDATE(), "s010100010", ?, ' +
                '   (SELECT EMP_ID FROM TB_S10_EMP010 WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '" AND MEMBER_ID IS NULL), ' +
                '   SYSDATE(), "s010100010", null, null, ?, ?, null, ?)'

            memberParams = [memberNm, regNo, memberTp, forMemberStatus, registCardFilename, registCardimageAddr, registCardFilePath];

        // 사업자등록증이 없을 경우
        } else if ((existingIdCard == null || existingIdCard == undefined) && (existingRegistCard != null || existingRegistCard != undefined)) {

            memberSql =
                'INSERT INTO TB_S10_MEMBER010 ' +
                    '(MEMBER_NM, REG_NO, MEMBER_TP,CREATED_DATE,CREATED_PROGRAM_ID,MEMBER_ST,CEO_ID,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID,' +
                    'CEO_IMAGE_ID,CEO_IMAGE_ID_SERVER,CEO_IMAGE_REGISTER,CEO_IMAGE_REGISTER_SERVER,CEO_IMAGE_ID_PATH,CEO_IMAGE_REGIST_PATH )  ' +
                'VALUES ' +
                '   (?, ?, ?, SYSDATE(), "s010100010", ?, ' +
                '   (SELECT EMP_ID FROM TB_S10_EMP010 WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '" AND MEMBER_ID IS NULL), ' +
                '   SYSDATE(), "s010100010", ?, ?, null, null, ?, null)'

            memberParams = [memberNm, regNo, memberTp, forMemberStatus, idCardFilename, idCardimageAddr, idCardFilePath];


        // 대표자신분증-사업자등록증이 없을 경우
        } else if ((existingIdCard == null || existingIdCard == undefined) && (existingRegistCard == null || existingRegistCard == undefined)) {

            memberSql =
                'INSERT INTO TB_S10_MEMBER010 ' +
                    '(MEMBER_NM, REG_NO, MEMBER_TP,CREATED_DATE,CREATED_PROGRAM_ID,MEMBER_ST,CEO_ID,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID,' +
                    'CEO_IMAGE_ID,CEO_IMAGE_ID_SERVER,CEO_IMAGE_REGISTER,CEO_IMAGE_REGISTER_SERVER,CEO_IMAGE_ID_PATH,CEO_IMAGE_REGIST_PATH )  ' +
                'VALUES ' +
                '   (?, ?, ?, SYSDATE(), "s010100010", ?, ' +
                '   (SELECT EMP_ID FROM TB_S10_EMP010 WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '" AND MEMBER_ID IS NULL), ' +
                '   SYSDATE(), "s010100010", null, null, null, null, null, null)'

            memberParams = [memberNm, regNo, memberTp, forMemberStatus];

        }
        // ------------------같은 회원 다른 회사 첫번째 EMP는 MEMBER_ID잇음 두번째 EMP는 MEMBER_ID없음 
        // let empId = 'SELECT EMP_ID FROM TB_S10_EMP010 WHERE WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '" AND MEMBER_ID IS NULL';


        // let empMemberIdSql =
        //     'UPDATE TB_S10_EMP010 ' +
        //     '   SET MEMBER_ID = (SELECT MEMBER_ID FROM TB_S10_MEMBER010 WHERE MEMBER_NM = "' + memberNm + '"AND REG_NO = "' + regNo + '" AND CEO_ID =)' +
        //     ' WHERE EMP_ID = (SELECT EMP_ID ' +
        //     ' FROM ' +
        //     ' (SELECT EMP_ID ' +
        //     ' FROM TB_S10_EMP010 ' +
        //     ' WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '"' +
        //     ' AND MEMBER_ID IS NULL)EMPID)';

        /** TB_S10_CONTRACT010  */

        //계약구분
        let contractTp = req.body.contractTp;
        //호실
        let contractTpVal = req.body.contractTpVal;
        //사물함
        let roomLockerTp = req.body.roomLockerTp;
        //계약기간
        let contractTerm = req.body.contractTerm;
        //시작일자
        let startDate = req.body.startAsk_date.toString().substring(0, 10);

        //종료일자
        let endDate = req.body.endDate.toString().substring(0, 10);
        //입금일
        let payDate = req.body.startAsk_date.toString().substring(7, 10);
        //납부방법
        let payMethod = req.body.payMethod;
        //계약접근경로
        let contractPath = req.body.contractPath;
        //납부금액
        let contractMoney = req.body.contractMoney;
        // 특약사항
        let comments = req.body.comment;

        let selectedOption = req.body.selectedOption;

       


        connection.query(empSql, empParams, function (error, result) {
            console.log('empSql :' + result);

            if (error) {
                connection.rollback(function () {
                    console.log('empSql.error');
                    if (error){
                        setImmediate(() => {
                            next(new Error(error))
                            console.log('error',error);
                        })
                        //next(error);
                    }
                });
            }

            connection.query(memberSql, memberParams, function (error, result) {
                console.log('memberSql: ' + result);
                if (error) {
                    connection.rollback(function () {
                        console.log('memberSql.error');
                        if (error){
                            setImmediate(() => {
                                next(new Error(error))
                                console.log('error',error);
                            })
                            //next(error);
                        }
                    });
                }
                
                let empIdSql = 'SELECT EMP_ID FROM TB_S10_EMP010 WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '" AND MEMBER_ID IS NULL';
                
                connection.query(empIdSql, function (error, empId) {
                    console.log('empIdSql',empId);
                    console.log('empIdSql: ' + empId[0].EMP_ID);
                    if (error) {
                        connection.rollback(function () {
                            console.log('empIdSql.error');
                            if (error){
                                setImmediate(() => {
                                    next(new Error(error))
                                    console.log('error',error);
                                })
                                //next(error);
                            }
                        });
                    }

                    let empMemberIdSql =
                    'UPDATE TB_S10_EMP010 ' +
                    '   SET MEMBER_ID = (SELECT MEMBER_ID FROM TB_S10_MEMBER010 WHERE MEMBER_NM = "' + memberNm + '"AND REG_NO = "' + regNo + '" AND CEO_ID ="' + empId[0].EMP_ID + '")' +
                    ' WHERE EMP_ID = (SELECT EMP_ID ' +
                    ' FROM ' +
                    ' (SELECT EMP_ID ' +
                    ' FROM TB_S10_EMP010 ' +
                    ' WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '"' +
                    ' AND MEMBER_ID IS NULL)EMPID)';
                

                connection.query(empMemberIdSql, function (error, result) {
                    console.log('empMemberIdSql: ' + result);
                    if (error) {
                        connection.rollback(function () {
                            console.log('empMemberIdSql.error');
                            if (error){
                                setImmediate(() => {
                                    next(new Error(error))
                                    console.log('error',error);
                                })
                                //next(error);
                            }
                        });
                    }
                    
                    let contractSql;
                    let contractParams;
                    // 임시계약에서 이름이랑 전화번호만 넣으면 이름 전화번호 계약만 emp ceo_id에 넣기?
                    if(forMemberStatus === "T"){
                        contractSql =
                            'INSERT INTO TB_S10_CONTRACT010 ' +
                                '(CONTRACT_TP,CONTRACT_ROOM,CONTRACT_LOCKER,CONTRACT_TERM,START_DATE,END_DATE,' +
                                'PAY_DATE,PAY_METHOD,CONTRACT_PATH,CREATED_DATE,CREATED_PROGRAM_ID,CONTRACT_DATE,COMMENT,MEMBER_ID, ' +
                                'MONTHLY_FEE,DEPOSIT,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID) ' +
                            'VALUES (?,?,?,?,?,?,?,?,?,sysdate(),"s010100010",sysdate(),?,' +
                                '(SELECT MEMBER_ID ' +
                                '   FROM TB_S10_MEMBER010' +
                                '  WHERE MEMBER_NM ="' + memberNm + '" AND REG_NO="' + regNo + '" AND CEO_ID = (SELECT EMP_ID FROM TB_S10_EMP010 WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '"AND EMP_EMAIL="'+empEmail+'")),' + 
                                '?,?,SYSDATE(),"s010100010")';
               
                        contractParams = [contractTp, contractTpVal, roomLockerTp, contractTerm, startDate, endDate, payDate, payMethod, contractPath, comments, contractMoney, contractMoney];

                    }else if(forMemberStatus === "C"){

                        contractSql =
                            'INSERT INTO TB_S10_CONTRACT010 ' +
                                '(CONTRACT_TP,CONTRACT_ROOM,CONTRACT_LOCKER,CONTRACT_TERM,START_DATE,END_DATE,' +
                                'PAY_DATE,PAY_METHOD,CONTRACT_PATH,CREATED_DATE,CREATED_PROGRAM_ID,CONTRACT_DATE,COMMENT,MEMBER_ID, ' +
                                'MONTHLY_FEE,DEPOSIT,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID) ' +
                            'VALUES (?,?,?,?,?,?,?,?,?,sysdate(),"s010100010",sysdate(),?,' +
                                '(SELECT MEMBER_ID ' +
                                '   FROM TB_S10_MEMBER010' +
                                '  WHERE MEMBER_NM ="' + memberNm + '" AND REG_NO="' + regNo + '"),' + 
                                '?,?,SYSDATE(),"s010100010")';
               
                        contractParams = [contractTp, contractTpVal, roomLockerTp, contractTerm, startDate, endDate, payDate, payMethod, contractPath, comments, contractMoney, contractMoney];

                    }

                    connection.query(contractSql, contractParams, function (error, result) {  //쿼리문
                        console.log('contractSql: ' + result);

                        if (error) {
                            connection.rollback(function () {
                                console.log('contractSql.error');
                                if (error){
                                    setImmediate(() => {
                                        next(new Error(error))
                                        console.log('error',error);
                                    })
                                    //next(error);
                                }
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
                        let originDate = '';

                        let payContractSql;
                        let payContractParams = [];
                        let updatePayedDate = '';

                        // 월납
                        if (payMethod === 'MO') {
                            console.log('월납,selectedOption', selectedOption);
                            for (let i = 0; i < contractTerm; i++) {

                                finalDate = contractYearDay + '-' + (wasteMonth + i) + '-' + contractDateDay;
                                originDate = contractYearDay + '-' + (wasteMonth) + '-' + contractDateDay;


                                // 납부여부-네
                                if (selectedOption === 'Y') {

                                    payContractSql =
                                                    'INSERT INTO TB_S10_CONTRACT020 ' +
                                                    '(CONTRACT_ID,PAY_PLAN_DATE,CREATED_DATE,CREATED_PROGRAM_ID,PAYED_PLAN_MONEY,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID) ' +
                                                    'VALUES(' +
                                                    '(SELECT CONTRACT_ID ' +
                                                    ' FROM TB_S10_CONTRACT010 ' +
                                                    ' WHERE MEMBER_ID = (SELECT MEMBER_ID ' +
                                                    ' FROM TB_S10_MEMBER010 ' +
                                                    ' WHERE CEO_ID = (SELECT EMP_ID ' +
                                                    ' FROM TB_S10_EMP010 ' +
                                                    ' WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '")' +
                                                    ' AND MEMBER_NM ="' + memberNm + '" AND REG_NO ="' + regNo + '")),?,SYSDATE(),"s010100010",?,SYSDATE(),"s010100010")';

                                                payContractParams = [finalDate, contractMoney];
                                                
                                                 updatePayedDate = 'UPDATE TB_S10_CONTRACT020 ' +
                                                    '   SET PAYED_FLAG="' + selectedOption + '",PAYED_DATE="' + originDate + '"' +
                                                    ' WHERE CONTRACT_ID ='+
                                                    '(SELECT CONTRACT_ID ' +
                                                    ' FROM TB_S10_CONTRACT010 ' +
                                                    ' WHERE MEMBER_ID = (SELECT MEMBER_ID ' +
                                                    ' FROM TB_S10_MEMBER010 ' +
                                                    ' WHERE CEO_ID = (SELECT EMP_ID ' +
                                                    ' FROM TB_S10_EMP010 ' +
                                                    ' WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '")' +
                                                    ' AND MEMBER_NM ="' + memberNm + '" AND REG_NO ="' + regNo + '")) AND PAY_PLAN_DATE="'+originDate+'"'

                                    //     // 납부여부-아니오
                                } else if (selectedOption === 'N') {
                                    console.log('월납 아니오');
                                    payContractSql =
                                    'INSERT INTO TB_S10_CONTRACT020 ' +
                                    '(CONTRACT_ID,PAY_PLAN_DATE,CREATED_DATE,CREATED_PROGRAM_ID,PAYED_PLAN_MONEY,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID) ' +
                                    'VALUES(' +
                                    '(SELECT CONTRACT_ID ' +
                                    ' FROM TB_S10_CONTRACT010 ' +
                                    ' WHERE MEMBER_ID = (SELECT MEMBER_ID ' +
                                    ' FROM TB_S10_MEMBER010 ' +
                                    ' WHERE CEO_ID = (SELECT EMP_ID ' +
                                    ' FROM TB_S10_EMP010 ' +
                                    ' WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '")' +
                                    ' AND MEMBER_NM ="' + memberNm + '" AND REG_NO ="' + regNo + '")),?,SYSDATE(),"s010100010",?,SYSDATE(),"s010100010")';

                                payContractParams = [finalDate, contractMoney];

                                }

                                // console.log("--------------------------------");
                                // console.log('payContractParams', payContractParams);
                                // console.log("--------------------------------");

                         

                                connection.query(payContractSql, payContractParams, function (error, result) {  //쿼리문
                                    console.log('payContractSql',payContractSql);
                                    console.log('payContractSql :' + result);

                                    if (error) {
                                        connection.rollback(function () {
                                            console.log('payContractSql.error');
                                            if (error){
                                                if(i === contractTerm-1){
                                                    setImmediate(() => {
                                                        next(new Error(error))
                                                        console.log('error',error);
                                                    })
                                                    //next(error);
                                                }
                                            }
                                        });
                                    }

                                    if ((payMethod === 'MO' && selectedOption === 'Y')) {

                                        connection.query(updatePayedDate, function (error, result) {  //쿼리문
                                            console.log('updatePayedDate :' + result);

                                            if (error) {
                                                connection.rollback(function () {
                                                    console.log('updatePayedDate.error');
                                                  
                                                    if (error){
                                                        if(i === contractTerm-1){
                                                            setImmediate(() => {
                                                                next(new Error(error))
                                                                console.log('error',error);
                                                            })
                                                        //next(error);
                                                        }
                                                    }
                                                });
                                            }
                                            connection.commit(function (err) {
                                                if (error) {
                                                    connection.rollback(function () {
                                                       
                                                        if (error){
                                                            if(i === contractTerm-1){
                                                                setImmediate(() => {
                                                                    next(new Error(error))
                                                                    console.log('error',error);
                                                                })
                                                            //next(error);
                                                            }
                                                        }


                                                    });
                                                }else{
                                                    if(i === contractTerm-1){
                                                        console.log('success!');
                                                        res.send({ success: true });    
                                                    }
                                                }
                                            });//commit
                                        });// updatePayedDate
                                    } else {
                                        connection.commit(function (error) {
                                            if (error) {
                                                connection.rollback(function () {
                                             
                                                    if (error){
                                                        if(i === contractTerm-1){
                                                            setImmediate(() => {
                                                                next(new Error(error))
                                                                console.log('error',error);
                                                            })
                                                            //next(error);
                                                        }
                                                    }

                                                });
                                            }else{
                                                if(i === contractTerm-1){
                                                    console.log('success!');
                                                    res.send({ success: true });    
                                                }
                                            }
                                        });//commit
                                    }//else
                                });//payContract
                            }// for
                        }else if (payMethod === 'SI') {
                            console.log('일시불');
                            for (let i = 0; i < contractTerm; i++) {

                                finalDate = contractYearDay + '-' + (wasteMonth + i) + '-' + contractDateDay;
                                originDate = contractYearDay + '-' + (wasteMonth) + '-' + contractDateDay;
                             
                                // 납부여부-네
                                if (selectedOption === 'Y') {
                                    console.log('일시불 네');
                                    payContractSql =
                                    'INSERT INTO TB_S10_CONTRACT020 ' +
                                    '(CONTRACT_ID,PAY_PLAN_DATE,CREATED_DATE,CREATED_PROGRAM_ID,PAYED_PLAN_MONEY,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID,PAYED_FLAG,PAYED_DATE) ' +
                                    'VALUES(' +
                                    '(SELECT CONTRACT_ID ' +
                                    ' FROM TB_S10_CONTRACT010 ' +
                                    ' WHERE MEMBER_ID = (SELECT MEMBER_ID ' +
                                    ' FROM TB_S10_MEMBER010 ' +
                                    ' WHERE CEO_ID = (SELECT EMP_ID ' +
                                    ' FROM TB_S10_EMP010 ' +
                                    ' WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '")' +
                                    ' AND MEMBER_NM ="' + memberNm + '" AND REG_NO ="' + regNo + '")),?,SYSDATE(),"s010100010",?,SYSDATE(),"s010100010",?,?)';

                                payContractParams = [finalDate, contractMoney, selectedOption, originDate];
                                    // 납부여부-아니오
                                } else if (selectedOption === 'N') {
                                    console.log('일시불 아니오');
                                    payContractSql =
                                                    'INSERT INTO TB_S10_CONTRACT020 ' +
                                                    '(CONTRACT_ID,PAY_PLAN_DATE,CREATED_DATE,CREATED_PROGRAM_ID,PAYED_PLAN_MONEY,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID) ' +
                                                    'VALUES(' +
                                                    '(SELECT CONTRACT_ID ' +
                                                    ' FROM TB_S10_CONTRACT010 ' +
                                                    ' WHERE MEMBER_ID = (SELECT MEMBER_ID ' +
                                                    ' FROM TB_S10_MEMBER010 ' +
                                                    ' WHERE CEO_ID = (SELECT EMP_ID ' +
                                                    ' FROM TB_S10_EMP010 ' +
                                                    ' WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '")' +
                                                    ' AND MEMBER_NM ="' + memberNm + '" AND REG_NO ="' + regNo + '")),?,SYSDATE(),"s010100010",?,SYSDATE(),"s010100010")';

                                                payContractParams = [finalDate, contractMoney];

                                }

                                // console.log("--------------------------------");
                                // console.log('payContractParams', payContractParams);
                                // console.log("--------------------------------");

                             

                                connection.query(payContractSql, payContractParams, function (error, result) {  //쿼리문
                                    console.log('payContractSql :' + result);

                                    if (error) {
                                        connection.rollback(function () {
                                            console.log('payContractSql.error');
                                            
                                            if (error){
                                                if(i === contractTerm-1){
                                                setImmediate(() => {
                                                    next(new Error(error))
                                                    console.log('error');
                                                })
                                            }
                                                //next(error);
                                            }
                                        });
                                    }


                                    connection.commit(function (error) {
                                        if (error) {
                                            connection.rollback(function () {
                                            
                                                if (error){
                                                    if(i === contractTerm-1){
                                                        setImmediate(() => {
                                                            next(new Error(error))
                                                            console.log('error');
                                                        })
                                                        //next(error);
                                                    }
                                                }

                                                
                                            });
                                        }else{
                                            
                                            if(i === contractTerm-1){
                                                console.log('success!');
                                                res.send({ success: true });    
                                            }
                                        }
                                    });//commit
                                });//payContract

                            }// for
                            //납부여부 없는경우
                        }else if (payMethod === null || payMethod === undefined || payMethod === ''){
                            
                            
                            for (let i = 0; i < contractTerm; i++) {
                                let payContractSql='d';
                                finalDate = contractYearDay + '-' + (wasteMonth + i) + '-' + contractDateDay;
                                originDate = contractYearDay + '-' + (wasteMonth) + '-' + contractDateDay;  

                                    // 납부여부-네
                                if (selectedOption === 'Y') {
                                    console.log('납부방법 x일시불 네');
                                    payContractSql =
                                    'INSERT INTO TB_S10_CONTRACT020 ' +
                                    '(CONTRACT_ID,PAY_PLAN_DATE,CREATED_DATE,CREATED_PROGRAM_ID,PAYED_PLAN_MONEY,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID,PAYED_FLAG,PAYED_DATE) ' +
                                    'VALUES(' +
                                    '(SELECT CONTRACT_ID ' +
                                    ' FROM TB_S10_CONTRACT010 ' +
                                    ' WHERE MEMBER_ID = (SELECT MEMBER_ID ' +
                                    ' FROM TB_S10_MEMBER010 ' +
                                    ' WHERE CEO_ID = (SELECT EMP_ID ' +
                                    ' FROM TB_S10_EMP010 ' +
                                    ' WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '")' +
                                    ' AND MEMBER_NM ="' + memberNm + '" AND REG_NO ="' + regNo + '")),?,SYSDATE(),"s010100010",null,SYSDATE(),"s010100010",null,null)';

                                payContractParams = [finalDate, contractMoney, selectedOption, originDate];
                                    // 납부여부-아니오
                                } else if (selectedOption === 'N') {
                                    console.log('납부방법 x 일시불 아니오');
                                    payContractSql =
                                                    'INSERT INTO TB_S10_CONTRACT020 ' +
                                                    '(CONTRACT_ID,PAY_PLAN_DATE,CREATED_DATE,CREATED_PROGRAM_ID,PAYED_PLAN_MONEY,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID) ' +
                                                    'VALUES(' +
                                                    '(SELECT CONTRACT_ID ' +
                                                    ' FROM TB_S10_CONTRACT010 ' +
                                                    ' WHERE MEMBER_ID = (SELECT MEMBER_ID ' +
                                                    ' FROM TB_S10_MEMBER010 ' +
                                                    ' WHERE CEO_ID = (SELECT EMP_ID ' +
                                                    ' FROM TB_S10_EMP010 ' +
                                                    ' WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '")' +
                                                    ' AND MEMBER_NM ="' + memberNm + '" AND REG_NO ="' + regNo + '")),?,SYSDATE(),"s010100010",null,SYSDATE(),"s010100010")';

                                                payContractParams = [finalDate, contractMoney];

                                }else if(selectedOption === null || selectedOption === undefined || selectedOption === ''){
                                    console.log('납부방법x 납부여부 x');
                                    payContractSql =
                                                    'INSERT INTO TB_S10_CONTRACT020 ' +
                                                    '(CONTRACT_ID,PAY_PLAN_DATE,CREATED_DATE,CREATED_PROGRAM_ID,PAYED_PLAN_MONEY,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID) ' +
                                                    'VALUES(' +
                                                    '(SELECT CONTRACT_ID ' +
                                                    ' FROM TB_S10_CONTRACT010 ' +
                                                    ' WHERE MEMBER_ID = (SELECT MEMBER_ID ' +
                                                    ' FROM TB_S10_MEMBER010 ' +
                                                    ' WHERE CEO_ID = (SELECT EMP_ID ' +
                                                    ' FROM TB_S10_EMP010 ' +
                                                    ' WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '")' +
                                                    ' AND MEMBER_NM ="' + memberNm + '" AND REG_NO ="' + regNo + '")),?,SYSDATE(),"s010100010",null,SYSDATE(),"s010100010")';
                                                    payContractParams = [finalDate, contractMoney];
                                                    console.log('payContractSql',payContractSql);
                                }

                               

                                console.log("--------------------------------");
                                console.log('payContractParams', payContractParams);
                                console.log("--------------------------------");

                             console.log('payContractSql',payContractSql);

                                connection.query(payContractSql, function (error, result) {  //쿼리문
                                    console.log('payContractSql :' + result);

                                    if (error) {
                                        connection.rollback(function () {
                                            console.log('payContractSql.error');
                                            
                                            if (error){
                                                if(i === contractTerm-1){
                                                setImmediate(() => {
                                                    next(new Error(error))
                                                    console.log('error');
                                                })
                                            }
                                                // next(error);
                                            }
                                        });
                                    }


                                    connection.commit(function (error) {
                                        if (error) {
                                            connection.rollback(function () {
                                            
                                                if (error){
                                                    if(i === contractTerm-1){
                                                        setImmediate(() => {
                                                            // next(new Error(error))
                                                            console.log('error');
                                                        })
                                                        //next(error);
                                                    }
                                                }

                                                
                                            });
                                        }else{
                                            
                                            if(i === contractTerm-1){
                                                console.log('success!');
                                                res.send({ success: true });    
                                            }
                                        }
                                    });//commit
                                  
                                });//payContract
                            }// for
                         }// if(payMethod === 'SI')
                    });// contractSql
                });// empMemberIdSql
            });// empMemberIdSql
            });
        });

    })//transaction

})

module.exports = router;