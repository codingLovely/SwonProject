const express = require('express');
const dbconfig = require('./config/database.js')(); // 위에서 생성한 MySQL에 연결을 위한 코드(모듈)
const connection = dbconfig.init(); // node express 와 MySQL의 연동
const bodyParser = require('body-parser');
const multer = require('multer');
const { configure } = require('@testing-library/react');
const bcrypt = require('bcrypt');
//const { request } = require('express');
const app = express();

let upload = multer({ dest: './src/uploads' })
let mime = require('mime');
let fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/askStList',require('./route/askStList'));
app.use('/api/memStList',require('./route/memStList'));
app.use('/api/memDetail',require('./route/memDetail'));
app.use('/api/payStList',require('./route/payStList'));


// app.use(fileUpload);
app.use('/image', express.static('./src/uploads'));
// 1. configuration 
app.set('port', process.env.PORT || 4001);



//<회원상세보기 수정
app.post('/api/s010100050/modifyMember', upload.fields([{ name: 'idCardFile', maxCount: 3 }, { name: 'registCardFile', maxCount: 5 }]), (req, res) => {

    let dataName = req.body.dataName;
    let dataEmpHp = req.body.dataEmpHp;
    let dataMemId = req.body.dataMemId;

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

    let idCardimageAddr;
    let idCardFilename;
    let idCardFilePath;

    let registCardimageAddr;
    let registCardFilename;
    let registCardFilePath;

    //첨부파일 존재 유무
    let existingIdCard = req.files['idCardFile'];
    let existingRegistCard = req.files['registCardFile'];
    console.log();

    //첨부파일
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
        '  EMP.DETAIL_ADDRESS ="' + detailDetailAddress + '"'

    if (existingIdCard != null || existingIdCard != undefined) {
        '  MEM.CEO_IMAGE_ID="' + idCardFilename + '",' +
            '  MEM.CEO_IMAGE_ID_SERVER="' + idCardimageAddr + '",' +
            '  MEM.CEO_IMAGE_ID_PATH="' + idCardFilePath + '",'
    }

    if (existingRegistCard != null || existingRegistCard != undefined) {
        '  MEM.CEO_IMAGE_REGISTER="' + registCardFilename + '",' +
            '  MEM.CEO_IMAGE_REGISTER_SERVER="' + registCardimageAddr + '",' +
            '  MEM.CEO_IMAGE_REGIST_PATH="' + registCardFilePath + '",'
    }

    sql += ' WHERE MEM.MEMBER_ID='+dataMemId;

    connection.query(sql, (error, rows) => {  //쿼리문
        if (error) throw error;
        res.send({ success: true });
    });

})
//회원상세보기 끝>





// 3. 로그인 routing
// 로그인 라우터
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





