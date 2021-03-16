const express = require('express');
const router = express.Router();

const dbconfig = require('../config/database.js')();
const connection = dbconfig.init();


const multer = require('multer');
let upload = multer({ dest: './src/uploads' })

const bcrypt = require('bcrypt');                                                    
const saltRounds = 7;                                                              





router.post('/empDetail', (req, res ,next) => {
    let empId = req.body.empId;
    let sql = 'SELECT MEM.MEMBER_NM,EMP.NAME,EMP.REG_NUMBER1,EMP.REG_NUMBER2,EMP.EMP_TP,ifnull(EMP.FINAL_SCHOOL_NAME,"")AS "FINAL_SCHOOL_NAME",EMP.EMP_HP,EMP.EMP_EMAIL, ' +
        '       EMP.ZIP_CODE,EMP.ADDRESS,EMP.DETAIL_ADDRESS,'+
        ' FAM_REL_CERT_IMAGE ,GRADUATION_CERT_IMAGE ,BANKBOOK_COPY_IMAGE,'+
        ' FAM_REL_CERT_IMAGE_NAME ,GRADUATION_CERT_IMAGE_NAME ,BANKBOOK_COPY_IMAGE_NAME,' +
        'ifnull(EMP.EMP_NUMBER,"")AS "EMP_NUMBER",ifnull(EMP.EMP_LEVEL,"")"EMP_LEVEL",EMP.JOIN_DATE,ifnull(EMP.DEPT_NM,"")AS "DEPT_NM",EMP.PWD,EMP.WAGES,EMP.RETIRE_DATE,EMP.BIRTH_DATE,' +
        '       ifnull(EMP.COMMENT,"")AS "EMP_COMMENT" ' +
        ' FROM TB_S10_EMP010 EMP INNER JOIN TB_S10_MEMBER010 MEM ' +
        ' ON EMP.MEMBER_ID = MEM.MEMBER_ID' +
        ' WHERE EMP_ID=' + empId;

    connection.query(sql, (error, rows) => {
        if (error){
            setImmediate(()=>{
                next(new Error(error));
            })
        }else{
            console.log(rows[0].GRADUATION_CERT_IMAGE);
            res.send({ success: true, rows });
        }
    });
})



