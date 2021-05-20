const express = require('express');
const router = express.Router();
const multer = require('multer');
const dbconfig = require('../config/database.js')();
const connection = dbconfig.init();
let upload = multer({ dest: './src/uploads' })
let mime = require('mime');
let fs = require('fs');
let http = require('http');
let url = require('url');
let request = require('request');
const Path = require('path');
const Axios = require('axios');
const moment = require('moment');

let Stream = require('stream').Transform;



// 회원정보

// 회원 구분 데이터 들고오는 api
router.get('/memberTpDetail', (req, res, next) => {

    let sql = 'SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = "MEMBER_TP"';

    connection.query(sql, (error, rows) => {
       
        if (error){
            setImmediate(()=>{
                next(new Error(error));
            })
        }else{
            res.send({ success: true, rows });
        }
      
    });
})
 
// 회원 상세정보
router.post('/detailMember_by_id', (req, res, next) => {

    let dataMemId = req.body.dataMemId;

    let sql = 
        'SELECT   ' +
        '  MEM.MEMBER_ID,MEM.MEMBER_NM,MEM.REG_NO,CODE1.CD_V "MEMBER_TP",  ' +
        '  MEM.ID_CARD_IMAGE, MEM.ID_CARD_IMAGE_NAME,'+
        '  MEM.BUSI_LICS_IMAGE, MEM.BUSI_LICS_IMAGE_NAME,'+
        '  DATE_FORMAT(MEM.RETIRE_DATE,"%y-%m-%d")AS "RETIRE_DATE",'+
        '  EMP.NAME,EMP.EMP_HP,EMP.EMP_EMAIL,EMP.ZIP_CODE,EMP.ADDRESS,EMP.DETAIL_ADDRESS,    ' +
        '  CON.CONTRACT_ID,DATE_FORMAT(CON.END_DATE,"%y.%m.%d") AS "END_DATE",' +
        '  DATE_FORMAT(CON.CONTRACT_DATE,"%y.%m.%d") AS "CONTRACT_DATE",' +
        '  CODE2.CD_V_MEANING AS "MEMBER_ST", ' +
        '  CODE3.CD_V_MEANING AS"CONTRACT_TP",  ' +
        '  CODE5.CD_V_MEANING AS "CONTRACT_LOCKER",  ' +
        '  CODE4.CD_V_MEANING AS "CONTRACT_ROOM",  ' +
        '  CON.CONTRACT_TERM,CON.PAY_DATE,CON.MONTHLY_FEE,     ' +
        '  CON.END_FLAG,  ' +
        '  (SELECT CD_V_MEANING '+
        '   FROM TB_S10_CODE'+
        '   WHERE CD_TP = "CONTRACT_ST" AND CD_V = CON.CONTRACT_ST) AS "CONTRACT_ST",' +
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
        if (error){
            setImmediate(()=>{
                next(new Error(error));
            })
        }else{
            
            res.send({ success: true, rows });
        }
    });
})

// 수정
router.post('/modifyMember', upload.fields([{ name: 'idCardFile', maxCount: 3 }, { name: 'registCardFile', maxCount: 5 }]), (req, res, next) => {
   
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

    let detailIdCardImg = req.body.detailIdCardImg;
    let detailBusiLicfImg = req.body.detailBusiLicfImg;
    let realDetailIdCardFileName = req.body.realDetailIdCardFileName;
    let  realDetailBusiCardFileName = req.body.realDetailBusiCardFileName;
    
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
        '  EMP.DETAIL_ADDRESS ="' + detailDetailAddress + '",'+
        '  MEM.LAST_UPDATE_DATE = SYSDATE(),'+
        '  MEM.LAST_UPDATE_PROGRAM_ID = "S010100050",'+
        '  EMP.LAST_UPDATE_DATE = SYSDATE(),'+
        '  EMP.LAST_UPDATE_PROGRAM_ID = "S010100050"'
        
        if(detailIdCardImg){
            sql += ',  MEM.ID_CARD_IMAGE="'+detailIdCardImg+'",'+
            '  MEM.ID_CARD_IMAGE_NAME="'+realDetailIdCardFileName+'"'
        }

        if(detailBusiLicfImg){
            sql += ',  MEM.BUSI_LICS_IMAGE= "'+detailBusiLicfImg+'",'+
            '  MEM.BUSI_LICS_IMAGE_NAME="'+realDetailBusiCardFileName+'"' 
        }
        
        sql += ' WHERE MEM.MEMBER_ID='+dataMemId;

    connection.query(sql, (error, rows) => {  //쿼리문
        if (error){
            setImmediate(()=>{
                next(new Error(error));
            })
        }else{
            res.send({ success: true });
        }
   
    });

})



router.post('/allContractEnd', (req, res, next) => {
   
   
    let dataMemId = req.body.dataMemId;


    let sql =
        'UPDATE TB_S10_MEMBER010 MEM INNER JOIN TB_S10_CONTRACT010 CON ON' +
        '  MEM.MEMBER_ID = CON.MEMBER_ID ' +
        'SET ' +
        '  MEM.RETIRE_DATE = sysdate(), ' +
        '  MEM.MEMBER_ST = "F", ' +
        '  CON.END_FLAG = "Y",' +
        '  CON.CONTRACT_ST = "F",'+
        '  MEM.LAST_UPDATE_DATE = SYSDATE(),'+
        '  MEM.LAST_UPDATE_PROGRAM_ID = "S010100050",'+
        '  CON.LAST_UPDATE_DATE = SYSDATE(),'+
        '  CON.LAST_UPDATE_PROGRAM_ID = "S010100050"'+
        'WHERE MEM.MEMBER_ID="' + dataMemId + '"'
     

    connection.query(sql, (error, rows) => {  //쿼리문
        if (error){
            setImmediate(()=>{
                next(new Error(error));
            })
        }else{
            res.send({ success: true });
        }
   
    });

})

module.exports = router;