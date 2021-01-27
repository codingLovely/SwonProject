import React, {Fragment, useState, useEffect} from 'react';
import DaumPostcode from 'react-daum-postcode';
import axios from 'axios';
import './css/S010100010.css'
import {Link} from 'react-router-dom';
//<!--모달창 라이브러리
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
//모달창 라이브러리 끝-->

//<!--켈린더 라이브러리시작
import DatePicker, {registerLocale} from 'react-datepicker';
import ko from 'date-fns/locale/ko';

registerLocale("ko", ko);
//켈린더 라이브러리 끝-->

let valueArr = [[], [], [], [], []];
let queryArr = [['MEMBER_TP', ''], ['CONTRACT_TP', 'ASK'], ['PAY_METHOD', '']];
let contractPaths = [];
let payDates = [];

function S010100010(props) {
    //console.log(props.params);

    //회원정보
    const [memberNm, setMemberNm] = useState('')
    const [firstRegNo, setFisrtRegNo] = useState('')
    const [secondRegNo, setSecondRegNo] = useState('')
    const [thirdRegNo, setThirdRegNo] = useState('')
    const [memberTp, setMemberTp] = useState('')
    const [empIdName, setEmpIdName] = useState('')
    const [firstEmpHp, setFirstEmpHp] = useState('')
    const [secondEmpHp, setSecondEmpHp] = useState('')
    const [thirdEmpHp, setThirdEmpHp] = useState('')
    const [empEmailId, setEmpEmailId] = useState('')
    const [domainAddress, setDomainAddress] = useState('')
    const [zipcode, setZipcode] = useState('')
    const [empAddress, setEmpAddress] = useState('')
    const [empDetailAddress, setEmpDetailAddress] = useState('')


    //계약정보
    const [contractTp, setContractTp] = useState('')
    const [contractTpVal, setContractTpVal] = useState([{key: '', value: '선택'}])
    const [roomLockerTp, setRoomLockerTp] = useState(0)
    const [contractMoney, setContractMoney] = useState('')
    const [contractTerm, setContractTerm] = useState('0')
    const [startAsk_date, setStartAsk_date] = useState(new Date());
    const [endAsk_date, setEndAsk_date] = useState(new Date());
    const [payDate, setPayDate] = useState(1)
    const [comment, setComment] = useState('')
    const [payMethod, setPayMethod] = useState('')
    const [contractPath, setContractPath] = useState('')
    const [contractStart, setContractStart] = useState('')
    const [contractEnd, setContractEnd] = useState('')


    //주소api
    const [open, setOpen] = React.useState(false);
    const [isPostOpen, setIsPostOpen] = useState(false);
    //hidden 이용해보기

    const onHandleClickClose = (event) => {
        setOpen(false);
    }

    const rNum = props.dataNum;
    const modalMemberId = props.dataMem;

    useEffect(() => {

        if (props.newDataForm === 'N') {

            axios.get(`/api/s01010010/insert/tb_s10_contract010_by_id?id=${modalMemberId}&type=single`)
                .then(response => {
                    if (response.data.success) {
                        //alert(response.data.rows[0]);
                        const modalCMemberNm = response.data.rows[0].MEMBER_NM;
                        const modalCRegNo = response.data.rows[0].REG_NO;
                        const modalCMemberTp = response.data.rows[0].MEMBER_TP;
                        const modalCName = response.data.rows[0].NAME;
                        const modalCEmpHp = response.data.rows[0].EMP_HP;
                        const modalCEmpemail = response.data.rows[0].EMP_EMAIL;
                        const zipCode = response.data.rows[0].ZIP_CODE;
                        const mAddress = response.data.rows[0].ADDRESS;
                        const mDAddress = response.data.rows[0].DETAIL_ADDRESS;


                        setMemberNm(modalCMemberNm);
                        setFisrtRegNo(modalCRegNo);
                        setMemberTp(modalCMemberTp);
                        //setMemberTpVal(modalCMemberSt);
                        setEmpIdName(modalCName);
                        setFirstEmpHp(modalCEmpHp);
                        setEmpEmailId(modalCEmpemail);
                        setZipcode(zipCode);
                        setEmpAddress(mAddress);
                        setEmpDetailAddress(mDAddress);

                        //setEndFlag(modalEndFLag);
                    } else {
                        alert("상세 정보 가져오기를 실패하였습니다.")
                    }
                })
        }

    }, [])


    useEffect(() => {

        if (props.cDataForm === 'I') {

            axios.get(`/api/s01010010/tb_s10_contract010_by_id?id=${rNum}&type=single`)
                .then(response => {
                    if (response.data.success) {
                        //alert(response.data.rows[0]);
                        const modalCMemberNm = response.data.rows[0].MEMBER_NM;
                        const modalCRegNo = response.data.rows[0].REG_NO;
                        const modalCMemberTp = response.data.rows[0].MEMBER_TP;
                        const modalCName = response.data.rows[0].NAME;
                        const modalCEmpHp = response.data.rows[0].EMP_HP;
                        const modalCEmpemail = response.data.rows[0].EMP_EMAIL;
                        let zipCode = response.data.rows[0].ZIP_CODE;
                        let mAddress = response.data.rows[0].ADDRESS;
                        let mDAddress = response.data.rows[0].DETAIL_ADDRESS;
                        const modalCAddress = zipCode + ' ' + mAddress + ' ' + mDAddress;
                        const modalCContractDate = response.data.rows[0].CONTRACT_DATE;
                        const modalCContractTp = response.data.rows[0].CONTRACT_TP;
                        const modalCContractTerm = response.data.rows[0].CONTRACT_TERM;
                        const modalCPayDate = response.data.rows[0].PAY_DATE;
                        const modalCContractMoney = response.data.rows[0].PAYED_MONEY;
                        const modalCPayMethod = response.data.rows[0].PAY_METHOD;
                        const modalCContractPath = response.data.rows[0].CONTRACT_PATH;
                        const modalCEndDate = response.data.rows[0].END_DATE;
                        const modalCContractTpVal = response.data.rows[0].CONTRACT_ROOM;
                        const modalCRoomLockerTp = response.data.rows[0].CONTRACT_LOCKER;
                        const modalCComment = response.data.rows[0].COMMENT;

                        console.log(response.data.rows[0].COMMENT);

                        setMemberNm(modalCMemberNm);
                        setFisrtRegNo(modalCRegNo);
                        setMemberTp(modalCMemberTp);
                        //setMemberTpVal(modalCMemberSt);
                        setContractTpVal(modalCContractTpVal);
                        setEmpIdName(modalCName);
                        setFirstEmpHp(modalCEmpHp);
                        setEmpEmailId(modalCEmpemail);
                        setZipcode(modalCAddress);

                        setContractStart(modalCContractDate);
                        setContractEnd(modalCEndDate);

                        setContractTp(modalCContractTp);
                        setContractTerm(modalCContractTerm);
                        setPayDate(modalCPayDate);

                        setContractMoney(modalCContractMoney);
                        setPayMethod(modalCPayMethod);
                        setContractPath(modalCContractPath);
                        setRoomLockerTp(modalCRoomLockerTp);
                        setComment(modalCComment);
                        //setEndFlag(modalEndFLag);
                    } else {
                        alert("상세 정보 가져오기를 실패하였습니다.")
                    }
                })
        }

    }, [])

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === "R") {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress +=
                    extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        setZipcode(data.zonecode);
        setEmpAddress(fullAddress);
        alert('입력되었습니다.');

    }

