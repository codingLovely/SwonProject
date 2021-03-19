import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { post } from 'axios';

import Base64Downloader from 'react-base64-downloader';
import DaumPostcode from 'react-daum-postcode';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import Form from 'react-bootstrap/Form';

import DatePicker, { registerLocale } from 'react-datepicker';
import ko from 'date-fns/locale/ko';

registerLocale('ko', ko);



const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

function S010100100(props) {

    let name = props.name;
  
    // 회원정보
    const [memberNm, setMemberNm] = useState('');
    const [empName, setEmpName] = useState('');
    const [fstResidentRegiNum, setFstResidentRegiNum] = useState('');
    const [sndResidentRegiNum, setSndResidentRegiNum] = useState('');
    const [empTp, setEmpTp] = useState('');
    const [empTps, setEmpTps] = useState([{}]);
    const [finalSchoolName, setFinalSchoolName] = useState('');
    const [firstEmpHp, setFirstEmpHp] = useState('');
    const [secondEmpHp, setSecondEmpHp] = useState('');
    const [thirdEmpHp, setThirdEmpHp] = useState('');
    const [empEmailId, setEmpEmailId] = useState('');
    const [domainAddress, setDomainAddress] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [empAddress, setEmpAddress] = useState('');
    const [empDetailAddress, setEmpDetailAddress] = useState('');

    const [isPostOpen, setIsPostOpen] = useState(false);

    // 첨부파일업로드
    const [famRelCertificate, setFamRelCertificate] = useState(null);
    const [famRelCertificateName, setFamRelCertificateName] = useState('');
    const [realFamRelCertificateName, setRealFamRelCertificateName] = useState('');
    

    const [graduationCertificate, setGraduationCertificate] = useState(null);
    const [graduationCertificateName, setGraduationCertificateName] = useState('');
    const [realGraduationCertificateName, setRealGraduationCertificateName] = useState('');

    const [copyOfBankbook, setCopyOfBankbook] = useState(null);
    const [copyOfBankbookName, setCopyOfBankbookName] = useState('');
    const [realCopyOfBankbookName, setRealCopyOfBankbookName] = useState('');

    const [detailFamRelCert,setDetailFamRelCert] = useState('');
    const [detailGraduationCert,setDetailGraduationCert] = useState('');
    const [detailCopyBankbook,setDetailCopyBankbook] = useState('');

    const [empNum, setEmpNum] = useState('');
    const [empLevel, setEmpLevel] = useState('');
    const [deptNm, setDeptNm] = useState('');
    const [pwd, setPwd] = useState('');
    const [wages, setWages] = useState('0');
    const [joinDate, setJoinDate] = useState('');
    const [retireDate, setRetireDate] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [empComment, setEmpComment] = useState('');
  
    // 중복확인
    const [regNumCheckBtn, setRegNumCheckBtn] = useState('');
    const [emailCheckBtn, setEmailCheckBtn] = useState('');

    const classes = useStyles();

    const handleOpen = () => {
        setIsPostOpen(true);
    };

    const handleClose = () => {
        setIsPostOpen(false);
    };


    const postCodeStyle = {
        display: "block",
        // position: "absolute",
        top: "50%",
        width: "400px",
        height: "500px",
        padding: "10px",
    };

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = "";

        if (data.addressType === "R") {
            if (data.bname !== "") {
                extraAddress += data.bname;
            }
            if (data.buildingName !== "") {
                extraAddress +=
                    extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }


        setZipcode(data.zonecode);
        setEmpAddress(fullAddress);

    };

    // 직원 구분
    useEffect(() => {
        axios.post('/api/s010100090/classification')
            .then(response => {
                if (response.data.success) {
                    let arr = [{ key: '', value: '선택' }]

                    response.data.rows.map((data) =>
                        arr.push({
                            value: data.CD_V_MEANING, key: data.CD_V
                        }));

                    setEmpTps(arr);

                } else {
                    alert(response.data.message);
                    alert("문의구분 데이터를 불러오는데 실패하였습니다.");
                }
            })
    }, [])

    // 파일확장자 체크 
    // const fileExtensionChk = (event) => {
    //     let imageType = event.currentTarget.files[0].type;
        
    //     if((imageType != 'image/png')&&(imageType != 'image/jpg')&&(imageType != 'image/jpeg')){
    //         alert('.jpg, .jpeg, .png 확장자만 업로드 가능합니다.');

    //         // setState 파라미터
    //         setFamRelCertificate('');
    //         setFamRelCertificateName('');
           
    //     }
    // }

    const onFamRelCertifiacteChange = (event) => {
        setFamRelCertificate(event.currentTarget.files[0]);
        setFamRelCertificateName(event.currentTarget.value);
        
        let imageType = event.currentTarget.files[0].type;
        
        if((imageType != 'image/png')&&(imageType != 'image/jpg')&&(imageType != 'image/jpeg')){
            alert('.jpg, .jpeg, .png 확장자만 업로드 가능합니다.');

            setFamRelCertificate('');
            setFamRelCertificateName('');
           
        }
    }

    const onGraduationCertificateChange = (event) => {
        setGraduationCertificate(event.currentTarget.files[0]);
        setGraduationCertificateName(event.currentTarget.value);
        
        let imageType = event.currentTarget.files[0].type;
        
        if((imageType != 'image/png')&&(imageType != 'image/jpg')&&(imageType != 'image/jpeg')){
            alert('.jpg, .jpeg, .png 확장자만 업로드 가능합니다.');
           
            setGraduationCertificate('');
            setGraduationCertificateName('');
           
        }
    }

    const onCopyOfBankbookChange = (event) => {
        setCopyOfBankbook(event.currentTarget.files[0]);
        setCopyOfBankbookName(event.currentTarget.value);

        let imageType = event.currentTarget.files[0].type;
        
        if((imageType != 'image/png')&&(imageType != 'image/jpg')&&(imageType != 'image/jpeg')){
            alert('.jpg, .jpeg, .png 확장자만 업로드 가능합니다.');
           
            setCopyOfBankbook('');
            setCopyOfBankbookName('');
           
        }
    }

    const [famRelFile,setFamRelFile] = useState('');
    const [graduationFile,setGraduationFile] = useState('');
    const [bankbookFile,setBankbookFile] = useState('');


    const encodeFamRelFileBase64 = (idCardfile) => {
        let reader = new FileReader();
        if(idCardfile){
            reader.readAsDataURL(idCardfile);
            reader.onload = () => {
                let Base64 = reader.result;
                // console.log(Base64);
                setFamRelFile(Base64);
               
            };
            
            reader.onerror = function (error){
                console.log('error : ',error);
            }
        }
    };
    
    const encodeGraduationFileBase64 = (idCardfile) => {
        let reader = new FileReader();
        if(idCardfile){
            reader.readAsDataURL(idCardfile);
            reader.onload = () => {
                let Base64 = reader.result;
                // console.log(Base64);
                setGraduationFile(Base64);
               
            };
            
            reader.onerror = function (error){
                console.log('error : ',error);
            }
        }
    };

    const encodeBankbookFileBase64 = (idCardfile) => {
        let reader = new FileReader();
        if(idCardfile){
            reader.readAsDataURL(idCardfile);
            reader.onload = () => {
                let Base64 = reader.result;
                // console.log(Base64);
                setBankbookFile(Base64);
               
            };
            
            reader.onerror = function (error){
                console.log('error : ',error);
            }
        }
    };

    encodeFamRelFileBase64(famRelCertificate);
    encodeGraduationFileBase64(graduationCertificate);
    encodeBankbookFileBase64(copyOfBankbook);
   

    // 저장 함수
    const addEmp = () => {
     
        let memId = props.memId;

        let retire;
        let join;
    
        if(retireDate){
           
            retire = retireDate.getFullYear()+'-'+ (retireDate.getMonth()+1)+'-'+retireDate.getDate();
        }
        if(joinDate){
          
            join = joinDate.getFullYear()+'-'+ (joinDate.getMonth()+1)+'-'+joinDate.getDate();
        }


        let realFamRelCertFileName;
        let realGraduationFileName;
        let realCopyOfBankFileName;

        if(famRelCertificateName){
            realFamRelCertFileName = famRelCertificateName.split('\\')[2].split('.')[0];    
        }
        
        if(graduationCertificateName){
            realGraduationFileName = graduationCertificateName.split('\\')[2].split('.')[0];
        }

        if(copyOfBankbookName){
            realCopyOfBankFileName = copyOfBankbookName.split('\\')[2].split('.')[0];
        }

     
        let body = {
            memId: memId,
            memberNm: memberNm,
            empName: empName,
            fstResidentRegiNum: fstResidentRegiNum,
            sndResidentRegiNum: sndResidentRegiNum,
            empTp: empTp,
            finalSchoolName: finalSchoolName,
            firstEmpHp: firstEmpHp,
            secondEmpHp: secondEmpHp,
            thirdEmpHp: thirdEmpHp,
            empEmailId: empEmailId,
            domainAddress: domainAddress,
            zipcode: zipcode,
            empAddress: empAddress,
            empDetailAddress: empDetailAddress,
        
            famRelFile:famRelFile,
            graduationFile:graduationFile,
            bankbookFile:bankbookFile,

            realFamRelCertFileName:realFamRelCertFileName,
            realGraduationFileName:realGraduationFileName,
            realCopyOfBankFileName:realCopyOfBankFileName,
    
            empNum: empNum,
            empLevel: empLevel,
            joinDate: join,
            deptNm: deptNm,
            pwd: pwd,
            wages: wages,
            retireDate: retire,
            empComment: empComment
        }

         axios.post('/api/s010100100/insertEmp',body)
         .then(response => {
                if(response.data.success){
                    alert('정상적으로 등록 되었습니다.');
                    props.setEmpChecked('');
                    props.setStoreOpen(false);
                    props.empList();
                }else{
                    alert(response.data.message);
                    props.setEmpChecked('');
                    alert('등록에 실패하였습니다.');
                }
         })
    }


    // 저장
    const onSubmitHandler = (event) => {
        event.preventDefault();

        // 회원명 NUll체크
        if (memberNm == null || memberNm == '') {
            return alert("회원명을 선택하세요.");
        }

        // 성명 NUll체크
        if (empName == null || empName == '' ) {
            return alert("이름을 입력하세요.");
        }

        // 주민번호 NUll체크
        if (fstResidentRegiNum == null || fstResidentRegiNum == '' || sndResidentRegiNum == null || sndResidentRegiNum == '') {
            return alert("주민번호를 입력하세요.");
        }

        // 연락처 NUll체크
        if (firstEmpHp == null || firstEmpHp == ''||secondEmpHp == null || secondEmpHp == ''|| thirdEmpHp == null || thirdEmpHp == '') {
            return alert("연락처를 입력하세요.");
        }

        // E-mail NUll체크
        if (empEmailId == null || empEmailId == '' || domainAddress == null || domainAddress == '') {
            return alert("E-mail을 입력하세요.");
        }

        // Password NUll체크
        if (pwd == null || pwd == '') {
            return alert("Password를 입력하세요.");
        }

        if (regNumCheckBtn == '') {
            return alert('주민번호번호 중복확인 하세요.');
        } 
        if (emailCheckBtn == '') {
            return alert('이메일 중복확인 하세요.');
        }
           
        if((firstEmpHp.length != 3)||(secondEmpHp.length != 4)||(thirdEmpHp.length != 4)){
            return alert('연락처 형식을 확인하세요');
        }
        
        addEmp();
    }


    // 수정
    const modifyEmp = (event) => {

        let empId = props.empIdM;
   
        let retire;
        let join;
        let wages;

        if(retireDate){
           
            retire = retireDate.getFullYear()+'-'+ (retireDate.getMonth()+1)+'-'+retireDate.getDate();
        }
        if(joinDate){
          
            join = joinDate.getFullYear()+'-'+ (joinDate.getMonth()+1)+'-'+joinDate.getDate();
        }
        if(retireDate == '' || retireDate == undefined || retireDate == null ){
         
            retire='0000-00-00';
        }
        if(joinDate == '' || joinDate == undefined || joinDate == null){
           
            join='0000-00-00';
        }
        if(wages == null){
            wages = 0;
        }

        let realFamRelCertFileName;
        let realGraduationFileName;
        let realCopyOfBankFileName;

        if(famRelCertificateName){
            realFamRelCertFileName = famRelCertificateName.split('\\')[2].split('.')[0];    
        }
        
        if(graduationCertificateName){
            realGraduationFileName = graduationCertificateName.split('\\')[2].split('.')[0];
        }

        if(copyOfBankbookName){
            realCopyOfBankFileName = copyOfBankbookName.split('\\')[2].split('.')[0];
        }

        console.log()
        let body = {

            empId:empId,
            memberNm: memberNm,
            empName: empName,
            fstResidentRegiNum: fstResidentRegiNum,
            sndResidentRegiNum: sndResidentRegiNum,
            empTp: empTp,
            finalSchoolName: finalSchoolName,
            firstEmpHp: firstEmpHp,
            secondEmpHp: secondEmpHp,
            thirdEmpHp: thirdEmpHp,
            empEmailId: empEmailId,
            domainAddress: domainAddress,
            zipcode: zipcode,
            empAddress: empAddress,
            empDetailAddress: empDetailAddress,

            famRelFile,
            graduationFile,
            bankbookFile,

            realFamRelCertFileName,
            realGraduationFileName,
            realCopyOfBankFileName,

            empNum: empNum,
            empLevel: empLevel,
            joinDate: join,
            deptNm: deptNm,
            pwd: pwd,
            wages: wages,
            retireDate: retire,
            empComment: empComment,
         
            famRelFile:famRelFile,
            graduationFile:graduationFile,
            bankbookFile:bankbookFile,

            realFamRelCertFileName:realFamRelCertFileName,
            realGraduationFileName:realGraduationFileName,
            realCopyOfBankFileName:realCopyOfBankFileName,
    
     
        }

         axios.post('/api/s010100100/modifyEmp',body)
         .then(response => {
            if(response.data.success){
                alert('정상적으로 수정 되었습니다.');
                props.setEmpChecked('');
                props.setStoreOpen(false);
                props.empList();
            }else{
                alert(response.data.message);
                props.setEmpChecked('');
                alert('수정에 실패하였습니다.');
            }
         })
   
    }


    const useConfirm = (message = null, onConfirm, onCancel) => {
        if (!onConfirm || typeof onConfirm !== "function") {
            return;
        }
        if (onCancel && typeof onCancel !== "function") {
            return;
        }

        const confirmAction = () => {
            if (window.confirm(message)) {
                onConfirm();
            } else {
                onCancel();
            }
        };

        return confirmAction;
    };

    const approvalConfirm = () => {

        if((firstEmpHp.length != 3)||(secondEmpHp.length != 4)||(thirdEmpHp.length != 4)){
            alert('연락처 형식을 확인하세요');
        }else{
            modifyEmp();
        }
    }

    const cancelConfirm = () => alert('수정을 취소하였습니다.');

    const onModifyHandler = useConfirm(
        "수정하시겠습니까?",
        approvalConfirm,
        cancelConfirm
    );

    let dataForm = props.dataForm;
    let memId = props.memId;

    useEffect(() => {

        axios.get('/api/s010100040/selectMemberTp')
            .then(response => {
                if (response.data.success) {
                    

                } else {
                    alert(response.data.message);
                    alert("회원상태 데이터를 불러오는데 실패하였습니다.");
                }
            })
    }, [])
    
    // 직원 등록
    useEffect(() => {

        if (dataForm == 'I') {
            setMemberNm(name);
        }

    }, [])

    // 직원 상세보기-(s010100090 수정버튼)
    useEffect(() => {

        if (dataForm == 'U') {
            let empId = props.empIdM;

            let body = {
                empId
            }
        
            axios.post('/api/s010100100/empDetail', body)
                .then(response => {
                    if (response.data.success) {
                    
                        setMemberNm(response.data.rows[0].MEMBER_NM);
                        setEmpName(response.data.rows[0].NAME);

                        if((response.data.rows[0].REG_NUMBER1) && (response.data.rows[0].REG_NUMBER2) != null){
                          setFstResidentRegiNum((response.data.rows[0].REG_NUMBER1));
                          setSndResidentRegiNum((response.data.rows[0].REG_NUMBER2));
                        }

                        setEmpTp(response.data.rows[0].EMP_TP);
                     
                        setFinalSchoolName(response.data.rows[0].FINAL_SCHOOL_NAME);
                        console.log();
                        setFirstEmpHp(((response.data.rows[0].EMP_HP).split("-"))[0]);
                        setSecondEmpHp(((response.data.rows[0].EMP_HP).split("-"))[1]);
                        setThirdEmpHp(((response.data.rows[0].EMP_HP).split("-"))[2]);
                        setEmpEmailId(((response.data.rows[0].EMP_EMAIL).split("@"))[0]);
                        setDomainAddress(((response.data.rows[0].EMP_EMAIL).split("@"))[1]);

                        setZipcode(response.data.rows[0].ZIP_CODE);
                        setEmpAddress(response.data.rows[0].ADDRESS);
                        setEmpDetailAddress(response.data.rows[0].DETAIL_ADDRESS);
                        
                        setEmpNum(response.data.rows[0].EMP_NUMBER);
                        setEmpLevel(response.data.rows[0].EMP_LEVEL);

                        const modalJoinDate = response.data.rows[0].JOIN_DATE;
                        
                        if(modalJoinDate === '0000-00-00'){
                            // console.log('조인날짜 00000');
                            setJoinDate('')
                        }else{
                            // console.log('조인날짜 있음');
                            setJoinDate(new Date(modalJoinDate));
                        }
                        
                        setDeptNm(response.data.rows[0].DEPT_NM);
                        setPwd(response.data.rows[0].PWD);
                        setWages(response.data.rows[0].WAGES);

                        const modalRetireDate = response.data.rows[0].RETIRE_DATE;
                       
                        if(modalRetireDate === '0000-00-00'){
                            setRetireDate('')
                        }else{
                            setRetireDate(new Date(modalRetireDate));
                        }

                        setBirthDate(response.data.rows[0].BIRTH_DATE);
                        setEmpComment(response.data.rows[0].EMP_COMMENT);

                        let famRelImg;
                        let gradCertImg;
                        let copyBankBookImg;

                        if(response.data.rows[0].FAM_REL_CERT_IMAGE){
                            famRelImg = new Buffer.from(response.data.rows[0].FAM_REL_CERT_IMAGE).toString();    
                        }else{
                            famRelImg = '';
                        }
                        if(response.data.rows[0].GRADUATION_CERT_IMAGE){
                            gradCertImg = new Buffer.from(response.data.rows[0].GRADUATION_CERT_IMAGE).toString();    
                        }else{
                            gradCertImg='';
                        }
                        if(response.data.rows[0].BANKBOOK_COPY_IMAGE){
                            copyBankBookImg = new Buffer.from(response.data.rows[0].BANKBOOK_COPY_IMAGE).toString();
                        }else{
                            copyBankBookImg='';
                        }
                         
    
                        setDetailFamRelCert(famRelImg);
                        setDetailGraduationCert(gradCertImg);
                        setDetailCopyBankbook(copyBankBookImg);

                        setRealFamRelCertificateName(response.data.rows[0].FAM_REL_CERT_IMAGE_NAME);
                        setRealGraduationCertificateName(response.data.rows[0].GRADUATION_CERT_IMAGE_NAME);
                        setRealCopyOfBankbookName(response.data.rows[0].BANKBOOK_COPY_IMAGE_NAME);
                    } else {
                        alert(response.data.message);
                        alert("직원 상세 데이터를 불러오는데 실패하였습니다.");
                    }
                })

        }

    }, [])

    const getRegexData = (regex,data) => {
        return data.replace(regex, "");
    }

    const onMemberNmHandler = (event) => {
        setMemberNm(event.currentTarget.value);
    }

    const onEmpNameHandler = (event) => {
        setEmpName(event.currentTarget.value);
    }

    const onFstResidentRegiNumHandler = (event) => {
        const regexData = getRegexData(/[^0-9]/g,event.currentTarget.value);
        setFstResidentRegiNum(regexData);      
    }
    

    const onSndResidentRegiNumHandler = (event) => {
        const regexData = getRegexData(/[^0-9]/g,event.currentTarget.value);
        setSndResidentRegiNum(regexData);
        
    }

    const onEmpTpHandler = (event) => {
        setEmpTp(event.currentTarget.value);
    }

    const onFinalSchoolNameHandler = (event) => {
        setFinalSchoolName(event.currentTarget.value);
    }

    const onFirstEmpHpHandler = (event) => {
        const regexData = getRegexData(/[^0-9]/g, event.currentTarget.value);
        setFirstEmpHp(regexData);
    }

    const onSecondEmpHpHandler = (event) => {
        const regexData = getRegexData(/[^0-9]/g, event.currentTarget.value);
        setSecondEmpHp(regexData);
    }

    const onThirdEmpHpHandler = (event) => {
        const regexData = getRegexData(/[^0-9]/g, event.currentTarget.value);
        setThirdEmpHp(regexData);
    }

    const onEmpEmailIdHandler = (event) => {
        const regexData = getRegexData(/[^-A-Za-z0-9_]/g,event.currentTarget.value);
        setEmpEmailId(regexData);
    }

    const onDomainAddressHandler = (event) => {
        const regexData = getRegexData(/[^a-zA-Z0-9.]+$/,event.currentTarget.value);
        setDomainAddress(regexData);
    }

    const onZipcodeHandler = (event) => {
        setZipcode(event.currentTarget.value);
    }

    const onEmpAddressHandler = (event) => {
        setEmpAddress(event.currentTarget.value);
    }

    const onEmpDetailAddressHandler = (event) => {
        setEmpDetailAddress(event.currentTarget.value);
    }

   

    const onEmpNumHandler = (event) => {
        setEmpNum(event.currentTarget.value);
    }

    const onEmpLevelHandler = (event) => {
        setEmpLevel(event.currentTarget.value);
    }

    const onDeptNmHandler = (event) => {
        setDeptNm(event.currentTarget.value);
    }

    const onPwdHandler = (event) => {
        setPwd(event.currentTarget.value);
    }

    const onWagesHandler = (event) => {
        setWages(event.currentTarget.value);
    }

    const onBirthDateHandler = (event) => {
        setBirthDate(event.currentTarget.value);
    }

    const onEmpCommentHandler = (event) => {
        setEmpComment(event.currentTarget.value);
    }

    // 중복확인
    const onRegNumCheckHandler = (event) => {
        event.preventDefault();

        const body = {
        
            fstResidentRegiNum,
            sndResidentRegiNum
        }
        if((fstResidentRegiNum.length != 6)||(sndResidentRegiNum.length != 7)||(fstResidentRegiNum.length === 0)||(sndResidentRegiNum.length === 0)){
            alert('주민번호 형식을 확인하세요');
        }else{
        axios.post('/api/s010100100/regNoCheck', body)
            .then(response => {
                if (response.data.success) {
                    if (response.data.number[0].RowNum >= 1) {
                        alert('이미 존재하는 주민번호입니다.');
                        setRegNumCheckBtn('');
                        
                    } else if (response.data.number[0].RowNum === 0) {
                        alert('사용할 수 있는 주민번호입니다.')
                        setRegNumCheckBtn('check');
                    }
                } else {
                    alert(response.data.message);
                    alert('중복체크에 실패 하였습니다.')
                }
            })
        }
    }

    const onEmpEmailChkHandler = (event) => {
        event.preventDefault();
        let memId = props.memId;

        const body = {
            // 회원정보
            memId,
            empEmailId,
            domainAddress
        }
        if((empEmailId.length === 0)||(domainAddress.length === 0)){
            alert('이메일 형식을 확인하세요');
        }else{
        axios.post('/api/s010100100/emailCheck', body)
            .then(response => {
                if (response.data.success) {
                    if (response.data.number[0].RowNum >= 1) {
                        alert('이미 존재하는 이메일입니다.');
                        setEmailCheckBtn('');
                    } else if (response.data.number[0].RowNum === 0) {
                        alert('사용할 수 있는 이메일입니다.');
                        setEmailCheckBtn('check');
                    }
                } else {
                    alert(response.data.message);
                    alert('중복체크에 실패 하였습니다.')
                }
            })
        }
    }


    return (

        <form style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
        }}
            encType='multipart/form-data'
        >
            <div className="memInfoWrapper">
                <div className="memInfoWrap">
                    {/* 회원정보란 */}
                    <h5 id="infoTitle">회원 정보</h5>

                    <table id="memberTable">
                        {/* 회원정보란 */}
                        <tbody>
                            <tr>
                                <th rowSpan="9" className="memberInfo">직원정보</th>
                            </tr>

                            <tr>
                                <th className="memberInfo">회원명<span className="star">(*)</span></th>
                                <td>
                                    <Form.Control style={{ width: 12 + 'em', display: 'inline' }} size="sm"
                                        type="text"
                                        onChange={onMemberNmHandler} disabled value={memberNm} id="memberNm" name="memberNm"
                                    />
                                </td>

                                <th className="memberInfo">성명<span className="star">(*)</span></th>
                                <td colSpan="2">

                                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm"
                                        type="text"
                                        onChange={onEmpNameHandler} value={empName} id="empName" name="empName" />

                                </td>


                                <th className="memberInfo">주민번호<span className="star">(*)</span></th>
                                <td colSpan="4">
                                    <Form.Control style={{ width: 7 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={fstResidentRegiNum} maxLength ="6" id="fstResidentRegiNum" name="fstResidentRegiNum"
                                        onChange={onFstResidentRegiNumHandler} />
                                        &nbsp;
                                        -
                                        &nbsp;
                                        <Form.Control style={{ width: 7 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={sndResidentRegiNum} maxLength ="7" id="sndResidentRegiNum" name="sndResidentRegiNum"
                                        onChange={onSndResidentRegiNumHandler} />

                                        &nbsp;

                                        <Button variant="contained" color="primary" style={{ width: 100 }} className="useContractBtn"
                                            onClick = {onRegNumCheckHandler}
                                    > 중복확인</Button>
                                </td>

                                <th className="memberInfo">직원구분</th>
                                <td>
                                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" as="select" multiple={false}
                                        onChange={onEmpTpHandler} value={empTp} id="empTp" name="empTp"
                                    >
                                        {empTps.map((item,index) => (
                                            <option key={index} value={item.key}>{item.value}</option>
                                        ))}
                                    </Form.Control>
                                </td>
                            </tr> 
                            <tr>
                                <th className="memberInfo">최종학교명</th>
                                <td>

                                    <Form.Control style={{ width: 9 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={finalSchoolName|| ''}
                                        onChange={onFinalSchoolNameHandler} id="finalSchoolName" name="finalSchoolName" />

                                </td>

                                <th className="memberInfo">연락처<span className="star">(*)</span></th>
                                <td colSpan="2">

                                    <Form.Control style={{ width: 5 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={firstEmpHp} maxLength ="3" id="firstEmpHp" name="firstEmpHp"
                                        onChange={onFirstEmpHpHandler} />

                                    &nbsp;
                                    -
                                    &nbsp;
                                    <Form.Control style={{ width: 5 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={secondEmpHp} maxLength ="4" id="secondEmpHp" name="secondEmpHp" name="firstEmpHp"
                                        onChange={onSecondEmpHpHandler} />
                                    &nbsp;
                                    -
                                    &nbsp;
                                    <Form.Control style={{ width: 5 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={thirdEmpHp} maxLength ="4" id="thirdEmpHp" name="thirdEmpHp"
                                        onChange={onThirdEmpHpHandler} />
                                </td>

                                <th className="memberInfo">E-mail<span className="star">(*)</span></th>
                                <td colSpan="7">

                                    <Form.Control style={{ width: 7 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={empEmailId} id="empEmailId" name="empEmailId"
                                        onChange={onEmpEmailIdHandler} />

                                    &nbsp;
                                    @
                                    &nbsp;

                                    <Form.Control style={{ width: 10 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={domainAddress} id="domainAddress" name="domainAddress"
                                        onChange={onDomainAddressHandler} />  &nbsp;
                                         <Button variant="contained" color="primary" style={{ width: 100 }} className="useContractBtn"
                                            onClick = {onEmpEmailChkHandler}
                                    > 중복확인</Button>
                                </td>

                            </tr>

                            <tr>
                                <th rowSpan="2" className="memberInfo">대표자 주소</th>

                                <td colSpan="11">

                                    <Form.Control style={{ width: 10 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={zipcode} id="zipcode" name="zipcode"
                                        onChange={onZipcodeHandler} />

                        &nbsp;
                            <Button variant="contained" color="primary" style={{ width: 70 }} className="useContractBtn" onClick={handleOpen}

                                    >우편</Button>

                                    <Modal
                                        className={classes.modal}
                                        open={isPostOpen}
                                        onClose={handleClose}
                                        closeAfterTransition={true}
                                        BackdropComponent={Backdrop}
                                       
                                    >
                                        <Fade in={isPostOpen}>
                                            <div className={classes.paper}>
                                                <DaumPostcode style={postCodeStyle} onComplete={handleComplete} />
                                            </div>
                                        </Fade>
                                    </Modal>
                        &nbsp;
                            <Form.Control style={{ width: 30 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={empAddress} id="empAddress" name="empAddress"
                                        onChange={onEmpAddressHandler} />

                                </td>

                            </tr>
                            <tr>
                                <td colSpan="11">

                                    <Form.Control style={{ width: 30 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={empDetailAddress}
                                        id="empDetailAddress"
                                        name="empDetailAddress"
                                        onChange={onEmpDetailAddressHandler}
                                    />

                                </td>
                            </tr>

                            <tr>
                                <th className="memberInfo" >첨부파일</th>
                                <td colSpan="4" >
                                <label htmlFor="file">가족관계증명서:</label>&nbsp;
                                    <Base64Downloader
                                        base64={detailFamRelCert}
                                        downloadName={realFamRelCertificateName}
                                        Tag="a"
                                        extraAttributes={{ href: '#' }}
                                        className="my-class-name"
                                        style={{ color: 'orange' }}
                                    >
                                       {realFamRelCertificateName}
                                    </Base64Downloader>&nbsp;

                                    <input type='file'
                                        file={famRelCertificate}
                                        name='famRelCertificate'
                                        value={famRelCertificateName}
                                        onChange={onFamRelCertifiacteChange}
                                    />
                                    <div className = 'fileStar'> * jpg,jpeg,png 파일만 가능합니다.</div>
                                </td>
                                <td colSpan="5" >
                                <label htmlFor="file">졸업증명서:</label>&nbsp;
                                    <Base64Downloader
                                        base64={detailGraduationCert}
                                        downloadName={realGraduationCertificateName}
                                        Tag="a"
                                        extraAttributes={{ href: '#' }}
                                        className="my-class-name"
                                        style={{ color: 'orange' }}
                                    >
                                       {realGraduationCertificateName}
                                    </Base64Downloader>        
                                    <input type='file'
                                        file={graduationCertificate}
                                        name='graduationCertificate'
                                        value={graduationCertificateName}
                                        onChange={onGraduationCertificateChange}
                                    />
                                    <div className = 'fileStar'> * jpg,jpeg,png 파일만 가능합니다.</div>
                                </td>

                                <td colSpan="5" >
                                <label htmlFor="file">통장사본:</label>&nbsp;
                                <Base64Downloader
                                        base64={detailCopyBankbook}
                                        downloadName={realCopyOfBankbookName}
                                        Tag="a"
                                        extraAttributes={{ href: '#' }}
                                        className="my-class-name"
                                        style={{ color: 'orange' }}
                                    >
                                       {realCopyOfBankbookName}
                                    </Base64Downloader>

                                    <input type='file'
                                        file={copyOfBankbook}
                                        name='copyOfBankbook'
                                        value={copyOfBankbookName}
                                        onChange={onCopyOfBankbookChange}
                                    />
                                    <div className = 'fileStar'> * jpg,jpeg,png 파일만 가능합니다.</div>
                                </td>
                                
                            </tr>

                            <tr>
                                <th className="memberInfo">직번</th>
                                <td colSpan="2">

                                    <Form.Control style={{ width: 7 + 'em', display: 'inline' }} size="sm"
                                        type="text"
                                        onChange={onEmpNumHandler} value={empNum|| ''} id="empNum" name="empNum" />

                                </td>

                                <th className="memberInfo">직급</th>
                                <td>

                                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm"
                                        type="text"
                                        onChange={onEmpLevelHandler} value={empLevel} id="empLevel" name="empLevel" />

                                </td>

                                <th className="memberInfo">입사일자</th>
                                <td colSpan="4">

                                <DatePicker
                                        className="dateSize"
                                        locale="ko"
                                        selected={joinDate}// .setHours(9, 0, 0, 0)
                                        onChange={date => setJoinDate(date)}
                                        dateFormat="yyyy-MM-dd"
                                       
                                    />
                                
                                </td>
                                <th className="memberInfo">부서</th>
                                <td>

                                    <Form.Control style={{ width: 8 + 'em', display: 'inline' }} size="sm"
                                        type="text"
                                        onChange={onDeptNmHandler} value={deptNm|| ''} id="deptNm" name="deptNm" />

                                </td>

                            </tr>
 
                            <tr>
                                <th className="memberInfo">Password</th>
                                <td colSpan="2">

                                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm"
                                        type="text"
                                        onChange={onPwdHandler} value={pwd|| ''} id="pwd" name="pwd" />

                                </td>

                                <th >급여</th>
                                <td>

                                <Form.Control style={{ width: 8 + 'em', display: 'inline' }} size="sm"
                                        type="text"
                                        onChange={onWagesHandler} value={wages || ''} id="wages" name="wages"  />

                                </td>

                                <th className="memberInfo">퇴사일자</th>
                                <td colSpan="4">

                                <DatePicker
                                        className="dateSize"
                                        locale="ko"
                                        selected={retireDate}//.setHours(9, 0, 0, 0)
                                        onChange={date => setRetireDate(date)}
                                        dateFormat="yyyy-MM-dd"
                                     
                                    />

                                </td>
                                <th className="memberInfo">생년월일</th>
                                <td>
                             
                                     <Form.Control style={{ width: 8 + 'em', display: 'inline' }} size="sm"
                                        type="text"
                                        onChange={onBirthDateHandler} value={birthDate|| ''} id="birthDate" name="birthDate" readOnly/> 


                            </td>

                            </tr>  
                            <tr>
                                <th className="memberInfo">특이사항</th>
                                <td colSpan="11">

                                    <Form.Control as="textarea" rows={3} value={empComment|| ''} id="empComment" name="empComment"
                                        onChange={onEmpCommentHandler} />

                                </td>

                            </tr>

                        </tbody>
                    </table>

                    <div className="btn-center">
                        <Button variant="contained" color="primary" style={{ width: 70 }} className="new"
                            hidden ={props.dataForm !== 'I'}onClick={onSubmitHandler}>저장</Button>
                        <Button variant="contained" color="primary" style={{ width: 70 }} className="new"
                            hidden ={props.dataForm !== 'U'}onClick={onModifyHandler}>저장</Button>
                        <Button variant="contained" color="primary" style={{ width: 70 }} className="new"
                        onClick={props.onHandleClickClose}>닫기</Button>
                    </div>
                </div>
            </div>


        </form>

    );

}

export default S010100100;