const express = require('express');
const router = express.Router();

const dbconfig = require('../config/database.js')();
const connection = dbconfig.init();

const multer = require('multer');
let upload = multer({ dest: './src/uploads' })

// 직원 구분
router.post('/classification', (req, res) => {

    let sql = 'SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = "EMP_TP"';
    connection.query(sql, (error, rows) => {
        if (error) throw error;
        res.send({ success: true, rows });
    });
})

router.post('/empList', (req, res) => {
    let staffName = req.body.staffName;
    let memberNm = req.body.memberNm;
    let staffClass = req.body.staffClass;
    let closeStatus = req.body.retireChecked[0];
    let startDate = req.body.startDate.toString().substring(0, 10);
    let endDate = req.body.endDate.toString().substring(0, 10);
    
    // console.log('closeStatus',closeStatus);
    let sql = 'SELECT ' +
                    'MEM.MEMBER_NM,EMP.MEMBER_ID,EMP.EMP_NUMBER,EMP.NAME,EMP.BIRTH_DATE,EMP.DEPT_NM, ' +
                    'EMP.EMP_ID,EMP.EMP_HP,(SELECT CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = "EMP_TP" AND CD_V = EMP.EMP_TP)AS "EMP_TP",'+
                    'EMP.APPROVAL_FLAG,EMP.EMP_EMAIL,EMP.PWD,EMP.CEO_FLAG, ' +
                    'DATE_FORMAT(EMP.JOIN_DATE,"%y-%m-%d")AS "JOIN_DATE",DATE_FORMAT(EMP.RETIRE_DATE,"%y-%m-%d")AS "RETIRE_DATE" ' +
                'FROM TB_S10_EMP010 EMP INNER JOIN TB_S10_MEMBER010 MEM ON EMP.MEMBER_ID = MEM.MEMBER_ID '+
                'INNER JOIN (SELECT distinct(MEMBER_ID)FROM TB_S10_CONTRACT010) CON ON CON.MEMBER_ID = MEM.MEMBER_ID'
              ' WHERE CON.CONTRACT_DATE BETWEEN "' + startDate + '" AND "' + endDate + '"'

    if (memberNm != null && memberNm != ""&& memberNm != undefined)
        sql += 'WHERE MEM.MEMBER_NM LIKE "%' + memberNm + '%"'
    if (staffName != null && staffName != ""&&staffName != undefined)
        sql += ' AND EMP.NAME LIKE "%' + staffName + '%"'
    if (staffClass != null && staffClass != "" && staffClass != "전체")
        sql += ' AND EMP.EMP_TP= "' + staffClass + '" '

    if (closeStatus == "Y") {
        sql += ' AND EMP.RETIRE_FLAG = "' + closeStatus + '" '
    } else {
        sql += ' AND (EMP.RETIRE_FLAG != "' + closeStatus + '" OR EMP.RETIRE_FLAG IS NULL) '
    }

    sql += 'AND EMP.RETIRE_FLAG = "N" ORDER BY EMP.MEMBER_ID DESC';



    connection.query(sql, (error, rows) => {
        if (error) throw error;
        res.send({ success: true, rows });
    });
})

router.post('/empDetail', (req, res) => {
    let empId = req.body.empId;
    let sql = 'SELECT MEM.MEMBER_NM,EMP.NAME,EMP.REG_NUMBER1,EMP.REG_NUMBER2,EMP.EMP_TP,EMP.FINAL_SCHOOL_NAME,EMP.EMP_HP,EMP.EMP_EMAIL, ' +
        '       EMP.ZIP_CODE,EMP.ADDRESS,EMP.DETAIL_ADDRESS,EMP.IMAGE_FAMRELCERTIFICATE,EMP.IMAGE_GRADCERTIFICATE,' +
        '       EMP.IMAGE_BANKBOOK,EMP.EMP_NUMBER,EMP.EMP_LEVEL,EMP.JOIN_DATE,EMP.DEPT_NM,EMP.PWD,EMP.WAGES,EMP.RETIRE_DATE,EMP.BIRTH_DATE,' +
        '       EMP.EMP_COMMENT ' +
        ' FROM TB_S10_EMP010 EMP INNER JOIN TB_S10_MEMBER010 MEM ' +
        ' ON EMP.MEMBER_ID = MEM.MEMBER_ID'+
        ' WHERE EMP_ID=' + empId;

    connection.query(sql, (error, rows) => {
        if (error) throw error;
        res.send({ success: true, rows });
    });
})

