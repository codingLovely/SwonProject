const express = require('express');
const dbconfig = require('./config/database.js')(); // 위에서 생성한 MySQL에 연결을 위한 코드(모듈)
const connection = dbconfig.init(); // node express 와 MySQL의 연동
const bodyParser = require('body-parser');
const multer = require('multer');
const { configure } = require('@testing-library/react');
const bcrypt = require('bcrypt');
//const { request } = require('express');
const app = express();

let upload = multer({dest: './src/uploads'})
let mime = require('mime');
let fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(fileUpload);
app.use('/image', express.static('./src/uploads'));


// 1. configuration 
app.set('port', process.env.PORT || 4001);



// 2. 상담등록 routing
app.post('/api/s010100140/selectTest', (req, res) => {
    let firstVal = req.body.firstVal;
    let secondVal = req.body.secondVal;
    //console.log(firstVal);
    let sql = `SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = '${firstVal}' AND ATTRIBUTE2 = '${secondVal}'`;

    connection.query(sql, (error, rows) => {
        res.send({ success: true, rows });
    });
})

app.post('/api/s010100010/roomLockerHier', (req, res) => {

    //console.log(firstVal);
    let sql = 'SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP ="L"';

    connection.query(sql, (error, rows) => {  //쿼리문
        if (error) throw error;
        res.send({ success: true, rows });
    });
})

app.post('/api/s010100010/contract', (req, res) => {
    //CD_TP ="CONTRACT_TP" and ATTRIBUTE2="ASK"
    let sql = 'SELECT t1.CD_V,t1.CD_V_MEANING,t2.CD_V ' +
        'FROM TB_S10_CODE t1 ' +
        'RIGHT JOIN TB_S10_CODE t2 ' +
        'ON t1.CD_TP = t2.CD_V ' +
        'WHERE t2.CD_TP = "CONTRACT_TP"'

    connection.query(sql, (error, rows) => {  //쿼리문 
        if (error) throw error;
        res.send({ success: true, rows });
    });
})


app.post('/api/s010100010/accessPath', (req, res) => {

    let sql = 'SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = "ACCESS_PATH" AND ATTRIBUTE1 ="CONTRACT"';

    connection.query(sql, (error, rows) => {  //쿼리문
        if (error) throw error;
        res.send({ success: true, rows });
        //console.log(rows);
    });
})


app.post('/api/s010100130/ask_tp', (req, res) => {
    //CD_TP ="ASK_METHOD"
    let sql = 'SELECT CD_V,CD_V_MEANING FROM tb_s10_code WHERE CD_TP = "CONTRACT_TP" AND ATTRIBUTE2="ASK"';
    connection.query(sql, (error, rows) => {  //쿼리문
        if (error) throw error;
        res.send({ success: true, rows });
    });
})
//2-1.끝>


