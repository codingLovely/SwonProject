const express = require('express');
const router = express.Router();

const dbconfig = require('../config/database.js')();
const connection = dbconfig.init();


// 직원 구분
router.post('/classification', (req, res,next) => {

    let sql = 'SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = "EMP_TP"';
    connection.query(sql, (error, rows) => {
        if (error) {
            setImmediate(() => {
                next(new Error(error));
            })
        } else {
            res.send({ success: true, rows });
        }
    });
})

router.post('/empList', (req, res,next) => {
    let staffName = req.body.staffName;
    let memberNm = req.body.memberNm;
    let staffClass = req.body.staffClass;
    let closeStatus = req.body.retireChecked[0];
    let startDate = req.body.startDate.toString().substring(0, 10);
    let endDate = req.body.endDate.toString().substring(0, 10);

    // console.log('closeStatus',closeStatus);
    let sql = 'SELECT ' +
        'MEM.MEMBER_NM,EMP.MEMBER_ID,IFNULL(EMP.EMP_NUMBER,""),EMP.NAME,EMP.BIRTH_DATE,IFNULL(EMP.DEPT_NM,""), ' +
        'EMP.EMP_ID,EMP.EMP_HP,(SELECT CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = "EMP_TP" AND CD_V = EMP.EMP_TP)AS "EMP_TP",' +
        'EMP.APPROVAL_FLAG,EMP.EMP_EMAIL,EMP.PWD,EMP.CEO_FLAG, ' +
        'DATE_FORMAT(EMP.JOIN_DATE,"%y-%m-%d")AS "JOIN_DATE",DATE_FORMAT(EMP.RETIRE_DATE,"%y-%m-%d")AS "RETIRE_DATE" ' +
        'FROM TB_S10_EMP010 EMP INNER JOIN TB_S10_MEMBER010 MEM ON EMP.MEMBER_ID = MEM.MEMBER_ID ' +
        'INNER JOIN (SELECT MEMBER_ID,CONTRACT_DATE FROM TB_S10_CONTRACT010 GROUP BY MEMBER_ID) CON ON CON.MEMBER_ID = MEM.MEMBER_ID ' +
        ' WHERE CON.CONTRACT_DATE BETWEEN "' + startDate + '" AND "' + endDate + '"'

    if (memberNm != null && memberNm != "" && memberNm != undefined)
        sql += ' WHERE MEM.MEMBER_NM LIKE "%' + memberNm + '%"'
    if (staffName != null && staffName != "" && staffName != undefined)
        sql += ' AND EMP.NAME LIKE "%' + staffName + '%"'
    if (staffClass != null && staffClass != "" && staffClass != "전체")
        sql += ' AND EMP.EMP_TP= "' + staffClass + '" '

    if (closeStatus == "Y") {
        sql += ' AND EMP.RETIRE_FLAG = "' + closeStatus + '" '
    } else {
        sql += ' AND (EMP.RETIRE_FLAG != "' + closeStatus + '" OR EMP.RETIRE_FLAG IS NULL OR EMP.RETIRE_FLAG = "N") '
    }

    sql += 'ORDER BY EMP.MEMBER_ID DESC';
    // console.log(sql);


    connection.query(sql, (error, rows) => {
        if (error) {
            setImmediate(() => {
                next(new Error(error));
            })
        } else {
            res.send({ success: true, rows });
        }

    });
})


router.post('/approval', (req, res,next) => {

    let checkEmpId = req.body.arr;

    if (checkEmpId.length > 1) {
        // console.log('checkEmpId',checkEmpId);
        for (let i = 0; i < checkEmpId.length; i++) {
            let sql = 'UPDATE TB_S10_EMP010 ' +
                'SET APPROVAL_FLAG = "Y" ' +
                'WHERE EMP_ID = ' + checkEmpId[i];

            connection.query(sql, (error) => {//쿼리문
                if (error) {
                    if (checkEmpId[checkEmpId.length - 1] === checkEmpId[i]) {
                        setImmediate(() => {
                            next(new Error(error));
                        })
                    }

                } else {
                    if (checkEmpId[checkEmpId.length - 1] === checkEmpId[i]) {
                        res.send({ success: true });
                    }
                }

            });
        }

    } else {
        let sql = 'UPDATE TB_S10_EMP010 ' +
            'SET APPROVAL_FLAG = "Y" ' +
            'WHERE EMP_ID = ' + checkEmpId[0];

        connection.query(sql, (error) => {//쿼리문
            if (error) {
                setImmediate(() => {
                    next(new Error(error));
                })
            } else {
                res.send({ success: true });
            }
        });
    }

})

module.exports = router;