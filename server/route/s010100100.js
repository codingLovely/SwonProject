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
    let sql = 'SELECT MEM.MEMBER_NM,EMP.NAME,EMP.REG_NUMBER1,EMP.REG_NUMBER2,EMP.EMP_TP,EMP.FINAL_SCHOOL_NAME,EMP.EMP_HP,EMP.EMP_EMAIL, ' +
        '       EMP.ZIP_CODE,EMP.ADDRESS,EMP.DETAIL_ADDRESS,EMP.IMAGE_FAMRELCERTIFICATE,EMP.IMAGE_GRADCERTIFICATE,' +
        '       EMP.IMAGE_BANKBOOK,EMP.EMP_NUMBER,EMP.EMP_LEVEL,EMP.JOIN_DATE,EMP.DEPT_NM,EMP.PWD,EMP.WAGES,EMP.RETIRE_DATE,EMP.BIRTH_DATE,' +
        '       EMP.EMP_COMMENT ' +
        ' FROM TB_S10_EMP010 EMP INNER JOIN TB_S10_MEMBER010 MEM ' +
        ' ON EMP.MEMBER_ID = MEM.MEMBER_ID' +
        ' WHERE EMP_ID=' + empId;

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

    let famRelCertificate = req.body.famRelCertificate;
    let famRelCertificateName = req.body.famRelCertificateName;
    let graduationCertificate = req.body.graduationCertificate;
    let graduationCertificateName = req.body.graduationCertificateName;
    let copyOfBankbook = req.body.copyOfBankbook;
    let copyOfBankbookName = req.body.copyOfBankbookName;

    let empNum = req.body.empNum;
    let empLevel = req.body.empLevel;
    let joinDate = req.body.joinDate;
    let deptNm = req.body.deptNm;
    let pwd = req.body.pwd;
    const encryptedPassword = bcrypt.hash(pwd, saltRounds);




    let wages = req.body.wages;
    let retireDate = req.body.retireDate;
    let birthDate = req.body.birthDate;
    let empComment = req.body.empComment;
    let retireFlag = req.body.retireFlag;
    console.log('retireDate',retireDate);

    let famRelCertificateAddr;
    let famRelCertificatename;
    let famRelCertificatePath;

    let graduationCertificateAddr;
    let graduationCertificatename;
    let graduationCertificatePath;

    let copyOfBankbookAddr;
    let copyOfBankbookname;
    let copyOfBankbookPath;

    //첨부파일 존재 유무
    let existfamRelCertificate = req.files['famRelCertificate'];
    let existgraduationCertificate = req.files['graduationCertificate'];
    let existcopyOfBankbook = req.files['copyOfBankbook'];

    //첨부파일
    if (existfamRelCertificate != null || existfamRelCertificate != undefined) {

        famRelCertificateAddr = '/image/' + req.files['famRelCertificate'][0].filename;
        famRelCertificatename = req.files['famRelCertificate'][0].originalname;
        famRelCertificatePath = req.files['famRelCertificate'][0].path;
    }

    if (existgraduationCertificate != null || existgraduationCertificate != undefined) {
        // console.log('existgraduationCertificate',existgraduationCertificate);

        graduationCertificateAddr = '/image/' + req.files['graduationCertificate'][0].filename;
        graduationCertificatename = req.files['graduationCertificate'][0].originalname;
        graduationCertificatePath = req.files['graduationCertificate'][0].path;
    }

    if (existcopyOfBankbook != null || existcopyOfBankbook != undefined) {
        // console.log('existcopyOfBankbook',existcopyOfBankbook);
        copyOfBankbookAddr = '/image/' + req.files['copyOfBankbook'][0].filename;
        copyOfBankbookname = req.files['copyOfBankbook'][0].originalname;
        copyOfBankbookPath = req.files['copyOfBankbook'][0].path;
    }
    let empSqlquery='INSERT INTO  ' +
    '       TB_S10_EMP010 ( MEMBER_ID,CREATED_DATE,CREATED_PROGRAM_ID,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID,' +
    '                       NAME,REG_NUMBER1,REG_NUMBER2,EMP_TP, FINAL_SCHOOL_NAME,EMP_HP,EMP_EMAIL,ZIP_CODE,' +
    '                       ADDRESS,DETAIL_ADDRESS,IMAGE_FAMRELCERTIFICATE,IMAGE_FAMRELCERTIFICATE_SERVER,' +
    '                       IMAGE_FAMRELCERTIFICATE_PATH,IMAGE_GRADCERTIFICATE,IMAGE_GRADCERTIFICATE_SERVER,' +
    '                       IMAGE_GRADCERTIFICATE_PATH,IMAGE_BANKBOOK,IMAGE_BANKBOOK_SERVER,IMAGE_BANKBOOK_PATH, ' +
    '                       EMP_NUMBER,EMP_LEVEL,JOIN_DATE,' +
    '                       DEPT_NM,' +
    '                       PWD,' +
    '                       WAGES,' +
    '                       RETIRE_DATE,' +
    '                       BIRTH_DATE,' +
    '                       EMP_COMMENT,' +
    '                       CEO_FLAG)' ;

    if (existfamRelCertificate && existgraduationCertificate && existcopyOfBankbook) {
        console.log('3개 다 존재');
        bcrypt.hash(pwd, saltRounds, function(err, hash) {
        let empSql = empSqlquery +
                            '    VALUES (?,SYSDATE(),"S010100100",SYSDATE(),"S010100100",' +
                            '?,?,?,?,?,?,?,?,' +
                            '?,?,?,?,' +
                            '?,?,?,' +
                            '?,?,?,?,' +
                            '?,?,?,' +
                            '?,?,?,?,?,?,"N")';


        let empParams = [memberId, empName, fstResidentRegiNum, sndResidentRegiNum, empTp, finalSchoolName, empHp, empEmail,
            zipcode, empAddress, empDetailAddress, famRelCertificatename, famRelCertificateAddr, famRelCertificatePath,
            graduationCertificatename, graduationCertificateAddr, graduationCertificatePath,
            copyOfBankbookname, copyOfBankbookAddr, copyOfBankbookPath, empNum, empLevel, joinDate,
            deptNm, hash, wages, retireDate, fstResidentRegiNum, empComment];

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


    } else if ((existfamRelCertificate != null || existfamRelCertificate != undefined) && (existgraduationCertificate == null || existgraduationCertificate == undefined)
        && (existcopyOfBankbook == null || existcopyOfBankbook == undefined)) {
            console.log('첫번째하나 존재');
            bcrypt.hash(pwd, saltRounds, function(err, hash) {
        let empSql = empSqlquery +
                   '    VALUES (?,SYSDATE(),"S010100100",SYSDATE(),"S010100100",?,?,?,?,?,?,?,?,?,?,?,?,?,null,null,null,null,null,null,?,?,?,?,?,?,?,?,?,"N")';


        let empParams = [memberId, empName, fstResidentRegiNum, sndResidentRegiNum, empTp, finalSchoolName, empHp, empEmail,
            zipcode, empAddress, empDetailAddress, famRelCertificatename, famRelCertificateAddr, famRelCertificatePath,
            empNum, empLevel, joinDate,
            deptNm, hash, wages, retireDate, fstResidentRegiNum, empComment];

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
    } else if ((existfamRelCertificate == null || existfamRelCertificate == undefined) && (existgraduationCertificate != null || existgraduationCertificate != undefined)
        && (existcopyOfBankbook == null || existcopyOfBankbook == undefined)) {
            console.log('두번째하나 존재');
            bcrypt.hash(pwd, saltRounds, function(err, hash) {
            let empSql =
                        empSqlquery +
                        '    VALUES (?,SYSDATE(),"S010100100",SYSDATE(),"S010100100",?,?,?,?,?,?,?,?,?,?,null,null,null,?,?,?,null,null,null,?,?,?,?,?,?,?,?,?,"N")';


        let empParams = [memberId, empName, fstResidentRegiNum, sndResidentRegiNum, empTp, finalSchoolName, empHp, empEmail,
            zipcode, empAddress, empDetailAddress, famRelCertificatename, famRelCertificateAddr, famRelCertificatePath,
            copyOfBankbookname, copyOfBankbookAddr, copyOfBankbookPath, empNum, empLevel, joinDate,
            deptNm, hash, wages, retireDate, fstResidentRegiNum, empComment];

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
    } else if ((existfamRelCertificate == null || existfamRelCertificate == undefined) && (existgraduationCertificate == null || existgraduationCertificate == undefined)
        && (existcopyOfBankbook != null || existcopyOfBankbook != undefined)) {
            console.log('세번째하나 존재');
            bcrypt.hash(pwd, saltRounds, function(err, hash) {
            let empSql =
                        empSqlquery +
                        '    VALUES (?,SYSDATE(),"S010100100",SYSDATE(),"S010100100",?,?,?,?,?,?,?,?,?,?,null,null,null,null,null,null,?,?,?,?,?,?,?,?,?,?,?,?,"N")';


        let empParams = [memberId, empName, fstResidentRegiNum, sndResidentRegiNum, empTp, finalSchoolName, empHp, empEmail,
            zipcode, empAddress, empDetailAddress,
            copyOfBankbookname, copyOfBankbookAddr, copyOfBankbookPath, empNum, empLevel, joinDate,
            deptNm, hash, wages, retireDate, fstResidentRegiNum, empComment];

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
    } else if ((existfamRelCertificate == null || existfamRelCertificate == undefined) && (existgraduationCertificate == null || existgraduationCertificate == undefined)
        && (existcopyOfBankbook == null || existcopyOfBankbook == undefined)) {
            console.log('전부다 존재안함');
            bcrypt.hash(pwd, saltRounds, function(err, hash) {                 
                // Store hash in your password DB.
                console.log('hash',hash);
                let empSql =
                            empSqlquery +
                                '    VALUES (?,SYSDATE(),"S010100100",SYSDATE(),"S010100100",' +
                                '?,?,?,?,?,?,?,?,' +
                                '?,?,null,null,' +
                                'null,null,null,' +
                                'null,null,null,null,' +
                                '?,?,?,?,?,?,?,?,?,"N")';

                let empParams = [memberId, empName, fstResidentRegiNum, sndResidentRegiNum, empTp, finalSchoolName, empHp, empEmail,
                    zipcode, empAddress, empDetailAddress, empNum, empLevel, joinDate,
                    deptNm, hash, wages, retireDate, fstResidentRegiNum, empComment];

                connection.query(empSql, empParams, (error, rows) => {
                    if (error){
                        setImmediate(()=>{
                            next(new Error(error));
                        })
                    }else{
                        res.send({ success: true, rows });
                    }
                });
            })
    } else if ((existfamRelCertificate != null || existfamRelCertificate != undefined) && (existgraduationCertificate != null || existgraduationCertificate != undefined)
        && (existcopyOfBankbook == null || existcopyOfBankbook == undefined)) {
            bcrypt.hash(pwd, saltRounds, function(err, hash) {
        let empSql =
                    empSqlquery +
                        '    VALUES (?,SYSDATE(),"S010100100",SYSDATE(),"S010100100",' +
                        '?,?,?,?,?,?,?,?,' +
                        '?,?,?,?,' +
                        '?,?,?,' +
                        '?,null,null,null,' +
                        '?,?,?,?,?,?,?,?,?,"N")';

        let empParams = [memberId, empName, fstResidentRegiNum, sndResidentRegiNum, empTp, finalSchoolName, empHp, empEmail,
            zipcode, empAddress, empDetailAddress, famRelCertificatename, famRelCertificateAddr, famRelCertificatePath,
            graduationCertificatename, graduationCertificateAddr, graduationCertificatePath, empNum, empLevel, joinDate,
            deptNm, hash, wages, retireDate, fstResidentRegiNum, empComment];

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
    } else if ((existfamRelCertificate == null || existfamRelCertificate == undefined) && (existgraduationCertificate != null || existgraduationCertificate != undefined)
        && (existcopyOfBankbook != null || existcopyOfBankbook != undefined)) {
            bcrypt.hash(pwd, saltRounds, function(err, hash) {
        let empSql =
                empSqlquery +   
                    '    VALUES (?,SYSDATE(),"S010100100",SYSDATE(),"S010100100",' +
                    '?,?,?,?,?,?,?,?,' +
                    '?,?,null,null,' +
                    'null,?,?,' +
                    '?,?,?,?,' +
                    '?,?,?,?,?,?,?,?,?,"N")';

        let empParams = [memberId, empName, fstResidentRegiNum, sndResidentRegiNum, empTp, finalSchoolName, empHp, empEmail,
            zipcode, empAddress, empDetailAddress, graduationCertificatename, graduationCertificateAddr, graduationCertificatePath,
            copyOfBankbookname, copyOfBankbookAddr, copyOfBankbookPath, empNum, empLevel, joinDate,
            deptNm, hash, wages, retireDate, fstResidentRegiNum, empComment];

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
    } else if ((existfamRelCertificate != null || existfamRelCertificate != undefined) && (existgraduationCertificate == null || existgraduationCertificate == undefined)
        && (existcopyOfBankbook != null || existcopyOfBankbook != undefined)) {
           
            bcrypt.hash(pwd, saltRounds, function(err, hash) {                 
                // Store hash in your password DB.
                console.log('hash',hash);
                let empSql =
                        empSqlquery +
                    '    VALUES (?,SYSDATE(),"S010100100",SYSDATE(),"S010100100",' +
                    '?,?,?,?,?,?,?,?,' +
                    '?,?,?,?,' +
                    '?,null,null,' +
                    'null,?,?,?,' +
                    '?,?,?,?,?,?,?,?,?,"N")';

        let empParams = [memberId, empName, fstResidentRegiNum, sndResidentRegiNum, empTp, finalSchoolName, empHp, empEmail,
            zipcode, empAddress, empDetailAddress, famRelCertificatename, famRelCertificateAddr, famRelCertificatePath,
            copyOfBankbookname, copyOfBankbookAddr, copyOfBankbookPath, empNum, empLevel, joinDate,
            deptNm, hash, wages, retireDate, fstResidentRegiNum, empComment];

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
        

    }
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

    let famRelCertificate = req.body.famRelCertificate;
    let famRelCertificateName = req.body.famRelCertificateName;
    let graduationCertificate = req.body.graduationCertificate;
    let graduationCertificateName = req.body.graduationCertificateName;
    let copyOfBankbook = req.body.copyOfBankbook;
    let copyOfBankbookName = req.body.copyOfBankbookName;

    let empNum = req.body.empNum;
    let empLevel = req.body.empLevel;
    let joinDate = req.body.joinDate;
    let deptNm = req.body.deptNm;
    let pwd = req.body.pwd;
    let wages = req.body.wages;
    let retireDate = req.body.retireDate;
    let birthDate = req.body.birthDate;
    let empComment = req.body.empComment;
    // console.log('retire',retireDate);

    let famRelCertificateAddr;
    let famRelCertificatename;
    let famRelCertificatePath;

    let graduationCertificateAddr;
    let graduationCertificatename;
    let graduationCertificatePath;

    let copyOfBankbookAddr;
    let copyOfBankbookname;
    let copyOfBankbookPath;

    //첨부파일 존재 유무
    let existfamRelCertificate = req.files['famRelCertificate'];
    let existgraduationCertificate = req.files['graduationCertificate'];
    let existcopyOfBankbook = req.files['copyOfBankbook'];

    //첨부파일
    if (existfamRelCertificate != null || existfamRelCertificate != undefined) {

        famRelCertificateAddr = '/image/' + req.files['famRelCertificate'][0].filename;
        famRelCertificatename = req.files['famRelCertificate'][0].originalname;
        famRelCertificatePath = req.files['famRelCertificate'][0].path;
    }

    if (existgraduationCertificate != null || existgraduationCertificate != undefined) {
        // console.log('existgraduationCertificate',existgraduationCertificate);

        graduationCertificateAddr = '/image/' + req.files['graduationCertificate'][0].filename;
        graduationCertificatename = req.files['graduationCertificate'][0].originalname;
        graduationCertificatePath = req.files['graduationCertificate'][0].path;
    }

    if (existcopyOfBankbook != null || existcopyOfBankbook != undefined) {
        // console.log('existcopyOfBankbook',existcopyOfBankbook);

        copyOfBankbookAddr = '/image/' + req.files['copyOfBankbook'][0].filename;
        copyOfBankbookname = req.files['copyOfBankbook'][0].originalname;
        copyOfBankbookPath = req.files['copyOfBankbook'][0].path;
    }
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
        'EMP_COMMENT="' + empComment + '"'

    if (existfamRelCertificate && existgraduationCertificate && existcopyOfBankbook) {
        empModifySql +=
            ',IMAGE_FAMRELCERTIFICATE="' + famRelCertificatename + '",' +
            'IMAGE_FAMRELCERTIFICATE_SERVER="' + famRelCertificateAddr + '",' +
            'IMAGE_FAMRELCERTIFICATE_PATH="' + famRelCertificatePath + '",' +
            'IMAGE_GRADCERTIFICATE="' + graduationCertificatename + '",' +
            'IMAGE_GRADCERTIFICATE_SERVER="' + graduationCertificateAddr + '",' +
            'IMAGE_GRADCERTIFICATE_PATH="' + graduationCertificatePath + '",' +
            'IMAGE_BANKBOOK="' + copyOfBankbookname + '",' +
            'IMAGE_BANKBOOK_SERVER="' + copyOfBankbookAddr + '",' +
            'IMAGE_BANKBOOK_PATH="' + copyOfBankbookPath + '"'

    }
    if ((existfamRelCertificate != null || existfamRelCertificate != undefined) && (existgraduationCertificate == null || existgraduationCertificate == undefined)
        && (existcopyOfBankbook == null || existcopyOfBankbook == undefined)) {
        empModifySql +=
            ',IMAGE_FAMRELCERTIFICATE="' + famRelCertificatename + '",' +
            'IMAGE_FAMRELCERTIFICATE_SERVER="' + famRelCertificateAddr + '",' +
            'IMAGE_FAMRELCERTIFICATE_PATH="' + famRelCertificatePath + '"'
    }
    if ((existfamRelCertificate == null || existfamRelCertificate == undefined) && (existgraduationCertificate != null || existgraduationCertificate != undefined)
        && (existcopyOfBankbook == null || existcopyOfBankbook == undefined)) {
        empModifySql +=
            ',IMAGE_GRADCERTIFICATE="' + graduationCertificatename + '",' +
            'IMAGE_GRADCERTIFICATE_SERVER="' + graduationCertificateAddr + '",' +
            'IMAGE_GRADCERTIFICATE_PATH="' + graduationCertificatePath + '"'

    }
    if ((existfamRelCertificate == null || existfamRelCertificate == undefined) && (existgraduationCertificate == null || existgraduationCertificate == undefined)
        && (existcopyOfBankbook != null || existcopyOfBankbook != undefined)) {
        empModifySql +=
            ',IMAGE_BANKBOOK="' + copyOfBankbookname + '",' +
            'IMAGE_BANKBOOK_SERVER="' + copyOfBankbookAddr + '",' +
            'IMAGE_BANKBOOK_PATH="' + copyOfBankbookPath + '"'
    }
    if ((existfamRelCertificate == null || existfamRelCertificate == undefined) && (existgraduationCertificate == null || existgraduationCertificate == undefined)
        && (existcopyOfBankbook == null || existcopyOfBankbook == undefined)) {

    }

    if ((existfamRelCertificate != null || existfamRelCertificate != undefined) && (existgraduationCertificate != null || existgraduationCertificate != undefined)
        && (existcopyOfBankbook == null || existcopyOfBankbook == undefined)) {
        empModifySql +=
            ',IMAGE_FAMRELCERTIFICATE="' + famRelCertificatename + '",' +
            'IMAGE_FAMRELCERTIFICATE_SERVER="' + famRelCertificateAddr + '",' +
            'IMAGE_FAMRELCERTIFICATE_PATH="' + famRelCertificatePath + '",' +
            'IMAGE_GRADCERTIFICATE="' + graduationCertificatename + '",' +
            'IMAGE_GRADCERTIFICATE_SERVER="' + graduationCertificateAddr + '",' +
            'IMAGE_GRADCERTIFICATE_PATH="' + graduationCertificatePath + '"'
    }
    if ((existfamRelCertificate == null || existfamRelCertificate == undefined) && (existgraduationCertificate != null || existgraduationCertificate != undefined)
        && (existcopyOfBankbook != null || existcopyOfBankbook != undefined)) {
        empModifySql +=
            ',IMAGE_GRADCERTIFICATE="' + graduationCertificatename + '",' +
            'IMAGE_GRADCERTIFICATE_SERVER="' + graduationCertificateAddr + '",' +
            'IMAGE_GRADCERTIFICATE_PATH="' + graduationCertificatePath + '",' +
            'IMAGE_BANKBOOK="' + copyOfBankbookname + '",' +
            'IMAGE_BANKBOOK_SERVER="' + copyOfBankbookAddr + '",' +
            'IMAGE_BANKBOOK_PATH="' + copyOfBankbookPath + '"'
    }
    if ((existfamRelCertificate != null || existfamRelCertificate != undefined) && (existgraduationCertificate == null || existgraduationCertificate == undefined)
        && (existcopyOfBankbook != null || existcopyOfBankbook != undefined)) {
        empModifySql +=
            ',IMAGE_FAMRELCERTIFICATE="' + famRelCertificatename + '",' +
            'IMAGE_FAMRELCERTIFICATE_SERVER="' + famRelCertificateAddr + '",' +
            'IMAGE_FAMRELCERTIFICATE_PATH="' + famRelCertificatePath + '",' +
            'IMAGE_BANKBOOK="' + copyOfBankbookname + '",' +
            'IMAGE_BANKBOOK_SERVER="' + copyOfBankbookAddr + '",' +
            'IMAGE_BANKBOOK_PATH="' + copyOfBankbookPath + '"'

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
// 주민번호 중복확인 

router.post('/regNoCheck', (req, res,next) => {

    let fstResidentRegiNum = req.body.fstResidentRegiNum;
    let sndResidentRegiNum = req.body.sndResidentRegiNum;


    let sndRegNumberChkSql = 'SELECT COUNT(REG_NUMBER2) AS RowNum  ' +
        ' FROM TB_S10_EMP010 EMP ' +
        '        WHERE REG_NUMBER2= "' + sndResidentRegiNum + '"';

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
        '        WHERE EMP_EMAIL = "' + empEmail + '" AND MEMBER_ID = ' + memId;

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