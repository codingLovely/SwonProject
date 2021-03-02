import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { post } from 'axios';


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
    const [empTp, setEmpTp] = useState();
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

    const [graduationCertificate, setGraduationCertificate] = useState(null);
    const [graduationCertificateName, setGraduationCertificateName] = useState('');

    const [copyOfBankbook, setCopyOfBankbook] = useState(null);
    const [copyOfBankbookName, setCopyOfBankbookName] = useState('');

    const [detailFamRelCert,setDetailFamRelCert] = useState('');
    const [detailGraduationCert,setDetailGraduationCert] = useState('');
    const [detailCopyBankbook,setDetailCopyBankbook] = useState('');

    const [empNum, setEmpNum] = useState('');
    const [empLevel, setEmpLevel] = useState('');
    const [deptNm, setDeptNm] = useState('');
    const [pwd, setPwd] = useState('');
    const [wages, setWages] = useState('');
    const [joinDate, setJoinDate] = useState(new Date(''));
    const [retireDate, setRetireDate] = useState(new Date(''));
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
        axios.post('/api/employeeSt/classification')
            .then(response => {
                if (response.data.success) {
                    let arr = [{ key: '전체', value: '전체' }]

                    response.data.rows.map((data) =>
                        arr.push({
                            value: data.CD_V_MEANING, key: data.CD_V
                        }));

                    setEmpTps(arr);

                } else {
                    alert("문의구분 데이터를 불러오는데 실패하였습니다.");
                }
            })
    }, [])

    const retireProcessing = (formData,retire) =>{
        let today = new Date();   

        let year = today.getFullYear(); // 년도
        let month = today.getMonth() + 1;  // 월
        let date = today.getDate();  // 날짜

        let todayForProcess = year+'-'+month+'-'+date;
        console.log('todayForProcess',todayForProcess);

        if(retire == todayForProcess){
            formData.append('retireFlag',"Y");
        }
    }

    // 저장 함수
    const addEmp = () => {
        const url = '/api/employeeSt/insertEmp';
        const formData = new FormData();
        let memId = props.memId;


        let retire = retireDate.getFullYear()+'-'+ (retireDate.getMonth()+1)+'-'+retireDate.getDate();
        let join = joinDate.getFullYear()+'-'+ (joinDate.getMonth()+1)+'-'+joinDate.getDate();

        console.log('retire',retire);
        
        formData.append('memId', memId);
        formData.append('memberNm', memberNm);
        formData.append('empName', empName);
        formData.append('fstResidentRegiNum', fstResidentRegiNum);
        formData.append('sndResidentRegiNum', sndResidentRegiNum);
        formData.append('empTp', empTp);
        formData.append('finalSchoolName', finalSchoolName);
        formData.append('firstEmpHp', firstEmpHp);
        formData.append('secondEmpHp', secondEmpHp);
        formData.append('thirdEmpHp', thirdEmpHp);
        formData.append('empEmailId', empEmailId);
        formData.append('domainAddress', domainAddress);

        formData.append('zipcode', zipcode);
        formData.append('empAddress', empAddress);
        formData.append('empDetailAddress', empDetailAddress);

        formData.append('famRelCertificate', famRelCertificate);
        formData.append('famRelCertificateName', famRelCertificateName);
        formData.append('graduationCertificate', graduationCertificate);
        formData.append('graduationCertificateName', graduationCertificateName);
        formData.append('copyOfBankbook', copyOfBankbook);
        formData.append('copyOfBankbookName', copyOfBankbookName);

        formData.append('empNum', empNum);
        formData.append('empLevel', empLevel);
        formData.append('joinDate', join);
        formData.append('deptNm', deptNm);
        formData.append('pwd', pwd);
        formData.append('wages', wages);
        formData.append('retireDate', retire);
        formData.append('empComment', empComment);
         // formData.append('birthDate',birthDate);

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return post(url, formData, config);
    }


    // 저장
    const onSubmitHandler = (event) => {
        event.preventDefault();

        // // 회원명 NUll체크
        // if (memberNm == null || memberNm == '') {
        //     return alert("회원명을 선택하세요.");
        // }

        // // 성명 NUll체크
        // if (empName == null || empName == '' ) {
        //     return alert("이름을 입력하세요.");
        // }

        // // 주민번호 NUll체크
        // if (fstResidentRegiNum == null || fstResidentRegiNum == '' || sndResidentRegiNum == null || sndResidentRegiNum == '') {
        //     return alert("주민번호를 입력하세요.");
        // }

        // // 연락처 NUll체크
        // if (firstEmpHp == null || firstEmpHp == ''||secondEmpHp == null || secondEmpHp == ''|| thirdEmpHp == null || thirdEmpHp == '') {
        //     return alert("연락처를 입력하세요.");
        // }

        // // E-mail NUll체크
        // if (empEmailId == null || empEmailId == '' || domainAddress == null || domainAddress == '') {
        //     return alert("E-mail을 입력하세요.");
        // }

        // // Password NUll체크
        // if (pwd == null || pwd == '') {
        //     return alert("Password를 입력하세요.");
        // }

        if((fstResidentRegiNum.length < 6 )||(fstResidentRegiNum.length < 7 ) ){
            alert('주민번호 형식을 확인하세요.');
        }

        // // 중복확인
        // if (regNumCheckBtn == '') {
        //     alert('주민번호번호 중복확인 하세요.');
        // } else if (emailCheckBtn == '') {
        //     alert('이메일 중복확인 하세요.');
        // } else if (regNumCheckBtn == 'check' && emailCheckBtn == 'check') {
        addEmp().then((response) => {
            alert('정상적으로 등록 되었습니다.');
        })
        // }

    }


    // 수정
    const modifyEmp = (event) => {

        const url = '/api/employeeSt/modifyEmp';
        const formData = new FormData();

        let empId = props.empIdM;
        // console.log('memId', memId);
        let retire = retireDate.getFullYear()+'-'+ (retireDate.getMonth()+1)+'-'+retireDate.getDate();
        let join = joinDate.getFullYear()+'-'+ (joinDate.getMonth()+1)+'-'+joinDate.getDate();
        console.log('retire',retire);
        console.log('join',join);
        
        formData.append('empId', empId);
        formData.append('memberNm', memberNm);
        formData.append('empName', empName);
        formData.append('fstResidentRegiNum', fstResidentRegiNum);
        formData.append('sndResidentRegiNum', sndResidentRegiNum);
        formData.append('empTp', empTp);
        formData.append('finalSchoolName', finalSchoolName);
        formData.append('firstEmpHp', firstEmpHp);
        formData.append('secondEmpHp', secondEmpHp);
        formData.append('thirdEmpHp', thirdEmpHp);
        formData.append('empEmailId', empEmailId);
        formData.append('domainAddress', domainAddress);

        formData.append('zipcode', zipcode);
        formData.append('empAddress', empAddress);
        formData.append('empDetailAddress', empDetailAddress);

        formData.append('famRelCertificate', famRelCertificate);
        formData.append('famRelCertificateName', famRelCertificateName);
        formData.append('graduationCertificate', graduationCertificate);
        formData.append('graduationCertificateName', graduationCertificateName);
        formData.append('copyOfBankbook', copyOfBankbook);
        formData.append('copyOfBankbookName', copyOfBankbookName);

        formData.append('empNum', empNum);
        formData.append('empLevel', empLevel);
        formData.append('joinDate', join);
        formData.append('deptNm', deptNm);
        formData.append('pwd', pwd);
        formData.append('wages', wages);
        formData.append('retireDate', retire);
        formData.append('empComment', empComment);
        // formData.append('birthDate',birthDate);

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return post(url, formData, config);

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

        if((fstResidentRegiNum.length < 6 )||(fstResidentRegiNum.length < 7 ) ){
            alert('주민번호 형식을 확인하세요.');
        }

        modifyEmp().then((response) => {
            alert('정상적으로 수정 되었습니다.');
        })

    }

    const cancelConfirm = () => alert('수정을 취소하였습니다.');

    const onModifyHandler = useConfirm(
        "수정하시겠습니까?",
        approvalConfirm,
        cancelConfirm
    );

    let dataForm = props.dataForm;
    let memId = props.memId;
    
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
          
            console.log('empIdMd',props.empIdM);

            axios.post('/api/employeeSt/empDetail', body)
                .then(response => {
                    if (response.data.success) {
                    
                        setMemberNm(response.data.rows[0].MEMBER_NM);
                        setEmpName(response.data.rows[0].NAME);

                        if((response.data.rows[0].REG_NUMBER1) && (response.data.rows[0].REG_NUMBER2) != null){
                          setFstResidentRegiNum((response.data.rows[0].REG_NUMBER1));
                          setSndResidentRegiNum((response.data.rows[0].REG_NUMBER2));
                        }

                        setEmpTp(response.data.rows[0].EMP_TP);
                        // console.log('response.data.rows[0].EMP_TP',response.data.rows[0].EMP_TP);
                        setFinalSchoolName(response.data.rows[0].FINAL_SCHOOL_NAME);
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
                        
                        if((modalJoinDate != null)&&(modalJoinDate != "")&&(modalJoinDate != undefined)){
                            setJoinDate(new Date(modalJoinDate));
                        }else{
                            setJoinDate(new Date(''))
                        }
                        
                        setDeptNm(response.data.rows[0].DEPT_NM);
                        setPwd(response.data.rows[0].PWD);
                        setWages(response.data.rows[0].WAGES);

                        const modalRetireDate = response.data.rows[0].RETIRE_DATE;
                        // console.log('retireDate',retireDate);
                        if((modalRetireDate != null)&&(modalRetireDate != "")&&(modalRetireDate != undefined)){
                            setRetireDate(new Date(modalRetireDate));
                        }else{
                            setRetireDate(new Date(''))
                        }

                        
                        setBirthDate(response.data.rows[0].BIRTH_DATE);
                        setEmpComment(response.data.rows[0].EMP_COMMENT);

                        setDetailFamRelCert(response.data.rows[0].IMAGE_FAMRELCERTIFICATE);
                        setDetailGraduationCert(response.data.rows[0].IMAGE_GRADCERTIFICATE);
                        setDetailCopyBankbook(response.data.rows[0].IMAGE_BANKBOOK);

                      
                    } else {
                        alert("직원 상세 데이터를 불러오는데 실패하였습니다.");
                    }
                })

        }

    }, [])

    const onMemberNmHandler = (event) => {
        setMemberNm(event.currentTarget.value);
    }

    const onEmpNameHandler = (event) => {
        setEmpName(event.currentTarget.value);
    }

    const onFstResidentRegiNumHandler = (event) => {
        setFstResidentRegiNum(event.currentTarget.value);
    }

    const onSndResidentRegiNumHandler = (event) => {
        setSndResidentRegiNum(event.currentTarget.value);
    }

    const onEmpTpHandler = (event) => {
        setEmpTp(event.currentTarget.value);
    }

    const onFinalSchoolNameHandler = (event) => {
        setFinalSchoolName(event.currentTarget.value);
    }

    const onFirstEmpHpHandler = (event) => {
        setFirstEmpHp(event.currentTarget.value);
    }

    const onSecondEmpHpHandler = (event) => {
        setSecondEmpHp(event.currentTarget.value);
    }

    const onThirdEmpHpHandler = (event) => {
        setThirdEmpHp(event.currentTarget.value);
    }

    const onEmpEmailIdHandler = (event) => {
        setEmpEmailId(event.currentTarget.value);
    }

    const onDomainAddressHandler = (event) => {
        setDomainAddress(event.currentTarget.value);
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

    const onFamRelCertifiacteChange = (event) => {
        // file: event.currentTarget.idCardFiles[0];
        setFamRelCertificate(event.currentTarget.files[0]);
        setFamRelCertificateName(event.currentTarget.value);
    }

    const onGraduationCertificateChange = (event) => {
        // file: event.currentTarget.idCardFiles[0];
        setGraduationCertificate(event.currentTarget.files[0]);
        setGraduationCertificateName(event.currentTarget.value);
    }

    const onCopyOfBankbookChange = (event) => {
        // file: event.currentTarget.idCardFiles[0];
        setCopyOfBankbook(event.currentTarget.files[0]);
        setCopyOfBankbookName(event.currentTarget.value);
    }
    
    const onIdDownloadHandler = (event) => {
        event.preventDefault();
        //  console.log('dataMemId', dataMemId);

        // axios.get(`/api/s01010050/download/tb_s10_member010_by_id?id=${dataMemId}&type=single`)
        //     .then(response => {
        //         if (response) {
        //             alert('res');
        //             console.log(response);

        //         } else {
        //             alert("다운로드에 실패하였습니다.");
        //         }
        //     })
    }

    const onEmpNumHandler = (event) => {
        setEmpNum(event.currentTarget.value);
    }

    const onEmpLevelHandler = (event) => {
        setEmpLevel(event.currentTarget.value);
    }

    // const onJoinDateHandler = (event) => {
    //     setJoinDate(event.currentTarget.value);
    // }

    const onDeptNmHandler = (event) => {
        setDeptNm(event.currentTarget.value);
    }

    const onPwdHandler = (event) => {
        setPwd(event.currentTarget.value);
    }

    const onWagesHandler = (event) => {
        setWages(event.currentTarget.value);
    }

    // const onRetireDateHandler = (event) => {
    //     setRetireDate(event.currentTarget.value);
    // }

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

        axios.post('/api/employeeSt/regNoCheck', body)
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
                    alert('중복체크에 실패 하였습니다.')
                }
            })
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

        axios.post('/api/employeeSt/emailCheck', body)
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
                    alert('중복체크에 실패 하였습니다.')
                }
            })

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
                                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm"
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

                                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={finalSchoolName|| ''}
                                        onChange={onFinalSchoolNameHandler} id="finalSchoolName" name="finalSchoolName" />

                                </td>

                                <th className="memberInfo">연락처<span className="star">(*)</span></th>
                                <td colSpan="2">

                                    <Form.Control style={{ width: 5 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={firstEmpHp} id="firstEmpHp" name="firstEmpHp"
                                        onChange={onFirstEmpHpHandler} />

                                    &nbsp;
                                    -
                                    &nbsp;
                                    <Form.Control style={{ width: 5 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={secondEmpHp} id="secondEmpHp" name="secondEmpHp" name="firstEmpHp"
                                        onChange={onSecondEmpHpHandler} />
                                    &nbsp;
                                    -
                                    &nbsp;
                                    <Form.Control style={{ width: 5 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={thirdEmpHp} id="thirdEmpHp" name="thirdEmpHp"
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
                                        closeAfterTransition
                                        BackdropComponent={Backdrop}
                                        BackdropProps={{
                                            timeout: 500,
                                        }}
                                    >
                                        <Fade in={isPostOpen}>
                                            <div className={classes.paper}>
                                                <DaumPostcode autoClose style={postCodeStyle} onComplete={handleComplete} />
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
                                <a href='#' onClick={onIdDownloadHandler} >{detailFamRelCert}</a>&nbsp;
                                    <input type='file'
                                        file={famRelCertificate}
                                        name='famRelCertificate'
                                        value={famRelCertificateName}
                                        onChange={onFamRelCertifiacteChange}
                                    />
                                </td>
                                <td colSpan="5" >
                                <a href='#' onClick={onIdDownloadHandler} >{detailGraduationCert}</a>&nbsp;
                                    <input type='file'
                                        file={graduationCertificate}
                                        name='graduationCertificate'
                                        value={graduationCertificateName}
                                        onChange={onGraduationCertificateChange}
                                    />
                                </td>

                                <td colSpan="5" >
                                <a href='#' onClick={onIdDownloadHandler} >{detailCopyBankbook}</a>&nbsp;
                                    <input type='file'
                                        file={copyOfBankbook}
                                        name='copyOfBankbook'
                                        value={copyOfBankbookName}
                                        onChange={onCopyOfBankbookChange}
                                    />
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
                                        selected={joinDate.setHours(9, 0, 0, 0)}
                                        onChange={date => setJoinDate(date)}
                                        dateFormat="yyyy-MM-dd"
                                       
                                    />
                                
                                </td>
                                <th className="memberInfo">부서</th>
                                <td>

                                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm"
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

                                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm"
                                        type="text"
                                        onChange={onWagesHandler} value={wages|| ''} id="wages" name="wages" />

                                </td>

                                <th className="memberInfo">퇴사일자</th>
                                <td colSpan="4">

                                <DatePicker
                                        className="dateSize"
                                        locale="ko"
                                        selected={retireDate.setHours(9, 0, 0, 0)}
                                        onChange={date => setRetireDate(date)}
                                        dateFormat="yyyy-MM-dd"
                                     
                                    />

                                </td>
                                <th className="memberInfo">생년월일</th>
                                <td>
                             
                                     <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm"
                                        type="text"
                                        onChange={onBirthDateHandler} value={birthDate|| ''} id="birthDate" name="birthDate" /> 


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