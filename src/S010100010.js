import React, { useState, useEffect, useRef } from 'react';
import DaumPostcode from 'react-daum-postcode';
import axios from 'axios';
import { post } from 'axios';
import './css/S010100010.css';
import LeaseAgreement from './utils/LeaseAgreement';

//모달창 라이브러리
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';

//켈린더 라이브러리
import DatePicker, { registerLocale } from 'react-datepicker';
import ko from 'date-fns/locale/ko';
registerLocale('ko', ko);


let valueArr = [[], [], [], [], []];
let queryArr = [['MEMBER_TP', ''], ['CONTRACT_TP', 'ASK'], ['PAY_METHOD', '']];
let payDates = [];
let forPrint;
let forMemberStatus; 

function S010100010(props) {
    //console.log(props.params);

    //회원정보
    /**state를 세분화시킨 이유가있나요? */
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

    //계약정보
    const [contractTp, setContractTp] = useState('');
    const [contractTpVal, setContractTpVal] = useState([{ key: '', value: '선택' }]);
    const [roomLockerTp, setRoomLockerTp] = useState(0);
    const [contractMoney, setContractMoney] = useState('');
    const [contractTerm, setContractTerm] = useState('0');
    const [startAsk_date, setStartAsk_date] = useState(new Date());
    const [endAsk_date, setEndAsk_date] = useState(new Date());
    const [payDate, setPayDate] = useState(1);
    const [comment, setComment] = useState('');
    const [payMethod, setPayMethod] = useState('');
    const [contractPath, setContractPath] = useState('');
    const [contractStart, setContractStart] = useState('');
    const [contractEnd, setContractEnd] = useState('');
    const [userStatus, setUserStatus] = useState('');

    //확정 가계약 status
    //const [memStatus,setMemStatus] = useState('');

    //중복확인
    const [regNoCheckBtn,setRegNoCheckBtn] = useState('');
    const [empHpCheckBtn,setEmpHpCheckBtn] = useState('');
    const [dateCheckBtn,setDateCheckBtn] = useState('');
    const [roomCheck,setRoomCheck] = useState('');
    
    //dialog open
    const [printSheetOpen,setPrintSheetOpen] = useState(false);
    const [leaseAgreementOpen,setLeaseAgreementOpen] = useState(false);

    //cd_v_meaning for printing
    const [memberTpPrint,setMemberTpPrint] = useState('');
    const [contractTpPrint,setContractTpPrint] = useState('');
    const [payMethodPrint,setPayMethodPrint] = useState('');
    const [accessPrint,setAccessPrint] = useState('');
    
    //첨부파일업로드
    const [idCardFile,setIdCardFile] = useState(null);
    const [idCardFileName,setIdCardFileName] = useState('');

    const [registCardFile,setRegistCardFile] = useState(null);
    const [registCardFileName,setRegistCardFileName] = useState('');
    // const onHandleClickClose = (event) => {
    //     setOpen(false);
    // }

    //  //주소api
    //  const [open, setOpen] = React.useState(false);
    //  const [isPostOpen, setIsPostOpen] = useState(false);
    //  //hidden 이용해보기

    const rNum = props.dataNum;
    const modalMemberId = props.dataMem;

    useEffect(() => {
        if (props.newDataForm === 'N') {
            axios.get(`/api/s01010010/insert/tb_s10_contract010_by_id?id=${modalMemberId}&type=single`)
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
                        setZipcode(modalCZipCode);
                        setEmpAddress(modalCAddress);
                        setEmpDetailAddress(modalCDetailAddress);

                        //setEndFlag(modalEndFLag);
                    } else {
                        alert("상세 정보 가져오기를 실패하였습니다.")
                    }
                })
        }

    }, []);

   

    useEffect(() => {
        if (props.cDataForm === 'I') {
          //계약상세정보 함수(contract_id이용)
        axios.get(`/api/s01010010/tb_s10_contract010_by_id?id=${rNum}&type=single`)
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
                    const modalCCeoIdCardImg = response.data.rows[0].CEO_IMAGE_ID;
                    const modalCRegistIdCardImg = response.data.rows[0].CEO_IMAGE_REGISTER;

                    const modalCContractDate = response.data.rows[0].CONTRACT_DATE;
                    const modalCContractTp = response.data.rows[0].CONTRACT_TP;
                    const modalCContractTerm = response.data.rows[0].CONTRACT_TERM;
                    const modalCPayDate = response.data.rows[0].PAY_DATE;
                    const modalCContractMoney = response.data.rows[0].PAYED_PLAN_MONEY;
                    const modalCPayMethod = response.data.rows[0].PAY_METHOD;

                    const modalCContractPath = response.data.rows[0].CONTRACT_PATH;
                    const modalCContractPathM =response.data.rows[0].CONTRACT_PATH_M;
                    
                    const modalCEndDate = response.data.rows[0].END_DATE;

                    const modalCContractTpVal = response.data.rows[0].CONTRACT_ROOM;
                    const modalCRoomLockerTp = response.data.rows[0].CONTRACT_LOCKER;
                    const modalCContractTpValM = response.data.rows[0].CONTRACT_ROOM_M;
                    const modalCRoomLockerTpM = response.data.rows[0].CONTRACT_LOCKER_M;
                    const modalCMemberSt = response.data.rows[0].MEMBER_ST;

                    const modalCComment = response.data.rows[0].COMMENT;

                    const modalCMemberTpPrint = response.data.rows[0].MEMBER_TP_M;
                    const modalCContractTpPrint = response.data.rows[0].CONTRACT_TP_M;
                    const modalCPayMethodPrint = response.data.rows[0].PAY_METHOD_M;
                    const modalCAccessPrint = response.data.rows[0].CONTRACT_PATH_M;

                    const modalCRegNos = modalCRegNo.split("-");
                    const modalCEmpHps = modalCEmpHp.split("-");
                    const modalCEmpEmails = modalCEmpEmail.split("@");

                    setUserStatus(modalCMemberSt);
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
                    setPayMethod(modalCPayMethod);
                    //setContractPath(modalCContractPath);
                    setRoomLockerTp(modalCRoomLockerTp);
                    setComment(modalCComment);
                    
                    setStartAsk_date(new Date(modalCContractDate));

                    setContractTpVal(modalCContractTpVal);
                    setRoomLockerTp(modalCRoomLockerTp);
                    setContractPath(modalCContractPath);

                    setContractTpVals([{ key: modalCContractTpVal, value: modalCContractTpValM }]);
                    setRoomLockers([{ key: modalCRoomLockerTp, value: modalCRoomLockerTpM }]);
                    setContractPaths([{ key: modalCContractPath, value: modalCContractPathM}]);
                    
                    //print용
                    setMemberTpPrint(modalCMemberTpPrint);
                    setContractTpPrint(modalCContractTpPrint);
                    setPayMethodPrint(modalCPayMethodPrint);
                    setAccessPrint(modalCAccessPrint);
                } else {
                    alert("상세 정보 가져오기를 실패하였습니다.")
                }
            })
    
        }
    }, [])



    const findAddr = () => {
    //     const script = document.createElement("script");
    //     script.innerHTML = `         
    //     new daum.Postcode({
    //         oncomplete: function(data) {
            
    //             var addr = ''; 
    //             var extraAddr = ''; 

              
    //             if (data.userSelectedType === 'R') { 
    //                 addr = data.roadAddress;
    //             } else {
    //                 addr = data.jibunAddress;
    //             }

           
    //             if(data.userSelectedType === 'R'){
                   
    //                 if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
    //                     extraAddr += data.bname;
    //                 }
               
    //                 if(data.buildingName !== '' && data.apartment === 'Y'){
    //                     extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
    //                 }
                 
    //                 if(extraAddr !== ''){
    //                     extraAddr = ' (' + extraAddr + ')';
    //                 }
                 
    //                 document.getElementById("sample6_extraAddress").value = extraAddr;
                
    //             } else {
    //                 document.getElementById("sample6_extraAddress").value = '';
    //             }

        
    //             document.getElementById('sample6_postcode').value = data.zonecode;
    //             document.getElementById("sample6_address").value = addr;
            
    //             document.getElementById("sample6_detailAddress").focus();  
    //         }
    //     }).open();
    //    `;
    //     script.type = "text/javascript";
    //     script.async = "async";
    //     document.head.appendChild(script);

        console.log('ggggg');

        const postCodeStyle = {
            display: "block",
            position: "absolute",
            top: "26%",
            right: "33%",
            width: "1000px",
            height: "1600px"

        }

        const handleComplete = (data) => {
            let fullAddress = data.address;
            let extraAddress = '';

            if (data.addressType === 'R') {
                if (data.bname !== '') {
                    extraAddress += data.bname;
                }
                if (data.buildingName !== '') {
                    extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
                }
                fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
            }

            console.log(fullAddress);  // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
            setZipcode(data.zonecode);
            setEmpAddress(fullAddress);
            alert('입력되었습니다.');
        }

        return (
            <div>
                {console.log(';/')}
                <DaumPostcode
                    onComplete={handleComplete}
                    style={postCodeStyle}
                    height={700}
                />
            </div>
        );

    }


    //<Lov시작>
    useEffect(() => {
        for (let i = 0; i < queryArr.length; i++) {

            let firstVal = queryArr[i][0];
            let secondVal = queryArr[i][1];
            axios.post('/api/s010100140/selectTest', { firstVal: firstVal, secondVal: secondVal })
                .then(response => {
                    if (response.data.success) {
                        //console.log('ask_tp',response.data.rows);
                        let arr = [{ key: '선택', value: '선택' }]

                        response.data.rows.map((data) =>
                            arr.push({
                                value: data.CD_V_MEANING,
                                key: data.CD_V
                            }));

                        valueArr[i] = arr;
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
                    let arr = [{ key: '선택', value: '선택' }]
                    response.data.rows.map((data) =>
                        arr.push({
                            value: data.CD_V_MEANING, key: data.CD_V
                        }));
                        setContractPaths(arr);
                } else {
                    alert("데이터를 불러오는데 실패하였습니다.");
                }
            })
    }, [])

    //날 일
    let arr = [{ key: '선택', value: '선택' }];
    for (let i = 1; i <= 31; i++) {
        arr.push({
            value: i,
            key: i
        });
        payDates = arr;
    }

    const [contractTpVals, setContractTpVals] = useState([{ key: '', value: '선택' }]);
    const [roomLockers, setRoomLockers] = useState([{ key: '', value: '선택' }]);
    const [contractpaths, setContractPaths] = useState([{ key: '', value: '선택' }]);

    const onContractTpHandler = (event) => {

        setContractTp(event.currentTarget.value);
        let contractTpBody = event.currentTarget.value;


        axios.post('/api/s010100010/contHier', { contractTpBody: contractTpBody })
            .then(response => {
                if (response.data.success) {
                    //console.log('ContractTpVal', response.data.rows);
                    let arr = [{ key: '선택', value: '선택' }]

                    response.data.rows.map((data) =>
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
                    }//switch

                    if (contractTpBody === 'FI' || contractTpBody === 'FL') {
                        axios.post('/api/s010100010/roomLockerHier')
                            .then(response => {
                                if (response.data.success) {
                                    //console.log('roomLocker', response.data.rows);
                                    let arr = [{ key: '선택', value: '선택' }]
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
                        let arr = [{ key: '선택', value: '선택' }];
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


    useEffect(() => {
        return () => setRegNoCheckBtn('');
    }, []);
    useEffect(() => {
        return () => setEmpHpCheckBtn('');
    }, []);
    useEffect(() => {
        return () => setDateCheckBtn('');
    }, []);


      //첨부파일 서버로 보내는 함수
      const addMember = () => {
        const url = '/api/s010100010/insertMember010';
        const formData = new FormData();

        let startDate = startAsk_date.getFullYear() + '-' + (startAsk_date.getMonth() + 1) + '-' + startAsk_date.getDate();

        formData.append('idCardFile',idCardFile);
        formData.append('registCardFile',registCardFile);
        formData.append('idCardFileName',idCardFileName);
        formData.append('registCardFileName',registCardFileName);

        formData.append('memberNm',memberNm);
        formData.append('firstRegNo',firstRegNo);
        formData.append('secondRegNo',secondRegNo);
        formData.append('thirdRegNo',thirdRegNo);
        formData.append('memberTp',memberTp);
        formData.append('empIdName',empIdName);
        formData.append('firstEmpHp',firstEmpHp);
        formData.append('secondEmpHp',secondEmpHp);
        formData.append('thirdEmpHp',thirdEmpHp);

        formData.append('zipcode', zipcode);
        formData.append('empEmailId', empEmailId);
        formData.append('domainAddress', domainAddress);
        formData.append('empAddress', empAddress);
        formData.append('empDetailAddress', empDetailAddress);
        //계약정보
        formData.append('contractTp', contractTp);
        formData.append('contractTpVal', contractTpVal);
        formData.append('roomLockerTp', roomLockerTp);
        formData.append('contractMoney', contractMoney);
        formData.append('contractTerm', contractTerm);
        formData.append('startAsk_date', startDate);
        formData.append('endDate', dateEnd);
        formData.append('payDate', payDate);
        formData.append('payMethod', payMethod);
        formData.append('contractPath', contractPath);
        formData.append('comment', comment);
        formData.append('forMemberStatus',forMemberStatus);
        
        console.log(formData);
        alert('forMemberStatus',forMemberStatus);

        const config = {
            headers : {
                'content-type':'multipart/form-data'
            }
        }
        return post(url, formData, config);
    }

    const tempAddMember = () => {
        const url = '/api/s010100140/tempStorage';
        const formData = new FormData();

        let startDate = startAsk_date.getFullYear() + '-' + (startAsk_date.getMonth() + 1) + '-' + startAsk_date.getDate();

        formData.append('idCardFile',idCardFile);
        formData.append('registCardFile',registCardFile);
        formData.append('idCardFileName',idCardFileName);
        formData.append('registCardFileName',registCardFileName);

        formData.append('memberNm',memberNm);
        formData.append('firstRegNo',firstRegNo);
        formData.append('secondRegNo',secondRegNo);
        formData.append('thirdRegNo',thirdRegNo);
        formData.append('memberTp',memberTp);
        formData.append('empIdName',empIdName);
        formData.append('firstEmpHp',firstEmpHp);
        formData.append('secondEmpHp',secondEmpHp);
        formData.append('thirdEmpHp',thirdEmpHp);

        formData.append('zipcode', zipcode);
        formData.append('empEmailId', empEmailId);
        formData.append('domainAddress', domainAddress);
        formData.append('empAddress', empAddress);
        formData.append('empDetailAddress', empDetailAddress);
        //계약정보
        formData.append('contractTp', contractTp);
        formData.append('contractTpVal', contractTpVal);
        formData.append('roomLockerTp', roomLockerTp);
        formData.append('contractMoney', contractMoney);
        formData.append('contractTerm', contractTerm);
        formData.append('startAsk_date', startDate);
        formData.append('endDate', dateEnd);
        formData.append('payDate', payDate);
        formData.append('payMethod', payMethod);
        formData.append('contractPath', contractPath);
        formData.append('comment', comment);
        //formData.append('memStatus',memStatus);
        
        console.log(formData);
        //alert('memStatus',memStatus);

        const config = {
            headers : {
                'content-type':'multipart/form-data'
            }
        }
        return post(url, formData, config);
    }


    //저장-확정
     const onSubmitHandler = (event) => {
        event.preventDefault();
        forMemberStatus ="C";

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

        //중복확인
        if(regNoCheckBtn == ''){
            alert('사업자 번호 중복확인 하세요.');
        }else if(empHpCheckBtn == ''){
            alert('전화번호 중복확인 하세요.');
        }else if(dateCheckBtn == ''){
            alert('이용날짜 중복확인 하세요.');
        }else if(regNoCheckBtn == 'check' && empHpCheckBtn == 'check' && dateCheckBtn == 'check'){
           addMember().then((response) => {
               alert('정상적으로 등록 되었습니다.');
           })
        //alert(forMemberStatus);
        }

    }

     //임시저장-가계약
     const temporaryStorage = (event) => {
        event.preventDefault();
        forMemberStatus ="T";
    

        //중복확인
        if(regNoCheckBtn == ''){
            alert('사업자 번호 중복확인 하세요.');
        }else if(empHpCheckBtn == ''){
            alert('전화번호 중복확인 하세요.');
        }else if(dateCheckBtn == ''){
            alert('이용날짜 중복확인 하세요.');
        }else if(regNoCheckBtn == 'check' && empHpCheckBtn == 'check' && dateCheckBtn == 'check'){
           addMember().then((response) => {
               alert('정상적으로 등록 되었습니다.');
           })
        }

    }

     //신규계약추가
     const newMemberIdStorage = (event) => {

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

       //memberId
       let memberIdForNew = props.dataMem;
       //시작일자
       let startDate = startAsk_date.getFullYear() + '-' + (startAsk_date.getMonth() + 1) + '-' + startAsk_date.getDate();

       let body = {
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
            startAsk_date: startDate,
            endDate: dateEnd,
            payDate: payDate,
            payMethod: payMethod,
            contractPath: contractPath,
            comment: comment
       }

       axios.post(`/api/s010100050/detailNewContract_by_id?id=${memberIdForNew}&type=single`, body)
           .then(response => {
               if (response.data.success) {
                   alert('신규계약에 성공 하였습니다');
               } else {
                   alert('신규계약에 실패 하였습니다');
               }
            })
   }

   

   //수정하기
   const newMemberModifyStorage = (event) => {
       event.preventDefault();
       let modifyDataNum = props.dataNum;


    //     modifyMember(modifyDataNum).then((response) => {
    //        //console.log(response.data);
    //        alert('수정 하였습니다.');
    //    })
    
       let startDate = startAsk_date.getFullYear() + '-' + (startAsk_date.getMonth() + 1) + '-' + startAsk_date.getDate();
       //contract_id
       //console.log('modifyDataNum',modifyDataNum);

       let body = {
        //    //회원정보
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
           startAsk_date: startDate,
           endDate: dateEnd,
           payDate: payDate,
           payMethod: payMethod,
           contractPath: contractPath,
           comment: comment
       }

    if(dateCheckBtn == ''){
        alert('이용날짜 중복확인 하세요.');
    }else if(dateCheckBtn == 'check'){
        axios.post(`/api/s010100050/detailModifyContract_by_id?id=${modifyDataNum}&type=single`, body)
           .then(response => {
               if (response.data.success) {
                   alert('이용계약서를 수정하였습니다');
               } else {
                   alert("이용계약서 수정을 실패 하였습니다");
               }
           })

    }
    
   }


    //가계약을 확정으로
    const newContractIdStorage = (event) => {
        let body = {
            rNum:rNum
        }

       axios.post('/api/s010100010/modifymemberSt', body)
           .then(response => {
               if (response.data.success) {
                   alert('확정되었습니다');
               } else {
                   alert('확정실패 하였습니다');
               }
           })
    }
    
    //출력버튼 모달 open
    const onPrintHandler = (event) => {
        forPrint = true;
        setPrintSheetOpen(true);
    }
    //출력버튼 모달 close
    const onPrintSheetClose = (event) => {
        forPrint = false;
        setPrintSheetOpen(false);
    }

    //useRef();
    //const printArea = useRef();
    //출력함수
    // const onPrintSheetHandler = (event) => {
    //     let printContents =printArea.current.focus; 
    //     let originalContents = document.body.innerHTML;
    //     document.body.innerHTML = printContents;
    //     window.print();
    //     document.body.innerHTML = originalContents;
        
    // }

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


    //종료
    const newEndHandler = (event) => {
        event.preventDefault();
        const body = {
            //계약정보
            rNum:rNum
        }
        axios.post('/api/s010100140/endFlag', body)
            .then(response => {
                if (response.data.success) {
                    alert('종료처리 하였습니다.')
                } else {
                    alert('종료처리에 실패하였습니다.')
                }
            })
    }

    
    const onDeleteHandler = (event) => {

        setUserStatus('');
        //alert(rNum);

        axios.post(`/api/s010100010/memberDelete_by_id?id=${rNum}`)
            .then(response => {
                if (response.data.success) {
                    alert('삭제 하였습니다.')
                } else {
                    alert('삭제에 실패하였습니다.')
                }
            })

    }

    const onRegNoCheckHandler = (event) => {
        event.preventDefault();

        setRegNoCheckBtn('check');

        console.log('regNoCheckBtn2.', regNoCheckBtn);

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

        console.log('regNoCheckBtn3.', regNoCheckBtn);
    }

    const onEmpHpChkHandler = (event) => {
        event.preventDefault();


        setEmpHpCheckBtn('check');

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




    let finalMonth = ((startAsk_date.getMonth() * 1 + contractTerm * 1) % 12) + 1;
    let finalYear = ((startAsk_date.getMonth() * 1 + contractTerm * 1) / 12) + startAsk_date.getFullYear();

    let dateEnd = Math.floor(finalYear) + '.' + finalMonth + '.' + startAsk_date.getDate();


    //이용기간 중복체크
    const funcDateChk = () => {
        // if(!setRoomCheck){
        //     alert('호실을 선택하세요');
        // }

        setDateCheckBtn('check');

        let startDate = startAsk_date.getFullYear() + '.' + (startAsk_date.getMonth() + 1) + '.' + startAsk_date.getDate();

        const body = {
            contractTp: contractTp,
            contractTpVal: contractTpVal,
            roomLockerTp: roomLockerTp,
            startDate: startDate,
            endDate: dateEnd,
            modalMemberId : modalMemberId
        }

        //console.log(modalMemberId);

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


    const onDateHandler = (event) => {
        event.preventDefault();
        funcDateChk();
    }


    const onPlusDateHandler = (event) => {
        event.preventDefault();
        funcDateChk();
    }


    const idCardHandleFileChange = (event) => {
        // file: event.currentTarget.idCardFiles[0];
        setIdCardFile(event.currentTarget.files[0]);
        setIdCardFileName(event.currentTarget.value);
    }

    const registCardHandleFileChange = (event) => {
        // file: event.currentTarget.registCardFiles[0];
        setRegistCardFile(event.currentTarget.files[0]);
        setRegistCardFileName(event.currentTarget.value);
    }

    return (

        <form style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
        }}
        //onSubmit={onSubmitHandler}
        encType='multipart/form-data'
        >
            <h1 id="useContractTitle">이용계약서</h1>
            <table className="useContractTable">
                {/* 회원정보란 */}
                <tbody>
                    <tr>
                        <th rowSpan="6" className="memberInfo">회원정보</th>
                    </tr>

                    <tr>
                        <th className="memberInfo">회원명</th>
                        <td hidden = {forPrint}>
                            <input type="text" value={memberNm} id="memberNm" name="memberNm" size="10"
                                onChange={onMemberNmHandler} disabled = {props.cDataForm === 'I' || props.newDataForm === 'N'}
                                />
                        </td>

                        {/* 회원명 출력 td */}
                        <td hidden = {!forPrint}>
                        {memberNm} 
                        </td>

                        <th className="memberInfo">사업자 번호</th>
                        <td colSpan="2" hidden = {forPrint}>

                            <input type="text" value={firstRegNo} id="firstRegNo" name="firstRegNo" size="3"
                                onChange={onFirstRegNoHandler} disabled = {props.cDataForm === 'I' || props.newDataForm === 'N'}/>
                        &nbsp;
                        -
                        &nbsp;
                        <input type="text" value={secondRegNo} id="secondRegNo" name="secondRegNo" size="3"
                                onChange={onSecondRegNoHandler} disabled = {props.cDataForm === 'I' || props.newDataForm === 'N'} />
                        &nbsp;
                        -
                        &nbsp;
                        <input type="text" value={thirdRegNo} id="thirdRegNo" name="thirdRegNo" size="3"
                                onChange={onThirdRegNoHandler} disabled = {props.cDataForm === 'I' || props.newDataForm === 'N'}/>

                            {/*신규회원 중복확인 */}
                            <input type="button" className="useContractBtn" onClick={onRegNoCheckHandler}
                              hidden = {props.cDataForm === 'I' || props.newDataForm === 'N'}  value="중복확인"></input>

                        </td>
                        {/*사업자 번호 출력용 */}
                        <td colSpan="2" hidden = {!forPrint} >{firstRegNo}-{secondRegNo}-{thirdRegNo}</td>


                        <th className="memberInfo" >회원구분</th>
                        <td colSpan="2" hidden = {forPrint}>
                            <select multiple={false} onChange={onMemberTpHandler} value={memberTp} disabled = {props.cDataForm === 'I' || props.newDataForm === 'N'}>
                                {valueArr[0].map(item => (
                                    <option key={item.key} value={item.key}>{item.value}</option>
                                ))}
                            </select>
                        </td>

                        {/*회원구분 출력용 */}
                        <td colSpan="2" hidden = {!forPrint} >{memberTpPrint}</td>
                    </tr>

                    <tr>
                        <th className="memberInfo">대표자<span className="star">(*)</span></th>
                        <td hidden = {forPrint}>
                            <input type="text" value={empIdName} id="empIdName" name="empIdName" size="10"
                                onChange={onEmpIdNameHandler} disabled = {props.cDataForm === 'I' || props.newDataForm === 'N'}/>
                        </td>

                        {/* 대표자(이름) 출력용 */}
                        <td hidden = {!forPrint} >{empIdName}</td>

                        <th className="memberInfo">연락처<span className="star">(*)</span></th>
                        <td colSpan="2" hidden = {forPrint}>

                            <input type="text" value={firstEmpHp} id="firstEmpHp" name="firstEmpHp" size="5"
                                onChange={onFirstEmpHpHandler} disabled = {props.cDataForm === 'I' || props.newDataForm === 'N'}/>
                        -
                        &nbsp;
                        <input type="text" value={secondEmpHp} id="secondEmpHp" name="secondEmpHp" size="5"
                                onChange={onSecondEmpHpHandler} disabled = {props.cDataForm === 'I' || props.newDataForm === 'N'}/>
                        -
                        &nbsp;
                        <input type="text" value={thirdEmpHp} id="thirdEmpHp" name="thirdEmpHp" size="5"
                                onChange={onThirdEmpHpHandler} disabled = {props.cDataForm === 'I' || props.newDataForm === 'N'}/>
                            <input type="button" onClick={onEmpHpChkHandler}  hidden={props.cDataForm == 'I' || props.newDataForm === 'N'} value="중복확인" />
                        </td>
                        
                        {/* 대표자(전화번호) 출력용 */}
                        <td colSpan="2" hidden = {!forPrint} >{firstEmpHp}-{secondEmpHp}-{thirdEmpHp}</td>


                        <th className="memberInfo">E-mail<span className="star">(*)</span></th>
                        <td colSpan="2" hidden = {forPrint}>

                            <input type="text" value={empEmailId} id="empEmailId" name="empEmailId" size="5"
                                onChange={onEmpEmailIdHandler} disabled = {props.cDataForm === 'I' || props.newDataForm === 'N'}/>
                        &nbsp;
                        @
                        &nbsp;
                        <input type="text" value={domainAddress} id="domainAddress" name="domainAddress"
                                size="5"
                                onChange={onDomainAddressHandler} disabled = {props.cDataForm === 'I' || props.newDataForm === 'N'}/>
                        </td>

                         {/* 대표자(이메일) 출력용 */}
                         <td colSpan="2" hidden = {!forPrint} >{empEmailId}@{domainAddress}</td>
                    </tr>

                    <tr>
                        <th rowSpan="2" className="memberInfo">대표자 주소</th>

                        <td colSpan="9" hidden = {forPrint}>

                            <input type="text" value={zipcode} id="zipcode" name="zipcode" size="10"
                                onChange={onZipcodeHandler} disabled = {props.cDataForm === 'I' || props.newDataForm === 'N'}/>
                            <input type="button" className="useContractBtn" onClick={findAddr}
                             disabled = {props.cDataForm === 'I' || props.newDataForm === 'N'}
                                value="우편"
                            />
                            <input type="text" value={empAddress} id="empAddress" name="empAddress" size="30"
                                onChange={onEmpAddressHandler} disabled = {props.cDataForm === 'I' || props.newDataForm === 'N'} />
                        </td>

                        <td colSpan = "9" hidden = {!forPrint}>{zipcode}{empAddress}{empDetailAddress}</td>

                    </tr>
                    <tr>
                        <td colSpan="9" hidden ={forPrint}>
                            <input type="text" value={empDetailAddress}
                                id="empDetailAddress"
                                name="empDetailAddress" size="30"
                                onChange={onEmpDetailAddressHandler}
                                disabled = {props.cDataForm === 'I' || props.newDataForm === 'N'} />
                        </td>
                    </tr>

                    <tr>
                        <th className="memberInfo" >첨부파일</th>
                        <td colSpan="4" hidden ={forPrint || props.cDataForm === 'I' || props.newDataForm === 'N'}>
                        <input type='file'
                        file = {idCardFile}
                        name ='idCardFile'
                        value = {idCardFileName}
                        onChange = {idCardHandleFileChange}
                       /> 
                       </td>
                        <td colSpan="5" hidden ={forPrint || props.cDataForm === 'I' || props.newDataForm === 'N'}>    
                        <input type='file' 
                        file = {registCardFile} 
                        name='registCardFile'
                        value = {registCardFileName}
                        onChange = {registCardHandleFileChange}
                        />
                        </td>

                        {/* 출력용 */}
                        <td colSpan="4" hidden ={!forPrint && props.cDataForm === 'I' && props.newDataForm === 'N'}>
                        {ceoIdCardImg}
                        </td>

                        <td colSpan="5" hidden ={!forPrint && props.cDataForm !== 'I' && props.newDataForm !== 'N'}>    
                        {ceoRegistCardImg}
                        </td>
                    </tr>


                    {/* 계약정보란 */}

                    <tr>
                        <th rowSpan="7" className="info">계약정보</th>
                    </tr>

                    <tr>
                        <th className="info">계약구분</th>
                        <td hidden ={forPrint}>
                            <select multiple={false} onChange={onContractTpHandler} value={contractTp}>
                                {valueArr[1].map(item => (
                                    <option key={item.key} value={item.key}>{item.value}</option>
                                ))}
                            </select>
                        </td>

                        {/* 계약구분 출력용 */}
                        <td hidden ={!forPrint}>
                            {contractTpPrint}
                        </td>

                        <th className="info">호실</th>
                        <td hidden = {forPrint}>
                            <select multiple={false} onChange={onContractTpValHandler} value={contractTpVal}>
                                {contractTpVals.map(item => (
                                    <option key={item.key} value={item.key}>{item.value}</option>
                                ))}
                            </select>
                        </td>
                        {/* 호실 출력용 */}
                        <td hidden = {!forPrint}>
                            {contractTpVals.map(item => (
                                    <option key={item.key} value={item.key}>{item.value}</option>
                                ))}
                        </td>

                        <th className="info">사물함</th>
                        <td hidden = {forPrint}>
                            <select multiple={false} onChange={onRoomLockerTpHandler} value={roomLockerTp}>
                                {roomLockers.map(item => (
                                    <option key={item.key} value={item.key}>{item.value}</option>
                                    ))}
                            </select>
                        </td>
                        {/* 사물함 출력용 */}
                        <td hidden = {!forPrint}>
                            {roomLockers.map(item => (
                                    <option key={item.key} value={item.key}>{item.value}</option>
                                ))}
                        </td>

                        <th className="info">월회비</th>
                        <td hidden = {forPrint}>
                            <input type="text" value={contractMoney} id="contractMoney" name="contractMoney"
                                size="5"
                                onChange={onContractMoneyHandler} />
                        </td>

                        {/* 월회비 출력용 */}
                        <td hidden = {!forPrint}>
                            {contractMoney}
                        </td>
                    </tr>

                    <tr>
                        <th className="info">이용기간</th>
                        <td hidden = {forPrint}> 
                            <input type="text" value={contractTerm} id="contractTerm" name="contractTerm" size="1"
                            onChange={onContractTermHandler}/> &nbsp;개월 &nbsp;
                                    
                                <DatePicker
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
                            <input type="button" onClick={onDateHandler} className="useContractBtn"
                                hidden = {props.newDataForm === 'N'} value="중복확인"></input>

                            {/*기존회원 신규계약 중복확인 */}
                            <input type="button" className="plusContractBtn" onClick={onPlusDateHandler}
                                hidden = {props.newDataForm !== 'N'} value="중복확인"></input>    
                        </td>

                        {/* 이용기간 출력용 */}
                        <td hidden = {!forPrint}> 
                            {contractTerm}개월 &nbsp;
                            
                                <DatePicker
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
                            <input type="button" onClick={onDateHandler} className="useContractBtn"
                                hidden = {props.newDataForm === 'N' || forPrint} value="중복확인"></input>

                            {/*기존회원 신규계약 중복확인 */}
                            <input type="button" className="plusContractBtn" onClick={onPlusDateHandler}
                                hidden = {props.newDataForm !== 'N'} value="중복확인"></input>    
                        </td>

                        <th className="info">입금일</th>
                        <td hidden = {forPrint}>
                            <select multiple={false} onChange={onPayDateHandler} value={payDate}>
                                {payDates.map(item => (
                                    <option key={item.key} value={item.key}>{item.value}</option>
                                ))}
                            </select>
                        </td>

                        <td hidden = {!forPrint}>
                            {payDate}일
                        </td>

                        <th className="info">납부방법</th>
                        <td hidden = {forPrint}>
                            <select multiple={false} onChange={onPayMethodHandler} value={payMethod}>
                                {valueArr[2].map(item => (
                                    <option key={item.key} value={item.key}>{item.value}</option>
                                ))}
                            </select>
                        </td>

                        <td hidden = {!forPrint}>
                            {payMethodPrint}
                        </td>            

                        <th className="info">예치금</th>
                        <td hidden = {forPrint}>
                            <input type="text" value={contractMoney} id="contractMoney" name="contractMoney"
                            size="10"
                            onChange={onContractMoneyHandler} />
                        </td>

                        {/*예치금 출력용  */}
                        <td hidden = {!forPrint}>
                             {contractMoney} 
                        </td>
                    </tr>

                    <tr>
                        <th className="info">특약사항</th>
                        <td colSpan="9" className="alignLeft" id="infoPadding" hidden = {forPrint}>
                        계약기간 만료 또는 종료시 사업지 주소지와 전화를 7일이내 이전해야 하고,<br />
                        계약을 해지할 경우 7일이전에 서면 또는 구두 통보해야함.<br />
                            <textarea rows="5" cols="110" value={comment} id="comment" name="comment"
                                onChange={onCommentHandler}></textarea>
                        </td>

                        {/* 특약사항 출력용 */}
                        <td colSpan="9" className="alignLeft" id="infoPadding" hidden = {!forPrint}>
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

                        <th colSpan="2"className="info">계약접근경로</th>
                        <td hidden = {forPrint}>
                            <select multiple={false} onChange={onContractPathHandler} value={contractPath}>
                                {contractpaths.map(item => (
                                    <option key={item.key} value={item.key}>{item.value}</option>
                                ))}
                            </select>
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
                        <td colSpan="9" className="alignRight"
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
                            <span id="hidden">spacing</span>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="btn-center" hidden = {forPrint}>
                {/* 신규계약 */}
                <input type="button" hidden={props.newDataForm === 'N' || props.cDataForm === 'I'}
                    onClick={temporaryStorage} value="임시저장" />
                <input type="button" className="new"
                    hidden={props.newDataForm === 'N' || props.cDataForm === 'I'}
                    onClick={onSubmitHandler} value="저장" />

                <input type="button" className="memberId" hidden={props.newDataForm !== 'N'}
                    onClick={newMemberIdStorage} value="저장" />
                
                {/* 가계약을 확정으로 */}
                <input type="button" className="contractId" hidden={props.cDataForm !== 'I'}
                    onClick={newContractIdStorage} value="저장" /> 


                <input type="button" className="contractId" hidden={props.cDataForm !== 'I'}
                    onClick={newMemberModifyStorage} value="수정하기" />

                <input type="button" onClick = {onPrintHandler} value="출력" />
                <input type="button" onClick = {onleaseAgreementHandler} id="btnWidth" value="임대차 계약서" />

                {/* <input type="button" className="memberId" hidden={props.newDataForm !== 'N'}
                    onClick={newEndHandler} value="종료" /> */}
                <input type="button" className="contractId" hidden={props.cDataForm !== 'I'}
                    onClick={newEndHandler} value="종료" />
                <input type="button" hidden={ userStatus !== 'T'}
                    onClick={onDeleteHandler} value="삭제" />
            </div>
          
            {/* <input type="button" onClick = {onPrintSheetHandler} hidden = {!forPrint} value="출력" /> */}

            <Dialog
                maxWidth={"lg"}
                open={printSheetOpen}
                onClose={onPrintSheetClose}>
                <S010100010 dataNum={rNum} cDataForm={'I'} />    
                {/* ref={printArea} */}
                <DialogActions>
                    <input type="button" onClick={onPrintSheetClose} color="primary" value="닫기" hidden ={forPrint}/>
                </DialogActions>
            </Dialog>

            <Dialog
                maxWidth={"lg"}
                open={leaseAgreementOpen}
                onClose={onleaseAgreementClose}>
                <LeaseAgreement dataNum={rNum}/>
                <DialogActions>
                    <input type="button" onClick={onleaseAgreementClose} color="primary" value="닫기" hidden ={forPrint}/>
                </DialogActions>
            </Dialog>

        </form>

    );

}

export default S010100010;