import React, {useState, useEffect, Fragment} from 'react';
import axios from 'axios';
import './css/S010100050.css';
import S010100010 from './S010100010';

//<!--모달창 라이브러리
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
//모달창 라이브러리 끝-->

let num = '';
let rNum = 0;


function S010100050(props) {

    const [detailAllInfo, setDetailAllInfo] = useState([])
    const [open, setOpen] = React.useState(false);
    const [numForDetailCModal, setNumForDetailCModal] = useState('')

    //회원정보
    const [detailMemberNm, setDetailMemberNm] = useState("")
    const [detailRegNo, setDetailRegNo] = useState("")
    const [detailMemberTp, setDetailMemberTp] = useState([])
    const [detailCheckoutDate, setDetailCheckoutDate] = useState("")
    const [detailName, setDetailName] = useState("")
    const [detailEmpHp, setDetailEmpHp] = useState("")
    const [detailEmpEmail, setDetailEmpEmail] = useState("")
    const [detailAddress, setDetailAddress] = useState("")

    // const [detailContractId, setDetailContractId] = useState("")
    // const [detailContractDa
    // te, setDetailContractDate] = useState("")
    // const [detailContractTp, setDetailContractTp] = useState("")
    // const [detailContractTerm, setDetailContractTerm] = useState("")
    // const [detailMemberSt, setDetailMemberSt] = useState("")
    // const [detailPayDate, setDetailPayDate] = useState("")
    // const [detailContractMoney, setDetailContractMoney] = useState("")
    // const [detailContractEndFlag, setDetailContractEndFlag] = useState("")


    const dataName = props.dataName;
    //console.log('dataNum',dataNum);

    const [conOpen, setConOpen] = React.useState(false);

    useEffect(() => {
        axios.post(`/api/s010100050/detailMember_by_id?id=${dataName}&type=single`)
            .then(response => {
                if (response.data.success) {
                    console.log('detailMembr', response.data);

                    const modalMemberNm = response.data.rows[0].MEMBER_NM;
                    const modalRegNo = response.data.rows[0].REG_NO;
                    const modalMemberTp = response.data.rows[0].MEMBER_TP;
                    const modalName = response.data.rows[0].NAME;
                    const modalEmpHp = response.data.rows[0].EMP_HP;
                    const modalEmpemail = response.data.rows[0].EMP_EMAIL;
                    const modalAddress = response.data.rows[0].ADDRESS;
                    //console.log(modalAddress);
                    setDetailAllInfo(response.data.rows);

                    setDetailMemberNm(modalMemberNm);
                    setDetailRegNo(modalRegNo);
                    setDetailMemberTp(modalMemberTp);
                    setDetailName(modalName);
                    setDetailEmpHp(modalEmpHp);
                    setDetailEmpEmail(modalEmpemail);
                    setDetailAddress(modalAddress);

                } else {
                    alert("상세정보 데이터를 불러오는데 실패하였습니다.");
                }
            })
    }, [])


    const onDetailMemberNmHandler = (event) => {
        setDetailMemberNm(event.currentTarget.value);
    }

    const onDetailRegNoHandler = (event) => {
        setDetailRegNo(event.currentTarget.value);
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

    const onDetailEmpHpHandler = (event) => {
        setDetailEmpHp(event.currentTarget.value);
    }

    const onDetailEmpEmailHandler = (event) => {
        setDetailEmpEmail(event.currentTarget.value);
    }

    const onDetailAddressHandler = (event) => {
        setDetailAddress(event.currentTarget.value);
    }


    const onSubmitDetailHandler = (event) => {

    }


    const onDetailClickOpen = (event) => {
        num = event.target.innerHTML;
        rNum = parseInt(num);
        setNumForDetailCModal(rNum);
        console.log(rNum);
        setOpen(true);
    }

    const onDetailClickClose = (event) => {
        setOpen(false);
    }

    const onConContractHandler = (event) => {
        setConOpen(false);
    }

    const onContractHandler = (event) => {

        setConOpen(true);
    }

    const s010100050 = detailAllInfo.map((detailAllInfo, index) => {
        return (
            <tr>
                <td onClick={onDetailClickOpen} id={detailAllInfo.CONTRACT_ID}>{detailAllInfo.CONTRACT_ID}</td>
                <td>{detailAllInfo.CONTRACT_DATE}</td>
                <td>{detailAllInfo.CONTRACT_TP}</td>
                <td>{detailAllInfo.CONTRACT_TP}</td>
                <td>{detailAllInfo.CONTRACT_TERM}</td>
                <td>{detailAllInfo.MEMBER_ST}</td>
                <td>{detailAllInfo.PAY_DATE}</td>
                <td>{detailAllInfo.CONTRACT_MONEY}</td>
                <td>{detailAllInfo.CONTRACT_TP}</td>
                <td>{detailAllInfo.END_FLAG}</td>
            </tr>
        )
    });


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
                    <h2 id = "infoTitle">회원정보</h2>

                    <table>
                        <tr>
                            <th>회원명</th>
                            <td><input type="text" value={detailMemberNm} id="detailMemberNm" name="detailMemberNm"
                                       size="5"
                                       onChange={onDetailMemberNmHandler} disabled={props.dataForm === 'U'}/></td>
                            <th>사업자번호</th>
                            <td><input type="text" value={detailRegNo} id="detailRegNo" name="detailRegNo" size="5"
                                       onChange={onDetailRegNoHandler} disabled={props.dataForm === 'U'}/></td>
                            <th>회원구분</th>
                            <td><input type="text" value={detailMemberTp} id="detailMemberTp" name="detailMemberTp"
                                       size="5"
                                       onChange={onDetailMemberTpHandler} disabled={props.dataForm === 'U'}/></td>
                            <th>퇴실일자</th>
                            <td><input type="text" value={detailCheckoutDate} id="detailCheckoutDate"
                                       name="detailCheckoutDate" size="5"
                                       onChange={onDetailCheckoutDateHandler} disabled={props.dataForm === 'U'}/></td>

                        </tr>

                        <tr>
                            <th rowSpan="2">대표자</th>

                            <th>성명</th>
                            <td>
                                <input type="text" value={detailName} id="detailName" name="detailName" size="5"
                                       onChange={onDetailNameHandler} disabled={props.dataForm === 'U'}/></td>

                            <th>연락처</th>
                            <td colSpan="2">
                                <input type="text" value={detailEmpHp} id="detailEmpHp" name="detailEmpHp" size="3"
                                       onChange={onDetailEmpHpHandler} disabled={props.dataForm === 'U'}/>
                            </td>
                            <th>E-mail</th>
                            <td>
                                <input type="text" value={detailEmpEmail} id="detailEmpEmail" name="detailEmpEmail"
                                       size="3"
                                       onChange={onDetailEmpEmailHandler} disabled={props.dataForm === 'U'}/>
                            </td>

                        </tr>
                        <th>주소</th>
                        <td colSpan="6">
                            <input type="text" value={detailAddress} id="detailAddress" name="detailAddress" size="5"
                                   onChange={onDetailAddressHandler} disabled={props.dataForm === 'U'}/>
                        </td>
                        <tr>
                            <th rowSpan="2">첨부파일</th>
                            <td colSpan="7">대표자신분증</td>
                        </tr>
                        <tr>
                            <td colSpan="7">사업자등록증</td>
                        </tr>

                    </table>

                    <h6 id = "conInfoTitle">계약정보</h6>
                    <table>
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
                        {s010100050}
                    </table>
                    <Dialog
                        maxWidth={"lg"}
                        //fullWidth = {true}
                        open={conOpen}
                        onClose={onConContractHandler}>
                        <S010100010 dataNum={numForDetailCModal} cDataForm={"I"}/>
                        <DialogActions>
                            <input type = "button" onClick={onConContractHandler} color="primary" value="닫기" />
                        </DialogActions>
                    </Dialog>

                    <div>
                        <input type = "button" id="btn-center" onClick={onContractHandler} value = "신규계약" />
                    </div>
                </div>
            </div>
        </form>

    );

}

export default S010100050;