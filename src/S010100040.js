import React, { Fragment, useState, useEffect } from 'react';
import Navbar from './Navbar';
import S010100010 from './S010100010';
import S010100050 from './S010100050';
import './css/S010100040.css';
import axios from "axios";
import Pagination from "./utils/Pagination";

//엑셀다운로드
import xlsx from 'xlsx';

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






let memberName = '';
let memberEmpHp = '';
let memberIdM = '';

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

    //select박스
    const [memberStatus,setMemberStatus] = useState([{}]);
    const [memberType,setMemberType] = useState([{}]);

    //<!--모달창 속성 및 이벤트
    const [open, setOpen] = React.useState(false);
    const [storeOpen, setStoreOpen] = React.useState(false);

    //페이징
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const indexOfLastPost = currentPage * postsPerPage;

    const [memberIdModal,setMemberIdModal] = useState(0);

    //select박스
    useEffect(() => {

        axios.get('/api/s010100140/selectMemberTp')
            .then(response => {
                if (response.data.success) {
                    //console.log('ask_tp',response.data.rows);
                    let arr = [{ key: '전체', value: '전체' }]

                    response.data.rows.map((data) =>
                        arr.push({
                            value: data.CD_V_MEANING,
                            key: data.CD_V

                        }));

                        setMemberType(arr);

                } else {
                    alert("회원상태 데이터를 불러오는데 실패하였습니다.");
                }
            })
    }, [])

    const endStatus = [ { key: '전체', value: '전체'  },
                        { key: 'Y', value: 'Y' },
                        { key: 'N', value: 'N' } ]

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

                        setMemberStatus(arr);

                } else {
                    alert("회원상태 데이터를 불러오는데 실패하였습니다.");
                }
            })
    }, [])

    //조회
    const memberList = () => {
        const body = {
            memberNm,
            regNo,
            name,
            memberTp,
            contractStatus,
            memberSt
        }
        
        axios.post('/api/s010100040/searchMember', body)
            .then(response => {
                if (response.data.success) {
                    //console.log('tb_member',response.data.rows);
                    setTbMember(response.data.rows);
                } else {
                    alert("데이터 목록을 가져오는 것을 실패하였습니다.")
                }
            })
    }

    useEffect(() => {    
        memberList();
    }, [])

    const onSearchSubmitHandler = (event) => {
        memberList();
    }


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
        memberEmpHp = event.target.id;
        memberName = event.target.innerHTML;
        memberIdM = event.target.className;

        setEmpHpForDetailModal(memberEmpHp);
        setNumForDetailModal(memberName);
        setMemberIdModal(memberIdM);
        setOpen(true);
    }

    const onHandleDetailClickClose = () => {
        memberList();
        setOpen(false);
    }

    const onSNSHandler = (event) => {

    }

    const onEmailHandler = (event) => {

    }

    //엑셀다운로드
    const excelHandler = (event) => {

        event.preventDefault();

        const ws = xlsx.utils.json_to_sheet(tbMember);
        //console.log(tbMember);

        ['NO','사업자번호','회원명','회원구분','상태','대표자 성명','대표자 연락처','대표자 E-mail','종료여부']
        .forEach((x,idx) => {
            const cellAdd = xlsx.utils.encode_cell({c:idx,r:0});
            ws[cellAdd].v = x;
        })

        ws['!cols'] = [];
        ws['!cols'][0] = {hidden:true};

        const wb = xlsx.utils.book_new();

        xlsx.utils.book_append_sheet(wb,ws,"Sheet1");
        xlsx.writeFile(wb,"회원현황.xlsx");
    }

    const s010100040R = tbMember.map((tbMember, index) => {
        return (
            <tr className='dataTable'>
                <td name="uname" variant="outlined" color="primary"
                    id={tbMember.MEMBER_ID}> {index + 1}</td>
                <td >{tbMember.MEMBER_NM}</td>
                <td id={tbMember.REG_NO}>{tbMember.REG_NO}</td>
                <td onClick={onHandleDetailClickOpen} className={tbMember.MEMBER_ID} id={tbMember.EMP_HP}>{tbMember.NAME}</td>
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
                }} 
            onSubmit={onSearchSubmitHandler}>

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
                        {memberType.map(item => (
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

                        {memberStatus.map(item => (
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
                    <S010100050 dataMemId = {memberIdModal} dataName={numForDetailModal} dataForm={"U"} dataEmpHp={empHpForDetailModal} />
                    <DialogActions>
                        <input type="button" id="contractBtn" onClick={onHandleDetailClickClose} color="primary" value='닫기' />
                    </DialogActions>
                </Dialog>


                <table className="btn">
                    <thead>
                        <tr>
                            <td colSpan="5">
                                <input type="button" onClick={onHandleClickOpen} value="신규회원"></input>
                                <input type="button" onClick={onSNSHandler} value="SNS" />
                                <input type="button" onClick={onEmailHandler} value="메일전송" />
                            </td>
                            <td id="alignRight">
                                <input type="button" onClick = {excelHandler} value="엑셀다운로드"></input>
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
                <S010100010/>
                <DialogActions>
                    <input type="button" onClick={onHandleClickClose} color="primary" value="닫기"/>
                </DialogActions>
            </Dialog>

        </Fragment>
    );

}

export default S010100040;