router.post('/insertEmp', upload.fields([{ name: 'famRelCertificate', maxCount: 3 }, { name: 'graduationCertificate', maxCount: 5 }, { name: 'copyOfBankbook', maxCount: 5 }]), (req, res) => {

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
    let wages = req.body.wages;
    let retireDate = req.body.retireDate;
    let birthDate = req.body.birthDate;
    let empComment = req.body.empComment;
    let retireFlag = req.body.retireFlag;
    
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

    if (existfamRelCertificate && existgraduationCertificate && existcopyOfBankbook) {
        let empSql =
            'INSERT INTO  ' +
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
            '                       CEO_FLAG)' +
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
            deptNm, pwd, wages, retireDate, fstResidentRegiNum, empComment];

        connection.query(empSql, empParams, (error, rows) => {
            if (error) throw error;
            res.send({ success: true, rows });
        });



    } else if ((existfamRelCertificate != null || existfamRelCertificate != undefined) && (existgraduationCertificate == null || existgraduationCertificate == undefined)
        && (existcopyOfBankbook == null || existcopyOfBankbook == undefined)) {

        let empSql =
            'INSERT INTO  ' +
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
            '                       CEO_FLAG)' +
            '    VALUES (?,SYSDATE(),"S010100100",SYSDATE(),"S010100100",?,?,?,?,?,?,?,?,?,?,?,?,?,null,null,null,null,null,null,?,?,?,?,?,?,?,?,?,"N")';


        let empParams = [memberId, empName, fstResidentRegiNum, sndResidentRegiNum, empTp, finalSchoolName, empHp, empEmail,
            zipcode, empAddress, empDetailAddress, famRelCertificatename, famRelCertificateAddr, famRelCertificatePath,
            empNum, empLevel, joinDate,
            deptNm, pwd, wages, retireDate, fstResidentRegiNum, empComment];

        connection.query(empSql, empParams, (error, rows) => {
            if (error) throw error;
            res.send({ success: true, rows });
        });

    } else if ((existfamRelCertificate == null || existfamRelCertificate == undefined) && (existgraduationCertificate != null || existgraduationCertificate != undefined)
        && (existcopyOfBankbook == null || existcopyOfBankbook == undefined)) {
        let empSql =
            'INSERT INTO  ' +
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
            '                       CEO_FLAG)' +
            '    VALUES (?,SYSDATE(),"S010100100",SYSDATE(),"S010100100",?,?,?,?,?,?,?,?,?,?,null,null,null,?,?,?,null,null,null,?,?,?,?,?,?,?,?,?,"N")';


        let empParams = [memberId, empName, fstResidentRegiNum, sndResidentRegiNum, empTp, finalSchoolName, empHp, empEmail,
            zipcode, empAddress, empDetailAddress, famRelCertificatename, famRelCertificateAddr, famRelCertificatePath,
            copyOfBankbookname, copyOfBankbookAddr, copyOfBankbookPath, empNum, empLevel, joinDate,
            deptNm, pwd, wages, retireDate, fstResidentRegiNum, empComment];

        connection.query(empSql, empParams, (error, rows) => {
            if (error) throw error;
            res.send({ success: true, rows });
        });

    } else if ((existfamRelCertificate == null || existfamRelCertificate == undefined) && (existgraduationCertificate == null || existgraduationCertificate == undefined)
        && (existcopyOfBankbook != null || existcopyOfBankbook != undefined)) {
        let empSql =
            'INSERT INTO  ' +
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
            '                       CEO_FLAG)' +
            '    VALUES (?,SYSDATE(),"S010100100",SYSDATE(),"S010100100",?,?,?,?,?,?,?,?,?,?,null,null,null,null,null,null,?,?,?,?,?,?,?,?,?,?,?,?,"N")';


        let empParams = [memberId, empName, fstResidentRegiNum, sndResidentRegiNum, empTp, finalSchoolName, empHp, empEmail,
            zipcode, empAddress, empDetailAddress,
            copyOfBankbookname, copyOfBankbookAddr, copyOfBankbookPath, empNum, empLevel, joinDate,
            deptNm, pwd, wages, retireDate, fstResidentRegiNum, empComment];

        connection.query(empSql, empParams, (error, rows) => {
            if (error) throw error;
            res.send({ success: true, rows });
        });

    } else if ((existfamRelCertificate == null || existfamRelCertificate == undefined) && (existgraduationCertificate == null || existgraduationCertificate == undefined)
        && (existcopyOfBankbook == null || existcopyOfBankbook == undefined)) {
        let empSql =
            'INSERT INTO  ' +
            '       TB_S10_EMP010 ( MEMBER_ID,CREATED_DATE,CREATED_PROGRAM_ID,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID,' +
            '                       NAME,REG_NUMBER1,REG_NUMBER2,EMP_TP, FINAL_SCHOOL_NAME,EMP_HP,EMP_EMAIL,ZIP_CODE,' +
            '                       ADDRESS,DETAIL_ADDRESS,IMAGE_FAMRELCERTIFICATE,IMAGE_FAMRELCERTIFICATE_SERVER,' +
            '                       IMAGE_FAMRELCERTIFICATE_PATH,IMAGE_GRADCERTIFICATE,IMAGE_GRADCERTIFICATE_SERVER,' +
            '                       IMAGE_GRADCERTIFICATE_PATH,IMAGE_BANKBOOK,IMAGE_BANKBOOK_SERVER,IMAGE_BANKBOOK_PATH, ' +
            '                       EMP_NUMBER,EMP_LEVEL,JOIN_DATE,DEPT_NM,PWD,WAGES,RETIRE_DATE,BIRTH_DATE,EMP_COMMENT,' +
            '                       CEO_FLAG)' +
            '    VALUES (?,SYSDATE(),"S010100100",SYSDATE(),"S010100100",' +
            '?,?,?,?,?,?,?,?,' +
            '?,?,null,null,' +
            'null,null,null,' +
            'null,null,null,null,' +
            '?,?,?,?,?,?,?,?,?,"N")';

        let empParams = [memberId, empName, fstResidentRegiNum, sndResidentRegiNum, empTp, finalSchoolName, empHp, empEmail,
            zipcode, empAddress, empDetailAddress, empNum, empLevel, joinDate,
            deptNm, pwd, wages, retireDate, fstResidentRegiNum, empComment];

        connection.query(empSql, empParams, (error, rows) => {
            if (error) throw error;
            res.send({ success: true, rows });
        });

    } else if ((existfamRelCertificate != null || existfamRelCertificate != undefined) && (existgraduationCertificate != null || existgraduationCertificate != undefined)
        && (existcopyOfBankbook == null || existcopyOfBankbook == undefined)) {
        let empSql =
            'INSERT INTO  ' +
            '       TB_S10_EMP010 ( MEMBER_ID,CREATED_DATE,CREATED_PROGRAM_ID,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID,' +
            '                       NAME,REG_NUMBER1,REG_NUMBER2,EMP_TP, FINAL_SCHOOL_NAME,EMP_HP,EMP_EMAIL,ZIP_CODE,' +
            '                       ADDRESS,DETAIL_ADDRESS,IMAGE_FAMRELCERTIFICATE,IMAGE_FAMRELCERTIFICATE_SERVER,' +
            '                       IMAGE_FAMRELCERTIFICATE_PATH,IMAGE_GRADCERTIFICATE,IMAGE_GRADCERTIFICATE_SERVER,' +
            '                       IMAGE_GRADCERTIFICATE_PATH,IMAGE_BANKBOOK,IMAGE_BANKBOOK_SERVER,IMAGE_BANKBOOK_PATH, ' +
            '                       EMP_NUMBER,EMP_LEVEL,JOIN_DATE,DEPT_NM,PWD,WAGES,RETIRE_DATE,BIRTH_DATE,EMP_COMMENT,' +
            '                       CEO_FLAG)' +
            '    VALUES (?,SYSDATE(),"S010100100",SYSDATE(),"S010100100",' +
            '?,?,?,?,?,?,?,?,' +
            '?,?,?,?,' +
            '?,?,?,' +
            '?,null,null,null,' +
            '?,?,?,?,?,?,?,?,?,"N")';

        let empParams = [memberId, empName, fstResidentRegiNum, sndResidentRegiNum, empTp, finalSchoolName, empHp, empEmail,
            zipcode, empAddress, empDetailAddress, famRelCertificatename, famRelCertificateAddr, famRelCertificatePath,
            graduationCertificatename, graduationCertificateAddr, graduationCertificatePath, empNum, empLevel, joinDate,
            deptNm, pwd, wages, retireDate, fstResidentRegiNum, empComment];

        connection.query(empSql, empParams, (error, rows) => {
            if (error) throw error;
            res.send({ success: true, rows });
        });

    } else if ((existfamRelCertificate == null || existfamRelCertificate == undefined) && (existgraduationCertificate != null || existgraduationCertificate != undefined)
        && (existcopyOfBankbook != null || existcopyOfBankbook != undefined)) {
        let empSql =
            'INSERT INTO  ' +
            '       TB_S10_EMP010 ( MEMBER_ID,CREATED_DATE,CREATED_PROGRAM_ID,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID,' +
            '                       NAME,REG_NUMBER1,REG_NUMBER2,EMP_TP, FINAL_SCHOOL_NAME,EMP_HP,EMP_EMAIL,ZIP_CODE,' +
            '                       ADDRESS,DETAIL_ADDRESS,IMAGE_FAMRELCERTIFICATE,IMAGE_FAMRELCERTIFICATE_SERVER,' +
            '                       IMAGE_FAMRELCERTIFICATE_PATH,IMAGE_GRADCERTIFICATE,IMAGE_GRADCERTIFICATE_SERVER,' +
            '                       IMAGE_GRADCERTIFICATE_PATH,IMAGE_BANKBOOK,IMAGE_BANKBOOK_SERVER,IMAGE_BANKBOOK_PATH, ' +
            '                       EMP_NUMBER,EMP_LEVEL,JOIN_DATE,DEPT_NM,PWD,WAGES,RETIRE_DATE,BIRTH_DATE,EMP_COMMENT,' +
            '                       CEO_FLAG)' +
            '    VALUES (?,SYSDATE(),"S010100100",SYSDATE(),"S010100100",' +
            '?,?,?,?,?,?,?,?,' +
            '?,?,null,null,' +
            'null,?,?,' +
            '?,?,?,?,' +
            '?,?,?,?,?,?,?,?,?,"N")';

        let empParams = [memberId, empName, fstResidentRegiNum, sndResidentRegiNum, empTp, finalSchoolName, empHp, empEmail,
            zipcode, empAddress, empDetailAddress, graduationCertificatename, graduationCertificateAddr, graduationCertificatePath,
            copyOfBankbookname, copyOfBankbookAddr, copyOfBankbookPath, empNum, empLevel, joinDate,
            deptNm, pwd, wages, retireDate, fstResidentRegiNum, empComment];

        connection.query(empSql, empParams, (error, rows) => {
            if (error) throw error;
            res.send({ success: true, rows });
        });

    } else if ((existfamRelCertificate != null || existfamRelCertificate != undefined) && (existgraduationCertificate == null || existgraduationCertificate == undefined)
        && (existcopyOfBankbook != null || existcopyOfBankbook != undefined)) {
        let empSql =
            'INSERT INTO  ' +
            '       TB_S10_EMP010 ( MEMBER_ID,CREATED_DATE,CREATED_PROGRAM_ID,LAST_UPDATE_DATE,LAST_UPDATE_PROGRAM_ID,' +
            '                       NAME,REG_NUMBER1,REG_NUMBER2,EMP_TP, FINAL_SCHOOL_NAME,EMP_HP,EMP_EMAIL,ZIP_CODE,' +
            '                       ADDRESS,DETAIL_ADDRESS,IMAGE_FAMRELCERTIFICATE,IMAGE_FAMRELCERTIFICATE_SERVER,' +
            '                       IMAGE_FAMRELCERTIFICATE_PATH,IMAGE_GRADCERTIFICATE,IMAGE_GRADCERTIFICATE_SERVER,' +
            '                       IMAGE_GRADCERTIFICATE_PATH,IMAGE_BANKBOOK,IMAGE_BANKBOOK_SERVER,IMAGE_BANKBOOK_PATH, ' +
            '                       EMP_NUMBER,EMP_LEVEL,JOIN_DATE,DEPT_NM,PWD,WAGES,RETIRE_DATE,BIRTH_DATE,EMP_COMMENT,' +
            '                       CEO_FLAG)' +
            '    VALUES (?,SYSDATE(),"S010100100",SYSDATE(),"S010100100",' +
            '?,?,?,?,?,?,?,?,' +
            '?,?,?,?,' +
            '?,null,null,' +
            'null,?,?,?,' +
            '?,?,?,?,?,?,?,?,?,"N")';

        let empParams = [memberId, empName, fstResidentRegiNum, sndResidentRegiNum, empTp, finalSchoolName, empHp, empEmail,
            zipcode, empAddress, empDetailAddress, famRelCertificatename, famRelCertificateAddr, famRelCertificatePath,
            copyOfBankbookname, copyOfBankbookAddr, copyOfBankbookPath, empNum, empLevel, joinDate,
            deptNm, pwd, wages, retireDate, fstResidentRegiNum, empComment];

        connection.query(empSql, empParams, (error, rows) => {
            if (error) throw error;
            res.send({ success: true, rows });
        });

    }
})