//<이용계약서 등록
app.post('/api/s010100010/insertMember010', upload.fields([{ name: 'idCardFile', maxCount: 3 }, { name: 'registCardFile', maxCount: 5 }]), (req, res) => {

    //console.log('dataCheck',req,res);
    //if (dateChkNum === 0 && empHpChkNum === 0 && regNoChkNum === 0) {
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
            let forMemberStatus = req.body.forMemberStatus;

            // let image = '/image/' + req.body.idCardFileName;
            // console.log('filename',req.body.idCardFileName);
            // let filename = (req.body.idCardFileName).split('\\').reverse()[0];
            // console.log('filename!!',filename);
            // let image = '/image/' + req.file.filename;
            // console.log('testIdCardFile',req.files['idCardFile'][0]);
            // console.log('testRegistCardFile',req.files['registCardFile'][0].filename);
            let idCardimageAddr;
            let idCardFilename;
            let idCardFilePath;

            let registCardimageAddr;
            let registCardFilename;
            let registCardFilePath;


            //첨부파일 존재 유무
            let existingIdCard = req.files['idCardFile'];
            let existingRegistCard = req.files['registCardFile'];

            //첨부파일
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

            //둘다 있는 경우 
            //기존에 회원정보가 있는 경우에는 MEMBER_ID가 없는 곳에 새로운 정보 INSERT하기
            if (existingIdCard && existingRegistCard) {
                memberSql =
                    'INSERT INTO  ' +
                    '            TB_S10_MEMBER010 ( MEMBER_NM, REG_NO, MEMBER_TP,CREATED_DATE,MEMBER_ST,COMMENT,CEO_ID,LAST_UPDATE_DATE,' +
                    'CEO_IMAGE_ID,CEO_IMAGE_ID_SERVER,CEO_IMAGE_REGISTER,CEO_IMAGE_REGISTER_SERVER,CEO_IMAGE_ID_PATH,CEO_IMAGE_REGIST_PATH )  ' +
                    '            VALUES (?, ?, ?, SYSDATE(),?, ?, (SELECT EMP_ID FROM TB_S10_EMP010 WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '"' +
                    'AND MEMBER_ID IS NULL),' +
                    'SYSDATE(),?,?,?,?,?,?)'

                memberParams = [memberNm, regNo, memberTp, forMemberStatus, comments, idCardFilename, idCardimageAddr, registCardFilename, registCardimageAddr, idCardFilePath, registCardFilePath];
                //Member_id는 -> sequence로 생성됨

                //대표자신분증이 없을 경우 
            } else if (existingIdCard != null || existingIdCard != undefined) {
                //기존에 회원정보가 있는 경우에는 MEMBER_ID가 없는 곳에 새로운 정보 INSERT하기
                memberSql =
                    'INSERT INTO  ' +
                    '            TB_S10_MEMBER010 ( MEMBER_NM, REG_NO, MEMBER_TP,CREATED_DATE,MEMBER_ST,COMMENT,CEO_ID,LAST_UPDATE_DATE,' +
                    'CEO_IMAGE_ID,CEO_IMAGE_ID_SERVER,CEO_IMAGE_REGISTER,CEO_IMAGE_REGISTER_SERVER,CEO_IMAGE_ID_PATH,CEO_IMAGE_REGIST_PATH )  ' +
                    '            VALUES (?, ?, ?, SYSDATE(),?, ?, (SELECT EMP_ID FROM TB_S10_EMP010 WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '"' +
                    'AND MEMBER_ID IS NULL),' +
                    'SYSDATE(),null,null,?,?,null,?)'

                memberParams = [memberNm, regNo, memberTp, forMemberStatus, comments, registCardFilename, registCardimageAddr, registCardFilePath];
                //Member_id는 -> sequence로 생성됨
                //사업자등록증이 없을 경우
            } else if (existingRegistCard != null || existingRegistCard != undefined) {
                //기존에 회원정보가 있는 경우에는 MEMBER_ID가 없는 곳에 새로운 정보 INSERT하기
                memberSql =
                    'INSERT INTO  ' +
                    '            TB_S10_MEMBER010 ( MEMBER_NM, REG_NO, MEMBER_TP,CREATED_DATE,MEMBER_ST,COMMENT,CEO_ID,LAST_UPDATE_DATE,' +
                    'CEO_IMAGE_ID,CEO_IMAGE_ID_SERVER,CEO_IMAGE_REGISTER,CEO_IMAGE_REGISTER_SERVER,CEO_IMAGE_ID_PATH,CEO_IMAGE_REGIST_PATH )  ' +
                    '            VALUES (?, ?, ?, SYSDATE(),?, ?, (SELECT EMP_ID FROM TB_S10_EMP010 WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '"' +
                    'AND MEMBER_ID IS NULL),' +
                    'SYSDATE(),?,?,null,null,?,null)'

                memberParams = [memberNm, regNo, memberTp, forMemberStatus, comments, idCardFilename, idCardimageAddr, idCardFilePath];
                //Member_id는 -> sequence로 생성됨
                //대표자신분증-사업자등록증이 없을 경우
            } else if ((existingIdCard == null || existingIdCard == undefined) && (existingRegistCard == null || existingRegistCard == undefined)) {
                //기존에 회원정보가 있는 경우에는 MEMBER_ID가 없는 곳에 새로운 정보 INSERT하기
                memberSql =
                    'INSERT INTO  ' +
                    '            TB_S10_MEMBER010 ( MEMBER_NM, REG_NO, MEMBER_TP,CREATED_DATE,MEMBER_ST,COMMENT,CEO_ID,LAST_UPDATE_DATE,' +
                    'CEO_IMAGE_ID,CEO_IMAGE_ID_SERVER,CEO_IMAGE_REGISTER,CEO_IMAGE_REGISTER_SERVER,CEO_IMAGE_ID_PATH,CEO_IMAGE_REGIST_PATH )  ' +
                    '            VALUES (?, ?, ?, SYSDATE(),?, ?, (SELECT EMP_ID FROM TB_S10_EMP010 WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '"' +
                    'AND MEMBER_ID IS NULL),' +
                    'SYSDATE(),null,null,null,null,null,null)'

                memberParams = [memberNm, regNo, memberTp, forMemberStatus, comments];
                //Member_id는 -> sequence로 생성됨
            }
            //넣는 순간 NULL이 아니라 MEMBER_ID가 생성되는데,?

            //member테이블의 member_id를 다시 emp테이블의 member_id에 넣기//          
            //새로 INSERT한 tb_s10_member010테이블의 정보를 Member_id를 다시 tb_s10_emp010의 member_id에 넣기,
            let empMemberIdSql = 'UPDATE TB_S10_EMP010 EMP '+
            'SET EMP.MEMBER_ID = (SELECT MEMBER_ID FROM TB_S10_MEMBER010 ORDER BY MEMBER_ID DESC LIMIT 1)';
            //어떻게 조건을 줘서 MEMBER_ID를 넣어?

            //상세보기 할때도 EMP_ID를 어떻게 가져와? 해당 EMP_ID를?
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
            //납부금액
            let contractMoney = req.body.contractMoney;

            let contractSql =
                'INSERT INTO ' +
                'TB_S10_CONTRACT010(CONTRACT_TP,CONTRACT_ROOM,CONTRACT_LOCKER,CONTRACT_TERM,START_DATE,END_DATE,' +
                'PAY_DATE,PAY_METHOD,CONTRACT_PATH,CREATED_DATE,CONTRACT_DATE,COMMENT,MEMBER_ID,LAST_UPDATE_DATE) ' +
                'VALUES (?,?,?,?,?,?,?,?,?,SYSDATE(),?,?,(SELECT MEMBER_ID FROM TB_S10_MEMBER010 WHERE CEO_ID = ' +
                '(SELECT EMP_ID FROM TB_S10_EMP010 WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '")),SYSDATE())';

            let contractParams = [contractTp, contractTpVal, roomLockerTp, contractTerm, startDate, endDate, payDate, payMethod, contractPath, startDate, comments];
            //contract_id는 -> sequence로 생성


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
                    //member테이블의 member_id를 다시 emp테이블의 emp_id에 넣기 
                    connection.query(empMemberIdSql, function (error, result) {
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
                        let wasteMonth = parseInt(wasteContracMonthDay);
                        let contractYearDay = parseInt(wasteContractYearDay);

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

                        } else if (contractDateDay <= parseInt(payDate)) {
                            finalDate = contractYearDay + '-' + contractMonthDay + '-' + payDate;
                        }


                        let payContractSql = '';
                        let payContractParams = [];


                        for (let i = 1; i <= contractTerm; i++) {

                            while (contractMonthDay > 12) {
                                contractYearDay += 1;
                                contractMonthDay -= 12;
                            }

                            finalDate = contractYearDay + '-' + contractMonthDay + '-' + payDate;
                            payContractSql = 'INSERT INTO ' +
                                'TB_S10_CONTRACT020(CONTRACT_ID,PAY_PLAN_DATE,CREATED_DATE,PAYED_PLAN_MONEY,LAST_UPDATE_DATE) ' +
                                'VALUES((SELECT CONTRACT_ID FROM TB_S10_CONTRACT010 ' +
                                ' WHERE MEMBER_ID = (SELECT MEMBER_ID FROM TB_S10_MEMBER010 ' +
                                ' WHERE CEO_ID = (SELECT EMP_ID FROM TB_S10_EMP010 ' +
                                ' WHERE NAME = "' + empIdName + '" AND EMP_HP = "' + empHp + '")))' +
                                ',?,SYSDATE(),?,SYSDATE())';

                            payContractParams = [finalDate, contractMoney];

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
                //member테이블의 member_id를 다시 emp테이블의 emp_id에 넣기 
             });
            });//memberId
        })//transaction
    // } else if (regNoChkNum >= 1 || empHpChkNum >= 1 || dateChkNum >= 1) {
    //     res.send({ check: false, message: "이미 존재하는 데이터 입니다." });
    // }
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



