import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { post } from 'axios';
import './css/S010100010.css';
import LeaseAgreement from './utils/LeaseAgreement';

import DaumPostcode from 'react-daum-postcode';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import Form from 'react-bootstrap/Form';

import DatePicker, { registerLocale } from 'react-datepicker';
import ko from 'date-fns/locale/ko';
import { blue } from '@material-ui/core/colors';
registerLocale('ko', ko);

// select박스
let valueArr = [[], [], [], [], []];
let queryArr = [['MEMBER_TP', ''], ['CONTRACT_TP', 'ASK'], ['PAY_METHOD', '']];
let payDates = [];

// 출력용
let forPrint;
// 확정-가계약
let forMemberStatus;


const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

function S010100010(props) {

    // 회원정보
    const [memberNm, setMemberNm] = useState('');
    const [firstRegNo, setFisrtRegNo] = useState('');
    const [secondRegNo, setSecondRegNo] = useState('');
    const [thirdRegNo, setThirdRegNo] = useState('');
    const [memberTp, setMemberTp] = useState('');
    const [empIdName, setEmpIdName] = useState('');
    const [firstEmpHp, setFirstEmpHp] = useState('');
    const [secondEmpHp, setSecondEmpHp] = useState('');
    const [thirdEmpHp, setThirdEmpHp] = useState('');
    const [empEmailId, setEmpEmailId] = useState('');
    const [domainAddress, setDomainAddress] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [empAddress, setEmpAddress] = useState('');
    const [empDetailAddress, setEmpDetailAddress] = useState('');
    const [ceoIdCardImg, setCeoIdCardImg] = useState('');
    const [ceoRegistCardImg, setCeoRegistCardImg] = useState('');

    // 계약정보
    const [contractTp, setContractTp] = useState('');
    const [contractTpVal, setContractTpVal] = useState('');
    const [roomLockerTp, setRoomLockerTp] = useState(0);
    const [contractMoney, setContractMoney] = useState(0);
    const [contractTerm, setContractTerm] = useState('0');
    const [startAsk_date, setStartAsk_date] = useState(new Date());
    const [endAsk_date, setEndAsk_date] = useState(new Date());
    const [payDate, setPayDate] = useState('');
    const [comment, setComment] = useState('');
    const [payMethod, setPayMethod] = useState('');
    const [contractPath, setContractPath] = useState('');
    const [contractStart, setContractStart] = useState('');
    const [contractEnd, setContractEnd] = useState('');
    const [userStatus, setUserStatus] = useState('');
    const [payedStatusForPrint, setPayedStatusForPrint] = useState('');
    // 중복확인
    const [regNoCheckBtn, setRegNoCheckBtn] = useState('');
    const [empHpCheckBtn, setEmpHpCheckBtn] = useState('');
    const [dateCheckBtn, setDateCheckBtn] = useState('');


    // dialog open
    const [printSheetOpen, setPrintSheetOpen] = useState(false);
    const [leaseAgreementOpen, setLeaseAgreementOpen] = useState(false);

    // cd_v_meaning for printing
    const [memberTpPrint, setMemberTpPrint] = useState('');
    const [contractTpPrint, setContractTpPrint] = useState('');
    const [payMethodPrint, setPayMethodPrint] = useState('');
    const [accessPrint, setAccessPrint] = useState('');

    // 첨부파일업로드
    const [idCardFile, setIdCardFile] = useState(null);
    const [idCardFileName, setIdCardFileName] = useState('');

    const [busiCardFile, setBusiCardFile] = useState(null);
    const [busiCardFileName, setBusiCardFileName] = useState('');

    // 확정-가계약구분
    const [memberStFlag, setMemberStFlag] = useState('');

    const [isPostOpen, setIsPostOpen] = useState(false);

    const classes = useStyles();

    const handleOpen = () => {
        setIsPostOpen(true);
    };

    const handleClose = () => {
        setIsPostOpen(false);
    };

    const postCodeStyle = {
        display: "block",
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

    const rNum = props.dataNum;
    const modalMemberId = props.dataMem;

    // s010100050 -> 신규계약버튼 클릭시 member상세정보
    useEffect(() => {

        if (props.newDataForm === 'N') {
            axios.get(`/api/s010100010/insert/tb_s10_contract010_by_id?id=${modalMemberId}&type=single`)
                .then(response => {
                    if (response.data.success) {

                        const modalCMemberNm = response.data.rows[0].MEMBER_NM;
                        const modalCRegNo = response.data.rows[0].REG_NO;
                        const modalCMemberTp = response.data.rows[0].MEMBER_TP;
                        const modalCName = response.data.rows[0].NAME;
                        const modalCEmpHp = response.data.rows[0].EMP_HP;
                        const modalCEmpEmail = response.data.rows[0].EMP_EMAIL;
                        const modalCZipCode = response.data.rows[0].ZIP_CODE;
                        const modalCAddress = response.data.rows[0].ADDRESS;
                        const modalCDetailAddress = response.data.rows[0].DETAIL_ADDRESS;

                        const modalCCeoIdCardImg = response.data.rows[0].ID_CARD_IMAGE_NAME;
                        const modalCRegistIdCardImg = response.data.rows[0].BUSI_LICS_IMAGE_NAME;


                        const modalCRegNos = modalCRegNo.split("-");
                        const modalCEmpHps = modalCEmpHp.split("-");
                        const modalCEmpEmails = modalCEmpEmail.split("@");

                        setMemberNm(modalCMemberNm);
                        setFisrtRegNo(modalCRegNos[0]);
                        setSecondRegNo(modalCRegNos[1]);
                        setThirdRegNo(modalCRegNos[2]);
                        setMemberTp(modalCMemberTp);
                        setEmpIdName(modalCName);
                        setFirstEmpHp(modalCEmpHps[0]);
                        setSecondEmpHp(modalCEmpHps[1]);
                        setThirdEmpHp(modalCEmpHps[2]);
                        setEmpEmailId(modalCEmpEmails[0]);
                        setDomainAddress(modalCEmpEmails[1]);
                        setCeoIdCardImg(modalCCeoIdCardImg);
                        setCeoRegistCardImg(modalCRegistIdCardImg);
                        setZipcode(modalCZipCode);
                        setEmpAddress(modalCAddress);
                        setEmpDetailAddress(modalCDetailAddress);
                        setEmpDetailAddress(modalCDetailAddress);

                    } else {
                        alert(response.data.message);
                        alert("상세 정보 가져오기를 실패하였습니다.")
                    }
                })
        }

    }, []);

    const [hideEndBtn,setHideEndBtn] = useState('');
    const [modalCContractSt, setModalCContractSt] = useState('');
 
    // s01010050 -> 계약id클릭시 계약상세정보
    useEffect(() => {
        if (props.cDataForm === 'I') {

            axios.get(`/api/s010100010/tb_s10_contract010_by_id?id=${rNum}&type=single`)
                .then(response => {
                    if (response.data.success) {
                        // console.log('contract_', response.data.rows);

                        const modalCMemberNm = response.data.rows[0].MEMBER_NM;
                        const modalCRegNo = response.data.rows[0].REG_NO;
                        const modalCMemberTp = response.data.rows[0].MEMBER_TP;
                        const modalCName = response.data.rows[0].NAME;
                        const modalCEmpHp = response.data.rows[0].EMP_HP;
                        const modalCEmpEmail = response.data.rows[0].EMP_EMAIL;
                        const modalCZipCode = response.data.rows[0].ZIP_CODE;
                        const modalCAddress = response.data.rows[0].ADDRESS;
                        const modalCDetailAddress = response.data.rows[0].DETAIL_ADDRESS;
                        const modalCCeoIdCardImg = response.data.rows[0].ID_CARD_IMAGE_NAME;
                        const modalCRegistIdCardImg = response.data.rows[0].BUSI_LICS_IMAGE_NAME;

                        const modalCContractDate = response.data.rows[0].CONTRACT_DATE;

                        const modalCContractTp = response.data.rows[0].CONTRACT_TP;
                        const modalCContractTerm = response.data.rows[0].CONTRACT_TERM;
                        const modalCPayDate = response.data.rows[0].PAY_DATE;
                        const modalCContractMoney = response.data.rows[0].PAYED_PLAN_MONEY;
                        // console.log('modalCContractMoney',modalCContractMoney);
                        const modalCPayMethod = response.data.rows[0].PAY_METHOD;

                        const modalCContractPath = response.data.rows[0].CONTRACT_PATH;
                        const modalCContractPathM = response.data.rows[0].CONTRACT_PATH_M;

                        const modalCStartDate = response.data.rows[0].START_DATE;
                        const modalCEndDate = response.data.rows[0].END_DATE;

                        const modalCContractTpVal = response.data.rows[0].CONTRACT_ROOM;
                        const modalCRoomLockerTp = response.data.rows[0].CONTRACT_LOCKER;
                        const modalCContractTpValM = response.data.rows[0].CONTRACT_ROOM_M;
                        const modalCRoomLockerTpM = response.data.rows[0].CONTRACT_LOCKER_M;
                        const modalCMemberSt = response.data.rows[0].MEMBER_ST;
                        const modalCEndFlag = response.data.rows[0].END_FLAG;
                        const modalCContractSt = response.data.rows[0].CONTRACT_ST;
                        setModalCContractSt(modalCContractSt);
                        setHideEndBtn(modalCEndFlag);
                        //console.log('modalCEndFlag',modalCEndFlag);
                        const modalCComment = response.data.rows[0].COMMENT;

                        const modalCMemberTpPrint = response.data.rows[0].MEMBER_TP_M;
                        const modalCContractTpPrint = response.data.rows[0].CONTRACT_TP_M;
                        const modalCPayMethodPrint = response.data.rows[0].PAY_METHOD_M;
                        const modalCAccessPrint = response.data.rows[0].CONTRACT_PATH_M;

                        const modalCRegNos = modalCRegNo.split("-");
                        const modalCEmpHps = modalCEmpHp.split("-");
                        const modalCEmpEmails = modalCEmpEmail.split("@");

                        setUserStatus(modalCMemberSt);
                        setMemberStFlag(modalCMemberSt);
                        setMemberNm(modalCMemberNm);
                        setFisrtRegNo(modalCRegNos[0]);
                        setSecondRegNo(modalCRegNos[1]);
                        setThirdRegNo(modalCRegNos[2]);
                        setMemberTp(modalCMemberTp);

                        setContractTpVal(modalCContractTpVal);

                        setEmpIdName(modalCName);
                        setFirstEmpHp(modalCEmpHps[0]);
                        setSecondEmpHp(modalCEmpHps[1]);
                        setThirdEmpHp(modalCEmpHps[2]);
                        setEmpEmailId(modalCEmpEmails[0]);
                        setDomainAddress(modalCEmpEmails[1]);
                        setZipcode(modalCZipCode);
                        setEmpAddress(modalCAddress);
                        setCeoIdCardImg(modalCCeoIdCardImg);
                        setCeoRegistCardImg(modalCRegistIdCardImg);

                        setEmpDetailAddress(modalCDetailAddress);
                        setContractStart(modalCContractDate);
                        setContractEnd(modalCEndDate);

                        setContractTp(modalCContractTp);
                        setContractTerm(modalCContractTerm);
                        setPayDate(modalCPayDate);
                        setContractMoney(modalCContractMoney);
                        // console.log('contractMoney',contractMoney);
                        setPayMethod(modalCPayMethod);
                        //setContractPath(modalCContractPath);
                        setRoomLockerTp(modalCRoomLockerTp);
                        setComment(modalCComment);

                        setStartAsk_date(new Date(modalCStartDate));
                        setEndAsk_date(modalCEndDate);

                        setContractTpVal(modalCContractTpVal);
                        setRoomLockerTp(modalCRoomLockerTp);
                        setContractPath(modalCContractPath);

                        setContractTpVals([{ key: modalCContractTpVal, value: modalCContractTpValM }]);
                        setRoomLockers([{ key: modalCRoomLockerTp, value: modalCRoomLockerTpM }]);
                        setContractPaths([{ key: modalCContractPath, value: modalCContractPathM }]);
                        setSelectedOption(response.data.rows[0].PAYED_FLAG);

                        if (response.data.rows[0].PAYED_FLAG === 'Y') {
                            setPayedStatusForPrint('네');
                        } else if (response.data.rows[0].PAYED_FLAG === 'N') {
                            setPayedStatusForPrint('아니오');
                        }

                        //print용
                        setMemberTpPrint(modalCMemberTpPrint);
                        setContractTpPrint(modalCContractTpPrint);
                        setPayMethodPrint(modalCPayMethodPrint);
                        setAccessPrint(modalCAccessPrint);
                    } else {
                        alert(response.data.message);
                        alert("상세 정보 가져오기를 실패하였습니다.")
                    }
                })

        }
    }, [])


    useEffect(() => {
        for (let i = 0; i < queryArr.length; i++) {

            let firstVal = queryArr[i][0];
            let secondVal = queryArr[i][1];
            axios.post('/api/s010100010/selectTest', { firstVal: firstVal, secondVal: secondVal })
                .then(response => {
                    if (response.data.success) {
                       
                        let arr = [{ key: '선택', value: '선택' }]

                        response.data.rows.map((data) =>
                            arr.push({
                                value: data.CD_V_MEANING,
                                key: data.CD_V
                            }));

                        valueArr[i] = arr;
                    } else {
                        alert(response.data.message);
                        alert(" 데이터를 불러오는데 실패하였습니다.");
                    }
            })

        }
    }, [])

    useEffect(() => {
        axios.post('/api/s010100010/accessPath')
            .then(response => {
                if (response.data.success) {
                    let arr = [{ key: '선택', value: '선택' }]
                    response.data.rows.map((data) =>
                        arr.push({
                            value: data.CD_V_MEANING, key: data.CD_V
                        }));
                    setContractPaths(arr);
                } else {
                    alert(response.data.message);
                    alert("데이터를 불러오는데 실패하였습니다.");
                }
            })
    }, [])

    // 날 일
    let arrDate = [{ key: '선택', value: '선택' }];
    for (let i = 1; i <= 31; i++) {
        arrDate.push({
            value: i,
            key: i
        });
        payDates = arrDate;
    }

    // const [contractTpVals, setContractTpVals] = useState([{ key: '선택', value: '' }]);
    // const [roomLockers, setRoomLockers] = useState([{ key: '선택', value: '' }]);
    // const [contractpaths, setContractPaths] = useState([{ key: '선택', value: '' }]);

    const [contractTpVals, setContractTpVals] = useState([{ key: '선택', value: '선택' }]);
    const [roomLockers, setRoomLockers] = useState([{ key: '선택', value: '선택' }]);
    const [contractpaths, setContractPaths] = useState([{ key: '선택', value: '선택' }]);


    const onContractTpHandler = (event) => {
        setContractTp(event.currentTarget.value);

        let contractTpBody = event.currentTarget.value;

        axios.post('/api/s010100010/contHier', { contractTpBody: contractTpBody })
            .then(response => {
                if (response.data.success) {
                    // console.log('ContractTpVal', response.data.rows);
                    let arr = [{ key: '선택', value: '선택' }];

                    (response.data.rows).map((data) =>
                        arr.push({
                            value: data.CD_V_MEANING, key: data.CD_V
                        }));

                    switch (contractTpBody) {
                        case 'R1':
                            setContractTpVals(arr);
                            break;
                        case 'R2':
                            setContractTpVals(arr);
                            break;
                        case 'R3':
                            setContractTpVals(arr);
                            break;
                        case 'FI':
                            setContractTpVals(arr);
                            break;
                        case 'FL':
                            setContractTpVals(arr);
                            break;
                        case 'FR':
                            setContractTpVals(arr);
                            break;
                    }// switch

                    if (contractTpBody === 'FI' || contractTpBody === 'FL') {
                        axios.post('/api/s010100010/roomLockerHier')
                            .then(response => {
                                if (response.data.success) {
                                    // console.log('roomLocker', response.data.rows);
                                    let arr = [{ key: '선택', value: '선택' }]
                                    response.data.rows.map((data) =>
                                        arr.push({
                                            value: data.CD_V_MEANING, key: data.CD_V
                                        }));
                                    setRoomLockers(arr);
                                } else {
                                    alert(response.data.message);
                                    alert('사물함정보를 불러오는데 실패하였습니다.');
                                }
                            })// axios
                    } else {
                        let arr = [{ key: '선택', value: '선택' }];
                        setRoomLockers(arr);
                    }


                    let monthlyMoney = {
                        contractTpBody: contractTpBody
                    }

                    axios.post('/api/s010100010/monthlyMoney', monthlyMoney)
                        .then(response => {
                            if (response.data.success) {
                                // console.log(response.data.rows[0].ATTRIBUTE3);
                                if(response.data.rows[0] == undefined){
                                    setContractMoney(0);
                                }else{
                                    setContractMoney(response.data.rows[0].ATTRIBUTE3);
                                }
         
                            } else {
                                alert(response.data.message);
                                alert('사물함정보를 불러오는데 실패하였습니다.');
                            }
                        })

                }// if문
                else {
                    alert('호실 정보를 불러오는데 실패하였습니다.');
                }

            })// axios,then

    }

    const onContractTpValHandler = (event) => {
        setContractTpVal(event.currentTarget.value);
    }

    const onRoomLockerTpHandler = (event) => {
        setRoomLockerTp(event.currentTarget.value);
    }

    const onContractMoneyHandler = (event) => {
        setContractMoney(event.currentTarget.value);
    }

    const onContractTermHandler = (event) => {
        const regexData = getRegexData(/[^0-9]/g, event.currentTarget.value);
        setContractTerm(regexData);
    }
    const onPayDateHandler = (event) => {
        setPayDate(event.currentTarget.value);
    }

    const onCommentHandler = (event) => {
        setComment(event.currentTarget.value);
    }

    const onPayMethodHandler = (event) => {
        setPayMethod(event.currentTarget.value);
    }

    const onContractPathHandler = (event) => {
        setContractPath(event.currentTarget.value);
    }


    useEffect(() => {
        return () => setRegNoCheckBtn('');
    }, []);
    useEffect(() => {
        return () => setEmpHpCheckBtn('');
    }, []);
    useEffect(() => {
        return () => setDateCheckBtn('');
    }, []);

    // 파일확장자 체크 
    const fileExtensionChk = (event) => {
        let imageType = event.currentTarget.files[0].type;
        
        if((imageType != 'image/png')&&(imageType != 'image/jpg')&&(imageType != 'image/jpeg')){
            alert('.jpg, .jpeg, .png 확장자만 업로드 가능합니다.');
        }
    }

    const idCardHandleFileChange = (event) => {
        setIdCardFile(event.currentTarget.files[0]);
        setIdCardFileName(event.currentTarget.value);
        let imageType = event.currentTarget.files[0].type;
        
        if((imageType != 'image/png')&&(imageType != 'image/jpg')&&(imageType != 'image/jpeg')){
            alert('.jpg, .jpeg, .png 확장자만 업로드 가능합니다.');
            setIdCardFile('');
            setIdCardFileName('');
        }
       
    }   

    const busiCardHandleFileChange = (event) => {
        setBusiCardFile(event.currentTarget.files[0]);
        setBusiCardFileName(event.currentTarget.value);

        let imageType = event.currentTarget.files[0].type;
        
        if((imageType != 'image/png')&&(imageType != 'image/jpg')&&(imageType != 'image/jpeg')){
            alert('.jpg, .jpeg, .png 확장자만 업로드 가능합니다.');
            setBusiCardFile('');
            setBusiCardFileName('');
        }
       
       
    }
    // 대표자 신분증
    const [idCardImg, setIdCardImg]= useState('');
    // 사업자 등록증
    const [busiLicfImg, setBusiLicfImg] = useState('');

    // setState을 파라미터로
    const encodeIdFileBase64 = (idCardfile) => {
        let reader = new FileReader();
        if(idCardfile){
            reader.readAsDataURL(idCardfile);
            reader.onload = () => {
                let Base64 = reader.result;
                // console.log(Base64);
                setIdCardImg(Base64);
               
            };
            
            reader.onerror = function (error){
                console.log('error : ',error);
            }
        }
    };

    const encodeBusiFileBase64 = (idCardfile) => {
        let reader = new FileReader();
        if(idCardfile){
            reader.readAsDataURL(idCardfile);
            reader.onload = () => {
                let Base64 = reader.result;
                // console.log(Base64);
                setBusiLicfImg(Base64);
               
            };
            
            reader.onerror = function (error){
                console.log('error : ',error);
            }
        }
    };


    encodeIdFileBase64(idCardFile);
    encodeBusiFileBase64(busiCardFile);


    // 확정-가계약 저장함수
    const addMember = () =>{

        let startDate = startAsk_date.getFullYear() + '-' + (startAsk_date.getMonth() + 1) + '-' + startAsk_date.getDate();

        let realIdCardFileName;
        let realBusiCardFileName;

        if(idCardFileName){
            realIdCardFileName = idCardFileName.split('\\')[2].split('.')[0];    
        }
        
        if(busiCardFileName){
            realBusiCardFileName = busiCardFileName.split('\\')[2].split('.')[0];
        }

        let body = {

            selectedOption:selectedOption,
            idCardImg: idCardImg,
            busiLicfImg: busiLicfImg,
            realIdCardFileName:realIdCardFileName,
            realBusiCardFileName:realBusiCardFileName,

            memberNm: memberNm,
            firstRegNo: firstRegNo,
            secondRegNo: secondRegNo,
            thirdRegNo: thirdRegNo,
            memberTp: memberTp,
            empIdName: empIdName,
            firstEmpHp: firstEmpHp,
            secondEmpHp: secondEmpHp,
            thirdEmpHp: thirdEmpHp,

            zipcode: zipcode,
            empEmailId: empEmailId,
            domainAddress: domainAddress,
            empAddress: empAddress,
            empDetailAddress: empDetailAddress,

            // 계약정보
            contractTp: contractTp,
            contractTpVal: contractTpVal,
            roomLockerTp: roomLockerTp,
            contractMoney: contractMoney,
            contractTerm: contractTerm,
            startAsk_date: startDate,
            endDate: dateEnd,
            payDate: payDate,
            payMethod: payMethod,
            contractPath: contractPath,
            comment: comment,
            forMemberStatus: forMemberStatus
        }

        axios.post('/api/s010100010/insertMember010', body)
        .then(response => {
            if (response.data.success) {
                setRegNoCheckBtn('');
                setEmpHpCheckBtn('');
                setDateCheckBtn('');
                alert('정상적으로 등록 되었습니다.');
                props.setStoreOpen(false);
                props.memberList();
            } else {
                alert(response.data.message);
                alert("등록 실패하였습니다.");
            }
    })

    }


    // 저장-확정
    const onSubmitHandler = (event) => {
        event.preventDefault();

        forMemberStatus = "C";

        if (empIdName == null || empIdName == '') {
            return alert("대표자를 입력하세요.");
        }

        // 연락처 NUll체크
        if (firstEmpHp == null || firstEmpHp == '' || secondEmpHp == null || secondEmpHp == '' || thirdEmpHp == null || thirdEmpHp == '') {
            return alert("연락처를 입력하세요.");
        }

        if (empEmailId == null || empEmailId == '' || domainAddress == null || domainAddress == '') {
            return alert("email을 입력하세요.");
        }

        // 계약구분 NUll체크
        if (contractTp == null || contractTp == '') {
            return alert("계약구분을 선택하세요.");
        }

        // 호실 NUll체크
        if (contractTpVal == null || contractTpVal == '') {
            return alert("호실을 선택하세요.");
        }

        // 이용기간 NUll체크
        if (contractTerm == null || contractTerm == '' || contractTerm == '0') {
            return alert("이용기간을 입력하세요.");
        }

        // 납부여부 NUll체크
        if (selectedOption == null || selectedOption == '') {
            return alert("납부여부를 선택하세요.");
        }

        // 납부방법 NUll체크
        if (payMethod == null || payMethod == '') {
            return alert("납부방법을 선택하세요.");
        }

        // 중복확인
        if (regNoCheckBtn == '') {
            return alert('사업자 번호 중복확인 하세요.');
        }

        if (empHpCheckBtn == '') {
            return alert('전화번호 중복확인 하세요.');
        }

        if (dateCheckBtn == '') {
            return alert('이용날짜 중복확인 하세요.');
        }

        addMember();

    }


    // 임시저장-가계약
    const temporaryStorage = (event) => {
        event.preventDefault();
        forMemberStatus = "T";

        // nullChk();

        if (empIdName == null || empIdName == '') {
            return alert("대표자를 입력하세요.");
        }

        // 연락처 NUll체크
        if (firstEmpHp == null || firstEmpHp == '' || secondEmpHp == null || secondEmpHp == '' || thirdEmpHp == null || thirdEmpHp == '') {
            return alert("연락처를 입력하세요.");
        }

        // // 중복확인
        if (empHpCheckBtn == '') {
            return alert('전화번호 중복확인 하세요.');
        }
        // 여부체크메세지

       addMember();

    }


    const nullChk = () =>{
         // 계약구분 NUll체크
         if (contractTp == null || contractTp == '') {
            return alert("계약구분을 선택하세요.");
        }

        // 호실 NUll체크
        if (contractTpVal == null || contractTpVal == '') {
            return alert("호실을 선택하세요.");
        }

        // 이용기간 NUll체크
        if (contractTerm == null || contractTerm == '' || contractTerm == '0') {
            return alert("이용기간을 입력하세요.");
        }

        // 입금일 NUll체크
        if (selectedOption == null || selectedOption == '') {
            return alert("납부여부를 선택하세요.");
        }

        // 납부방법 NUll체크
        if (payMethod == null || payMethod == '') {
            return alert("납부방법을 선택하세요.");
        }
    }
    // 신규계약추가
    const newMemberIdStorage = () => {

        nullChk();

        // memberId
        let memberIdForNew = props.dataMem;
        // 시작일자
        let startDate = startAsk_date.getFullYear() + '-' + (startAsk_date.getMonth() + 1) + '-' + startAsk_date.getDate();

        let body = {
           
            memberIdForNew: memberIdForNew,
            contractTp: contractTp,
            contractTpVal: contractTpVal,
            roomLockerTp: roomLockerTp,
            contractMoney: contractMoney,
            contractTerm: contractTerm,
            startAsk_date: startDate,
            endDate: dateEnd,
            payDate: payDate,
            payMethod: payMethod,
            contractPath: contractPath,
            comment: comment,
            selectedOption: selectedOption
        }


        axios.post('/api/s010100010/detailNewContract_by_id', body)
            .then(response => {
                if (response.data.success) {
                    alert('신규계약에 성공 하였습니다');
                    props.setNewOpen(false);
                    props.detailMemberList();

                } else {
                    alert(response.data.message);
                    alert('신규계약에 실패 하였습니다');
                }
            })
    }

    // s010100050 -> insertMember010 
    const contractModify = () => {

        let modifyDataNum = props.dataNum;

        let year = (startAsk_date.getFullYear() + '').substring(2);
        let month = startAsk_date.getMonth() + 1;
        let date = startAsk_date.getDate();
        month = month < 10 ? '0' + month : month;
        date = date < 10 ? '0' + date : date;

        let startDate = year + '-' + month + '-' + date;

        nullChk();

       

        let realIdCardFileName;
        let realBusiCardFileName;

        if(idCardFileName){
            realIdCardFileName = idCardFileName.split('\\')[2].split('.')[0];    
        }
        
        if(busiCardFileName){
            realBusiCardFileName = busiCardFileName.split('\\')[2].split('.')[0];
        }


        let body = {

            idCardImg: idCardImg,
            busiLicfImg: busiLicfImg,
            realIdCardFileName:realIdCardFileName,
            realBusiCardFileName:realBusiCardFileName,

            memberNm: memberNm,
            firstRegNo: firstRegNo,
            secondRegNo: secondRegNo,
            thirdRegNo: thirdRegNo,
            memberTp: memberTp,
            empIdName: empIdName,
            firstEmpHp: firstEmpHp,
            secondEmpHp: secondEmpHp,
            thirdEmpHp: thirdEmpHp,

            zipcode: zipcode,
            empEmailId: empEmailId,
            domainAddress: domainAddress,
            empAddress: empAddress,
            empDetailAddress: empDetailAddress,
       
            //계약정보
            modifyDataNum: modifyDataNum,
            contractTp: contractTp,
            contractTpVal: contractTpVal,
            roomLockerTp: roomLockerTp,
            contractMoney: contractMoney,
            contractTerm: contractTerm,
            startAsk_date: startDate,
            endDate: dateEnd,
            payDate: payDate,
            payMethod: payMethod,
            contractPath: contractPath,
            comment: comment,
            selectedOption: selectedOption
        }
        
        console.log('body',body);
        console.log('body2222222222222222222222222222222222222222222222',body);

        let dateEndFrame = dateEnd.toString().substring(2, 10);

        // 날짜 수정x
        if (dateEndFrame === endAsk_date && contractTerm === contractTerm) {

            setDateCheckBtn('check');
          ;
            axios.post('/api/s010100010/detailModifyContracId', body)
                .then(response => {
                    if (response.data.success) {
                        alert('이용계약서를 수정하였습니다');
                        setDateCheckBtn('');
                        props.setConOpen(false);
                        props.detailMemberList();
                        // props.setModalOpen(false);

                    } else {
                        alert(response.data.message);
                        alert('이용계약서 수정을 실패 하였습니다');
                    }
                })

        } else {

            if (dateCheckBtn == 'check') {

                axios.post('/api/s010100010/detailModifyContracId', body)
                    .then(response => {
                        if (response.data.success) {
                            alert('이용계약서를 수정하였습니다');
                            setDateCheckBtn('');
                            props.setConOpen(false);
                            props.detailMemberList();

                        } else {
                            alert(response.data.message);
                            alert('이용계약서 수정을 실패 하였습니다');
                        }
                    })

            } else if (dateCheckBtn == '') {
                alert('날짜 중복확인 하세요');
            }
        }
        
    }

    const [memberStTModal,setMemberStModal] = React.useState(false);
    const memberStTModalClose = (event) => {
        setMemberStModal(false);
    }
    // 가계약을 확정으로 + 수정하기
    const newContractIdStorage = (event) => {
        if (memberStFlag == 'T') {
            setMemberStModal(true);
        } else if (memberStFlag == 'C') {
            contractModify();
        }
    }

    
    const memStTModifyHandler = () => {

        contractModify();

    }
    const memberStHandler = () => {

           // 가계약을 확정으로
           let memberBody = {
            rNum: rNum
        }
        axios.post('/api/s010100010/modifymemberSt', memberBody)
            .then(response => {
                if (response.data.success) {
                    alert('확정되었습니다');
                    props.detailMemberList();
                    setMemberStModal(false);
                    props.setConOpen(false);

                } else {
                    alert(response.data.message);
                    alert('확정실패 하였습니다');
                }
            })

    }

    const [printMemberSheetOpen, setPrintMemberSheetOpen] = useState(false);

    // 출력버튼 모달 open
    const onPrintHandler = (event) => {
        forPrint = true;
        setPrintSheetOpen(true);
        // props.setModalOpen(false);
    }
    // 출력버튼 모달 close
    const onPrintSheetClose = (event) => {
        forPrint = false;
        setPrintSheetOpen(false);
    }

    const onPrintMemberHandler = (event) => {
        forPrint = true;
        setPrintMemberSheetOpen(true);
    }

    const onPrintMemberSheetClose = (event) => {
        forPrint = false;
        setPrintMemberSheetOpen(false);
    }
    const onleaseAgreementHandler = (event) => {
        setLeaseAgreementOpen(true);
    }

    const onleaseAgreementClose = (event) => {
        setLeaseAgreementOpen(false);
    }

    const onMemberNmHandler = (event) => {
        setMemberNm(event.currentTarget.value);
    }

    const onFirstRegNoHandler = (event) => {
        const regexData = getRegexData(/[^0-9]/g, event.currentTarget.value);
        setFisrtRegNo(regexData);
    }

    const onSecondRegNoHandler = (event) => {
        const regexData = getRegexData(/[^0-9]/g, event.currentTarget.value);
        setSecondRegNo(regexData);
    }

    const onThirdRegNoHandler = (event) => {
        const regexData = getRegexData(/[^0-9]/g, event.currentTarget.value);
        setThirdRegNo(regexData);
    }

    const onMemberTpHandler = (event) => {
        setMemberTp(event.currentTarget.value);
    }

    const onEmpIdNameHandler = (event) => {
        setEmpIdName(event.currentTarget.value);
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
        const regexData = getRegexData(/[^-A-Za-z0-9_]/g, event.currentTarget.value);
        setEmpEmailId(regexData);
    }

    const onDomainAddressHandler = (event) => {
        const regexData = getRegexData(/[^a-zA-Z0-9.]+$/, event.currentTarget.value);
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

    const getRegexData = (regex, data) => {
        return data.replace(regex, "");
    }

    // 종료
    const newEndHandler = (event) => {
        event.preventDefault();
        const body = {
            // 계약정보
            rNum: rNum
        }
        axios.post('/api/s010100010/endFlag', body)
            .then(response => {
                if (response.data.success) {
                    alert('종료처리 하였습니다.');
                    props.setConOpen(false);
                    props.detailMemberList();
                } else {
                    alert(response.data.message);
                    alert('종료처리에 실패하였습니다.');
                }
            })
    }


    const onDeleteHandler = () => {

        setUserStatus('');

        axios.post(`/api/s010100010/memberDelete_by_id?id=${rNum}`)
            .then(response => {
                if (response.data.success) {
                    alert('삭제 하였습니다.')
                } else {
                    alert(response.data.message);
                    alert('삭제에 실패하였습니다.')
                }
            })

    }

    const onRegNoCheckHandler = (event) => {
        event.preventDefault();

        const body = {
            //회원정보
            firstRegNo: firstRegNo,
            secondRegNo: secondRegNo,
            thirdRegNo: thirdRegNo,
        }
        if ((firstRegNo.length != 3 || firstRegNo.length === 0) || (secondRegNo.length != 2 || secondRegNo.length === 0) || (thirdRegNo.length != 5 || thirdRegNo.length === 0)) {
            alert('사업자번호 형식을 확인하세요');
        } else {
            axios.post('/api/s010100010/regNoCheck', body)
                .then(response => {
                    if (response.data.success) {
                        if (response.data.number[0].RowNum >= 1) {
                            setRegNoCheckBtn('');
                            alert('이미 존재하는 사업자번호입니다.');

                        } else if (response.data.number[0].RowNum === 0) {
                            setRegNoCheckBtn('check');
                            alert('사용할 수 있는 사업자 번호입니다.')
                        }
                    } else {
                        alert(response.data.message);
                        alert('중복체크에 실패 하였습니다.')
                    }
                })
        }

    }

    const onEmpHpChkHandler = (event) => {
        event.preventDefault();

        setEmpHpCheckBtn('check');

        const body = {
            // 회원정보
            firstEmpHp: firstEmpHp,
            secondEmpHp: secondEmpHp,
            thirdEmpHp: thirdEmpHp,
        }

        if ((firstEmpHp.length != 3) || (secondEmpHp.length != 4) || (thirdEmpHp.length != 4) || (firstEmpHp.length === 0) || (secondEmpHp.length === 0) || (thirdEmpHp.length === 0)) {
            alert('연락처 형식을 확인하세요');
        } else {
            axios.post('/api/s010100010/empHpCheck', body)
                .then(response => {
                    if (response.data.success) {
                        if (response.data.number[0].RowNum >= 1) {
                            alert('존재하는 전화번호입니다.');
                        } else if (response.data.number[0].RowNum === 0) {

                            alert('사용할 수 있는 전화번호입니다.')
                        }
                    } else {
                        alert(response.data.message);
                        alert('중복체크에 실패 하였습니다.')
                    }
                })

        }

    }

    let finalYear = ((startAsk_date.getMonth() * 1 + contractTerm * 1) / 12) + startAsk_date.getFullYear();

    let finalMonth = ((startAsk_date.getMonth() * 1 + contractTerm * 1) % 12) + 1;
    finalMonth = finalMonth < 10 ? '0' + finalMonth : finalMonth;

    let finalDate = new Date(finalYear, finalMonth, 0).getDate() > startAsk_date.getDate()
        ? startAsk_date.getDate()
        : new Date(finalYear, finalMonth, 0).getDate();
    finalDate = finalDate < 10 ? '0' + finalDate : finalDate;
    let dateEnd = Math.floor(finalYear) + '-' + finalMonth + '-' + finalDate;


    // 이용기간 중복체크
    const funcDateChk = () => {

        // setDateCheckBtn('check');
        const rNum = props.dataNum;
        let startDate = startAsk_date.getFullYear() + '-' + (startAsk_date.getMonth() + 1) + '-' + startAsk_date.getDate();

        const body = {
            contractTp: contractTp,
            contractTpVal: contractTpVal,
            roomLockerTp: roomLockerTp,
            startDate: startDate,
            endDate: dateEnd,
            modalMemberId: modalMemberId,
            contractId: rNum
        }

        // console.log(modalMemberId);
        if (contractTerm.length === 0) {
            alert('개월수를 입력하세요');
        } else {
            axios.post('/api/s010100010/dateCheck', body)
                .then(response => {
                    if (response.data.success) {
                        if (response.data.number[0].STARTENDDATE >= 1) {
                            setDateCheckBtn('');
                            alert('이미 이용중인 날짜입니다.');
                        } else if (response.data.number[0].STARTENDDATE === 0) {
                            alert('사용가능한 날짜입니다.')
                            setDateCheckBtn('check');
                        }
                    } else {
                        alert(response.data.message);
                        alert('중복체크에 실패 하였습니다.')
                    }
                })
        }




    }

    const [paymentY, setPaymentY] = useState('Y');
    const [paymentN, setPaymentN] = useState('N');
    const [selectedOption, setSelectedOption] = useState('');

    const changeRadio = (event) => {
        setSelectedOption(event.target.value);
    };


    const onDateHandler = (event) => {
        event.preventDefault();
        funcDateChk();
    }

    const onPrintSheetHandler = () => {
        window.print();
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
                                <th rowSpan="6" className="memberInfo">회원정보</th>
                            </tr>

                            <tr>
                                <th className="memberInfo">회원명</th>
                                <td hidden={forPrint}>

                                    <Form.Control style={{ width: 10 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={memberNm} id="memberNm" name="memberNm"
                                        onChange={onMemberNmHandler} disabled={(props.cDataForm === 'I' && modalCContractSt ==='C') || props.newDataForm === 'N' } />

                                </td>

                                {/* 회원명 출력 td */}
                                <td hidden={!forPrint}>
                                    {memberNm}
                                </td>

                                <th className="memberInfo">사업자 번호</th>
                                <td colSpan="2" hidden={forPrint}>

                                    <Form.Control style={{ width: 4 + 'em', display: 'inline' }} size="sm"
                                        type="text" maxLength="3" required="required" value={firstRegNo} id="firstRegNo" name="firstRegNo"
                                        onChange={onFirstRegNoHandler} disabled={(props.cDataForm === 'I' && modalCContractSt ==='C')  || props.newDataForm === 'N'} />


                        &nbsp;
                        -
                        &nbsp;

                        <Form.Control style={{ width: 3 + 'em', display: 'inline' }} size="sm"
                                        type="text" maxLength="2" required="required" value={secondRegNo} id="secondRegNo" name="secondRegNo"
                                        onChange={onSecondRegNoHandler} disabled={(props.cDataForm === 'I' && modalCContractSt ==='C') || props.newDataForm === 'N'} />

                        &nbsp;
                        -
                        &nbsp;

                        <Form.Control style={{ width: 7 + 'em', display: 'inline' }} size="sm"
                                        type="text" maxLength="5" required="required" value={thirdRegNo} id="thirdRegNo" name="thirdRegNo"
                                        onChange={onThirdRegNoHandler} disabled={(props.cDataForm === 'I' && modalCContractSt ==='C')  || props.newDataForm === 'N'} />


                                    {/*신규회원 중복확인 */}
                                    <Button variant="contained" color="primary" style={{ width: 100 }} className="useContractBtn" onClick={onRegNoCheckHandler}
                                        hidden={(props.cDataForm === 'I' && modalCContractSt ==='C')  || props.newDataForm === 'N'}> 중복확인</Button>

                                </td>

                                {/*사업자 번호 출력용 */}
                                <td colSpan="2" hidden={!forPrint} >{firstRegNo}-{secondRegNo}-{thirdRegNo}</td>


                                <th className="memberInfo" >회원구분</th>
                                <td colSpan="2" hidden={forPrint}>

                                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" as="select" multiple={false} onChange={onMemberTpHandler} value={memberTp}
                                        disabled={(props.cDataForm === 'I' && modalCContractSt ==='C')  || props.newDataForm === 'N'}>
                                        {valueArr[0].map(item => (
                                            <option key={item.key} value={item.key}>{item.value}</option>
                                        ))}

                                    </Form.Control>

                                </td>

                                {/*회원구분 출력용 */}
                                <td colSpan="2" hidden={!forPrint} >{memberTpPrint}</td>
                            </tr>

                            <tr>
                                <th className="memberInfo">대표자<span className="star">(*)</span></th>
                                <td hidden={forPrint}>

                                    <Form.Control style={{ width: 7 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={empIdName} id="empIdName" name="empIdName"
                                        onChange={onEmpIdNameHandler} disabled={(props.cDataForm === 'I' && modalCContractSt ==='C')  || props.newDataForm === 'N'} />

                                </td>

                                {/* 대표자(이름) 출력용 */}
                                <td hidden={!forPrint} >{empIdName}</td>

                                <th className="memberInfo">연락처<span className="star">(*)</span></th>
                                <td colSpan="2" hidden={forPrint}>

                                    <Form.Control style={{ width: 5 + 'em', display: 'inline' }} size="sm"
                                        type="text" maxLength="3" required="required" value={firstEmpHp} id="firstEmpHp" name="firstEmpHp"
                                        onChange={onFirstEmpHpHandler} disabled={(props.cDataForm === 'I' && modalCContractSt ==='C') || props.newDataForm === 'N'} />

                        &nbsp;
                        -
                        &nbsp;
                        <Form.Control style={{ width: 5 + 'em', display: 'inline' }} size="sm"
                                        type="text" maxLength="4" required="required" value={secondEmpHp} id="secondEmpHp" name="secondEmpHp" name="firstEmpHp"
                                        onChange={onSecondEmpHpHandler} disabled={(props.cDataForm === 'I' && modalCContractSt ==='C')  || props.newDataForm === 'N'} />

                        -
                        &nbsp;
                        <Form.Control style={{ width: 5 + 'em', display: 'inline' }} size="sm"
                                        type="text" maxLength="4" required="required" value={thirdEmpHp} id="thirdEmpHp" name="thirdEmpHp"
                                        onChange={onThirdEmpHpHandler} disabled={(props.cDataForm === 'I' && modalCContractSt ==='C')  || props.newDataForm === 'N'} />

                                    <Button variant="contained" color="primary" style={{ width: 100 }} onClick={onEmpHpChkHandler} hidden={props.cDataForm == 'I' || props.newDataForm === 'N'} >중복확인</Button>
                                </td>

                                {/* 대표자(전화번호) 출력용 */}
                                <td colSpan="2" hidden={!forPrint} >{firstEmpHp}-{secondEmpHp}-{thirdEmpHp}</td>

                                <th className="memberInfo">E-mail</th>
                                <td colSpan="2" hidden={forPrint}>

                                    <Form.Control style={{ width: 7 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={empEmailId} id="empEmailId" name="empEmailId"
                                        onChange={onEmpEmailIdHandler} disabled={(props.cDataForm === 'I' && modalCContractSt ==='C')  || props.newDataForm === 'N'} />

                        &nbsp;
                        @
                        &nbsp;

                        <Form.Control style={{ width: 10 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={domainAddress} id="domainAddress" name="domainAddress"
                                        onChange={onDomainAddressHandler} disabled={(props.cDataForm === 'I' && modalCContractSt ==='C')  || props.newDataForm === 'N'} />

                                </td>

                                {/* 대표자(이메일) 출력용 */}
                                <td colSpan="2" hidden={!forPrint} >{empEmailId}@{domainAddress}</td>
                            </tr>

                            <tr>
                                <th rowSpan="2" className="memberInfo">대표자 주소</th>

                                <td colSpan="7" hidden={forPrint}>

                                    <Form.Control style={{ width: 10 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={zipcode} id="zipcode" name="zipcode"
                                        onChange={onZipcodeHandler} disabled={(props.cDataForm === 'I' && modalCContractSt ==='C')  || props.newDataForm === 'N'} />

                        &nbsp;
                            <Button variant="contained" color="primary" style={{ width: 70 }} className="useContractBtn" onClick={handleOpen}
                                        disabled={(props.cDataForm === 'I' && modalCContractSt ==='C')  || props.newDataForm === 'N'}
                                    >우편</Button>

                                    <Modal
                                        className={classes.modal}
                                        open={isPostOpen}
                                        onClose={handleClose}
                                        closeAfterTransition
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
                                        onChange={onEmpAddressHandler} disabled={(props.cDataForm === 'I' && modalCContractSt ==='C')  || props.newDataForm === 'N'} />

                                </td>

                                <td colSpan="7" hidden={!forPrint}>{zipcode}{empAddress}{empDetailAddress}</td>

                            </tr>
                            <tr>
                                <td colSpan="7" hidden={forPrint}>

                                    <Form.Control style={{ width: 30 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={empDetailAddress}
                                        id="empDetailAddress"
                                        name="empDetailAddress"
                                        onChange={onEmpDetailAddressHandler}
                                        disabled={(props.cDataForm === 'I' && modalCContractSt ==='C')  || props.newDataForm === 'N'} />

                                </td>
                            </tr>

                            <tr>
                                <th className="memberInfo" >첨부파일</th>
                                <td colSpan="2" hidden={forPrint || (props.cDataForm === 'I' && modalCContractSt ==='C')  || props.newDataForm === 'N'}>

                                <label htmlFor="file">대표자신분증:</label>&nbsp;
                                    <input type='file'
                                        file={idCardFile}
                                        name='idCardFile'
                                        value={idCardFileName}
                                        onChange={idCardHandleFileChange}
                                    />
                                    <div className = 'fileStar'> * jpg,jpeg,png 파일만 가능합니다.</div>
                                </td>

                                <td colSpan="4" hidden={forPrint || (props.cDataForm === 'I' && modalCContractSt ==='C')  || props.newDataForm === 'N'}>
                                <label htmlFor="file">사업자등록증:</label>&nbsp;
                                    <input type='file'
                                        file={busiCardFile}
                                        name='busiCardFile'
                                        value={busiCardFileName}
                                        onChange={busiCardHandleFileChange}
                                    />
                                    <div className = 'fileStar'> * jpg,jpeg,png 파일만 가능합니다.</div>
                                </td>

                                {/* 출력용 */}
                                <td colSpan="4" hidden={!forPrint && props.cDataForm === 'I' && props.newDataForm === 'N'}>
                                    {ceoIdCardImg}
                                </td>

                                <td colSpan="5" hidden={!forPrint && props.cDataForm !== 'I' && props.newDataForm !== 'N'}>
                                    {ceoRegistCardImg}
                                </td>
                            </tr>


                            {/* 계약정보란 */}
                            <tr>
                                <th rowSpan="7" className="info">계약정보</th>
                            </tr>

                            <tr>
                                <th className="info">계약구분</th>
                                <td hidden={forPrint}>

                                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" as="select" multiple={false} onChange={onContractTpHandler} value={contractTp }>
                                        {valueArr[1].map(item => (
                                            <option key={item.key} value={item.key}>{item.value}</option>
                                        ))}

                                    </Form.Control>

                                </td>

                                {/* 계약구분 출력용 */}
                                <td hidden={!forPrint}>
                                    {contractTpPrint}
                                </td>

                                <th className="info">호실</th>

                                <td hidden={forPrint}>

                                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" as="select" multiple={false} onChange={onContractTpValHandler} value={contractTpVal}>
                                        {contractTpVals.map(item => (
                                            <option key={item.key} value={item.key}>{item.value}</option>
                                        ))}
                                    </Form.Control>

                                </td>
                                {/* 호실 출력용 */}
                                <td hidden={!forPrint}>
                                    {contractTpVals.map(item => (
                                        <option key={item.key} value={item.key}>{item.value}</option>
                                    ))}
                                </td>

                                <th className="info">사물함</th>
                                <td hidden={forPrint}>

                                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" as="select" multiple={false} onChange={onRoomLockerTpHandler} value={roomLockerTp}>
                                        {roomLockers.map(item => (
                                            <option key={item.key} value={item.key}>{item.value}</option>
                                        ))}
                                    </Form.Control>

                                </td>
                                {/* 사물함 출력용 */}
                                <td hidden={!forPrint}>
                                    {roomLockers.map(item => (
                                        <option key={item.key} value={item.key}>{item.value}</option>
                                    ))}
                                </td>

                                <th className="info">월회비</th>
                                <td hidden={forPrint}>

                                    <Form.Control style={{ width: 7 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={contractMoney} id="contractMoney" name="contractMoney"
                                        onChange={onContractMoneyHandler} />

                                </td>

                                {/* 월회비 출력용 */}
                                <td hidden={!forPrint}>
                                    {contractMoney}
                                </td>
                            </tr>

                            <tr>
                                <th className="info">이용기간</th>
                                <td hidden={forPrint}>

                                    <Form.Control style={{ width: 3 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={contractTerm} id="contractTerm" name="contractTerm"
                                        onChange={onContractTermHandler} />

                                &nbsp;개월 &nbsp;

                                <DatePicker
                                        id="dateSize"
                                        locale="ko"
                                        selected={startAsk_date.setHours(9, 0, 0, 0)}
                                        onChange={date => setStartAsk_date(date)}
                                        dateFormat="yyyy-MM-dd"
                                    />

                                    {/* <DatePicker
                                        id="dateSize"
                                        multiple={false}
                                        locale="ko"
                                        selected={startAsk_date.setHours(9, 0, 0, 0)}//Front = 한국시 BackEnd = 표준시 9시간차이
                                        onChange={date => setStartAsk_date(date)}
                                        selectsStart
                                        startDate={startAsk_date.setHours(9, 0, 0, 0)}
                                        endDate={endAsk_date}
                                        dateFormat="yyyy.MM.dd"
                                    />&nbsp; */}
                           &nbsp; ~ &nbsp;

                            <Form.Control style={{ width: 8 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={dateEnd} readOnly />

                                    <Button variant="contained" color="primary" style={{ width: 100 }} onClick={onDateHandler} className="useContractBtn"
                                    >중복확인</Button>

                                </td>

                                {/* 이용기간 출력용 */}
                                <td hidden={!forPrint}>
                                    {contractTerm}개월 &nbsp;

                                <DatePicker
                                        id="dateSize"
                                        multiple={false}
                                        locale="ko"
                                        selected={startAsk_date.setHours(9, 0, 0, 0)}//Front = 한국시 BackEnd = 표준시 9시간차이
                                        onChange={date => setStartAsk_date(date)}
                                        selectsStart
                                        startDate={startAsk_date.setHours(9, 0, 0, 0)}
                                        endDate={endAsk_date}
                                        dateFormat="yyyy.MM.dd"

                                    />&nbsp;
                            ~ &nbsp;
                            <input type="text" disabled={true} value={dateEnd} size="8" />
                                    {/* 신규계약 중복확인 */}
                                    <Button variant="contained" color="primary" style={{ width: 100 }} onClick={onDateHandler} className="useContractBtn"
                                        hidden={forPrint}>중복확인</Button>

                                </td>

                                <th className="info">납부여부</th>
                                <td hidden={forPrint}>

                                    &nbsp;
                                    <div onChange={changeRadio}>
                                        <input
                                            type="radio"
                                            id="paymentY"
                                            name="paymentFlag"
                                            value={paymentY}
                                            checked={selectedOption === 'Y'}
                                            readOnly
                                        ></input>

                                        네
                                        &nbsp;&nbsp;

                                        <input
                                            type="radio"
                                            id="paymentN"
                                            name="paymentFlag"
                                            value={paymentN}
                                            checked={selectedOption === 'N'}
                                            readOnly
                                        ></input>

                                        아니오
                                    </div>
                                </td>



                                <td hidden={!forPrint}>
                                    {payedStatusForPrint}
                                </td>

                                <th className="info">납부방법</th>
                                <td hidden={forPrint}>

                                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" as="select" multiple={false} onChange={onPayMethodHandler} value={payMethod}>
                                        {valueArr[2].map(item => (
                                            <option key={item.key} value={item.key}>{item.value}</option>
                                        ))}
                                    </Form.Control>

                                </td>

                                <td hidden={!forPrint}>
                                    {payMethodPrint}
                                </td>

                                <th className="info">예치금</th>
                                <td hidden={forPrint}>

                                    <Form.Control style={{ width: 7 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={contractMoney} id="contractMoney" name="contractMoney"
                                        onChange={onContractMoneyHandler} />

                                </td>

                                {/*예치금 출력용  */}
                                <td hidden={!forPrint}>
                                    {contractMoney}
                                </td>
                            </tr>

                            <tr>
                                <th className="info">특약사항</th>
                                <td colSpan="9" className="alignLeft" id="infoPadding" hidden={forPrint}>
                                    계약기간 만료 또는 종료시 사업지 주소지와 전화를 7일이내 이전해야 하고,<br />
                            계약을 해지할 경우 7일이전에 서면 또는 구두 통보해야함.<br />

                                    <Form.Control as="textarea" rows={3} value={comment} id="comment" name="comment"
                                        onChange={onCommentHandler} />

                                </td>

                                {/* 특약사항 출력용 */}
                                <td colSpan="9" className="alignLeft" id="infoPadding" hidden={!forPrint}>
                                    계약기간 만료 또는 종료시 사업지 주소지와 전화를 7일이내 이전해야 하고,<br />
                            계약을 해지할 경우 7일이전에 서면 또는 구두 통보해야함.<br />
                                    <hr></hr>
                                    {comment}
                                </td>
                            </tr>

                            <tr>
                                <th className="info">이용범위</th>
                                <td colSpan="9" className="alignLeft" id="etcInfoPadding">
                                    사무공간 제공과 부대시설(회의실,접견실,휴게실,IT기기,유무선 통신망)을 이용 가능
                    </td>
                            </tr>

                            <tr>
                                <th className="basicInfoTitle">센터</th>
                                <td className="basicInfo">(주)에스원테크</td>

                                <th className="basicInfoTitle">전화번호</th>
                                <td colSpan="2" className="basicInfo">070-4355-2312</td>

                                <th className="basicInfoTitle">E-mail</th>
                                <td colSpan="2" className="basicInfo">swonbiz@s-onetech.com</td>
                            </tr>

                            <tr>
                                <th className="basicInfoTitle">성명</th>
                                <td className="basicInfo">이정희</td>

                                <th className="basicInfoTitle">FAX번호</th>
                                <td colSpan="2" className="basicInfo">070-4015-3344/02-6203-4433</td>

                                <th colSpan="2" className="info">계약접근경로</th>
                                <td hidden={forPrint}>

                                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" as="select" multiple={false} onChange={onContractPathHandler} value={contractPath}>
                                        {contractpaths.map(item => (
                                            <option key={item.key} value={item.key}>{item.value}</option>
                                        ))}
                                    </Form.Control>

                                </td>

                                {/* 계약접근경로 출력용 */}
                                <td hidden={!forPrint}>
                                    {accessPrint}
                                </td>

                            </tr>


                            <tr>
                                <td colSpan="9" className="alignLeft" id="borderBottom">
                                    -에스원비즈 삼성센터(이하 "갑")과 상기 회원(이하 "을")은 "갑"이 제공하는 서비스를 "을"이 이용함에 있어서 수반되는 사항을 본
                                    이용계약서 약관대로 체결하고, 본 &nbsp; 계약의 성립을 증명하기 위하여 본 이용계약서 2부를 작성하여 기명, 날인하고 각 한 부씩 보관한다.
                        <br />-본 이용계약서로는 임대차계약서를 대신할 수 없음
                    </td>
                            </tr>
                            <tr>
                                <td colSpan="9"
                                    id="borderTopBottom"> 2021년 &nbsp;&nbsp; {new Date().getMonth() + 1}월 &nbsp;&nbsp; {new Date().getDate()}일
                    </td>
                            </tr>

                            <tr>
                                <td colSpan="5" className="alignLeft" id="fstTextSpacing">

                                    갑: &nbsp; &nbsp; &nbsp;
                        서울특별시 강남구 봉은사로 63길 11 명화빌딩 3, 4층(삼성동) <br />

                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;㈜ 에스원테크 최현수 (인)<br />

                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;계좌번호 : 우리은행 1005-002-433395<br />

                                </td>
                                <td colSpan="4" className="alignLeft" id="sndTextSpacing">
                                    을 :&nbsp; &nbsp; &nbsp;
                            {zipcode} {empAddress} {empDetailAddress}<br />
                            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {memberNm} {empIdName} (인)<br />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="btn-center" hidden={forPrint}>
                        {/* 신규계약 */}
                        <Button variant="contained" color="primary" style={{ width: 100 }} hidden={props.newDataForm === 'N' || props.cDataForm === 'I'}
                            onClick={temporaryStorage} >임시저장</Button>

                        <Button variant="contained" color="primary" style={{ width: 100 }} className="new"
                            hidden={props.newDataForm === 'N' || props.cDataForm === 'I'}
                            onClick={onSubmitHandler}   >저장</Button>

                        <Button variant="contained" color="primary" style={{ width: 100 }} className="memberId" hidden={props.newDataForm !== 'N'}
                            onClick={newMemberIdStorage} >저장</Button>

                        {/* 가계약을 확정으로  / 수정한 것 저장하기 */}
                        <Button variant="contained" color="primary" style={{ width: 100 }} className="contractId" hidden={props.cDataForm !== 'I' || hideEndBtn == 'Y'}
                            onClick={newContractIdStorage} >저장</Button>

                        <Button variant="contained" color="primary" style={{ width: 70 }} hidden={props.cDataForm !== 'I'} onClick={onPrintHandler} >출력</Button>
                        <Button variant="contained" color="primary" style={{ width: 70 }} id="mem" hidden={props.newDataForm !== 'N'} onClick={onPrintMemberHandler} >출력</Button>

                        <Button variant="contained" color="primary" style={{ width: 150 }} onClick={onleaseAgreementHandler} id="btnWidth" >임대차 계약서</Button>

                        <Button variant="contained" color="primary" style={{ width: 70 }} className="contractId" hidden={props.cDataForm !== 'I' || hideEndBtn == 'Y'}
                            onClick={newEndHandler}  >종료</Button>
                        <Button variant="contained" color="primary" style={{ width: 70 }} hidden={userStatus !== 'T'}
                            onClick={onDeleteHandler} >삭제</Button>



                        <Button hidden={props.cDataForm === 'I' || props.newDataForm === 'N'} variant="contained" color="primary" style={{ width: 70 }}
                            onClick={props.onHandleClickClose} >닫기</Button>
                        {/* S010100050 -> 계약Id클릭시 닫기 */}
                        <Button variant="contained" color="primary" style={{ width: 70 }}
                            hidden={props.cDataForm !== 'I'} onClick={props.onConContractHandler} >닫기</Button>
                        {/* S010100050 -> 신규계약클릭시 닫기  */}
                        <Button variant="contained" color="primary" style={{ width: 70 }}
                            hidden={props.newDataForm !== 'N'} onClick={props.onNewContractHandler} >닫기</Button>


                    </div>
                </div>
            </div>
            <Button onClick={onPrintSheetHandler} variant="contained" color="primary" style={{ width: 70 }} hidden={!forPrint} >출력</Button>

            <Dialog
                maxWidth={"lg"}
                open={printSheetOpen}
                onClose={onPrintSheetClose}>
                <S010100010 dataNum={rNum} cDataForm={'I'} />
                <DialogActions>
                    <Button variant="contained" color="primary" style={{ width: 70 }} onClick={onPrintSheetClose} color="primary" hidden={forPrint} >닫기</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                maxWidth={"lg"}
                open={printMemberSheetOpen}
                onClose={onPrintMemberSheetClose}>
                <S010100010 dataMem={modalMemberId} newDataForm={'N'} />
                <DialogActions>
                    <Button variant="contained" color="primary" style={{ width: 70 }} onClick={onPrintMemberSheetClose} hidden={forPrint} >닫기</Button>
                </DialogActions>
            </Dialog>


            <Dialog
                maxWidth={"lg"}
                open={leaseAgreementOpen}
                onClose={onleaseAgreementClose}>
                <LeaseAgreement dataNum={rNum} />
                <DialogActions>
                    {/* <input type="button" onClick={onleaseAgreementClose} color="primary" value="닫기" hidden={forPrint} /> */}
                </DialogActions>
            </Dialog>

            <Dialog
                open={memberStTModal}
                onClose={memberStTModalClose}
            >
                 <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                 계약ID: "{rNum}" 번
                </DialogTitle>
                <DialogContent dividers>
                <DialogTitle id="alert-dialog-title">{empIdName+" 회원님의 가계약건을 수정하시려면 수정하기를, 확정하시려면 저장하기를 선택하세요."}</DialogTitle>
                </DialogContent>
                <DialogActions>
                <Button onClick={memStTModifyHandler}color="primary" style={{ width: 100 }} >
                    수정하기
                </Button>
                <Button onClick={memberStHandler}color="primary" style={{ width: 100 }}>
                    저장하기
                </Button>
                </DialogActions>
            </Dialog>

        </form>

    );

}

export default S010100010;