//<Lov시작>
    useEffect(() => {
        for (let i = 0; i < queryArr.length; i++) {

            let firstVal = queryArr[i][0];
            let secondVal = queryArr[i][1];
            axios.post('/api/s010100140/selectTest', {firstVal: firstVal, secondVal: secondVal})
                .then(response => {
                    if (response.data.success) {
                        //console.log('ask_tp',response.data.rows);
                        let arr = [{key: '선택', value: '선택'}]

                        response.data.rows.map((data) =>
                            arr.push({
                                value: data.CD_V_MEANING,
                                key: data.CD_V
                            }));

                        valueArr[i] = arr;
                        //console.log(valueArr[2]);
                    } else {
                        alert(" 데이터를 불러오는데 실패하였습니다.");
                    }
                })

        }

    }, [])


    useEffect(() => {
        axios.post('/api/s010100010/accessPath')
            .then(response => {
                if (response.data.success) {
                    //console.log('Lov-ask_tp',response.data);
                    let arr = [{key: '선택', value: '선택'}]

                    response.data.rows.map((data) =>
                        arr.push({
                            value: data.CD_V_MEANING, key: data.CD_V
                        }));

                    contractPaths = arr;

                } else {
                    alert("데이터를 불러오는데 실패하였습니다.");
                }
            })
    }, [])


    let arr = [{key: '선택', value: '선택'}];

    for (let i = 1; i <= 31; i++) {
        arr.push({
            value: i,
            key: i
        });
        payDates = arr;
    }


