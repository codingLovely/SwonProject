import React, { Fragment, useState, useEffect } from 'react';
import Navbar from './Navbar';
import S010100010 from './S010100010';
import S010100050 from './S010100050';
import './css/S010100040.css';
import axios from "axios";
import Pagination from "./utils/Pagination";


//<!--모달창 라이브러리
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import Button from '@material-ui/core/Button';
//모달창 라이브러리 끝-->

//<!--켈린더 라이브러리시작
import DatePicker, { registerLocale } from "react-datepicker";
import ko from 'date-fns/locale/ko';
registerLocale("ko", ko);
//켈린더 라이브러리 끝-->ghy


let valueArr = [[]];
let queryArr = [['MEMBER_TP', '']];
let contractsStatus = [];
let endStatus = [{ key: '전체', value: '전체' },
{ key: 'Y', value: 'Y' },
{ key: 'N', value: 'N' }]

let memberName = '';
let memberEmpHp = '';
let rNum = 0;

function S010100040(props) {

    const [memberNm, setMemberNm] = useState('')
    const [regNo, setRegNo] = useState('')
    const [memberTp, setMemberTp] = useState('')
    const [contractStatus, setContractStatus] = useState('')
    const [memberSt, setMemberSt] = useState('')
    const [name, setName] = useState('')
    const [numForDetailModal, setNumForDetailModal] = useState('')
    const [empHpForDetailModal, setEmpHpForDetailModal] = useState('')
    const [tbMember, setTbMember] = useState([])

    //<!--모달창 속성 및 이벤트
    const [open, setOpen] = React.useState(false);
    const [storeOpen, setStoreOpen] = React.useState(false);

    //페이징
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const indexOfLastPost = currentPage * postsPerPage;


    const memberList = () => {
        axios.post('/api/s010100040/list')
            .then(response => {
                if (response.data.success) {
                    //console.log('tb_member',response.data.rows);
                    setTbMember(response.data.rows);
                } else {
                    alert("데이터 조회를 실패하였습니다.")
                }

            })
    }

    useEffect(() => {
        memberList();
    }, [])


    useEffect(() => {
        for (let i = 0; i < queryArr.length; i++) {

            let firstVal = queryArr[i][0];
            let secondVal = queryArr[i][1];
            axios.post('/api/s010100140/selectTest', { firstVal: firstVal, secondVal: secondVal })
                .then(response => {
                    if (response.data.success) {
                        //console.log('ask_tp',response.data.rows);
                        let arr = [{ key: '전체', value: '전체' }]

                        response.data.rows.map((data) =>
                            arr.push({
                                value: data.CD_V_MEANING,
                                key: data.CD_V

                            }));

                        valueArr[i] = arr;
                        //console.log(valueArr[2]);
                    } else {
                        alert("문의구분 데이터를 불러오는데 실패하였습니다.");
                    }
                })

        }
    }, [])

    useEffect(() => {

        axios.get('/api/s010100140/selectMemberSt')
            .then(response => {
                if (response.data.success) {
                    //console.log('ask_tp',response.data.rows);
                    let arr = [{ key: '전체', value: '전체' }]

                    response.data.rows.map((data) =>
                        arr.push({
                            value: data.CD_V_MEANING,
                            key: data.CD_V

                        }));

                    contractsStatus = arr;

                } else {
                    alert("회원상테 데이터를 불러오는데 실패하였습니다.");
                }
            })


    }, [])

    //<!--onSubmit
    const onSearchSubmitHandler = (event) => {

        const body = {
            memberNm,
            regNo,
            name,
            memberTp,
            contractStatus,
            memberSt
        }

        const memberList = () => {
            axios.post('/api/s010100040/searchMember', body)
                .then(response => {
                    if (response.data.success) {
                        //console.log('tb_member',response.data.rows);
                        setTbMember(response.data.rows);
                    } else {
                        alert("검색에 실패하였습니다.")
                    }

                })
        }

        memberList(body);

    }
    //onSubmit끝-->

    const onHandleClickOpen = () => {
        setStoreOpen(true);

    };

    const onHandleClickClose = () => {
        setStoreOpen(false);
        memberList();
    }

    const memberStHandler = (event) => {
        setMemberSt(event.currentTarget.value);
    }

    const nameHandler = (event) => {
        setName(event.currentTarget.value);
    }


    const memberNmHandler = (event) => {
        setMemberNm(event.currentTarget.value);
    }

    const regNoHandler = (event) => {
        setRegNo(event.currentTarget.value);
    }

    const memberTpHandler = (event) => {
        setMemberTp(event.currentTarget.value);
    }

    const contractStatusHandler = (event) => {
        setContractStatus(event.currentTarget.value);
    }

    const onHandleDetailClickOpen = (event) => {
        //console.log(event.target.id);
        memberEmpHp = event.target.id;
        memberName = event.target.innerHTML;
        setEmpHpForDetailModal(memberEmpHp);
        setNumForDetailModal(memberName);
        setOpen(true);
        //console.log('memberName',memberName);
    }

    const onHandleDetailClickClose = () => {
        memberList();
        setOpen(false);
    }

    const onModifyHandler = (event) => {

    }

    const onApprovalHandler = (event) => {

    }


    const s010100040R = tbMember.map((tbMember, index) => {
        return (
            <tr class='dataTable'>
                <td name="uname" variant="outlined" color="primary"
                    id={tbMember.MEMBER_ID}> {index + 1}</td>
                <td >{tbMember.MEMBER_NM}</td>
                <td id={tbMember.REG_NO}>{tbMember.REG_NO}</td>
                <td onClick={onHandleDetailClickOpen} id={tbMember.EMP_HP}>{tbMember.NAME}</td>
                <td >{tbMember.EMP_HP}</td>
                <td >{tbMember.EMP_EMAIL}</td>
                <td >{tbMember.MEMBER_TP}</td>
                <td >{tbMember.MEMBER_ST}</td>
                <td >{tbMember.END_FLAG}</td>
            </tr>
        )
    });

    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = s010100040R.slice(indexOfFirstPost, indexOfLastPost);
    //Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);
    
    return (

        <Fragment>
            <Navbar />

            <form style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
            }} onSubmit={onSearchSubmitHandler}
            >

                <h1>회원현황</h1>
                <div id="search">

                    회원명&nbsp;
                    <input type="text" value={memberNm} id="memberNm" name="memberNm" size="5"
                        onChange={memberNmHandler} />
                    &nbsp;


                    사업자번호 &nbsp;
                    <input type="text" value={regNo} id="regNo" name="regNo" size="10"
                        onChange={regNoHandler} />
                    &nbsp;


                    대표자명 &nbsp;
                    <input type="text" value={name} id="name" name="name" size="5"
                        onChange={nameHandler} />
                    &nbsp;

                    회원구분 &nbsp;
                    <select multiple={false} onChange={memberTpHandler} value={memberTp}>

                        {valueArr[0].map(item => (
                            <option key={item.key} value={item.key}>{item.value}</option>
                        ))}
                    </select>
                    &nbsp;
                    종료 &nbsp;
                    <select multiple={false} onChange={contractStatusHandler} value={contractStatus}>
                        {endStatus.map(item => (
                            <option key={item.key} value={item.key}>{item.value}</option>
                        ))}
                    </select>

                    &nbsp;
                    상태 &nbsp;
                    <select multiple={false} onChange={memberStHandler} value={memberSt}>

                        {contractsStatus.map(item => (
                            <option key={item.key} value={item.key}>{item.value}</option>
                        ))}
                    </select>

                    &nbsp;&nbsp;&nbsp;&nbsp;

                    <input type="button" onClick={onSearchSubmitHandler} value="조회"></input>
                </div>

                <Dialog
                    maxWidth={"lg"}
                    open={open}
                    onClose={onHandleDetailClickClose}>
                    <S010100050 dataName={numForDetailModal} dataForm={"U"} dataEmpHp={empHpForDetailModal} />
                    <DialogActions>
                        {/* <Button onClick={onhandleStoreClose} color="primary" autoFocus>
                                저장
                            </Button> */}
                        <input type="button" id="contractBtn" onClick={onHandleDetailClickClose} color="primary"
                            value='닫기' />
                    </DialogActions>
                </Dialog>


                <table className="btn">
                    <thead>
                        <tr>
                            <td colSpan="5">
                                <input type="button" onClick={onHandleClickOpen} value="신규회원"></input>
                                <input type="button" onClick={onModifyHandler} value="SNS" />
                                <input type="button" onClick={onApprovalHandler} value="메일전송" />
                            </td>
                            <td id="alignRight">
                                <input type="button" value="엑셀다운로드"></input>
                            </td>
                        </tr>
                    </thead>
                </table>

                <table id="list">
                    <thead>
                        <tr>
                            <th rowSpan="2">No</th>
                            <th rowSpan="2">회원명</th>
                            <th rowSpan="2">사업자번호</th>
                            <th colSpan="3">대표자</th>
                            <th rowSpan="2">회원구분</th>
                            <th rowSpan="2">상태</th>
                            <th rowSpan="2">종료여부</th>
                        </tr>

                        <tr>
                            <th>성명</th>
                            <th>연락처</th>
                            <th>E-mail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts}
                    </tbody>
                </table>
                <Pagination postsPerPage={postsPerPage} totalPosts={s010100040R.length} paginate={paginate} />
            </form>

            <Dialog
                maxWidth={"lg"}
                open={storeOpen}
                onClose={onHandleClickClose}>
                <S010100010 />
                <DialogActions>
                    <input type="button" onClick={onHandleClickClose} color="primary" value="닫기">
                    </input>
                </DialogActions>
            </Dialog>

        </Fragment>
    );

}

export default S010100040;