router.post('/modifyEmp', upload.fields([{ name: 'famRelCertificate', maxCount: 3 }, { name: 'graduationCertificate', maxCount: 5 }, { name: 'copyOfBankbook', maxCount: 5 }]), (req, res) => {

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
        'PWD="' + pwd + '",' +
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
        if (error) throw error;
        res.send({ success: true, rows });
    });
})
// 주민번호 중복확인 

router.post('/regNoCheck', (req, res) => {

    let fstResidentRegiNum = req.body.fstResidentRegiNum;
    let sndResidentRegiNum = req.body.sndResidentRegiNum;


    let sndRegNumberChkSql = 'SELECT COUNT(REG_NUMBER2) AS RowNum  ' +
        ' FROM TB_S10_EMP010 EMP ' +
        '        WHERE REG_NUMBER2= "' + sndResidentRegiNum + '"';

    connection.query(sndRegNumberChkSql, (error, number) => {//쿼리문
        if (error) throw error;
        res.send({ success: true, number })
        sndRegNumberChkSql = number[0].RowNum;
        //console.log(number[0].RowNum);
        //console.log(number.RowDataPacket.RowNum);
    });



})


router.post('/emailCheck', (req, res) => {
    let memId = req.body.memId;
    let empEmailId = req.body.empEmailId;
    let domainAddress = req.body.domainAddress;

    let empEmail = empEmailId + '@' + domainAddress;

    let emailChkSql = 'SELECT COUNT(EMP_EMAIL) AS RowNum  ' +
        ' FROM TB_S10_EMP010 EMP ' +
        '        WHERE EMP_EMAIL = "' + empEmail + '" AND MEMBER_ID = ' + memId;

    connection.query(emailChkSql, (error, number) => {//쿼리문
        if (error) throw error;
        res.send({ success: true, number })
        emailChkSql = number[0].RowNum;
        //console.log(number[0].RowNum);
        //console.log(number.RowDataPacket.RowNum);
    });



})




router.post('/approval', (req, res) => {

    let checkEmpId = req.body. arr;

    if(checkEmpId.length > 1){
    // console.log('checkEmpId',checkEmpId);
        for (let i = 0; i < checkEmpId.length; i++) {
            let sql = 'UPDATE TB_S10_EMP010 ' +
                'SET APPROVAL_FLAG = "Y" ' +
                'WHERE EMP_ID = ' + checkEmpId[i];

            connection.query(sql, (error) => {//쿼리문
                if (error) throw error;
                
            });
        }
        res.send({ success: true })
    }else{
            let sql = 'UPDATE TB_S10_EMP010 ' +
            'SET APPROVAL_FLAG = "Y" ' +
            'WHERE EMP_ID = ' + checkEmpId[0];

            connection.query(sql, (error) => {//쿼리문
                if (error) throw error;
                res.send({ success: true })
            });
    }

})



module.exports = router;