router.post('/insertEmp', upload.fields([{ name: 'famRelCertificate', maxCount: 3 }, { name: 'graduationCertificate', maxCount: 5 }, { name: 'copyOfBankbook', maxCount: 5 }]), (req, res ,next) => {

    let memberId = req.body.memId;
    let memberNm = req.body.memberNm;
    let empName = req.body.empName;

    let fstResidentRegiNum = req.body.fstResidentRegiNum;
    let sndResidentRegiNum = req.body.sndResidentRegiNum;

    let empTp = req.body.empTp;
    let finalSchoolName = req.body.finalSchoolName;

    let firstEmpHp = req.body.firstEmpHp;
    let secondEmpHp = req.body.secondEmpHp;
    let thirdEmpHp = req.body.thirdEmpHp;

    let empHp = firstEmpHp + '-' + secondEmpHp + '-' + thirdEmpHp;

    let empEmailId = req.body.empEmailId;
    let domainAddress = req.body.domainAddress;

    let empEmail = empEmailId + '@' + domainAddress;

    let zipcode = req.body.zipcode;
    let empAddress = req.body.empAddress;
    let empDetailAddress = req.body.empDetailAddress;


    let empNum = req.body.empNum;
    let empLevel = req.body.empLevel;
    let joinDate = req.body.joinDate;
    let deptNm = req.body.deptNm;
    let pwd = req.body.pwd;
  

    let wages = req.body.wages;
    let retireDate = req.body.retireDate;
    let birthDate = req.body.birthDate;
    let empComment = req.body.empComment;
    let retireFlag = req.body.retireFlag;

    let famRelFile=req.body.famRelFile;
    let graduationFile=req.body.graduationFile;
    let bankbookFile=req.body.bankbookFile;

    let realFamRelCertFileName=req.body.realFamRelCertFileName;
    let realGraduationFileName=req.body.realGraduationFileName;
    let realCopyOfBankFileName=req.body.realCopyOfBankFileName;


       
        bcrypt.hash(pwd, saltRounds, function(err, hash) {
        let empSql = 'INSERT INTO TB_S10_EMP010 '+
                            '( MEMBER_ID,CREATED_DATE,CREATED_PROGRAM_ID,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID,' +
                            ' NAME,REG_NUMBER1,REG_NUMBER2,EMP_TP, FINAL_SCHOOL_NAME,EMP_HP,EMP_EMAIL,ZIP_CODE,' +
                            ' ADDRESS,DETAIL_ADDRESS,'+
                            ' EMP_NUMBER,EMP_LEVEL,JOIN_DATE,' +
                            ' DEPT_NM,' +
                            ' PWD,' +
                            ' WAGES,' +
                            ' RETIRE_DATE,' +
                            ' BIRTH_DATE,' +
                            ' COMMENT,' +
                            ' CEO_FLAG,'+
                            ' FAM_REL_CERT_IMAGE ,GRADUATION_CERT_IMAGE ,BANKBOOK_COPY_IMAGE,'+
                            ' FAM_REL_CERT_IMAGE_NAME ,GRADUATION_CERT_IMAGE_NAME ,BANKBOOK_COPY_IMAGE_NAME)' +
                     'VALUES (?,SYSDATE(),"S010100100",SYSDATE(),"S010100100",' +
                            '?,?,?,?,?,?,?,?,' +
                            '?,?,?,?,?,' +
                            '?,?,?,?,?,?,"N",?,?,?,?,?,?)';
                           
                            

        let empParams = [memberId, empName, fstResidentRegiNum, sndResidentRegiNum, empTp, finalSchoolName, empHp, empEmail,
            zipcode, empAddress, empDetailAddress, empNum, empLevel, joinDate,
            deptNm, hash, wages, retireDate, fstResidentRegiNum, empComment,famRelFile,graduationFile,bankbookFile,
            realFamRelCertFileName,realGraduationFileName,realCopyOfBankFileName];

           
        connection.query(empSql, empParams, (error, rows) => {
            if (error){
                setImmediate(()=>{
                    next(new Error(error));
                })
            }else{
                res.send({ success: true, rows });
            }
           
        });
    });


   
})


