import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import './css/S010100050.css';
import S010100010 from './S010100010';
import Pagination from "./utils/Pagination";

//<!--모달창 라이브러리
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DatePicker from "react-datepicker";
import { addDays } from "date-fns";
//모달창 라이브러리 끝-->

let num = '';
let rNum = 0;
let memberTpDetail = [];

function S010100050(props) {

    const [detailAllInfo, setDetailAllInfo] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [nameForDetailCModal, setNameForDetailCModal] = useState('');

    //회원정보
    const [detailMemberNm, setDetailMemberNm] = useState('');

    const [detailFstRegNo, setDetailFstRegNo] = useState('');
    const [detailSndRegNo, setDetailSndRegNo] = useState('');
    const [detailThdRegNo, setDetailThdRegNo] = useState('');

    const [detailMemberTp, setDetailMemberTp] = useState([])
    const [detailCheckoutDate, setDetailCheckoutDate] = useState('');
    const [detailName, setDetailName] = useState('');

    const [detailFstEmpHp, setDetailFstEmpHp] = useState('');
    const [detailSndEmpHp, setDetailSndEmpHp] = useState('');
    const [detailThdEmpHp, setDetailThdEmpHp] = useState('');

    const [detailEmpEmail, setDetailEmpEmail] = useState('');
    const [detailDomain, setDetailDomain] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [detailZipcode, setDetailZipcode] = useState('');
    const [detailDetailAddress, setDetailDetailAddress] = useState('');

    const [startAsk_date, setStartAsk_date] = useState(new Date());
    const [endAsk_date, setEndAsk_date] = useState(new Date());
    const [endDateTest, setEndDateTest] = useState('');

    

    // const [detailContractId, setDetailContractId] = useState('')
    // const [detailContractDa
    // te, setDetailContractDate] = useState('')
    // const [detailContractTp, setDetailContractTp] = useState('')
    // const [detailContractTerm, setDetailContractTerm] = useState('')
    // const [detailMemberSt, setDetailMemberSt] = useState('')
    // const [detailPayDate, setDetailPayDate] = useState('')
    // const [detailContractMoney, setDetailContractMoney] = useState('')
    // const [detailContractEndFlag, setDetailContractEndFlag] = useState('')


    const dataName = props.dataName;
    const dataEmpHp = props.dataEmpHp;
    //console.log('dataEmpHp',dataEmpHp); dataMemId = {memberIdModal}
    const dataMemId = props.dataMemId;
    console.log('dataName',props.dataMemId);

    const [conOpen, setConOpen] = React.useState(false);
    const [newOpen, setNewOpen] = React.useState(false);
    const [detailMemberId, setDetailMemberId] = useState('');


    //datepicker속성 및 이벤트 시작
    const [modifyDate, setModifyDate] = useState(new Date());
    const [endModifyDate, setEndModifyDate] = useState(new Date());
    //datepicker속성 및 이벤트 끝

    //페이징
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(3);
    const indexOfLastPost = currentPage * postsPerPage;
    //let modalRegistImg;

    useEffect(() => {

        axios.get('/api/s010100150/memberTpDetail')
            .then(response => {
                if (response.data.success) {
                    //console.log('ask_tp',response.data.rows);
                    let arr = [{ key: '선택', value: '선택' }]

                    response.data.rows.map((data) =>
                        arr.push({
                            value: data.CD_V_MEANING,
                            key: data.CD_V
                        }));

                    memberTpDetail = arr;
                    //console.log(valueArr[2]);
                } else {
                    alert(" 데이터를 불러오는데 실패하였습니다.");
                }
            })


    }, [])
  

    useEffect(() => {

        let body = {
            dataName:dataName,
            dataEmpHp:dataEmpHp
        }

        axios.post('/api/s010100050/detailMember_by_id',body)
            .then(response => {
                if (response.data.success) {
                    //console.log('memberId', response.data.rows[0].MEMBER_ID);

                    const memberId = response.data.rows[0].MEMBER_ID;
                    const modalMemberNm = response.data.rows[0].MEMBER_NM;
                    const modalRegNo = response.data.rows[0].REG_NO;
                    const modalMemberTp = response.data.rows[0].MEMBER_TP;
                    const modalName = response.data.rows[0].NAME;
                    const modalEmpHp = response.data.rows[0].EMP_HP;
                    const modalEmpEmail = response.data.rows[0].EMP_EMAIL;
                    const modalZip = response.data.rows[0].ZIP_CODE;
                    const modalAddr = response.data.rows[0].ADDRESS;
                    const modalDetailAddr = response.data.rows[0].DETAIL_ADDRESS;
                    //const modalAddress = zip + ' ' + addr + ' ' + detailAddr;
                    const modalEndDate = response.data.rows[0].END_DATE;
                    const modalIdImg = response.data.rows[0].CEO_IMAGE_ID;
                    //modalRegistImg = response.data.rows[0].CEO_IMAGE_REGISTER;
                    const modalRegNos = modalRegNo.split('-');
                    const modalEmpHps = modalEmpHp.split('-');
                    const modalEmpEmails = modalEmpEmail.split('@');
                    setDetailMemberId(memberId);
                    setEndDateTest(modalEndDate);
                    //console.log(modalRegistImg);
                    setDetailAllInfo(response.data.rows);
                    //console.log(detailAllInfo);
                    setDetailMemberNm(modalMemberNm);

                    setDetailFstRegNo(modalRegNos[0]);
                    setDetailSndRegNo(modalRegNos[1]);
                    setDetailThdRegNo(modalRegNos[2]);

                    setDetailMemberTp(modalMemberTp);
                    setDetailName(modalName);
                    
                    //setIdCar(modalIdImg);
                    //setRegistCar(modalRegistImg);

                    setDetailFstEmpHp(modalEmpHps[0]);
                    setDetailSndEmpHp(modalEmpHps[1]);
                    setDetailThdEmpHp(modalEmpHps[2]);

                    setDetailEmpEmail(modalEmpEmails[0]);
                    setDetailDomain(modalEmpEmails[1]);

                    setStartAsk_date(new Date(modalEndDate));
           
                    //alert(modalEndDate);

                    //alert(finDate);
                   // setModifyDate(finDate);

                    setDetailZipcode(modalZip);
                    setDetailAddress(modalAddr);
                    setDetailDetailAddress(modalDetailAddr);
                    //setDetailCheckoutDate(modalEndDate);
                } else {
                    alert('상세정보 데이터를 불러오는데 실패하였습니다.');
                }
            })
    }, [])

    
    const onDetailMemberNmHandler = (event) => {
        setDetailMemberNm(event.currentTarget.value);
    }

    const onDetailFstRegNoHandler = (event) => {
        setDetailFstRegNo(event.currentTarget.value);
    }

    const onDetailSndRegNoHandler = (event) => {
        setDetailSndRegNo(event.currentTarget.value);
    }
    const onDetailThdRegNoHandler = (event) => {
        setDetailThdRegNo(event.currentTarget.value);
    }

    const onDetailMemberTpHandler = (event) => {
        setDetailMemberTp(event.currentTarget.value);
    }

    const onDetailCheckoutDateHandler = (event) => {
        setDetailCheckoutDate(event.currentTarget.value);
    }

    const onDetailNameHandler = (event) => {
        setDetailName(event.currentTarget.value);
    }

    const onDetailFstEmpHpHandler = (event) => {
        setDetailFstEmpHp(event.currentTarget.value);
    }

    const onDetailSndEmpHpHandler = (event) => {
        setDetailSndEmpHp(event.currentTarget.value);
    }

    const onDetailThdEmpHpHandler = (event) => {
        setDetailThdEmpHp(event.currentTarget.value);
    }

    const onDetailEmpEmailHandler = (event) => {
        setDetailEmpEmail(event.currentTarget.value);
    }

    const onDetailDomainHandler = (event) => {
        setDetailDomain(event.currentTarget.value);
    }

    const onDetailZipcodeHandler = (event) => {
        setDetailZipcode(event.currentTarget.value);
    }

    const onDetailAddressHandler = (event) => {
        setDetailAddress(event.currentTarget.value);
    }

    const onDetailDetailAddressHandler = (event) => {
        setDetailDetailAddress(event.currentTarget.value);
    }

    const onSubmitDetailHandler = (event) => {

    }

    const onDetailClickOpen = (event) => {
        num = event.target.innerHTML;
        rNum = parseInt(num);
        setNameForDetailCModal(rNum);
        console.log(rNum);
        setConOpen(true);
    }

    const onDetailClickClose = (event) => {
        setOpen(false);
    }

    const onConContractHandler = (event) => {

        setConOpen(false);
    }

    const onNewContractHandler = (event) => {
        setNewOpen(false);
    }

    const onNewOpenContractHandler = (event) => {
        setNewOpen(true);
    }

    const onContractHandler = (event) => {
        setConOpen(true);

    }
    
    const onIdDownloadHandler = (event) => {
        event.preventDefault();
        console.log('dataMemId',dataMemId);

        axios.get(`/api/s01010050/download/tb_s10_member010_by_id?id=${dataMemId}&type=single`)
            .then(response => {
                if (response) {
                    alert('so');
                    // let wasteIdPath =response.data.rows[0].CEO_IMAGE_ID_PATH;
                    // let wasteId =response.data.rows[0].CEO_IMAGE_ID;
                    // console.log(typeof wasteIdPath);
                    // let test = wasteIdPath;
                    // let testId = wasteId;
                    // console.log(typeof test);
                    // let path = {
                    //     test:test,
                    //     testId:testId
                    // }
                    // console.log(path);
                   
          } else {
                    alert("다운로드에 실패하였습니다.");
                }
            })
    }

    const onRegDownloadHandler = (event) => {
        event.preventDefault();

        axios.get('/api/s010100150/regDownload')
            .then(response => {
                console.log('response',response);
            })
    }


    const s010100050R = detailAllInfo.map((detailAllInfo, index) => {
        return (
            <tr>
                <td onClick={onDetailClickOpen} id={detailAllInfo.CONTRACT_ID}>{detailAllInfo.CONTRACT_ID}</td>
                <td>{detailAllInfo.CONTRACT_DATE}</td>
                <td>{detailAllInfo.CONTRACT_TP}</td>
                <td>{detailAllInfo.CONTRACT_ROOM}</td>
                <td>{detailAllInfo.CONTRACT_TERM}개월 ({detailAllInfo.START_DATE} ~ {detailAllInfo.END_DATE})</td>
                <td>{detailAllInfo.MEMBER_ST}</td>
                <td>{detailAllInfo.PAY_DATE}일</td>
                <td>{detailAllInfo.PAYED_PLAN_MONEY}</td>
                <td>{detailAllInfo.CONTRACT_LOCKER}</td>
                <td>{detailAllInfo.END_FLAG}</td>
            </tr>
        )
    });

    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = s010100050R.slice(indexOfFirstPost, indexOfLastPost);
    //Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);


    return (

        <form style={{
            display: 'flex',
            flexDirection: 'column14',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
        }}
            onSubmit={onSubmitDetailHandler}
        >
            <div className="memberInfoWrapper">
                <div className="memberInfoWrap">
                    {/* 회원정보란 */}
                    <h2 id="infoTitle">회원정보</h2>

                    <table id = "memberDetailTable">
                        <tr>
                            <th>회원명</th>
                            <td><input type="text" value={detailMemberNm} id="detailMemberNm" name="detailMemberNm"
                                size="5"
                                onChange={onDetailMemberNmHandler} /></td>
                            <th>사업자번호</th>
                            <td><input type="text" value={detailFstRegNo} id="detailRegNo" name="detailRegNo" size="3"
                                onChange={onDetailFstRegNoHandler} /> -&nbsp;
                                <input type="text" value={detailSndRegNo} id="detailRegNo" name="detailRegNo" size="3"
                                    onChange={onDetailSndRegNoHandler} /> -&nbsp;
                                <input type="text" value={detailThdRegNo} id="detailRegNo" name="detailRegNo" size="3"
                                    onChange={onDetailThdRegNoHandler} />
                            </td>
                            <th>회원구분</th>
                            <td>
                                <select onChange={onDetailMemberTpHandler} value={detailMemberTp}>
                                    {memberTpDetail.map(item => (
                                        <option key={item.key} value={item.key}>{item.value}</option>
                                    ))}
                                </select>
                            </td>
                            <th>퇴실일자</th>
                            <td> 
                                <input type = "text" value = {endDateTest} size = "6"></input>
                            </td>

                        </tr>

                        <tr>
                            <th rowSpan="2">대표자</th>

                            <th>성명</th>
                            <td>
                                <input type="text" value={detailName} id="detailName" name="detailName" size="5"
                                    onChange={onDetailNameHandler} /></td>

                            <th>연락처</th>
                            <td colSpan="2">
                                <input type="text" value={detailFstEmpHp} id="detailEmpHp" name="detailEmpHp" size="3"
                                    onChange={onDetailFstEmpHpHandler} /> -&nbsp;
                                <input type="text" value={detailSndEmpHp} id="detailEmpHp" name="detailEmpHp" size="3"
                                    onChange={onDetailSndEmpHpHandler} /> -&nbsp;
                                <input type="text" value={detailThdEmpHp} id="detailEmpHp" name="detailEmpHp" size="3"
                                    onChange={onDetailThdEmpHpHandler} />
                            </td>
                            <th>E-mail</th>
                            <td>
                                <input type="text" value={detailEmpEmail} id="detailEmpEmail" name="detailEmpEmail"
                                    size="10"
                                    onChange={onDetailEmpEmailHandler} /> @&nbsp;
                                <input type="text" value={detailDomain} id="detailEmpEmail" name="detailEmpEmail"
                                    size="10"
                                    onChange={onDetailDomainHandler} />
                            </td>

                        </tr>
                        <th>주소</th>
                        <td colSpan="6">
                            <input type="text" value={detailZipcode} id="detailAddress" name="detailAddress" size="7"
                                onChange={onDetailZipcodeHandler} />&nbsp;
                            <input type="text" value={detailAddress} id="detailAddress" name="detailAddress" size="40"
                                onChange={onDetailAddressHandler} />
                            <input type="text" value={detailDetailAddress} id="detailAddress" name="detailAddress"
                                size="80"
                                onChange={onDetailDetailAddressHandler} />
                        </td>
                        <tr>
                            <th rowSpan="2">첨부파일</th>
                            <td colSpan="7"><a href = '#' onClick={onIdDownloadHandler}>대표자신분증</a></td>
                            {/* onClick={onIdDownloadHandler} */}
                        </tr>
                        <tr>
                            <td colSpan="7"><a href = '#' onClick={onRegDownloadHandler}>사업자등록증</a></td>
                        </tr>

                    </table>

                    <h6 id="conInfoTitle">계약정보</h6>
                    <table id = "conInfoDetialTable">
                        <tr>
                            <th>계약ID</th>
                            <th>계약일자</th>
                            <th>계약상품</th>
                            <th>호실</th>
                            <th>계약기간</th>
                            <th>계약상태</th>
                            <th>매월입금일</th>
                            <th>월회비</th>
                            <th>사물함</th>
                            <th>종료여부</th>
                        </tr>
                        <tbody>
                        {currentPosts}
                        </tbody>
                    </table>
                    <Pagination postsPerPage={postsPerPage} totalPosts={s010100050R.length} paginate={paginate} />

                    <div id="btnAlign">
                        <input type="button" id="btn-centerN" onClick={onNewOpenContractHandler} value="신규계약" />
                    </div>

                    {/*계약ID클릭*/}
                    <Dialog
                        maxWidth={"lg"}
                        //fullWidth = {true}
                        open={conOpen}
                        onClose={onConContractHandler}>
                        <S010100010 dataNum={rNum} cDataForm={'I'} />
                        <DialogActions>
                            <input type="button" onClick={onConContractHandler} color="primary" value="닫기" />
                        </DialogActions>
                    </Dialog>

                    {/*신규계약 멤버ID클릭*/}
                    <Dialog
                        maxWidth={"lg"}
                        //fullWidth = {true}
                        open={newOpen}
                        onClose={onNewContractHandler}>
                        <S010100010 dataMem={detailMemberId} newDataForm={'N'} />
                        <DialogActions>
                            <input type="button" onClick={onNewContractHandler} color="primary" value="닫기" />
                        </DialogActions>
                    </Dialog>

                </div>
            </div>
        </form>

    );

}

export default S010100050;