//< 2-2. 상담등록
app.post('/api/s010100140', (req, res) => {
 
    let sql =
        'INSERT INTO ' +
        'TB_S10_ASK010 ( ASK_TP, ASK_DATE, ASK_METHOD, ASK_PATH, ASK_NAME, ASK_INFO, ASK_CONTENT ) ' +
        'VALUES ( ?, ?, ?, ?, ?, ?, ? )';

    let ask_tp = req.body.modalAskTp;
    let ask_date = req.body.modalAskDate;
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

//2-2.끝>

//< 2-2. 상담등록수정
app.post('/api/s010100140/modify', (req, res) => {


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
        ' TB_S10_ASK010 ' +
        'SET ASK_TP="' + ask_tp + '",' +
        ' ASK_DATE="' + ask_date + '",' +
        ' ASK_METHOD="' + ask_method + '",' +
        ' ASK_PATH="' + ask_path + '",' +
        ' ASK_NAME="' + ask_name + '",' +
        ' ASK_INFO="' + ask_info + '",' +
        ' ASK_CONTENT="' + ask_content + '",' +
        ' LAST_DELETE_DATE = sysdate()' +
        ' WHERE ASK_ID=' + ask_id +
        ' LIMIT 1'

    connection.query(sql, (error, rows) => {  //쿼리문
        if (error) throw error;
        res.send({ success: true, rows });
    });

})

//2-2.끝>

//<2-4. 상세보기
app.get('/api/s010100140/tb_s10_ask010_by_id', (req, res) => {

    //쿼리를 이용해서 가져올때는 body가 아닌type으로 가져온다
    let type = req.query.type
    let rNum = req.query.id
    //console.log(Rnum)
    let sql =
        'SELECT ' +
        'ASK010.ASK_ID' +
        ', CODE1.CD_V AS "ASK_TP"' +
        ', ASK010.ASK_DATE AS "ASK_DATE"' +
        ', CODE2.CD_V AS "ASK_METHOD"' +
        ', CODE3.CD_V AS "ASK_PATH"' +
        ', ASK010.ASK_NAME' +
        ', ASK_INFO ' +
        ', ASK_CONTENT ' +
        'FROM TB_S10_ASK010 ASK010' +
        ' LEFT JOIN TB_S10_CODE CODE1' +
        ' ON ASK010.ASK_TP = CODE1.CD_V' +
        ' AND CODE1.CD_TP = "CONTRACT_TP"' +
        ' AND CODE1.ATTRIBUTE2 = "ASK"' +
        ' LEFT OUTER JOIN TB_S10_CODE CODE2' +
        ' ON ASK010.ASK_METHOD = CODE2.CD_V' +
        ' AND CODE2.CD_TP = "ASK_METHOD"' +
        ' LEFT OUTER JOIN TB_S10_CODE CODE3' +
        ' ON ASK010.ASK_PATH = CODE3.CD_V' +
        ' AND CODE3.CD_TP = "ACCESS_PATH"' +
        ' AND CODE3.ATTRIBUTE2 = "ASK"' +
        ' where ASK_ID = ' + rNum

    connection.query(sql, (error, rows) => {//쿼리문
        if (error) throw error;
        res.send({ success: true, rows });
        //console.log(rows);
    });

})
//2-4.끝>

//<2-3.상담현황(s010100130) 조회
app.get('/api/s010100130', (req, res) => {

    let sql =
        'SELECT ' +
        'ASK010.ASK_ID' +
        ', CODE1.CD_V_MEANING AS "ASK_TP"' +
        ', DATE_FORMAT(ASK010.ASK_DATE,"%y-%m-%d") AS "ASK_DATE"' +
        ', CODE2.CD_V_MEANING AS "ASK_METHOD"' +
        ', CODE3.CD_V_MEANING AS "ASK_PATH"' +
        ', ASK010.ASK_NAME' +
        ', ASK_INFO ' +
        'FROM TB_S10_ASK010 ASK010' +
        ' LEFT JOIN TB_S10_CODE CODE1' +
        ' ON ASK010.ASK_TP = CODE1.CD_V' +
        ' AND CODE1.CD_TP = "CONTRACT_TP"' +
        ' AND CODE1.ATTRIBUTE2 = "ASK"' +
        ' LEFT OUTER JOIN TB_S10_CODE CODE2' +
        ' ON ASK010.ASK_METHOD = CODE2.CD_V' +
        ' AND CODE2.CD_TP = "ASK_METHOD"' +
        ' LEFT OUTER JOIN TB_S10_CODE CODE3' +
        ' ON ASK010.ASK_PATH = CODE3.CD_V' +
        ' AND CODE3.CD_TP = "ACCESS_PATH"' +
        ' AND CODE3.ATTRIBUTE2 = "ASK"' +
        ' WHERE ASK010.ASK_DATE BETWEEN DATE_FORMAT("2021/01/24","%y-%m-%d") AND DATE_FORMAT("2021/01/24","%y-%m-%d") ';

    //상담등록(TB_S10_ASK010 에 들어있는 모든 데이터 가져오기)
    connection.query(sql, (error, rows) => {
        if (error) throw error;
        res.send({ success: true, rows });
        console.log('전체조회rows:' + rows);
    });

})
//2-3끝>

//<회원상세보기 수정
app.post('/api/s010100050/modifyMember', (req, res) => {
    //상담 등록할때 필요한 정보들을 client에서 가져온것을
    //데이터베이스에 넣어준다.
    //console.log(req.body);
    let dataName = req.body.dataName;
    let dataEmpHp = req.body.dataEmpHp;

    let detailMemberNm = req.body.detailMemberNm;

    let detailFstRegNo = req.body.detailFstRegNo;
    let detailSndRegNo = req.body.detailSndRegNo;
    let detailThdRegNo = req.body.detailThdRegNo;

    let detailRegNo = detailFstRegNo + "-" + detailSndRegNo + "-" + detailThdRegNo;

    let detailMemberTp = req.body.detailMemberTp;
    let detailName = req.body.detailName;

    let detailFstEmpHp = req.body.detailFstEmpHp;
    let detailSndEmpHp = req.body.detailSndEmpHp;
    let detailThdEmpHp = req.body.detailThdEmpHp;

    let detailEmpHp = detailFstEmpHp + "-" + detailSndEmpHp + "-" + detailThdEmpHp;

    let detailEmail = req.body.detailEmpEmail;
    let detailDomain = req.body.detailDomain;

    let detailEmpEmail = detailEmail + "@" + detailDomain;

    let detailAddress = req.body.detailAddress;
    let detailZipcode = req.body.detailZipcode;
    let detailDetailAddress = req.body.detailDetailAddress;


    let sql =
        'UPDATE TB_S10_EMP010 EMP INNER JOIN TB_S10_MEMBER010 MEM ON' +
        '  EMP.EMP_ID=MEM.CEO_ID ' +
        'SET ' +
        '  MEM.MEMBER_NM="' + detailMemberNm + '",' +
        '  MEM.REG_NO="' + detailRegNo + '",' +
        '  MEM.MEMBER_TP="' + detailMemberTp + '",' +
        '  EMP.NAME="' + detailName + '",' +
        '  EMP.EMP_HP="' + detailEmpHp + '",' +
        '  EMP.EMP_EMAIL="' + detailEmpEmail + '",' +
        '  EMP.ZIP_CODE = "' + detailZipcode + '",' +
        '  EMP.ADDRESS = "' + detailAddress + '",' +
        '  EMP.DETAIL_ADDRESS ="' + detailDetailAddress + '"' +
        ' WHERE EMP.NAME="' + dataName + '"  AND EMP.EMP_HP="' + dataEmpHp + '"';

    connection.query(sql, (error, rows) => {  //쿼리문
        if (error) throw error;
        res.send({ success: true });
    });

})
//회원상세보기 끝>

//<3-1.회원현황조회

app.post('/api/s010100040/list', (req, res) => {
    let sql =
        '  SELECT ' +
        '                 member010.MEMBER_ID   ' +
        '                , member010.REG_NO   ' +
        '                , member010.MEMBER_NM   ' +
        '                , code1.CD_V_MEANING AS "MEMBER_TP"  ' +
        '                , code2.CD_V_MEANING AS "MEMBER_ST"  ' +
        '                , emp010.NAME   ' +
        '                , emp010.EMP_HP   ' +
        '                , emp010.EMP_EMAIL ' +
        '                , con010.END_FLAG ' +
        ' FROM  TB_S10_MEMBER010 member010   ' +
        '           INNER JOIN TB_S10_EMP010 emp010 ON member010.CEO_ID = emp010.EMP_ID ' +
        '           INNER JOIN TB_S10_CONTRACT010 con010 ON member010.MEMBER_ID = con010.MEMBER_ID ' +
        '           LEFT OUTER JOIN TB_S10_CODE code1 ON member010.MEMBER_TP = code1.CD_V   ' +
        '                AND CODE1.CD_TP = "MEMBER_TP" ' +
        '           LEFT OUTER JOIN TB_S10_CODE code2 ON member010.MEMBER_ST = code2.CD_V  ' +
        '                AND CODE2.CD_TP = "MEMBER_ST" ' +
        'WHERE MEMBER_ST != "D" ' +
        'ORDER BY MEMBER010.MEMBER_ID DESC';

    //MEMBER010 EMP010 JOIN 에 들어있는 모든 데이터 가져오기)
    connection.query(sql, (error, rows) => {
        if (error) throw error;
        res.send({ success: true, rows });

    });

})

//끝>

//회원현황 select박스
app.get('/api/s010100140/selectMemberTp', (req, res) => {
   
    let sql = 'SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = "MEMBER_TP"';

    connection.query(sql, (error, rows) => { 
        if (error) throw error;
        res.send({ success: true, rows });
    });
})




app.post('/api/s010100050/detailNewContract_by_id', (req, res) => {
    let type = req.query.type;
    let memberIdForNew = req.query.id;

    connection.beginTransaction(function (error) {

        let detailMemberNm = req.body.memberNm;

        let detailFstRegNo = req.body.firstRegNo;
        let detailSndRegNo = req.body.secondRegNo;
        let detailThdRegNo = req.body.thirdRegNo;

        let detailRegNo = detailFstRegNo + "-" + detailSndRegNo + "-" + detailThdRegNo;

        let detailMemberTp = req.body.memberTp;
        let detailName = req.body.empIdName;

        let detailFstEmpHp = req.body.firstEmpHp;
        let detailSndEmpHp = req.body.secondEmpHp;
        let detailThdEmpHp = req.body.thirdEmpHp;

        let detailEmpHp = detailFstEmpHp + "-" + detailSndEmpHp + "-" + detailThdEmpHp;

        let detailEmail = req.body.empEmailId;
        let detailDomain = req.body.domainAddress;

        let detailEmpEmail = detailEmail + "@" + detailDomain;

        let detailAddress = req.body.empAddress;
        let detailZipcode = req.body.zipcode;
        let detailDetailAddress = req.body.empDetailAddress;

        let updateSql =
            'UPDATE TB_S10_EMP010 EMP INNER JOIN TB_S10_MEMBER010 MEM ON' +
            '  EMP.EMP_ID=MEM.CEO_ID ' +
            'SET ' +
            '  MEM.MEMBER_NM="' + detailMemberNm + '",' +
            '  MEM.REG_NO="' + detailRegNo + '",' +
            '  MEM.MEMBER_TP="' + detailMemberTp + '",' +
            '  EMP.NAME="' + detailName + '",' +
            '  EMP.EMP_HP="' + detailEmpHp + '",' +
            '  EMP.EMP_EMAIL="' + detailEmpEmail + '",' +
            '  EMP.ZIP_CODE = "' + detailZipcode + '",' +
            '  EMP.ADDRESS = "' + detailAddress + '",' +
            '  EMP.DETAIL_ADDRESS ="' + detailDetailAddress + '"' +
            ' WHERE MEM.MEMBER_ID = ' + memberIdForNew;


        //if (dateChkNum === 0 && empHpChkNum === 0 && regNoChkNum === 0) {
        let comments = req.body.comment;
        //계약구분
        let contractTp = req.body.contractTp;
        //호실
        let contractTpVal = req.body.contractTpVal;
        //사물함
        let roomLockerTp = req.body.roomLockerTp;
        //계약기간
        let contractTerm = req.body.contractTerm;
        //시작일자
        let startDate = req.body.startAsk_date;

        //종료일자
        let endDate = req.body.endDate;
        //입금일
        let payDate = req.body.payDate;
        //납부방법
        let payMethod = req.body.payMethod;
        //계약접근경로
        let contractPath = req.body.contractPath;


        let contractSql =
            'INSERT INTO ' +
            'TB_S10_CONTRACT010(CONTRACT_TP,CONTRACT_ROOM,CONTRACT_LOCKER,CONTRACT_TERM,START_DATE,END_DATE,' +
            'PAY_DATE,PAY_METHOD,CONTRACT_PATH,CREATED_DATE,CONTRACT_DATE,COMMENT,MEMBER_ID ) ' +
            'VALUES (?,?,?,?,?,?,?,?,?,SYSDATE(),?,?,?)'
        //여기서 생성된 contract_id가 con2에 가야함

        let contractParams = [contractTp, contractTpVal, roomLockerTp, contractTerm, startDate, endDate, payDate, payMethod, contractPath, startDate, comments, memberIdForNew];
        //contract_id는 -> sequence로 생성

        //납부금액
        let contractMoney = req.body.contractMoney;

        connection.query(updateSql, function (error, result) {  //쿼리문
            //console.log('contractSql: ' + result);
            if (error) {
                connection.rollback(function () {
                    console.log('contractSql.error');
                    throw error;
                });
            }

            connection.query(contractSql, contractParams, function (error, result) {  //쿼리문
                //console.log('contractSql: ' + result);
                if (error) {
                    connection.rollback(function () {
                        console.log('contractSql.error');
                        throw error;
                    });
                }
                //payDate->입금일만 보여줌(년월 없음), payed_date는 실제 납부 일자로 나중에 insert할 자리
                //pay_plan_date 납부예정일 넣어서 for문 돌려서 insert하기

                //startDate '2021-03-01'
                let dateToString = startDate.toString().substring(0, 10);
                //날 01
                let contractDateDay = parseInt(dateToString.substring(8, 10));
                //월 03
                let contractMonthDay = parseInt(dateToString.substring(5, 7));
                //년 2021
                let contractYearDay = parseInt(dateToString.substring(0, 4));

                let finalDate = '';
                let dateMonth = 0;
                // console.log('dateToString: ' + dateToString);
                // console.log('contractDateDay: ' + contractDateDay);
                // console.log('contractMonthDay: ' + contractMonthDay);
                // console.log('contractYearDay: ' + contractYearDay);


                //계약시작일자가 납부일보다 크면 29 1
                if (contractDateDay > parseInt(payDate)) {
                    //console.log(payDate);
                    if (contractMonthDay >= 12) {
                        contractMonthDay = 1;
                        //console.log('contractMonthDay11: ' + contractMonthDay);
                        //contractMonthDay += 1;
                        //console.log('contractMonthDay11: ' + contractMonthDay);
                    } else {
                        contractMonthDay += 1;
                    }
                    finalDate = contractYearDay + '-' + contractMonthDay + '-' + payDate;
                    //계약일자가 납부일보다 작으면 1 29
                } else if (contractDateDay <= parseInt(payDate)) {
                    finalDate = contractYearDay + '-' + contractMonthDay + '-' + payDate;
                    //console.log('contractMonthDay22: ' + contractMonthDay);
                }
                //월만 우선 정해서 받아주는 곳 끝-------
                //let finalityOfDate = new Date(contractYearDay,contractMonthDay,payDate);
                //console.log('finality :' + finalityOfDate);
                let monthDay = 0;
                let payContractSql = '';
                let payContractParams = [];

                // payContractSql = 'INSERT INTO ' +
                //     'TB_S10_CONTRACT020(CONTRACT_ID,PAY_PLAN_DATE,CREATED_DATE,PAYED_MONEY) ' +
                //     'VALUES((SELECT CONTRACT_ID FROM TB_S10_CONTRACT010 WHERE MEMBER_ID = (SELECT EMP_ID FROM TB_S10_EMP010 WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '") ),?,SYSDATE(),?)';
                // payContractParams = [finalDate, contractMoney];
                //console.log(payContractSql);

                for (let i = 1; i <= contractTerm; i++) {
                    //console.log('!!!!!!!!!!!!!!!!!!!contractMonthDay: ' + contractMonthDay);
                    //console.log('!!!!!!!!!!!!!!!!!monthDay: ' + monthDay);
                    finalDate = contractYearDay + '-' + contractMonthDay + '-' + payDate;
                
                    payContractSql = 'INSERT INTO  TB_S10_CONTRACT020(CONTRACT_ID,PAY_PLAN_DATE,CREATED_DATE,PAYED_PLAN_MONEY)  \n' +
                        '\t\t\t  VALUES((SELECT CONTRACT_ID FROM (SELECT  \n' +
                        '              CONTRACT_ID  \n' +
                        '              ,ROW_NUMBER() OVER(ORDER BY CONTRACT_ID DESC) AS RN  \n' +
                        '              FROM TB_S10_CONTRACT010 CON010  \n' +
                        '              ) CON010  \n' +
                        '              WHERE RN = 1),?,SYSDATE(),?)';
                    //여기서 생성된 contract_id가 con2에 가야함

                    // console.log(payContractSql);
                    // console.log("--------------------------------");
                    // console.log(finalDate);
                    // console.log("--------------------------------");
                    // console.log(payContractParams);
                    // console.log("--------------------------------");
                    payContractParams = [finalDate, contractMoney];
                    // console.log("--------------------------------");
                    // console.log('finalDate: ' + finalDate);

                    contractMonthDay++;

                    connection.query(payContractSql, payContractParams, function (error, result) {  //쿼리문
                        //console.log('payContractSql :' + result);

                        if (error) {
                            connection.rollback(function () {
                                console.log('payContractSql.error');
                                throw error;
                            });
                        }
                        // }

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

                //     });//contract
                // } else if (dateChkNum >= 1 || empHpChkNum >= 1 || regNoChkNum >= 1) {
                //     res.send({msg: 'chk failed because of already exists'});
                // }
            });
          });
        })//transaction
    })
    app.get('/api/s01010010/insert/tb_s10_contract010_by_id', (req, res) => {

        let type = req.query.type
        let memberId = req.query.id
        console.log(memberId);

        let sql =
            'SELECT \n' +
            '\t   EMP.NAME, EMP.EMP_HP, EMP.EMP_EMAIL, EMP.ADDRESS,EMP.ZIP_CODE,EMP.DETAIL_ADDRESS,\n' +
            '\t   MEM.MEMBER_NM, MEM.REG_NO, CODE1.CD_V AS "MEMBER_TP"\n' +
            'FROM TB_S10_EMP010 EMP \n' +
            'INNER JOIN TB_S10_MEMBER010 MEM\n' +
            'ON EMP.EMP_ID = MEM.CEO_ID\n' +
            'LEFT JOIN TB_S10_CODE CODE1  ON MEM.MEMBER_TP = CODE1.CD_V\n' +
            'AND CODE1.CD_TP = "MEMBER_TP"\n' +
            'WHERE MEM.MEMBER_ID =' + memberId
        //console.log(sql);

        connection.query(sql, (error, rows) => {//쿼리문
            //console.log(rows);
            if (error) throw error;
            //console.log(rows);
            res.send({ success: true, rows });

        });

    })

    app.get('/api/s01010010/tb_s10_contract010_by_id', (req, res) => {

        let type = req.query.type
        let contractId = req.query.id
        //console.log(contractId);

        let sql =
            'SELECT EMP.NAME, EMP.EMP_HP, EMP.EMP_EMAIL, EMP.ADDRESS,EMP.ZIP_CODE,EMP.DETAIL_ADDRESS,\n' +
            '\t   MEM.MEMBER_NM, MEM.REG_NO, CODE1.CD_V AS "MEMBER_TP", CODE1.CD_V_MEANING AS "MEMBER_TP_M", CODE2.CD_V AS "MEMBER_ST",\n' +
            '       CODE2.CD_V_MEANING AS "MEMBER_ST_M",CON.CONTRACT_ID, CON.CONTRACT_DATE, CON.CONTRACT_MONEY, CODE3.CD_V AS "CONTRACT_TP" , \n' +
            '       CODE3.CD_V_MEANING AS "CONTRACT_TP_M" ,CON.END_DATE,\n' +
            '       CON.END_FLAG ,\n' +
            '       CON.PAY_DATE,' +
            '       CODE6.CD_V AS"CONTRACT_ROOM", CODE6.CD_V_MEANING AS"CONTRACT_ROOM_M",\n' +
            '       CODE7.CD_V AS"CONTRACT_LOCKER", CODE7.CD_V_MEANING AS"CONTRACT_LOCKER_M",\n' +
            '       CON.COMMENT,\n' +
            '       CON.CONTRACT_TERM,\n' +
            '       PCON.PAYED_PLAN_MONEY,\n' +
            '       CON.PAY_METHOD,\n' +
            '       CODE4.CD_V AS "PAY_METHOD",CODE4.CD_V_MEANING AS "PAY_METHOD_M",' +
            '       CODE5.CD_V AS "CONTRACT_PATH",' +
            '       CODE5.CD_V_MEANING AS "CONTRACT_PATH_M" \n' +
            'FROM TB_S10_EMP010 EMP \n' +
            'INNER JOIN TB_S10_MEMBER010 MEM\n' +
            'ON EMP.EMP_ID = MEM.CEO_ID\n' +
            'INNER JOIN TB_S10_CONTRACT010 CON\n' +
            'ON MEM.MEMBER_ID = CON.MEMBER_ID\n' +
            'INNER JOIN TB_S10_CONTRACT020 PCON\n' +
            'ON CON.CONTRACT_ID = PCON.CONTRACT_ID\n' +
            'LEFT JOIN TB_S10_CODE CODE1  \n' +
            'ON MEM.MEMBER_TP = CODE1.CD_V  \n' +
            'AND CODE1.CD_TP ="MEMBER_TP"  \n' +
            'LEFT JOIN TB_S10_CODE CODE2  \n' +
            'ON MEM.MEMBER_ST = CODE2.CD_V  \n' +
            'AND CODE2.CD_TP ="MEMBER_ST"  \n' +
            'LEFT JOIN TB_S10_CODE CODE3  \n' +
            'ON CON.CONTRACT_TP = CODE3.CD_V  \n' +
            'AND CODE3.CD_TP ="CONTRACT_TP"  \n' +
            'AND CODE3.ATTRIBUTE1 = "CONTRACT"  \n' +
            'LEFT JOIN TB_S10_CODE CODE4  \n' +
            'ON CON.PAY_METHOD = CODE4.CD_V  \n' +
            'AND CODE4.CD_TP ="PAY_METHOD"  \n' +
            'LEFT JOIN TB_S10_CODE CODE5  \n' +
            'ON CON.CONTRACT_PATH = CODE5.CD_V  \n' +
            'AND CODE5.CD_TP ="ACCESS_PATH"\n' +
            'LEFT JOIN TB_S10_CODE code6 ON CON.CONTRACT_ROOM = CODE6.CD_V   \n' +
            'LEFT OUTER JOIN TB_S10_CODE code7 ON CON.CONTRACT_LOCKER = CODE7.CD_V   \n' +
            'AND CODE7.CD_TP = "L"\n' +
            'WHERE CON.CONTRACT_ID =' + contractId;
        //console.log(sql);

        connection.query(sql, (error, rows) => {//쿼리문
            //console.log(rows);
            if (error) throw error;
            //console.log(rows);
            res.send({ success: true, rows });

        });

    })
    //2-4.끝>


    app.get('/api/s01010070/insert/tb_s10_contract020_by_id', (req, res) => {

        let type = req.query.type
        let dataContracId = req.query.id
        //console.log(dataContracId);

        let sql =
            'SELECT EMP.NAME, EMP.EMP_HP, EMP.EMP_EMAIL, EMP.ADDRESS,EMP.ZIP_CODE,EMP.DETAIL_ADDRESS, ' +
            '       MEM.MEMBER_NM, MEM.REG_NO, CODE1.CD_V_MEANING AS "MEMBER_TP", CODE2.CD_V_MEANING AS "MEMBER_ST", ' +
            '       CON.CONTRACT_DATE, CON.CONTRACT_MONEY, CODE3.CD_V_MEANING AS "CONTRACT_TP" ,  ' +
            '       DATE_FORMAT(CON.START_DATE,"%y.%m.%d") AS "START_DATE",' +
            '       DATE_FORMAT(CON.END_DATE,"%y.%m.%d" ) AS "END_DATE",' +
            '       CON.END_FLAG , ' +
            '       DATE_FORMAT(PCON.PAYED_DATE,"%y.%m.%d") AS "PAYED_DATE",' +
            '       CODE6.CD_V_MEANING AS"CONTRACT_ROOM", ' +
            '       CODE7.CD_V_MEANING AS"CONTRACT_LOCKER", ' +
            '       CON.COMMENT, ' +
            '       CON.CONTRACT_TERM, ' +
            '       PCON.PAYED_MONEY, ' +
            '       DATE_FORMAT(PCON.PAY_PLAN_DATE,"%y.%m.%d") AS "PAY_PLAN_DATE", ' +
            '       PCON.CONTRACT_ID, ' +
            '       PCON.PAYED_FLAG, ' +
            '       PCON.CONTRACT_COMMENT, ' +
            '       CON.PAY_METHOD, ' +
            '       CODE4.CD_V_MEANING AS "PAY_METHOD",CODE5.CD_V_MEANING AS "CONTRACT_PATH" ' +
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
            'LEFT JOIN TB_S10_CODE CODE4    ' +
            'ON CON.PAY_METHOD = CODE4.CD_V    ' +
            'AND CODE4.CD_TP ="PAY_METHOD"    ' +
            'LEFT JOIN TB_S10_CODE CODE5    ' +
            'ON CON.CONTRACT_PATH = CODE5.CD_V    ' +
            'AND CODE5.CD_TP ="ACCESS_PATH"  ' +
            'LEFT JOIN TB_S10_CODE code6 ON CON.CONTRACT_ROOM = CODE6.CD_V    ' +
            'LEFT OUTER JOIN TB_S10_CODE code7 ON CON.CONTRACT_LOCKER = CODE7.CD_V    ' +
            'AND CODE7.CD_TP = "L"  ' +
            'WHERE PCON.CONTRACT_ID =' + dataContracId;

        connection.query(sql, (error, rows) => {//쿼리문
            //console.log(rows);
            if (error) throw error;
            //console.log(rows);
            res.send({ success: true, rows });

        });

    })

    //<2-5.검색하기
    app.post('/api/s010100130/search', (req, res) => {

        //console.log(req.body);
        //console.log('startDate:' + req.body.startAsk_date.toString());
        let startDate = req.body.startAsk_date.toString().substring(0, 10);
        //console.log('startDate:'+ req.body.startAsk_date.toString());
        let endDate = req.body.endAsk_date.toString().substring(0, 10);
        let ask_tp = req.body.ask_tp;
        let searchName = req.body.ask_name;


        //console.log(req.body.searchName);
        // console.log('startDateToString: '+startDate.toString().substring(0,8));
        // console.log('endDate: '+endDate);
        // // console.log('ask_tp: '+ask_tp);
        // console.log('searchName: '+searchName);
        //console.log('ask_tp:' + ask_tp);

        let sql =
            'SELECT ' +
            'ASK010.ASK_ID' +
            ', CODE1.CD_V_MEANING AS "ASK_TP"' +
            ', DATE_FORMAT(ASK010.ASK_DATE,"%y-%m-%d") AS "ASK_DATE"' +
            ', CODE2.CD_V_MEANING AS "ASK_METHOD"' +
            ', CODE3.CD_V_MEANING AS "ASK_PATH"' +
            ', ASK010.ASK_NAME' +
            ', ASK_INFO ' +
            'FROM TB_S10_ASK010 ASK010' +
            ' LEFT JOIN TB_S10_CODE CODE1' +
            ' ON ASK010.ASK_TP = CODE1.CD_V' +
            ' AND CODE1.CD_TP = "CONTRACT_TP"' +
            ' AND CODE1.ATTRIBUTE2 = "ASK"' +
            ' LEFT OUTER JOIN TB_S10_CODE CODE2' +
            ' ON ASK010.ASK_METHOD = CODE2.CD_V' +
            ' AND CODE2.CD_TP = "ASK_METHOD"' +
            ' LEFT OUTER JOIN TB_S10_CODE CODE3' +
            ' ON ASK010.ASK_PATH = CODE3.CD_V' +
            ' AND CODE3.CD_TP = "ACCESS_PATH"' +
            ' AND CODE3.ATTRIBUTE2 = "ASK"' +
            ' WHERE ASK010.ASK_DATE BETWEEN "' + startDate + '" AND "' + endDate + '" ' +
            ' AND ASK010.LAST_DELETE_FLAG =""';

        if (ask_tp != null && ask_tp != "" && ask_tp != "전체" )//null아니고 전체가 아닐때 때, null 아니고 공백이 아닐때
            sql += ' AND ASK010.ASK_TP= "' + ask_tp + '" ';
        if (searchName != null && searchName != "")
            sql += ' AND ASK010.ASK_NAME LIKE "%' + searchName + '%"'

        connection.query(sql, (error, rows) => {//쿼리문
            if (error) throw error;

            res.send({ success: true, rows });
        })
    })
    //2-5.끝>


    //<3-1.회원정보 상세정보
    app.post('/api/s010100050/detailMember_by_id', (req, res) => {

        let empHp= req.body.dataEmpHp
        let name = req.body.dataName

        let sql = 'SELECT   \n' +
            '                                 MEM.MEMBER_ID,MEM.MEMBER_NM,MEM.REG_NO,CODE1.CD_V "MEMBER_TP",  \n' +
            '                                 MEM.CEO_IMAGE_ID,MEM.CEO_IMAGE_ID_SERVER,MEM.CEO_IMAGE_REGISTER,MEM.CEO_IMAGE_REGISTER_SERVER,  \n' +
            '                                 EMP.NAME,EMP.EMP_HP,EMP.EMP_EMAIL,EMP.ZIP_CODE,EMP.ADDRESS,EMP.DETAIL_ADDRESS,    \n' +
            '                                 CON.CONTRACT_ID,DATE_FORMAT(CON.END_DATE,"%y.%m.%d") AS "END_DATE",'+                                                                                      
            '                                 DATE_FORMAT(CON.CONTRACT_DATE,"%y.%m.%d") AS "CONTRACT_DATE",' +
            '                                 CODE2.CD_V_MEANING AS "MEMBER_ST", \n' +
            '                                 CODE3.CD_V_MEANING AS"CONTRACT_TP",  \n' +
            '                                 CODE5.CD_V_MEANING AS "CONTRACT_LOCKER",  \n' +
            '                                 CODE4.CD_V_MEANING AS "CONTRACT_ROOM",  \n' +
            '                                 CON.CONTRACT_TERM,CON.PAY_DATE,CON.CONTRACT_MONEY,     \n' +
            '                                 CON.END_FLAG,  \n' +
            '                                 PCON.PAYED_PLAN_MONEY, ' +
            '                                 DATE_FORMAT(CON.START_DATE,"%y.%m.%d") AS "START_DATE"\n' +
            '                           FROM TB_S10_MEMBER010 MEM   \n' +
            '                                 INNER JOIN TB_S10_EMP010 EMP     \n' +
            '                                 ON MEM.CEO_ID = EMP.EMP_ID     \n' +
            '                                 INNER JOIN TB_S10_CONTRACT010 CON     \n' +
            '                                 ON MEM.MEMBER_ID = CON.MEMBER_ID   \n' +
            '                                 INNER JOIN (SELECT DISTINCT CONTRACT_ID ,PAYED_PLAN_MONEY    \n' +
            '                                 FROM TB_S10_CONTRACT020 C020) PCON  \n' +
            '                                 ON CON.CONTRACT_ID = PCON.CONTRACT_ID  \n' +
            '                                 LEFT OUTER JOIN TB_S10_CODE code1 ON MEM.MEMBER_TP = CODE1.CD_V     \n' +
            '                                 AND CODE1.CD_TP = "MEMBER_TP"   \n' +
            '                                 LEFT OUTER JOIN TB_S10_CODE code2 ON MEM.MEMBER_ST = CODE2.CD_V     \n' +
            '                                 AND CODE2.CD_TP = "MEMBER_ST"  \n' +
            '\t\t\t\t\t\t\t\t LEFT OUTER JOIN TB_S10_CODE CODE3 ON CON.CONTRACT_TP = CODE3.CD_V     \n' +
            '                                 AND CODE3.CD_TP = "CONTRACT_TP" AND CODE3.ATTRIBUTE1 = "CONTRACT" \n' +
            '                                 LEFT OUTER JOIN TB_S10_CODE code4 ON CON.CONTRACT_ROOM = CODE4.CD_V     \n' +
            '                                 LEFT OUTER JOIN TB_S10_CODE code5 ON CON.CONTRACT_LOCKER = CODE5.CD_V     \n' +
            '                                 AND CODE5.CD_TP = "L"  \n' +
            '                                 WHERE EMP.NAME = "' + name + '" AND EMP.EMP_HP ="' + empHp + '"';


        connection.query(sql, (error, rows) => {//쿼리문
            if (error) throw error;
            res.send({ success: true, rows });
            //console.log(rows);
        });
    })
    //3-1.끝>


    app.post('/api/s010100130/delete', (req, res) => {
        console.log('체크박스');
        let askIdArray = req.body;
        let sql = '';
        let resultRows = [];
        let error = '';

        //배열에 담겨있는 숫자 분리해서 넣기
        for (let i = 0; i < askIdArray.length; i++) {

            sql =
                'UPDATE ' +
                ' TB_S10_ASK010 ' +
                ' SET LAST_DELETE_FLAG = "*",' +
                ' LAST_DELETE_DATE = sysdate()' +
                ' WHERE ASK_ID=' + askIdArray[i] +
                ' LIMIT 1';

            //console.log(sql);

            connection.query(sql, (error, resultRows) => {//쿼리문
            });

        }//for
        if (error) throw error;
        res.send({ success: true })
        //console.log(resultRows);
    })


    app.post('/api/s010100010/contHier', (req, res) => {
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

    app.post('/api/s010100010/monthlyMoney', (req, res) => {

        let cdTpRoom = req.body.contractTpBody;
        console.log(cdTpRoom);
        let sql = 'SELECT ATTRIBUTE3 FROM TB_S10_CODE WHERE CD_TP = "' + cdTpRoom + '"';

        connection.query(sql, (error, rows) => {//쿼리문
            if (error) throw error;
            res.send({ success: true, rows })
        });

    })


    //3. 로그인 routing
    //로그인 기능을 위한 라우터
    app.post('/api/users/login', (req, res) => {
        //요청된 이메일을 데이터베이스에서 있는지 찾는다.
        let Email = req.body.Email;
        let Password = req.body.PASSWORD;

        //console.log('Email',Email);
        //console.log('Password',Password);
        // connection.query('SELECT * from users where Email="'+ Email+'" and PASSWORD = "'+Password+'"', (error, rows) => {//쿼리문
        //   if(error) throw error;
        //   //console.log(rows)
        //   if(rows > 0){
        //     return res.send({loginResult:true});
        //   }else{
        //     return res.send({loginResult:false});
        //   }
        // })
    })

    // app.post('api/s010100100',(req,res)=>{

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




    app.post('/api/s010100050/detailModifyContract_by_id', (req, res) => {
        
        let type = req.query.type;
        let modifyDataNum = req.query.id;
        //console.log(modifyDataNum);
        let payPlanDateModifySql;

        if (dateChkNum === 0 && empHpChkNum === 0 && regNoChkNum === 0) {
            connection.beginTransaction(function (error) {
                let empIdName = req.body.empIdName;

                let firstEmpHp = req.body.firstEmpHp;
                let secondEmpHp = req.body.secondEmpHp;
                let thirdEmpHp = req.body.thirdEmpHp;
                let empHp = firstEmpHp + "-" + secondEmpHp + "-" + thirdEmpHp;

                let empEmailId = req.body.empEmailId;
                let domainAddress = req.body.domainAddress;
                let empEmail = empEmailId + "@" + domainAddress;

                let zipcode = req.body.zipcode;
                let empAddress = req.body.empAddress;
                let empDetailAddress = req.body.empDetailAddress;

                let memberNm = req.body.memberNm;


                let firstRegNo = req.body.firstRegNo;
                let secondRegNo = req.body.secondRegNo;
                let thirdRegNo = req.body.thirdRegNo;
                let regNo = firstRegNo + "-" + secondRegNo + "-" + thirdRegNo;

                let memberTp = req.body.memberTp;
                let comments = req.body.comment;
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



                let modifySql = 'UPDATE TB_S10_EMP010 EMP ' +
                '   INNER JOIN TB_S10_MEMBER010 MEM ON EMP.EMP_ID = MEM.MEMBER_ID ' +
                '   INNER JOIN TB_S10_CONTRACT010 CON ON MEM.MEMBER_ID = CON.MEMBER_ID ' +
                '       INNER JOIN TB_S10_CONTRACT020 CON2 ON CON.CONTRACT_ID = CON2.CONTRACT_ID ' +
                'SET MEM.MEMBER_NM = "' + memberNm + '" ,' +
                ' MEM.REG_NO = "' + regNo + '",' +
                '    MEM.MEMBER_TP = "' + memberTp + '",' +
                '    EMP.NAME = "' + empIdName + '",' +
                '    EMP.EMP_HP = "' + empHp + '",' +
                '    EMP.EMP_EMAIL = "' + empEmail + '",' +
                '    EMP.ZIP_CODE = "' + zipcode + '",' +
                '    EMP.ADDRESS = "' + empAddress + '",' +
                '    EMP.DETAIL_ADDRESS = "' + empDetailAddress + '",' +
                '    CON.CONTRACT_TP =  "' + contractTp + '",' +
                '    CON.CONTRACT_ROOM = "' + contractTpVal + '",' +
                '    CON.CONTRACT_LOCKER = "' + roomLockerTp + '",' +
                '    CON.CONTRACT_TERM = ' + contractTerm + ',' +
                '    CON.START_DATE = "' + startDate + '",' +
                '    CON.END_DATE = "' + endDate + '",' +
                '    CON.PAY_DATE = "' + payDate + '",' +
                '    CON.CONTRACT_PATH = "' + contractPath + '",' +
                '    CON.PAY_METHOD = "' + payMethod + '",' +
                '    CON.CONTRACT_PATH = "' + contractPath + '",' +
                '    CON.CONTRACT_DATE = "' + startDate + '",' +
                '    CON2.PAYED_PLAN_MONEY = "' + contractMoney + '"' +
                'WHERE CON.CONTRACT_ID = ' + modifyDataNum;

                let bringDateSql = 'SELECT DATE_FORMAT(PAY_PLAN_DATE,"%y-%m-%d") AS "PAY_PLAN_DATE" FROM TB_S10_CONTRACT020 '+
                                   ' WHERE CONTRACT_ID ='+ modifyDataNum;

            connection.query(bringDateSql, function (error, rows) {
                    //console.log('memberSql: ' + result);
                        if (error) {
                            connection.rollback(function () {
                                console.log('bringDateSql.error');
                                throw error;
                            });
                           
                        }

                connection.query(modifySql, function (error, result) {
                        //console.log('memberSql: ' + result);
                        if (error) {
                            connection.rollback(function () {
                                console.log('modifySql.error');
                                throw error;
                            });
                        }


                let dateToString = startDate.toString().substring(0, 10);
                let wasteDateDay = dateToString.substring(7, 10);
                let wasteContracMonthDay = dateToString.substring(5, 7);
                let wasteContractYearDay = dateToString.substring(0, 4);

             
                // //날 01
                let contractDateDay = parseInt(wasteDateDay);
                let wasteMonth =  parseInt(wasteContracMonthDay);
                let contractYearDay =  parseInt(wasteContractYearDay);

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
                    //console.log('finalDate 입금일이 더 클 때',finalDate);
                }
            
                for (let i = 0; i < contractTerm; i++) {

                    while(contractMonthDay > 12){
                        contractYearDay  += 1;
                        contractMonthDay -= 12;
                    }
                    
                    finalDate = contractYearDay + '-' + contractMonthDay + '-' + payDate;
                    //console.log(finalDate);

                    payPlanDateModifySql =   'UPDATE TB_S10_CONTRACT020'+   
                    ' SET PAY_PLAN_DATE = "' + finalDate + '" ' +
                    ' WHERE CONTRACT_ID = ' + modifyDataNum + ' AND PAY_PLAN_DATE ="' + rows[i].PAY_PLAN_DATE + '"' ;

                    contractMonthDay++;
                    //console.log('payPlanDateModifySql', payPlanDateModifySql );
                }

                connection.query(payPlanDateModifySql, function (error, result) {  //쿼리문
                    //console.log('contractSql: ' + result);

                    if (error) {
                        connection.rollback(function () {
                            console.log('payPlanDateModifySql.error');
                            throw error;
                        });
                    }
                    connection.commit(function (err,result) {
                        if (err) {
                            connection.rollback(function () {
                                throw err;
                                
                            });
                            console.log('SUCCESS!');
                            res.send({ success: true });
                        }
                    });//commit
                    });//memberId
                });//commit
                });//modifySql
            })//transaction
        } else if (regNoChkNum >= 1 || empHpChkNum >= 1 || dateChkNum >= 1){
            res.send({check: false, message: "이미 존재하는 데이터 입니다."});
        }
    })


    let regNoChkNum;
    app.post('/api/s010100140/regNoCheck', (req, res) => {

        let firstRegNo = req.body.firstRegNo;
        let secondRegNo = req.body.secondRegNo;
        let thirdRegNo = req.body.thirdRegNo;
        // console.log("firstRegNo: " + firstRegNo);
        // console.log("secondRegNo: " + secondRegNo);
        // console.log("thirdRegNo: " + thirdRegNo);
        // console.log(firstRegNo + secondRegNo + thirdRegNo);
        let RegNo = firstRegNo + "-" + secondRegNo + "-" + thirdRegNo;

        let regNoChkSql = 'SELECT  COUNT(REG_NO) AS RowNum  \n' +
            '\t\tFROM TB_S10_MEMBER010 MEM010 \n' +
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
    app.post('/api/s010100140/empHpCheck', (req, res) => {

        let firstEmpHp = req.body.firstEmpHp;
        let secondEmpHp = req.body.secondEmpHp;
        let thirdEmpHp = req.body.thirdEmpHp;

        let EmpHp = firstEmpHp + "-" + secondEmpHp + "-" + thirdEmpHp;

        let empHpChkSql =
            'SELECT  COUNT(EMP_HP) AS RowNum  \n' +
            '\t\tFROM TB_S10_EMP010 EMP010 \n' +
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

    app.post('/api/s010100140/dateCheck', (req, res) => {

        let contractTp = req.body.contractTp;
        let contractTpVal = req.body.contractTpVal;
        let roomLockerTp = req.body.roomLockerTp;
        let startDate = req.body.startDate;
        let endDate = req.body.endDate;


        let dateChkSql =
            'SELECT  COUNT(START_DATE) AS STARTENDDATE \n' +
            '        FROM TB_S10_CONTRACT010 CON010 \n' +
            '        WHERE CON010.START_DATE="' + startDate + '" AND CON010.END_DATE="' + endDate + '" '+
            ' AND CON010.CONTRACT_ROOM';

        connection.query(dateChkSql, (error, number) => {//쿼리문
            if (error) throw error;
            res.send({ success: true, number })
            dateChkNum = number[0].STARTENDDATE;
            //console.log(number[0].RowNum);
            //console.log(number.RowDataPacket.RowNum);
        });
    })
    //<<회원현황 조회
    app.post('/api/s010100040/searchMember', (req, res) => {
       
        let memberNm = req.body.memberNm;
        let regNo = req.body.regNo;
        let name = req.body.name;
        let memberTp = req.body.memberTp;
        let contractStatus = req.body.contractStatus;
        let memberSt = req.body.memberSt;
        
        let sql =
            'SELECT' +
            ' member010.MEMBER_ID ' +
            ', member010.REG_NO ' +
            ', member010.MEMBER_NM ' +
            ', code1.CD_V_MEANING AS "MEMBER_TP" ' +
            ', code2.CD_V_MEANING AS "MEMBER_ST" ' +
            ', emp010.NAME ' +
            ', emp010.EMP_HP ' +
            ', emp010.EMP_EMAIL ' +
            ', contract010.END_FLAG ' +
            'FROM TB_S10_MEMBER010 member010 ' +
            'INNER JOIN TB_S10_EMP010 emp010 ' +
            'ON member010.CEO_ID = emp010.EMP_ID ' +
            'INNER JOIN TB_S10_CONTRACT010 CONTRACT010 ' +
            'ON CONTRACT010.MEMBER_ID = MEMBER010.MEMBER_ID ' +
            'LEFT OUTER JOIN TB_S10_CODE code1 ' +
            'ON member010.MEMBER_TP = code1.CD_V ' +
            'AND CODE1.CD_TP = "MEMBER_TP" ' +
            'LEFT OUTER JOIN TB_S10_CODE code2 ' +
            'ON member010.MEMBER_ST = code2.CD_V ' +
            'AND CODE2.CD_TP = "MEMBER_ST" ' +
            'WHERE 1=1 AND MEMBER_ST != "D"';

        if (memberTp != null && memberTp != "")
            sql += ' AND member010.MEMBER_TP = "' + memberTp + '"';
        if (contractStatus != null && contractStatus != "")
            sql += ' AND contract010.END_FLAG = "' + contractStatus + '"';
        if (memberSt != null && memberSt != "")
            sql += ' AND member010.MEMBER_ST = "' + memberSt + '"';
        if (memberNm != null && memberNm != "")
            sql += ' AND member010.MEMBER_NM LIKE "%' + memberNm + '%"';
        if (regNo != null && regNo != "")
            sql += ' AND member010.REG_NO LIKE "%' + regNo + '%"';
        if (name != null && name != "")
            sql += ' AND emp010.NAME LIKE "%' + name + '%"';

            sql += ' ORDER BY member010.MEMBER_ID DESC';
        connection.query(sql, (error, rows) => {
            if (error) throw error;
            res.send({ success: true, rows })
        })

    })
    //>

    //<이용계약서 등록
    app.post('/api/s010100010/insertMember010',upload.fields([{name:'idCardFile',maxCount:3},{name:'registCardFile',maxCount:5}]), (req, res) => {
        //console.log('dataCheck',req,res);
      if (dateChkNum === 0 && empHpChkNum === 0 && regNoChkNum === 0) {
            connection.beginTransaction(function (error) {
                //emp010-> 대표자 이름
                let empIdName = req.body.empIdName;
                //console.log('empIdName: ' + empIdName);
                //emp010-> 대표자 연락처
                let firstEmpHp = req.body.firstEmpHp;
                let secondEmpHp = req.body.secondEmpHp;
                let thirdEmpHp = req.body.thirdEmpHp;
                let empHp = firstEmpHp + "-" + secondEmpHp + "-" + thirdEmpHp;

                // console.log('firstEmpHp: ' + firstEmpHp);
                // console.log('secondEmpHp: ' + secondEmpHp);
                // console.log('thirdEmpHp: ' + thirdEmpHp);
                // console.log('empHp: ' + empHp);

                //emp010-> 대표자 이메일
                let empEmailId = req.body.empEmailId;
                let domainAddress = req.body.domainAddress;
                let empEmail = empEmailId + "@" + domainAddress;
                // console.log('empEmail: ' + empEmail);
                //emp010-> 대표자 주소
                let zipcode = req.body.zipcode;
                let empAddress = req.body.empAddress;
                let empDetailAddress = req.body.empDetailAddress;
                // console.log('zipcode: ' + zipcode);
                // console.log('empAddress: ' + empAddress);
                // console.log('empDetailAddress: ' + empDetailAddress);
                

                //insert .. from tb_s10_emp010;
                let empSql = 'INSERT INTO TB_S10_EMP010 (CREATED_DATE, NAME, EMP_HP, EMP_EMAIL,' +
                    'ZIP_CODE,ADDRESS,DETAIL_ADDRESS,CEO_FLAG,LAST_UPDATE_DATE) VALUES (SYSDATE(),?,?,?,?,?,?,"Y",SYSDATE())';

                let empParams = [empIdName, empHp, empEmail, zipcode, empAddress, empDetailAddress];

                //select한 값 emp_id에insert하기 contract010에 member_id넣을 때 insert into contract010(member_id) where tb_s10_member010 ceo_id;
                //회원명
                let memberNm = req.body.memberNm;
                //console.log('memberNm: ' + memberNm);
                // 전화번호
                let firstRegNo = req.body.firstRegNo;
                let secondRegNo = req.body.secondRegNo;
                let thirdRegNo = req.body.thirdRegNo;
                let regNo = firstRegNo + "-" + secondRegNo + "-" + thirdRegNo;
                //회원구분(법인,개인,프리랜서)
                let memberTp = req.body.memberTp;
                //코멘트
                let comments = req.body.comment;
                let userStatus = req.body.userStatus;

                // let image = '/image/' + req.body.idCardFileName;
                // console.log('filename',req.body.idCardFileName);
                // let filename = (req.body.idCardFileName).split('\\').reverse()[0];
                // console.log('filename!!',filename);
                // let image = '/image/' + req.file.filename;
                // console.log('testIdCardFile',req.files['idCardFile'][0]);
                // console.log('testRegistCardFile',req.files['registCardFile'][0].filename);
               
                let idCardimageAddr = '/image/'+ req.files['idCardFile'][0].filename;
                let idCardFilename = req.files['idCardFile'][0].originalname;
                let idCardFilePath = req.files['idCardFile'][0].path;
                let testFilePath = idCardFilePath + ".jpg";
                
                
                let registCardimageAddr = './image/'+ req.files['registCardFile'][0].filename;
                let registCardFilename = req.files['registCardFile'][0].originalname;
                let registCardFilePath = req.files['registCardFile'][0].path;
                
                // console.log('image',image);
                // console.log('idCardFilename',idCardFilename);
                

                let memberSql =
                    'INSERT INTO  ' +
                    '            TB_S10_MEMBER010 ( MEMBER_NM, REG_NO, MEMBER_TP,CREATED_DATE,MEMBER_ST,COMMENT,CEO_ID,LAST_UPDATE_DATE,'+
                    'CEO_IMAGE_ID,CEO_IMAGE_REGISTER_SERVER,CEO_IMAGE_REGISTER,CEO_IMAGE_ID_SERVER,CEO_IMAGE_ID_PATH,CEO_IMAGE_REGIST_PATH )  ' +
                    '            VALUES (?, ?, ?, SYSDATE(),"C", ?, (SELECT EMP_ID FROM TB_S10_EMP010 WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '"),'+
                    'SYSDATE(),?,?,?,?,?,?)'
                //console.log(memberSql);
                let memberParams = [memberNm, regNo, memberTp, comments, idCardFilename, idCardimageAddr, registCardFilename,registCardimageAddr,testFilePath,registCardFilePath];
                //Member_id는 -> sequence로 생성

                //tb_s10_contract010
                //select member_id where ,,ceo_id 에insert하기

                //계약구분
                let contractTp = req.body.contractTp;
                //호실
                let contractTpVal = req.body.contractTpVal;
                //사물함
                let roomLockerTp = req.body.roomLockerTp;
                //계약기간
                let contractTerm = req.body.contractTerm;
                //시작일자
                let startDate = req.body.startAsk_date;

                //종료일자
                let endDate = req.body.endDate;
                //입금일
                let payDate = req.body.payDate;
                //납부방법
                let payMethod = req.body.payMethod;
                //계약접근경로
                let contractPath = req.body.contractPath;
            


                let contractSql =
                    'INSERT INTO ' +
                    'TB_S10_CONTRACT010(CONTRACT_TP,CONTRACT_ROOM,CONTRACT_LOCKER,CONTRACT_TERM,START_DATE,END_DATE,' +
                    'PAY_DATE,PAY_METHOD,CONTRACT_PATH,CREATED_DATE,CONTRACT_DATE,COMMENT,MEMBER_ID,LAST_UPDATE_DATE) ' +
                    'VALUES (?,?,?,?,?,?,?,?,?,SYSDATE(),?,?,(SELECT MEMBER_ID FROM TB_S10_MEMBER010 WHERE CEO_ID = ' +
                    '(SELECT EMP_ID FROM TB_S10_EMP010 WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '")),SYSDATE())';

                let contractParams = [contractTp, contractTpVal, roomLockerTp, contractTerm, startDate, endDate, payDate, payMethod, contractPath, startDate, comments];
                //contract_id는 -> sequence로 생성

                //납부금액
                let contractMoney = req.body.contractMoney;
    

                if (error) throw error;

                connection.query(empSql, empParams, function (error, result) {
                    //console.log('empSql :' + result);
                    if (error) {
                        connection.rollback(function () {
                            console.log('empSql.error');
                            throw error;
                        });
                    }

                    connection.query(memberSql, memberParams, function (error, result) {
                        //console.log('memberSql: ' + result);
                        if (error) {
                            connection.rollback(function () {
                                console.log('memberSql.error');
                                throw error;
                            });
                        }

                        connection.query(contractSql, contractParams, function (error, result) {  //쿼리문
                            //console.log('contractSql: ' + result);

                            if (error) {
                                connection.rollback(function () {
                                    console.log('contractSql.error');
                                    throw error;
                                });
                            }

                            //payDate->입금일만 보여줌(년월 없음), payed_date는 실제 납부 일자로 나중에 insert할 자리
                            //pay_plan_date 납부예정일 넣어서 for문 돌려서 insert하기

                            //startDate '2021-03-01'
                            let dateToString = startDate.toString().substring(0, 10);
                            let wasteDateDay = dateToString.substring(7, 10);
                            let wasteContracMonthDay = dateToString.substring(5, 7);
                            let wasteContractYearDay = dateToString.substring(0, 4);

                            // //날 01
                            let contractDateDay = parseInt(wasteDateDay);
                            let wasteMonth =  parseInt(wasteContracMonthDay);
                            let contractYearDay =  parseInt(wasteContractYearDay);

                            let finalDate = '';
                            let contractMonthDay = wasteMonth;

                            // console.log('dateToString: ' + dateToString);
                            // console.log('contractDateDay: ' + contractDateDay);
                            // console.log('contractMonthDay: ' + contractMonthDay);
                            // console.log('contractYearDay: ' + contractYearDay);

                            
                            // //계약시작일자가 납부일보다 크면 29 1
                            if (contractDateDay > parseInt(payDate)) {
                                //console.log(payDate);
                    
                             contractMonthDay = wasteMonth + 1;
                            //console.log(contractMonthDay);
                            //// console.log('납부일보다크면 contractMonthDay:' + contractMonthDay);
                            //// console.log('납부일보다크면typeOf contractMonthDay:' , typeof contractMonthDay);
                            //// console.log('납부일보다크면typeOf contractMonthDay:' , typeof 1);
                            //// console.log('납부일보다크면 contractMonthDay:' + contractMonthDay + 1);
                                    

                             finalDate = contractYearDay + '-' + contractMonthDay + '-' + payDate;
                            //     console.log('finalDate 납부일이 더 작을 때:',finalDate);
                            //     //계약일자가 납부일보다 작으면 1 29
                             } else if (contractDateDay <= parseInt(payDate)) {
                             finalDate = contractYearDay + '-' + contractMonthDay + '-' + payDate;
                             }
                            //     //console.log('contractMonthDay22: ' + contractMonthDay);
                            //     console.log('finalDate 납부일이 더 클 때:',finalDate);
                            // }
                          
                           
                            let payContractSql = '';
                            let payContractParams = [];
                             
                            

                            for (let i = 1; i <= contractTerm; i++) {

                                while(contractMonthDay > 12){
                                    contractYearDay  += 1;
                                    contractMonthDay -= 12;
                                }
                                //console.log('!!!!!!!!!!!!!!!!!!!contractMonthDay: ' + contractMonthDay);
                                //console.log('!!!!!!!!!!!!!!!!!monthDay: ' + monthDay);
                                
                                finalDate = contractYearDay + '-' + contractMonthDay + '-' + payDate;
                                payContractSql = 'INSERT INTO ' +
                                    'TB_S10_CONTRACT020(CONTRACT_ID,PAY_PLAN_DATE,CREATED_DATE,PAYED_PLAN_MONEY,LAST_UPDATE_DATE) ' +
                                    'VALUES((SELECT CONTRACT_ID FROM TB_S10_CONTRACT010 '+ 
                                    ' WHERE MEMBER_ID = (SELECT MEMBER_ID FROM TB_S10_MEMBER010 ' +
                                    ' WHERE CEO_ID = (SELECT EMP_ID FROM TB_S10_EMP010 '+
                                    ' WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '")))'+
                                    ',?,SYSDATE(),?,SYSDATE())';

                                payContractParams = [finalDate, contractMoney];
                                
                                console.log("--------------------------------");
                                console.log('payContractParams',payContractParams);
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
                                    // }

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
                    });//memberId
                });//emp
            })//transaction
        } else if (regNoChkNum >= 1 || empHpChkNum >= 1 || dateChkNum >= 1){
            res.send({check: false, message: "이미 존재하는 데이터 입니다."});
        } 
    })

    app.post('/api/s010100140/tempStorage', (req, res) => {
        if (dateChkNum === 0 && empHpChkNum === 0 && regNoChkNum === 0) {
            connection.beginTransaction(function (error) {
                //emp010-> 대표자 이름
                let empIdName = req.body.empIdName;
                // console.log('empIdName: ' + empIdName);
                //emp010-> 대표자 연락처
                let firstEmpHp = req.body.firstEmpHp;
                let secondEmpHp = req.body.secondEmpHp;
                let thirdEmpHp = req.body.thirdEmpHp;
                let empHp = firstEmpHp + "-" + secondEmpHp + "-" + thirdEmpHp;
                // console.log('firstEmpHp: ' + firstEmpHp);
                // console.log('secondEmpHp: ' + secondEmpHp);
                // console.log('thirdEmpHp: ' + thirdEmpHp);
                // console.log('empHp: ' + empHp);
                //emp010-> 대표자 이메일
                let empEmailId = req.body.empEmailId;
                let domainAddress = req.body.domainAddress;
                let empEmail = empEmailId + "@" + domainAddress;
                // console.log('empEmail: ' + empEmail);
                //emp010-> 대표자 주소
                let zipcode = req.body.zipcode;
                let empAddress = req.body.empAddress;
                let empDetailAddress = req.body.empDetailAddress;
                // console.log('zipcode: ' + zipcode);
                // console.log('empAddress: ' + empAddress);
                // console.log('empDetailAddress: ' + empDetailAddress);

                //insert .. from tb_s10_emp010;
                let empSql = 'INSERT INTO TB_S10_EMP010 (CREATED_DATE, NAME, EMP_HP, EMP_EMAIL,' +
                    'ZIP_CODE,ADDRESS,DETAIL_ADDRESS,CEO_FLAG) VALUES (SYSDATE(),?,?,?,?,?,?,"Y")';

                let empParams = [empIdName, empHp, empEmail, zipcode, empAddress, empDetailAddress];

                //select한 값 emp_id에insert하기 contract010에 member_id넣을 때 insert into contract010(member_id) where tb_s10_member010 ceo_id;
                //회원명
                let memberNm = req.body.memberNm;
                //console.log('memberNm: ' + memberNm);
                // 전화번호
                let firstRegNo = req.body.firstRegNo;
                let secondRegNo = req.body.secondRegNo;
                let thirdRegNo = req.body.thirdRegNo;
                let regNo = firstRegNo + "-" + secondRegNo + "-" + thirdRegNo;
                //회원구분(법인,개인,프리랜서)
                let memberTp = req.body.memberTp;
                //코멘트
                let comments = req.body.comment;

                let memberSql =
                    'INSERT INTO  ' +
                    '            TB_S10_MEMBER010 ( MEMBER_NM, REG_NO, MEMBER_TP,CREATED_DATE,MEMBER_ST,COMMENT,CEO_ID)  ' +
                    '            VALUES (?, ?, ?, SYSDATE(),"T",?, (SELECT EMP_ID FROM TB_S10_EMP010 WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '"))'
                //console.log(memberSql);
                let memberParams = [memberNm, regNo, memberTp, comments];
                //Member_id는 -> sequence로 생성

                //tb_s10_contract010
                //select member_id where ,,ceo_id 에insert하기

                //계약구분
                let contractTp = req.body.contractTp;
                //호실
                let contractTpVal = req.body.contractTpVal;
                //사물함
                let roomLockerTp = req.body.roomLockerTp;
                //계약기간
                let contractTerm = req.body.contractTerm;
                //시작일자
                let startDate = req.body.startAsk_date;

                //종료일자
                let endDate = req.body.endDate;
                //입금일
                let payDate = req.body.payDate;
                //납부방법
                let payMethod = req.body.payMethod;
                //계약접근경로
                let contractPath = req.body.contractPath;


                let contractSql =
                    'INSERT INTO ' +
                    'TB_S10_CONTRACT010(CONTRACT_TP,CONTRACT_ROOM,CONTRACT_LOCKER,CONTRACT_TERM,START_DATE,END_DATE,' +
                    'PAY_DATE,PAY_METHOD,CONTRACT_PATH,CREATED_DATE,CONTRACT_DATE,COMMENT,MEMBER_ID ) ' +
                    'VALUES (?,?,?,?,?,?,?,?,?,SYSDATE(),?,?,(SELECT MEMBER_ID FROM TB_S10_MEMBER010 WHERE CEO_ID = ' +
                    '(SELECT EMP_ID FROM TB_S10_EMP010 WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '")))';

                let contractParams = [contractTp, contractTpVal, roomLockerTp, contractTerm, startDate, endDate, payDate, payMethod, contractPath, startDate, comments];
                //contract_id는 -> sequence로 생성

                //납부금액
                let contractMoney = req.body.contractMoney;
                // 납부년월
                // let payPlanDate = req.body.startAsk_date;

                //payDate->입금일만 보여줌(년월 없음), payed_date는 실제 납부 일자로 나중에 insert할 자리
                //pay_plan_date 납부예정일 넣어서 for문 돌려서 insert하기

                // //startDate '2021-03-01'
                // let dateToString = startDate.toString().substring(0, 10);
                // //날 01
                // let contractDateDay = parseInt(dateToString.substring(8, 10));
                // //월 03
                // let contractMonthDay = parseInt(dateToString.substring(5, 7));
                // //년 2021
                // let contractYearDay = parseInt(dateToString.substring(0, 4));
                //
                // let finalDate = '';
                // let dateMonth = 0;
                // // console.log('dateToString: ' + dateToString);
                // // console.log('contractDateDay: ' + contractDateDay);
                // // console.log('contractMonthDay: ' + contractMonthDay);
                // // console.log('contractYearDay: ' + contractYearDay);
                //
                //
                // //계약시작일자가 납부일보다 크면 29 1
                // if (contractDateDay > parseInt(payDate)) {
                //     //console.log(payDate);
                //     if (contractMonthDay >= 12) {
                //         contractMonthDay = 1;
                //         //console.log('contractMonthDay11: ' + contractMonthDay);
                //         //contractMonthDay += 1;
                //         //console.log('contractMonthDay11: ' + contractMonthDay);
                //     } else {
                //         contractMonthDay += 1;
                //     }
                //     finalDate = contractYearDay + '-' + contractMonthDay + '-' + payDate;
                //     //계약일자가 납부일보다 작으면 1 29
                // } else if (contractDateDay <= parseInt(payDate)) {
                //     finalDate = contractYearDay + '-' + contractMonthDay + '-' + payDate;
                //     //console.log('contractMonthDay22: ' + contractMonthDay);
                // }
                // //월만 우선 정해서 받아주는 곳 끝-------
                // //let finalityOfDate = new Date(contractYearDay,contractMonthDay,payDate);
                // //console.log('finality :' + finalityOfDate);
                // let monthDay = 0;
                // let payContractSql = '';
                // let payContractParams = [];
                //
                // // payContractSql = 'INSERT INTO ' +
                // //     'TB_S10_CONTRACT020(CONTRACT_ID,PAY_PLAN_DATE,CREATED_DATE,PAYED_MONEY) ' +
                // //     'VALUES((SELECT CONTRACT_ID FROM TB_S10_CONTRACT010 WHERE MEMBER_ID = (SELECT EMP_ID FROM TB_S10_EMP010 WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '") ),?,SYSDATE(),?)';
                // // payContractParams = [finalDate, contractMoney];
                // //console.log(payContractSql);
                //
                // for (let i = 1; i <= contractTerm; i++) {
                //     //console.log('!!!!!!!!!!!!!!!!!!!contractMonthDay: ' + contractMonthDay);
                //     //console.log('!!!!!!!!!!!!!!!!!monthDay: ' + monthDay);
                //     finalDate = contractYearDay + '-' + contractMonthDay + '-' + payDate;
                //     payContractSql = 'INSERT INTO ' +
                //         'TB_S10_CONTRACT020(CONTRACT_ID,PAY_PLAN_DATE,CREATED_DATE,PAYED_PLAN_MONEY) ' +
                //         'VALUES((SELECT CONTRACT_ID FROM TB_S10_CONTRACT010 WHERE MEMBER_ID = (SELECT MEMBER_ID FROM TB_S10_MEMBER010 WHERE CEO_ID = (SELECT EMP_ID FROM TB_S10_EMP010 WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '"))),?,SYSDATE(),?)';
                //
                //     console.log(payContractSql);
                //     console.log("--------------------------------");
                //     console.log(finalDate);
                //     console.log("--------------------------------");
                //     console.log(payContractParams);
                //     console.log("--------------------------------");
                //     payContractParams = [finalDate, contractMoney];
                //     console.log("--------------------------------");
                //     console.log('finalDate: ' + finalDate);
                //
                //     contractMonthDay++;
                // }


                if (error) throw error;

                connection.query(empSql, empParams, function (error, result) {
                    //console.log('empSql :' + result);
                    if (error) {
                        connection.rollback(function () {
                            console.log('empSql.error');
                            throw error;
                        });
                    }

                    connection.query(memberSql, memberParams, function (error, result) {
                        //console.log('memberSql: ' + result);
                        if (error) {
                            connection.rollback(function () {
                                console.log('memberSql.error');
                                throw error;
                            });
                        }

                        connection.query(contractSql, contractParams, function (error, result) {  //쿼리문
                            //console.log('contractSql: ' + result);

                            if (error) {
                                connection.rollback(function () {
                                    console.log('contractSql.error');
                                    throw error;
                                });
                            }


                            //payDate->입금일만 보여줌(년월 없음), payed_date는 실제 납부 일자로 나중에 insert할 자리
                            //pay_plan_date 납부예정일 넣어서 for문 돌려서 insert하기

                            //startDate '2021-03-01'
                             dateToString = startDate.toString().substring(0, 10);
                            //날 01
                            let contractDateDay = parseInt(dateToString.substring(8, 10));
                            //월 03
                            let contractMonthDay = parseInt(dateToString.substring(5, 7));
                            //년 2021
                            let contractYearDay = parseInt(dateToString.substring(0, 4));

                            let finalDate = '';
                            let dateMonth = 0;
                            // console.log('dateToString: ' + dateToString);
                            // console.log('contractDateDay: ' + contractDateDay);
                            // console.log('contractMonthDay: ' + contractMonthDay);
                            // console.log('contractYearDay: ' + contractYearDay);


                            //계약시작일자가 납부일보다 크면 29 1
                            if (contractDateDay > parseInt(payDate)) {
                                //console.log(payDate);
                                if (contractMonthDay >= 12) {
                                    contractMonthDay = 1;
                                    //console.log('contractMonthDay11: ' + contractMonthDay);
                                    //contractMonthDay += 1;
                                    //console.log('contractMonthDay11: ' + contractMonthDay);
                                } else {
                                    contractMonthDay += 1;
                                }
                                finalDate = contractYearDay + '-' + contractMonthDay + '-' + payDate;
                                //계약일자가 납부일보다 작으면 1 29
                            } else if (contractDateDay <= parseInt(payDate)) {
                                finalDate = contractYearDay + '-' + contractMonthDay + '-' + payDate;
                                //console.log('contractMonthDay22: ' + contractMonthDay);
                            }
                            //월만 우선 정해서 받아주는 곳 끝-------
                            //let finalityOfDate = new Date(contractYearDay,contractMonthDay,payDate);
                            //console.log('finality :' + finalityOfDate);
                            let monthDay = 0;
                            let payContractSql = '';
                            let payContractParams = [];

                            // payContractSql = 'INSERT INTO ' +
                            //     'TB_S10_CONTRACT020(CONTRACT_ID,PAY_PLAN_DATE,CREATED_DATE,PAYED_MONEY) ' +
                            //     'VALUES((SELECT CONTRACT_ID FROM TB_S10_CONTRACT010 WHERE MEMBER_ID = (SELECT EMP_ID FROM TB_S10_EMP010 WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '") ),?,SYSDATE(),?)';
                            // payContractParams = [finalDate, contractMoney];
                            //console.log(payContractSql);

                            for (let i = 1; i <= contractTerm; i++) {
                                //console.log('!!!!!!!!!!!!!!!!!!!contractMonthDay: ' + contractMonthDay);
                                //console.log('!!!!!!!!!!!!!!!!!monthDay: ' + monthDay);
                                finalDate = contractYearDay + '-' + contractMonthDay + '-' + payDate;
                                payContractSql = 'INSERT INTO ' +
                                    'TB_S10_CONTRACT020(CONTRACT_ID,PAY_PLAN_DATE,CREATED_DATE,PAYED_PLAN_MONEY) ' +
                                    'VALUES((SELECT CONTRACT_ID FROM TB_S10_CONTRACT010 WHERE MEMBER_ID = (SELECT MEMBER_ID FROM TB_S10_MEMBER010 WHERE CEO_ID = (SELECT EMP_ID FROM TB_S10_EMP010 WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '"))),?,SYSDATE(),?)';

                                console.log(payContractSql);
                                console.log("--------------------------------");
                                console.log(finalDate);
                                console.log("--------------------------------");
                                console.log(payContractParams);
                                console.log("--------------------------------");

                                payContractParams = [finalDate, contractMoney];
                                
                                
                                console.log("--------------------------------");
                                console.log('finalDate: ' + finalDate);

                                contractMonthDay++;

                                connection.query(payContractSql, payContractParams, function (error, result) {  //쿼리문
                                    //console.log('payContractSql :' + result);

                                    if (error) {
                                        connection.rollback(function () {
                                            console.log('payContractSql.error');
                                            throw error;
                                        });
                                    }
                                    // }

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
                        })
                    });//contract
                });//memberId
            });//emp

        } else if (dateChkNum >= 1 || empHpChkNum >= 1 || regNoChkNum >= 1) {
            res.send({ msg: 'chk failed because of already exists' });
        }

    })


    
    app.get('/api/s010100140/selectMemberSt', (req, res) => {
        let sql = 'SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = "MEMBER_ST"';

        connection.query(sql, (error, rows) => {
            if (error) throw error;
            res.send({ success: true, rows })
        })
    })


    app.post('/api/s010100010/memberDelete_by_id',(req,res) => {
        let contractId = req.query.id;

        let sql = ' UPDATE TB_S10_MEMBER010 '+
        ' SET MEMBER_ST = "D" '+
        ' WHERE MEMBER_ID = (SELECT MEMBER_ID FROM TB_S10_CONTRACT010 WHERE CONTRACT_ID = '+ contractId +')';
        connection.query(sql, (error, rows) => {
                    if (error) throw error;
                    res.send({ success: true })
        })

     })

    app.post('/api/s010100140/tempStorage/memberId', (req, res) => {
        connection.beginTransaction(function (error) {

            let memberIdForNew = req.body.modalMemberId;

            //계약구분
            let contractTp = req.body.contractTp;
            //호실
            let contractTpVal = req.body.contractTpVal;
            //사물함
            let roomLockerTp = req.body.roomLockerTp;
            //계약기간
            let contractTerm = req.body.contractTerm;
            //시작일자
            let startDate = req.body.startAsk_date;

            //종료일자
            let endDate = req.body.endDate;
            //입금일
            let payDate = req.body.payDate;
            //납부방법
            let payMethod = req.body.payMethod;
            //계약접근경로
            let contractPath = req.body.contractPath;

            //memberId가 emp ceo _id인 곳에서 해야된다!!!!!!!!!!!
            let contractSql =
                'INSERT INTO ' +
                'TB_S10_CONTRACT010(CONTRACT_TP,CONTRACT_ROOM,CONTRACT_LOCKER,CONTRACT_TERM,START_DATE,END_DATE,' +
                'PAY_DATE,PAY_METHOD,CONTRACT_PATH,CREATED_DATE,CONTRACT_DATE,MEMBER_ID ) ' +
                'VALUES (?,?,?,?,?,?,?,?,?,SYSDATE(),?,?)';

            let contractParams = [contractTp, contractTpVal, roomLockerTp, contractTerm, startDate, endDate, payDate, payMethod, contractPath, startDate, memberIdForNew];


            //납부금액
            let contractMoney = req.body.contractMoney;
            //납부년월
            let payMonth = req.body.startAsk_date;


            let payContractSql = 'INSERT INTO ' +
                'TB_S10_CONTRACT020(PAY_MONTH,CREATED_DATE,PAYED_DATE,PAYED_MONEY) ' +
                'VALUES(?,SYSDATE(),?,?)'

            let payContractParams = [payMonth, payDate, contractMoney];

            if (error) throw error;

            connection.query(contractSql, contractParams, function (error, result) {  //쿼리문
                console.log('contractSql: ' + result);

                if (error) {
                    connection.rollback(function () {
                        console.log('contractSql.error');
                        throw error;
                    });
                }
                connection.query(payContractSql, payContractParams, function (error, result) {  //쿼리문
                    console.log('payContractSql :' + result);

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
                        console.log('success!');
                        res.send({ success: true });
                    });//commit
                });//memberId
            });//emp
        })//transaction
    })


    app.get('/api/s010100150/memberTpDetail', (req, res) => {

        let sql = 'SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = "MEMBER_TP"';

        connection.query(sql, (error, rows) => {
            if (error) throw error;
            res.send({ success: true, rows });

        });
    })

    app.post('/api/s010100060/list', (req, res) => {
        let startDate = req.body.startDate;
        let endDate = req.body.endDate;
        let userName = req.body.userName;
        let paymentStatus = req.body.paymentStatus;


        let sql = 'SELECT     ' +
            '                   MEM.MEMBER_NM, ' +
            '                   date_format(CON2.PAY_PLAN_DATE,"%y.%m.%d") AS "PAY_PLAN_DATE", \n' +
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
            

        if (userName != null && userName != "")//null아니고 전체가 아닐때 때, null 아니고 공백이 아닐때
            sql += ' AND MEM.MEMBER_NM LIKE "%' + userName + '%" ';
        if (paymentStatus != null && paymentStatus != "")
            sql += ' AND CON2.PAYED_FLAG = "' + paymentStatus + '"';
            // sql += ' ORDER BY CON2.CONTRACT_ID DESC';

        connection.query(sql, (error, rows) => {
            if (error) throw error;
            res.send({ success: true, rows });
            //console.log('전체조회rows:' + rows);
        });

    })

    app.post('/api/s01010070/paymentUpdate', (req, res) => {

        let modalContractId = modalContractId;
        let modalPayPlanDate = modalPayPlanDate;
        let insertPayDate = insertPayDate;
        let referComment = referComment;

        let sql =
            '\tUPDATE TB_S10_CONTRACT020  \n' +
            '        SET \n' +
            '        PAYED_DATE ="' + insertPayDate + '", \n' +
            '        PAYED_FLAG = "Y", \n' +
            '            LAST_UPDATE_DATE = SYSDATE(), \n' +
            '            PAYED_MONEY = PAYED_PLAN_MONEY, \n' +
            '            CONTRACT_COMMENT = "' + referComment + '"' +
            '         WHERE CONTRACT_ID =' + modalContractId + ' AND PAY_PLAN_DATE ="' + modalPayPlanDate + '"';

        connection.query(sql, (error, rows) => {
            if (error) throw error;
            res.send({ success: true, rows });
            //console.log('전체조회rows:' + rows);
        });

    })
   

    app.get('/api/s01010050/download/tb_s10_member010_by_id',function(req,res){
      let type = req.query.type;
      let memberIdForDown = req.query.id;
        
      let dataName = req.body.dataName;
      let dataEmpHp = req.body.dataEmpHp;
       

        let sql = 'SELECT CEO_IMAGE_ID_SERVER,CEO_IMAGE_ID,CEO_IMAGE_ID_PATH FROM TB_S10_MEMBER010 '+
        ' WHERE MEMBER_ID = ' + memberIdForDown;
        
        connection.query(sql, (error, rows) => {
            if (error) throw error;
            //res.send({ success: true, rows });
            console.log('전체조회rows:' + rows[0].CEO_IMAGE_ID_PATH);
            savedFileNm =  rows[0].CEO_IMAGE_ID_PATH;
            mimetype = mime.getType(rows[0].CEO_IMAGE_ID);
            console.log('mimetype',mimetype);
            res.setHeader('Content-disposition','attachment; filename = "' + rows[0].CEO_IMAGE_ID + '"');

            res.setHeader('Content-type',mimetype);
            let filestream = fs.createReadStream(savedFileNm);
            console.log('filestream:' + filestream);
            filestream.pipe(res);

        });

        // app.post('/api/s010100150/idDownloadPath',function(req,res){
        //     let origFileNm,savedFileNm;
        //     // let wasteIdPath = req.path.wasteIdPath;
        //     let test = req.body.test;
        //     // let wasteId = req.path.wasteId;
        //     let testId = req.body.testId;
        //     //console.log('wasteIdPath',wasteIdPath);
        //          // console.log('전체조회rows:' + rows[0].CEO_IMAGE_ID);
        //           //let a = rows[0].CEO_IMAGE_ID_SERVER.PATH;
        //           savedFileNm = test;
        //           mimetype = mime.getType(testId);
        //           res.setHeader('Content-disposition','attachment; filename = "' + testId + '"');
      
        //           res.setHeader('Content-type',mimetype);
        //           console.log('typeof savedFileNm~~~~~~~~~~~~~~~~~~~~~',typeof req.body.test);
        //           let filestream = fs.createReadStream(savedFileNm);
        //           filestream.pipe(res);
      
        //       });

        // res.setHeader('Content-disposition','attachment; filename=' + );

        // res.setHeader('Content-type',MimeType);
        // let filestream = fs.createReadStream(file);
        // filestream.pipe(res);
        //console.log(imageRows);
        
        

    })
    
    app.get('/api/s010100150/regDownload',function(req,res){
      //let origFileNm,savedFileNm;
      //임시코드 테스트
      origFileNm = '1ie11_test.jpg';
      savedFileNm = '1eaab3d9fe3a98059a581fc0d1a4d029.jpg';
      savedPath = 'C:/Users/team_/Desktop/mysqltestCopy/src/uploads'
      fileSize = '6209';

      var file = savedPath + '/' + savedFileNm; //예) '/temp/filename.zip'
      /*test*/console.log('file : ', file);
      //만약 var file 이 저장경로+원본파일명으로 이루져 있다면, 'filename = path.basename(file)' 문법으로 파일명을 읽어올 수도 있다.
      
      res.setHeader('Content-disposition', 'attachment; filename=' + origFileNm ); //origFileNm으로 로컬PC에 파일 저장
      res.setHeader('Content-type', 'jpg');
   
      var filestream = fs.createReadStream(file);
      filestream.pipe(res);
   });
   
   


//s010100070 납부update
   app.post('api/s01010070/paymentUpdate',(req,res) =>{

    let modalContractId = req.body.modalContractId;
    let modalPayPlanDate = req.body.modalPayPlanDate;
    let payMethodM = req.body.payMethodM;

    let sql = 'UPDATE TB_S10_CONTRACT020 '+
              'SET PAYED_DATE = "' + modalPayPlanDate + '"' +
              'WHERE ';
    
    connection.query(sql, (error, rows) => {//쿼리문
        //console.log(rows);
        if (error) throw error;
        //console.log(rows);
        res.send({ success: true, rows });

    });
})


    //연결알려주기
    const server = app.listen(app.get('port'), () => {
        server.setTimeout(3 * 60 * 1000);
        console.log('portNumber : ' + app.get('port') + " OnMyWayToFind..ForWhat 'IT'S TURNS ON'");
    })