router.post('/modifyEmp', upload.fields([{ name: 'famRelCertificate', maxCount: 3 }, { name: 'graduationCertificate', maxCount: 5 }, { name: 'copyOfBankbook', maxCount: 5 }]), (req, res,next) => {

    let empId = req.body.empId;
    let memberNm = req.body.memberNm;
    let empName = req.body.empName;
    let fstResidentRegiNum = req.body.fstResidentRegiNum;
    let sndResidentRegiNum = req.body.sndResidentRegiNum;

    let ResidentRegiNum = fstResidentRegiNum + '-' + sndResidentRegiNum;

    let empTp = req.body.empTp;
    let finalSchoolName = req.body.finalSchoolName;
    // console.log('empTp',empTp);
    let firstEmpHp = req.body.firstEmpHp;
    let secondEmpHp = req.body.secondEmpHp;
    let thirdEmpHp = req.body.thirdEmpHp;

    let empHp = firstEmpHp + '-' + secondEmpHp + '-' + thirdEmpHp;

    let empEmailId = req.body.empEmailId;
    let domainAddress = req.body.domainAddress;

    let empEmail = empEmailId + '@' + domainAddress;

    let zipcode = req.body.zipcode;
    let empAddress = req.body.empAddress;
    let empDetailAddress = req.body.empDetailAddress;


    let empNum = req.body.empNum;
    let empLevel = req.body.empLevel;
    let joinDate = req.body.joinDate;
    let deptNm = req.body.deptNm;
    let pwd = req.body.pwd;
    let wages = req.body.wages;
    let retireDate = req.body.retireDate;
    let birthDate = req.body.birthDate;
    let empComment = req.body.empComment;

    let famRelFile=req.body.famRelFile;
    let graduationFile=req.body.graduationFile;
    let bankbookFile=req.body.bankbookFile;

    let realFamRelCertFileName=req.body.realFamRelCertFileName;
    let realGraduationFileName=req.body.realGraduationFileName;
    let realCopyOfBankFileName=req.body.realCopyOfBankFileName;

    bcrypt.hash(pwd, saltRounds, function(err, hash) {
  
    let empModifySql =
        'UPDATE TB_S10_EMP010 ' +
           'SET CREATED_DATE = sysdate(),' +
                'CREATED_PROGRAM_ID = "s010100100",' +
                'LAST_UPDATE_DATE = sysdate(),' +
                'LAST_UPDATE_PROGRAM_ID ="s010100100",' +
                'NAME="' + empName + '",' +
                'REG_NUMBER1="' + fstResidentRegiNum + '",' +
                'REG_NUMBER2="' + sndResidentRegiNum + '",' +
                'EMP_TP="' + empTp + '",' +
                'FINAL_SCHOOL_NAME="' + finalSchoolName + '",' +
                'EMP_HP="' + empHp + '",' +
                'EMP_EMAIL="' + empEmail + '",' +
                'ZIP_CODE="' + zipcode + '",' +
                'ADDRESS="' + empAddress + '",' +
                'DETAIL_ADDRESS="' + empDetailAddress + '",' +
                'EMP_NUMBER="' + empNum + '",' +
                'EMP_LEVEL="' + empLevel + '",' +
                'JOIN_DATE="' + joinDate + '",' +
                'DEPT_NM="' + deptNm + '",' +
                'PWD="' + hash + '",' +
                'WAGES="' + wages + '",' +
                'RETIRE_DATE="' + retireDate + '",' +
                'BIRTH_DATE="' + fstResidentRegiNum + '",' +
                'COMMENT="' + empComment + '"'

    if (famRelFile) {
        empModifySql +=
            ',FAM_REL_CERT_IMAGE="' +famRelFile + '",' +
            'FAM_REL_CERT_IMAGE_NAME="' + realFamRelCertFileName + '" ' 
    }
    if(graduationFile){
        empModifySql +=
            ',GRADUATION_CERT_IMAGE="' + graduationFile + '",' +
            'GRADUATION_CERT_IMAGE_NAME="' + realGraduationFileName + '" ' 
    }
    if(bankbookFile){
        empModifySql +=
            ',BANKBOOK_COPY_IMAGE="' + bankbookFile + '",' +
            'BANKBOOK_COPY_IMAGE_NAME="' + realCopyOfBankFileName + '" ' 
    }
 
    empModifySql += ' WHERE EMP_ID =' + empId;

    connection.query(empModifySql, (error, rows) => {
        if (error){
            setImmediate(()=>{
                next(new Error(error));
            })
        }else{
            res.send({ success: true, rows });
        }
    });
});
})


router.post('/regNoCheck', (req, res,next) => {

    let fstResidentRegiNum = req.body.fstResidentRegiNum;
    let sndResidentRegiNum = req.body.sndResidentRegiNum;


    let sndRegNumberChkSql = 'SELECT COUNT(REG_NUMBER2) AS RowNum  ' +
                              ' FROM TB_S10_EMP010 EMP ' +
                             ' WHERE REG_NUMBER2= "' + sndResidentRegiNum + '"';

    connection.query(sndRegNumberChkSql, (error, number) => {//쿼리문
        if (error){
            setImmediate(()=>{
                next(new Error(error));
            })
        }else{
            res.send({ success: true, number })
            sndRegNumberChkSql = number[0].RowNum;
        }
     
        //console.log(number[0].RowNum);
        //console.log(number.RowDataPacket.RowNum);
    });



})


router.post('/emailCheck', (req, res, next) => {
    let memId = req.body.memId;
    let empEmailId = req.body.empEmailId;
    let domainAddress = req.body.domainAddress;

    let empEmail = empEmailId + '@' + domainAddress;

    let emailChkSql = 'SELECT COUNT(EMP_EMAIL) AS RowNum  ' +
        ' FROM TB_S10_EMP010 EMP ' +
        '        WHERE EMP_EMAIL = "' + empEmail +'"' 
        // AND MEMBER_ID = ' + memId 
    console.log(emailChkSql);
    connection.query(emailChkSql, (error, number) => {//쿼리문
        if (error){
            setImmediate(()=>{
                next(new Error(error));
            })
        }else{
            res.send({ success: true, number })
            emailChkSql = number[0].RowNum;
        }
       
        //console.log(number[0].RowNum);
        //console.log(number.RowDataPacket.RowNum);
    });

})


module.exports = router;