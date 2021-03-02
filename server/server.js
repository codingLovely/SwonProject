const express = require('express');
const dbconfig = require('./config/database.js')(); // 위에서 생성한 MySQL에 연결을 위한 코드(모듈)
const connection = dbconfig.init(); // node express 와 MySQL의 연동
const bodyParser = require('body-parser');
const multer = require('multer');
const { configure } = require('@testing-library/react');
const bcrypt = require('bcrypt');
const { request } = require('express');
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
app.use('/api/employeeSt',require('./route/employeeSt'));
app.use('/api/contractList',require('./route/contractList'));
app.use('/api/joinMembership',require('./route/joinMembership'));
app.use('/api/login',require('./route/login'));

// app.use(fileUpload);
app.use('/image', express.static('./src/uploads'));
// 1. configuration 
app.set('port', process.env.PORT || 4001);











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