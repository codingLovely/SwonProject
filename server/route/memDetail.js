const express = require('express');
const router = express.Router();

const dbconfig = require('../config/database.js')();
const connection = dbconfig.init();


const multer = require('multer');
let upload = multer({ dest: './src/uploads' });


// 회원정보

// 회원 구분 데이터 들고오는 api
router.get('/memberTpDetail', (req, res) => {

    let sql = 'SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = "MEMBER_TP"';

    connection.query(sql, (error, rows) => {
        if (error) throw error;
        res.send({ success: true, rows });

    });
})

// 회원 상세정보
router.post('/detailMember_by_id', (req, res) => {

    let dataMemId = req.body.dataMemId;

    let sql = 
        'SELECT   ' +
        '  MEM.MEMBER_ID,MEM.MEMBER_NM,MEM.REG_NO,CODE1.CD_V "MEMBER_TP",  ' +
        '  MEM.CEO_IMAGE_ID,MEM.CEO_IMAGE_ID_SERVER,MEM.CEO_IMAGE_REGISTER,MEM.CEO_IMAGE_REGISTER_SERVER,  ' +
        '  EMP.NAME,EMP.EMP_HP,EMP.EMP_EMAIL,EMP.ZIP_CODE,EMP.ADDRESS,EMP.DETAIL_ADDRESS,    ' +
        '  CON.CONTRACT_ID,DATE_FORMAT(CON.END_DATE,"%y.%m.%d") AS "END_DATE",' +
        '  DATE_FORMAT(CON.CONTRACT_DATE,"%y.%m.%d") AS "CONTRACT_DATE",' +
        '  CODE2.CD_V_MEANING AS "MEMBER_ST", ' +
        '  CODE3.CD_V_MEANING AS"CONTRACT_TP",  ' +
        '  CODE5.CD_V_MEANING AS "CONTRACT_LOCKER",  ' +
        '  CODE4.CD_V_MEANING AS "CONTRACT_ROOM",  ' +
        '  CON.CONTRACT_TERM,CON.PAY_DATE,CON.MONTHLY_FEE,     ' +
        '  CON.END_FLAG,  ' +
        '  PCON.PAYED_PLAN_MONEY, ' +
        '  DATE_FORMAT(CON.START_DATE,"%y.%m.%d") AS "START_DATE"' +
        'FROM TB_S10_MEMBER010 MEM   ' +
        '  INNER JOIN TB_S10_EMP010 EMP     ' +
        '  ON MEM.CEO_ID = EMP.EMP_ID     ' +
        '  INNER JOIN TB_S10_CONTRACT010 CON     ' +
        '  ON MEM.MEMBER_ID = CON.MEMBER_ID   ' +
        '  INNER JOIN (SELECT DISTINCT CONTRACT_ID ,PAYED_PLAN_MONEY    ' +
        'FROM TB_S10_CONTRACT020 C020) PCON  ' +
        '   ON CON.CONTRACT_ID = PCON.CONTRACT_ID  ' +
        '   LEFT OUTER JOIN TB_S10_CODE code1 ON MEM.MEMBER_TP = CODE1.CD_V     ' +
        '   AND CODE1.CD_TP = "MEMBER_TP"   ' +
        '   LEFT OUTER JOIN TB_S10_CODE code2 ON MEM.MEMBER_ST = CODE2.CD_V     ' +
        '   AND CODE2.CD_TP = "MEMBER_ST"  ' +
        '   LEFT OUTER JOIN TB_S10_CODE CODE3 ON CON.CONTRACT_TP = CODE3.CD_V     ' +
        '   AND CODE3.CD_TP = "CONTRACT_TP" AND CODE3.ATTRIBUTE1 = "CONTRACT" ' +
        '   LEFT OUTER JOIN TB_S10_CODE code4 ON CON.CONTRACT_ROOM = CODE4.CD_V     ' +
        '   LEFT OUTER JOIN TB_S10_CODE code5 ON CON.CONTRACT_LOCKER = CODE5.CD_V     ' +
        '   AND CODE5.CD_TP = "L"  ' +
        'WHERE MEM.MEMBER_ID = '+dataMemId;


    connection.query(sql, (error, rows) => {//쿼리문
        if (error) throw error;
        res.send({ success: true, rows });
        //console.log(rows);
    });
})

// 수정
router.post('/modifyMember', upload.fields([{ name: 'idCardFile', maxCount: 3 }, { name: 'registCardFile', maxCount: 5 }]), (req, res) => {

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
    console.log('existingIdCard',existingIdCard);

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
        console.log('idCardFilename',idCardFilename);
        sql +=  '  ,MEM.CEO_IMAGE_ID="' + idCardFilename + '",' +
            '  MEM.CEO_IMAGE_ID_SERVER="' + idCardimageAddr + '",' +
            '  MEM.CEO_IMAGE_ID_PATH="' + idCardFilePath + '"'
    }

    if (existingRegistCard != null || existingRegistCard != undefined) {
        sql +=  '  ,MEM.CEO_IMAGE_REGISTER="' + registCardFilename + '",' +
            '  MEM.CEO_IMAGE_REGISTER_SERVER="' + registCardimageAddr + '",' +
            '  MEM.CEO_IMAGE_REGIST_PATH="' + registCardFilePath + '"'
    }
   
    sql += ' WHERE MEM.MEMBER_ID='+dataMemId;

    connection.query(sql, (error, rows) => {  //쿼리문
        if (error) throw error;
        res.send({ success: true });
    });

})






module.exports = router;