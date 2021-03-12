const express = require('express');

const router = express.Router();

const dbconfig = require('../config/database.js')();
const connection = dbconfig.init();


// 회원구분 selectBox
router.get('/selectMemberTp', (req, res, next) => {
    let sql = 'SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = "MEMBER_TP"';

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

// 회원상태 selectBox
router.get('/selectMemberSt', (req, res, next) => {
    let sql = 'SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = "MEMBER_ST"';

    connection.query(sql, (error, rows) => {
        if (error){
            setImmediate(() => {
                next(new Error(error))
            })
            //next(error);
        }else{
            res.send({ success: true,rows });
        } 
    })
})

// 회원현황 조회
router.post('/searchMember', (req, res, next) => {
    let startDate = req.body.startDate.toString().substring(0, 10);
    let endDate = req.body.endDate.toString().substring(0, 10);
    let memberNm = req.body.memberNm;
    let regNo = req.body.regNo;
    let name = req.body.name;
    let memberTp = req.body.memberTp;
    let contractStatus = req.body.contractStatus;
    let memberSt = req.body.memberSt;

    let sql =
        'SELECT DISTINCT(member010.MEMBER_ID) ' +
        '       , member010.REG_NO ' +
        '       , member010.MEMBER_NM ' +
        '       , member010.MEMBER_ST ' +
        '       , (select CD_V_MEANING ' +
        '           from TB_S10_CODE ' +
        '           where CD_TP = "MEMBER_TP" ' +
        '           and CD_V = member010.MEMBER_TP)  AS MEMBER_TP ' +
        '       , (select CD_V_MEANING ' +
        '           from TB_S10_CODE ' +
        '           where CD_TP = "MEMBER_ST" ' +
        '           and CD_V = member010.MEMBER_ST) AS MEMBER_ST ' +
        '       , emp010.NAME ' +
        '       , emp010.EMP_HP ' +
        '       , emp010.EMP_EMAIL ' +
        '       , (select  case when count(distinct(con.end_flag)) = 2 ' +
        '                       then "N" ' +
        '                       when count(distinct(con.end_flag)) = 1 and con.end_flag = "Y" ' +
        '                       then "Y" ' +
        '                       when count(distinct(con.end_flag)) = 1 and con.end_flag = "N" ' +
        '                       then "N" ' +
        '                       end ' +
        '           from TB_S10_CONTRACT010 con ' +
        '   where con.MEMBER_ID = member010.MEMBER_ID) as END_FLAG ' +
        '   FROM TB_S10_MEMBER010 member010 ' +
        '           INNER JOIN TB_S10_EMP010 emp010 ' +
        '               ON member010.CEO_ID = emp010.EMP_ID ' +
        '   INNER JOIN TB_S10_CONTRACT010 con010 '+
        '   ON member010.MEMBER_ID = con010.MEMBER_ID '+
        ' WHERE member010.CREATED_DATE BETWEEN DATE_FORMAT("' + startDate + '","%y-%m-%d") AND  DATE_FORMAT("' + endDate + '" ,"%y-%m-%d")' +
        ' AND  member010.MEMBER_ST != "D" '

    if (memberTp != null && memberTp != "" && memberTp != "전체")
        sql += ' AND member010.MEMBER_TP = "' + memberTp + '"';
    if (contractStatus != null && contractStatus != "" && contractStatus != "전체")
        sql += ' AND con010.END_FLAG = "' + contractStatus + '"';
    if (memberSt != null && memberSt != "" && memberSt != "전체")
        sql += ' AND member010.MEMBER_ST = "' + memberSt + '"';
    if (memberNm != null && memberNm != "" && memberNm != "전체")
        sql += ' AND member010.MEMBER_NM LIKE "%' + memberNm + '%"';
    if (regNo != null && regNo != "" && regNo != "전체")
        sql += ' AND member010.REG_NO LIKE "%' + regNo + '%"';
    if (name != null && name != "" && name != "전체")
        sql += ' AND emp010.NAME LIKE "%' + name + '%"';
    
    sql += ' ORDER BY member010.MEMBER_ID DESC';
    console.log(sql);
   
    connection.query(sql, (error, rows) => {
        if (error){
            setImmediate(() => {
                next(new Error(error))
                console.log(error);
            })
            //next(error);
        }else{
            res.send({ success: true,rows });
        } 

    })

})

module.exports = router;