//Lov끝>

    const [contractTpVals, setContractTpVals] = useState([{key: '', value: 'waiting...'}]);
    const [roomLockers, setRoomLockers] = useState([{key: '', value: 'waiting...'}]);

    const onContractTpHandler = (event) => {
        setContractTp(event.currentTarget.value);

        let contractTpBody = event.currentTarget.value;

        axios.post('/api/s010100010/contHier', {contractTpBody: contractTpBody})
            .then(response => {
                if (response.data.success) {
                    //console.log('ContractTpVal', response.data.rows);
                    let arr = [{key: '선택', value: '선택'}]

                    response.data.rows.map((data) =>
                        arr.push({
                            value: data.CD_V_MEANING, key: data.CD_V
                        }));
                    switch (contractTpBody) {
                        case 'R1' :
                            setContractTpVals(arr);
                            break;
                        case 'R2' :
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
                    }//switch

                    if (contractTpBody === 'FI' || contractTpBody === 'FL') {
                        axios.post('/api/s010100010/roomLockerHier')
                            .then(response => {
                                if (response.data.success) {
                                    //console.log('roomLocker', response.data.rows);
                                    let arr = [{key: '선택', value: '선택'}]
                                    response.data.rows.map((data) =>
                                        arr.push({
                                            value: data.CD_V_MEANING, key: data.CD_V
                                        }));
                                    setRoomLockers(arr);
                                } else {
                                    alert('사물함정보를 불러오는데 실패하였습니다.');
                                }
                            })//axios
                    } else {
                        let arr = [{key: '선택', value: '선택'}];
                        setRoomLockers(arr);
                    }

                    let monthlyMoney = {
                        contractTpBody: contractTpBody
                    }
                    axios.post('/api/s010100010/monthlyMoney', monthlyMoney)
                        .then(response => {
                            if (response.data.success) {
                                //console.log(response.data.rows[0].ATTRIBUTE3);
                                setContractMoney(response.data.rows[0].ATTRIBUTE3);

                            } else {
                                alert('사물함정보를 불러오는데 실패하였습니다.');
                            }
                        })

                }//if문
                else {
                    alert('호실 정보를 불러오는데 실패하였습니다.');
                }

            })//axios,then
    }//contractTpHandler();

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
        setContractTerm(event.currentTarget.value);
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
    const onNewSubmitHandler = (event) => {

    }
    //alert(contractMoney);
    //alert(startAsk_date);
    //<!--onSubmit
    const onSubmitHandler = (event) => {
        event.preventDefault();

        // //대표자 NUll체크
        // if (empIdName == null || empIdName == '') {
        //     return alert("대표자를 입력하세요.");
        // }
        //
        // //연락처 NUll체크
        // if (firstEmpHp == null || firstEmpHp == '' || secondEmpHp == null || secondEmpHp == '' || thirdEmpHp == null || thirdEmpHp == '') {
        //     return alert("연락처를 입력하세요.");
        // }
        //
        // //E-mail NUll체크
        // if (empEmailId == null || empEmailId == '' || domainAddress == null || domainAddress == '') {
        //     return alert("E-mail을 입력하세요.");
        // }
        //
        // //계약구분 NUll체크
        // if (contractTp == null || contractTp == '') {
        //     return alert("계약구분을 선택하세요.");
        // }
        //
        // //호실 NUll체크
        // if (contractTpVal == null || contractTpVal == '') {
        //     return alert("호실을 선택하세요.");
        // }
        //
        // //이용기간 NUll체크
        // if (contractTerm == null || contractTerm == '') {
        //     return alert("이용기간을 입력하세요.");
        // }
        //
        // //입금일 NUll체크
        // if (payDate == null || payDate == '') {
        //     return alert("입금일을 하세요.");
        // }
        //
        // //납부방법 NUll체크
        // if (payMethod == null || payMethod == '') {
        //     return alert("납부방법을 선택하세요.");
        // }
        //
        // //월회비 NUll체크
        // if (contractMoney == null || contractMoney == '') {
        //     return alert("월회비를 입력하세요.");
        // }
        //
        // //납부액 NUll체크
        // if (contractMoney == null || contractMoney == '') {
        //     return alert("납부액을 입력하세요.");
        // }
        // //계약접근경로 NUll체크
        // if (contractPath == null || contractPath == '') {
        //     return alert("계약접근경로를 선택하세요.");
        // }

        let contractTerms = parseInt(contractTerm);
        let startDate = startAsk_date.getFullYear() + '-' + (startAsk_date.getMonth() + 1) + '-' + startAsk_date.getDate();
        let endDate = startAsk_date.getFullYear() + '-' + ((startAsk_date.getMonth() + 1) + contractTerms) + '-' + startAsk_date.getDate();


         const body = {
            //회원정보
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
            contractTp: contractTp,
            contractTpVal: contractTpVal,
            roomLockerTp: roomLockerTp,
            contractMoney: contractMoney,
            contractTerm: contractTerm,
            startAsk_date: startAsk_date,
            payDate: payDate,
            payMethod: payMethod,
            contractPath: contractPath,
            comment: comment
        }
        //alert('contractMoney: '+contractMoney);

        // alert('contractTpVal: '+contractTpVal);
        // alert('roomLockerTp: '+roomLockerTp);

        axios.post('/api/s010100010/insertMember010', body)
            .then(response => {
                if (response.data.success) {
                    alert('정상적으로 등록되었습니다.')
                } else {
                    alert('등록에 실패하였습니다.')
                }
            })
    }
    //onSubmit끝-->
    //     console.log(memberNm);
    //     console.log(firstRegNo);
    //     console.log(secondEmpHp);
    //     console.log(thirdEmpHp);
    // //console.log(DaumPostcode);

    const onMemberNmHandler = (event) => {
        setMemberNm(event.currentTarget.value);
    }

    const onFirstRegNoHandler = (event) => {
        setFisrtRegNo(event.currentTarget.value);
    }

    const onSecondRegNoHandler = (event) => {
        setSecondRegNo(event.currentTarget.value);
    }

    const onThirdRegNoHandler = (event) => {
        setThirdRegNo(event.currentTarget.value);
    }

    const onMemberTpHandler = (event) => {
        setMemberTp(event.currentTarget.value);
    }

    const onEmpIdNameHandler = (event) => {
        setEmpIdName(event.currentTarget.value);
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

    const onChange = (event) => {
        setFile(event.target.files[0]);
        setFilename(event.target.files[0].name);
    };


    //파일업로드
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('ChooseFile');
    const [uploadedFile, setUploadedFile] = useState({});

    const onFileHandler = (event) => {
        //     event.preventDefault();
        //     const formData = new FormData();
        //     formData.append('file',file);
        //
        //     try{
        //         const res = axios.post('/api/upload',formData,{
        //            headers:{
        //                'Content-Type':'multipart/form-data'
        //            }
        //         });
        //
        //         const{ fileName, filePath} = res.data;
        //         setUploadedFile({fileName,filePath});
        //     }catch (err){
        //         if(err.response.status === 500){
        //             console.log('serverProplem');
        //         }else{
        //             console.log(err.response.data.msg);
        //         }
        //     }
    };

    //console.log(startAsk_date);
    //임시저장
    const temporaryStorage = (event) => {
        event.preventDefault();
        const body = {
            //회원정보
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
            contractTp: contractTp,
            contractTpVal: contractTpVal,
            roomLockerTp: roomLockerTp,
            contractMoney: contractMoney,
            contractTerm: contractTerm,
            startAsk_date: startAsk_date,
            payDate: payDate,
            payMethod: payMethod,
            contractPath: contractPath,
            comment: comment
        }


        axios.post('/api/s010100140/tempStorage', body)
            .then(response => {
                if (response.data.success) {
                    alert('임시저장 하였습니다.')
                } else {
                    alert('임시저장에 실패하였습니다.')
                }
            })

    }

    const newTemporaryStorage = (event) => {
        alert(modalMemberId);
        event.preventDefault();
        const body = {
            //계약정보
            modalMemberId: modalMemberId,
            contractTp: contractTp,
            contractTpVal: contractTpVal,
            roomLockerTp: roomLockerTp,
            contractMoney: contractMoney,
            contractTerm: contractTerm,
            startAsk_date: startAsk_date,
            payDate: payDate,
            payMethod: payMethod,
            contractPath: contractPath,
            comment: comment
        }
        axios.post('/api/s010100140/tempStorage/memberId', body)
            .then(response => {
                if (response.data.success) {
                    alert('임시저장 하였습니다.')
                } else {
                    alert('임시저장에 실패하였습니다.')
                }
            })
    }


    const [postCodeDisplay, setPostCodeDisplay] = useState('none');
    const postCodeStyle = {
        display: postCodeDisplay,
        position: "absolute",
        top: "26%",
        right: "33%",
        width: "350px",
        height: "600px"

    }
    const handleOpenPost = (event) => {
        setPostCodeDisplay('block');

        if (postCodeDisplay == 'block') {
            setPostCodeDisplay('none');
        }
    }
    const onDeleteHandler = (event) => {

    }

    const onRegNoCheckHandler = (event) => {
        event.preventDefault();
        // alert(firstRegNo,secondRegNo,thirdRegNo);
        // alert(secondRegNo);
        // alert(thirdRegNo);

        const body = {
            //회원정보
            firstRegNo: firstRegNo,
            secondRegNo: secondRegNo,
            thirdRegNo: thirdRegNo,
        }


        axios.post('/api/s010100140/regNoCheck', body)
            .then(response => {
                if (response.data.success) {
                    if (response.data.number[0].RowNum >= 1) {
                        alert('이미 존재하는 사업자번호입니다.');
                    } else if (response.data.number[0].RowNum === 0) {
                        alert('사용할 수 있는 사업자 번호입니다.')
                    }
                } else {
                    alert('중복체크에 실패 하였습니다.')
                }
            })
    }

    const onEmpHpChkHandler = (event) => {
        event.preventDefault();
        // alert(firstRegNo,secondRegNo,thirdRegNo);
        // alert(secondRegNo);
        // alert(thirdRegNo);

        const body = {
            //회원정보
            firstEmpHp: firstEmpHp,
            secondEmpHp: secondEmpHp,
            thirdEmpHp: thirdEmpHp,
        }


        axios.post('/api/s010100140/empHpCheck', body)
            .then(response => {
                if (response.data.success) {
                    if (response.data.number[0].RowNum >= 1) {
                        alert('이미 존재하는 전화번호입니다.');
                    } else if (response.data.number[0].RowNum === 0) {
                        alert('사용할 수 있는 전화번호입니다.')
                    }
                } else {
                    alert('중복체크에 실패 하였습니다.')
                }
            })

    }

    const onDateHandler = (event) => {
        event.preventDefault();
        // alert(firstRegNo,secondRegNo,thirdRegNo);
        // alert(secondRegNo);
        // alert(thirdRegNo);
        let startDate = startAsk_date.getFullYear() + '-' + (startAsk_date.getMonth() + 1) + '-' + startAsk_date.getDate();
        let endDate = startAsk_date.getFullYear() + '-' + ((startAsk_date.getMonth() + 1) + parseInt(contractTerm)) + '-' + startAsk_date.getDate();

        const body = {
            contractTp: contractTp,
            contractTpVal: contractTpVal,
            roomLockerTp: roomLockerTp,
            startDate: startDate,
            endDate: endDate,
        }

        axios.post('/api/s010100140/dateCheck', body)
            .then(response => {
                if (response.data.success) {
                    if (response.data.number[0].STARTENDDATE >= 1) {
                        alert('이미 이용중인 날짜입니다.');
                    } else if (response.data.number[0].STARTENDDATE === 0) {
                        alert('사용가능한 날짜입니다.')
                    }
                } else {
                    alert('중복체크에 실패 하였습니다.')
                }
            })

    }


    //setEndAsk_date(startAsk_date.getFullYear().getMonth()+1);
    //console.log(startAsk_date);

    //const [endDatePicker,setEndDatePicker] = useState(false);
    const dateEnd = startAsk_date.getFullYear() + '.' + ((startAsk_date.getMonth() + 1) + parseInt(contractTerm)) + '.' + startAsk_date.getDate();


    //alert(dateEnd);
    //setEndDatePicker(dateEnd);
    return (

        <form style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
        }}
            //onSubmit={onSubmitHandler}
        >
            <h1 id="useContractTitle">이용계약서</h1>
            <table class="useContractTable">
                {/* 회원정보란 */}
                <tbody>
                <tr>
                    <th rowSpan="6" className="memberInfo">회원정보</th>
                </tr>

                <tr>
                    <th className="memberInfo">회원명</th>
                    <td>
                        <input type="text" value={memberNm} id="memberNm" name="memberNm" size="10"
                               onChange={onMemberNmHandler}/></td>

                    <th className="memberInfo">사업자 번호</th>
                    <td colSpan="2">
                        <input type="text" value={firstRegNo} id="firstRegNo" name="firstRegNo" size="10"
                               onChange={onFirstRegNoHandler}
                               hidden={props.cDataForm !== 'I'}/>

                        <input type="text" value={firstRegNo} id="firstRegNo" name="firstRegNo" size="3"
                               onChange={onFirstRegNoHandler} hidden={props.cDataForm === 'I'}/>
                        &nbsp;
                        <span hidden={props.cDataForm === 'I'}>-</span>
                        &nbsp;
                        <input type="text" value={secondRegNo} id="secondRegNo" name="secondRegNo" size="3"
                               onChange={onSecondRegNoHandler} hidden={props.cDataForm === 'I'}/>
                        &nbsp;
                        <span hidden={props.cDataForm === 'I'}>-</span>
                        &nbsp;
                        <input type="text" value={thirdRegNo} id="thirdRegNo" name="thirdRegNo" size="3"
                               onChange={onThirdRegNoHandler} hidden={props.cDataForm === 'I'}/>

                        <input type="button" class="useContractBtn" onClick={onRegNoCheckHandler}
                               hidden={props.cDataForm === 'I'} value="중복체크"></input>
                    </td>
                    <th className="memberInfo">회원구분</th>
                    <td colSpan="2">
                        <select onChange={onMemberTpHandler} value={memberTp} hidden={props.cDataForm === 'I'}>

                            {valueArr[0].map(item => (
                                <option key={item.key} value={item.key}>{item.value}</option>
                            ))}
                        </select>
                        <input type="text" value={memberTp} hidden={props.cDataForm !== 'I'} size="5"/>
                    </td>
                </tr>

                <tr>
                    <th className="memberInfo">대표자<span className="star">(*)</span></th>
                    <td>
                        <input type="text" value={empIdName} id="empIdName" name="empIdName" size="10"
                               onChange={onEmpIdNameHandler}/></td>

                    <th className="memberInfo">연락처<span className="star">(*)</span></th>
                    <td colSpan="2">
                        <input type="text" value={firstEmpHp} id="firstEmpHp" name="firstEmpHp" size="10"
                               onChange={onFirstEmpHpHandler}
                               hidden={props.cDataForm !== 'I'}/>

                        <input type="text" value={firstEmpHp} id="firstEmpHp" name="firstEmpHp" size="5"
                               onChange={onFirstEmpHpHandler} hidden={props.cDataForm === 'I'}/>
                        &nbsp;
                        <span hidden={props.cDataForm === 'I'}>-</span>
                        &nbsp;
                        <input type="text" value={secondEmpHp} id="secondEmpHp" name="secondEmpHp" size="5"
                               onChange={onSecondEmpHpHandler} hidden={props.cDataForm === 'I'}/>
                        &nbsp;
                        <span hidden={props.cDataForm === 'I'}>-</span>
                        &nbsp;
                        <input type="text" value={thirdEmpHp} id="thirdEmpHp" name="thirdEmpHp" size="5"
                               onChange={onThirdEmpHpHandler} hidden={props.cDataForm === 'I'}/>
                        <input type="button" className="useContractBtn" hidden={props.cDataForm === 'I'}
                               onClick={onEmpHpChkHandler}
                               value="중복체크"></input>
                    </td>

                    <th className="memberInfo">E-mail<span className="star">(*)</span></th>
                    <td colSpan="2">
                        <input type="text" value={empEmailId} id="empEmailId" name="empEmailId" size="10"
                               onChange={onEmpEmailIdHandler}
                               hidden={props.cDataForm !== 'I'}/>

                        <input type="text" value={empEmailId} id="empEmailId" name="empEmailId" size="5"
                               onChange={onEmpEmailIdHandler} hidden={props.cDataForm === 'I'}/>
                        &nbsp;
                        <span hidden={props.cDataForm === 'I'}>@</span>
                        &nbsp;
                        <input type="text" value={domainAddress} id="domainAddress" name="domainAddress" size="5"
                               onChange={onDomainAddressHandler} hidden={props.cDataForm === 'I'}/>
                    </td>
                </tr>
                <tr>
                    <th rowSpan="2" className="memberInfo">대표자 주소</th>

                    <td colSpan="9">

                        <input type="text" value={zipcode} id="zipcode" name="zipcode" size="50"
                               onChange={onZipcodeHandler}
                               hidden={props.cDataForm !== 'I'}/>

                        <input type="text" value={zipcode} id="zipcode" name="zipcode" size="10"
                               onChange={onZipcodeHandler} hidden={props.cDataForm === 'I'}/>
                        <input type="button" class="useContractBtn" onClick={handleOpenPost}
                               hidden={props.cDataForm === 'I'} value="우편"
                        />
                        <DaumPostcode
                            onComplete={handleComplete}
                            style={postCodeStyle}
                            //isPostOpen={false}
                            autoClose={true}
                        />

                        <input type="text" value={empAddress} id="empAddress" name="empAddress" size="30"
                               onChange={onEmpAddressHandler} hidden={props.cDataForm === 'I'}/>
                    </td>

                </tr>
                <tr>
                    <td hidden={props.cDataForm === 'I'} colSpan="9">
                        <input type="text" value={empDetailAddress}
                               id="empDetailAddress"
                               name="empDetailAddress" size="30"
                               onChange={onEmpDetailAddressHandler}/>
                    </td>
                </tr>

                <tr>
                    <th className="memberInfo">첨부파일</th>
                    <td colSpan="4">
                        <input type="file" disabled={props.cDataForm === 'I'}
                               onChange={onChange}
                        />

                    </td>
                    <td colSpan="5">
                        <input type="file" disabled={props.cDataForm === 'I'}
                               onChange={onChange}
                        />

                    </td>

                </tr>


                {/* 계약정보란 */}

                <tr>
                    <th rowSpan="7" className="info">계약정보</th>
                </tr>

                <tr>
                    <th className="info">계약구분</th>
                    <td>
                        <select multiple={false} onChange={onContractTpHandler} value={contractTp}
                                hidden={props.cDataForm === 'I'}>

                            {valueArr[1].map(item => (
                                <option key={item.key} value={item.key}>{item.value}</option>
                            ))}
                        </select>
                        <input type="text" value={contractTp} hidden={props.cDataForm !== 'I'} size="5"/>
                    </td>

                    <th className="info">호실</th>
                    <td>
                        <select multiple={false} onChange={onContractTpValHandler} value={contractTpVal}
                                hidden={props.cDataForm === 'I'}>

                            {contractTpVals.map(item => (
                                <option key={item.key} value={item.key}>{item.value}</option>
                            ))}
                        </select>

                        <input type="text" value={contractTpVal}
                               hidden={props.cDataForm !== 'I'} size="5">
                        </input>

                    </td>

                    <th className="info">사물함</th>
                    <td>
                        <select multiple={false} onChange={onRoomLockerTpHandler} value={roomLockerTp}
                                hidden={props.cDataForm === 'I'}>

                            {roomLockers.map(item => (
                                <option key={item.key} value={item.key}>{item.value}</option>
                            ))}
                        </select>
                        <input type="text" value={roomLockerTp} size="5" hidden={props.cDataForm !== 'I'}/>
                    </td>

                    <th className="info">월회비</th>
                    <td>
                        <input type="text" value={contractMoney} id="contractMoney" name="contractMoney" size="5"
                               onChange={onContractMoneyHandler}/>
                    </td>
                </tr>

                <tr>
                    <th className="info">이용기간</th>
                    <td><input type="text" value={contractTerm} id="contractTerm" name="contractTerm" size="1"
                               onChange={onContractTermHandler}/>&nbsp;개월 &nbsp;
                        <input type="text" value={contractStart} id="contractStart" name="contractStart" size="7"
                               hidden={props.cDataForm !== 'I'}
                        />&nbsp;
                        ~ &nbsp;
                        <input type="text" value={contractEnd} id="contractEnd" name="contractEnd" size="7"
                               hidden={props.cDataForm !== 'I'}
                        />

                        <div hidden={props.cDataForm === 'I'}>
                            <DatePicker
                                locale="ko"
                                selected={startAsk_date.setHours(9, 0, 0, 0)}//Front = 한국시 BackEnd = 표준시 9시간차이
                                onChange={date => setStartAsk_date(date)}
                                selectsStart
                                startDate={startAsk_date}
                                endDate={endAsk_date}
                                dateFormat="yyyy.MM.dd"

                            />&nbsp;
                            ~ &nbsp;
                            <input type="text" disabled={true} value={dateEnd} size="8"/>

                            {/*<DatePicker*/}
                            {/*    locale="ko"*/}
                            {/*    selected={startAsk_date.setHours(9, 0, 0, 0)}//Front = 한국시 BackEnd = 표준시 9시간차이*/}
                            {/*    value = {endDatePicker}*/}
                            {/*    selectsEnd*/}
                            {/*    startDate={startAsk_date}*/}
                            {/*    endDate={endAsk_date}*/}
                            {/*    minDate={startAsk_date}*/}
                            {/*    dateFormat="yyyy.MM.dd"*/}
                            {/*    disabled={true}*/}
                            {/*/>*/}
                            <input type="button" onClick={onDateHandler} className="useContractBtn"
                                   hidden={props.cDataForm === 'I'}
                                   value="중복체크"></input>
                        </div>
                    </td>

                    <th className="info">입금일</th>
                    <td>
                        <select multiple={false} onChange={onPayDateHandler} value={payDate}
                                hidden={props.cDataForm === 'I'}>

                            {payDates.map(item => (
                                <option key={item.key} value={item.key}>{item.value}</option>
                            ))}
                        </select>
                        <input type="text" value={payDate} hidden={props.cDataForm !== 'I'} size="5"/>
                    </td>

                    <th className="info">납부방법</th>
                    <td>
                        <select multiple={false} onChange={onPayMethodHandler} value={payMethod}
                                hidden={props.cDataForm === 'I'}>

                            {valueArr[2].map(item => (
                                <option key={item.key} value={item.key}>{item.value}</option>
                            ))}
                        </select>
                        <input type="text" value={payMethod} hidden={props.cDataForm !== 'I'} size="5"/>
                    </td>
                    <th className="info">예치금</th>
                    <td><input type="text" value={contractMoney} id="contractMoney" name="contractMoney" size="10"

                               onChange={onContractMoneyHandler}/></td>
                </tr>

                <tr>
                    <th className="info">특약사항</th>
                    <td colSpan="9" className="alignLeft" id="infoPadding">
                        계약기간 만료 또는 종료시 사업지 주소지와 전화를 7일이내 이전해야 하고,<br/>
                        계약을 해지할 경우 7일이전에 서면 또는 구두 통보해야함.<br/>

                        <textarea rows="5" cols="110" value={comment} id="comment" name="comment"

                                  onChange={onCommentHandler}></textarea>
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

                    <th colSpan="2" className="basicInfoTitle">전화번호</th>
                    <td colSpan="2" className="basicInfo">070-4355-2312</td>

                    <th className="basicInfoTitle">E-mail</th>
                    <td className="basicInfo">swonbiz@s-onetech.com</td>
                </tr>

                <tr>
                    <th className="basicInfoTitle">성명</th>
                    <td className="basicInfo">이정희</td>

                    <th colSpan="2" className="basicInfoTitle">FAX번호</th>
                    <td colSpan="2" className="basicInfo">070-4015-3344/02-6203-4433</td>

                    <th className="info">계약접근경로</th>
                    <td>
                        <select multiple={false} onChange={onContractPathHandler} value={contractPath}
                                hidden={props.cDataForm === 'I'}>

                            {contractPaths.map(item => (
                                <option key={item.key} value={item.key}>{item.value}</option>
                            ))}
                        </select>
                        <input type="text" value={contractPath} hidden={props.cDataForm !== 'I'} size="5"/>

                    </td>
                </tr>


                <tr>
                    <td colSpan="9" className="alignLeft" id="borderBottom">
                        -에스원비즈 삼성센터(이하 "갑")과 상기 회원(이하 "을")은 "갑"이 제공하는 서비스를 "을"이 이용함에 있어서 수반되는 사항을 본
                        이용계약서 약관대로 체결하고, 본 &nbsp; 계약의 성립을 증명하기 위하여 본 이용계약서 2부를 작성하여 기명, 날인하고 각 한 부씩 보관한다.
                        <br/>-본 이용계약서로는 임대차계약서를 대신할 수 없음
                    </td>
                </tr>
                <tr>
                    <td colSpan="9" className="alignRight" id="borderTopBottom"> 2021년 &nbsp;&nbsp; 월 &nbsp;&nbsp; 일
                    </td>
                </tr>

                <tr>
                    <td colSpan="5" className="alignLeft" id="fstTextSpacing">

                        갑: &nbsp; &nbsp; &nbsp;
                        서울특별시 강남구 봉은사로 63길 11 명화빌딩 3, 4층(삼성동) <br/>

                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;㈜ 에스원테크 최현수 (인)<br/>

                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;계좌번호 : 우리은행 1005-002-433395<br/>

                    </td>
                    <td colSpan="4" className="alignLeft" id="sndTextSpacing">
                        을 :<br/>
                        (인)<br/>
                        <span id="hidden">spacing</span>
                    </td>
                </tr>
                </tbody>
            </table>

            <div class="btn-center">
                <input type="button" hidden={props.newDataForm === 'N'} onClick={temporaryStorage} value="임시저장"/>
                <input type="button" hidden={props.newDataForm === 'N'} onClick={onSubmitHandler} value="저장"/>
                <input type="button" hidden={props.newDataForm !== 'N'} onClick={newTemporaryStorage} value="저장"/>
                <input type="button" value="출력"/>
                <input type="button" id="btnWidth" value="임대차 계약처"/>
                <input type="button" onClick={onDeleteHandler} value="삭제"/>
                <Link to="/member">
                </Link>
            </div>
        </form>

    );

}

export default S010100010;