app.get('/api/s01010050/download/tb_s10_member010_by_id', function (req, res) {
    let type = req.query.type;
    let memberIdForDown = req.query.id;


    let sql = 'SELECT CEO_IMAGE_ID_SERVER,CEO_IMAGE_ID,CEO_IMAGE_ID_PATH FROM TB_S10_MEMBER010 ' +
        ' WHERE MEMBER_ID = ' + memberIdForDown;
        savedPath = 'C:/Users/team_/Desktop/mysqltestCopy/src/uploads'
    connection.query(sql, (error, rows) => {
        if (error) throw error;
        //res.send({ success: true, rows });
        console.log('전체조회rows:' + rows[0].CEO_IMAGE_ID_PATH);
        savedFileNm = rows[0].CEO_IMAGE_ID_PATH;
        console.log(savedPath+"/"+rows[0].CEO_IMAGE_ID);
        mimetype = rows[0].CEO_IMAGE_ID_PATH+'.jpg';//.substring(rows[0].CEO_IMAGE_ID_PATH+'.jpg'.lastIndexOf("."))  //'jpg'//mime.getType(rows[0].CEO_IMAGE_ID_PATH);
        console.log('mimetype',mimetype);
        res.setHeader('Content-disposition', 'attachment; filename = "' + rows[0].CEO_IMAGE_ID + '"');
        res.setHeader('Content-type', mimetype);
        let filestream = fs.createReadStream(savedFileNm);
        console.log('filestream:' + filestream);
        filestream.pipe(res);

    });


})

app.get('/api/s010100150/regDownload', function (req, res) {
    // //let origFileNm,savedFileNm;
    // //임시코드 테스트
    // origFileNm = '1ie11_test.jpg';
    // savedFileNm = '1eaab3d9fe3a98059a581fc0d1a4d029.jpg';
    // savedPath = 'C:/Users/team_/Desktop/mysqltestCopy/src/uploads'
    // fileSize = '6209';

    // var file = savedPath + '/' + savedFileNm; //예) '/temp/filename.zip'
    //   /*test*/console.log('file : ', file);
    // //만약 var file 이 저장경로+원본파일명으로 이루져 있다면, 'filename = path.basename(file)' 문법으로 파일명을 읽어올 수도 있다.

    // res.setHeader('Content-disposition', 'attachment; filename=' + origFileNm); //origFileNm으로 로컬PC에 파일 저장
    // res.setHeader('Content-type', 'jpg');

    // var filestream = fs.createReadStream(file);
    // filestream.pipe(res);


});



//연결알려주기
const server = app.listen(app.get('port'), () => {
    server.setTimeout(3 * 60 * 1000);
    console.log('portNumber : ' + app.get('port') + " OnMyWayToFind..ForWhat 'IT'S TURNS ON'");
})