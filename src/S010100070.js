import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import './css/S010100070.css';


import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Form from 'react-bootstrap/Form';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import ReactPaginate from 'react-paginate';

import xlsx from 'xlsx';

import DatePicker, { registerLocale } from 'react-datepicker';
import ko from 'date-fns/locale/ko';

registerLocale("ko", ko);

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 200,
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: '25ch',
        },
    },

    toolbar: {
        paddingRight: 24, 
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },

 
}));




function S010100070(props) {

    const [paymentMemberNm, setPaymentMemberNm] = useState('');
    const [paymentPeriod, setPaymentPeriod] = useState('');
    const [paymentCeoNm, setPaymentCeoNm] = useState('');
    const [paymentEmpHp, setPaymentEmpHp] = useState('');
    const [paymentEmpEmail, setPaymentEmpEmail] = useState('');
    const [paymentEmpComment, setPaymentEmpComment] = useState('');
    const [paymentStatusList, setPaymentStatusList] = useState([]);
    const [payMethod, setPayMethod] = useState('');
    const [payPlanMoney, setPayPlanMoney] = useState('');

    // 페이징
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(12);
    const indexOfLastPost = currentPage * postsPerPage;

    const [checked, setChecked] = useState([]);
    const [sequenceChk, setSequenceChk] = useState('');
    const [checkStatusChk, setCheckStatusChk] = useState('');
    
    const [payMethodM, setPayMethodM] = useState('');

    const [pageNumber,setPageNumber] = useState(0);
    const usersPerPage = 12;
    const pagesVisited = pageNumber * usersPerPage;
    const pageCount = Math.ceil(paymentStatusList/usersPerPage);

    const classes = useStyles();
        
    const changePage = ({selected}) => {
        setPageNumber(selected);
    }

    const paymentMemberNmHandler = (event) => {
        setPaymentMemberNm(event.currentTarget.value);
    }

    const paymentPeriodHandler = (event) => {
        setPaymentPeriod(event.currentTarget.value);
    }

    const paymentCeoNmHandler = (event) => {
        setPaymentCeoNm(event.currentTarget.value);
    }

    const paymentEmpHpHandler = (event) => {
        setPaymentEmpHp(event.currentTarget.value);
    }

    const paymentEmpEmailHandler = (event) => {
        setPaymentEmpEmail(event.currentTarget.value);
    }

    const paymentEmpCommentHandler = (event) => {
        setPaymentEmpComment(event.currentTarget.value);
    }

    const payMethodHandler = (event) => {
        setPayMethod(event.currentTarget.value);
    }

    const paymentStList = () => {
        axios.get(`/api/s010100070/insert/tb_s10_contract020_by_id?id=${dataContracId}`)
            .then(response => {
                if (response.data.success) {
                    // 초기값 세팅
                    response.data.rows.map((row) => {
                        if (row.PAYED_DATE === null || row.PAYED_DATE === undefined) row.PAYED_DATE = makeYYMMDD(new Date());
                        if (row.COMMENT === null || row.COMMENT === undefined) row.COMMENT = '';
                    })

                    setPaymentStatusList(response.data.rows);
                    setPaymentMemberNm(response.data.rows[0].MEMBER_NM);
                    setPaymentPeriod(response.data.rows[0].CONTRACT_TERM + '개월 ' +
                        '(' + response.data.rows[0].START_DATE + ' ~ ' + response.data.rows[0].END_DATE + ')');
                    setPaymentCeoNm(response.data.rows[0].NAME);
                    setPaymentEmpHp(response.data.rows[0].EMP_HP);
                    setPaymentEmpEmail(response.data.rows[0].EMP_EMAIL);
                    setPaymentEmpComment(response.data.rows[0].COMMENT);
                    setPayMethodM(response.data.rows[0].PAY_METHOD);
                    // if(response.data.rows[0].PAY_METHOD_M === null){
                    //     setPayMethod('가계약');
                    // }else{
                        setPayMethod(response.data.rows[0].PAY_METHOD_M);
                    // }

                } else {
                    alert(response.data.message);
                    alert("데이터 조회를 실패하였습니다.")
                }

            })
    }

    useEffect(() => {
        paymentStList();
    }, [])

    let newChecked;
   
    const toggleHandler = (value) => {
           
            
            const currentIndex = checked.indexOf(value);
            // console.log(checked);
          
            const newChecked = [...checked];
           
            if (currentIndex === -1) {
                newChecked.push(value)
            } else {
                newChecked.splice(currentIndex, 1)
            }
            setChecked(newChecked);
            // console.log('Checked',checked);
            
    }

    const snsBtnHandler = (event) => {

    }
    const emailBtnHandler = (event) => {

    }
 
    const excelBtnHandler = () => {

        const ws = xlsx.utils.json_to_sheet(paymentStatusList);

        ['대표자', '연락처', 'E-mail', '회원명', '계약상태', '계약기간', '계약기간', '납부일자', '특약사항', '계약기간(개월)', '납부예정일', 'contract_id', '납부여부', '비고']
            .forEach((x, idx) => {
                const cellAdd = xlsx.utils.encode_cell({ c: idx, r: 0 });
                ws[cellAdd].v = x;

            })

        ws['!cols'] = [];
        ws['!cols'][11] = { hidden: true };


        const wb = xlsx.utils.book_new();

        xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
        xlsx.writeFile(wb, "고객납부등록.xlsx");
    }


    let dataContracId = props.dataContracId;

    const makeYYMMDD = (value) => {
        let year = (value.getFullYear() + '').substring(2);
        let month = value.getMonth() + 1;
        let date = value.getDate();
        month = month < 10 ? '0' + month : month;
        date = date < 10 ? '0' + date : date;
        return year + '-' + month + '-' + date;
    }
 
  

    const displayUsers = paymentStatusList.slice(pagesVisited,pagesVisited + usersPerPage).map((paymentStatus, index) => {
        let insertPayDate = paymentStatus.PAYED_DATE
            ? new Date('20' + paymentStatus.PAYED_DATE)
            : new Date();

        return (
            <TableRow key={index}>
                <TableCell>
                    <input type="checkbox" checked = {checked.indexOf(paymentStatus.PAY_PLAN_DATE + ',' + paymentStatus.PAYED_DATE + ',' + paymentStatus.COMMENT)=== -1 ? false : true} onChange={()=>toggleHandler(paymentStatus.PAY_PLAN_DATE + ',' + paymentStatus.PAYED_DATE + ',' + paymentStatus.COMMENT)} id={paymentStatus.PAY_PLAN_DATE + ',' + paymentStatus.PAYED_DATE + ',' + paymentStatus.COMMENT} />
                </TableCell>
                <TableCell id={paymentStatus.CONTRACT_ID}>{paymentStatus.CONTRACT_ID}</TableCell>
                <TableCell>{paymentStatus.PAYED_PLAN_MONEY}</TableCell>
                <TableCell>{paymentStatus.PAY_PLAN_DATE}</TableCell>
                <TableCell>{paymentStatus.PAYED_FLAG}</TableCell>
                <TableCell>
                    {/* api보고 바뀐 이벤트 값 들고오는거 찾아서 했어요 */}
                    <DatePicker
                        className ="dateSize"
                        id={paymentStatus.PAY_PLAN_DATE}
                        locale="ko"
                        selected={insertPayDate.setHours(9, 0, 0, 0)}
                        onChange={
                            date => {
                                setPaymentStatusList(
                                    paymentStatusList.map(changePaymentStatus =>
                                        changePaymentStatus.PAY_PLAN_DATE === paymentStatus.PAY_PLAN_DATE ?
                                            { ...changePaymentStatus, PAYED_DATE: makeYYMMDD(date) }
                                            : changePaymentStatus
                                    ))

                                    setSequenceChk('dateChecked');
                            }
                        }
                        selectsStart
                        startDate={insertPayDate}
                        dateFormat="yyyy-MM-dd (eee)"
                    />
                </TableCell>
                <TableCell>
                    <Form.Control as="textarea" cols="20" rows="2"
                        value={paymentStatus.COMMENT}
                        size="5"
                        id={paymentStatus.PAY_PLAN_DATE}
                        onChange={(e) => {
                            setPaymentStatusList(
                                paymentStatusList.map((changePaymentStatus, chIndex) =>
                                    chIndex === index ?
                                        { ...changePaymentStatus, COMMENT: e.target.value }
                                        : changePaymentStatus
                                ))
                        }
                        }
                    />
                </TableCell>
            </TableRow>
        )
    });

    const payCancelBtnHandler = (event) => {
        let modalContractId = props.dataContracId;
        let modalPayPlanDate = checked;

        if(checked.length > 0){
            let body = {
                modalContractId: modalContractId,
                modalPayPlanDate: modalPayPlanDate,
                payMethodM: payMethodM,
                newChecked: newChecked,
                checked: checked
            }
    
            axios.post('/api/s010100070/paymentCancel', body)
                .then(response => {
                    if (response.data.success) {
                        alert('취소처리되었습니다.');
                        setChecked('');
                        paymentStList();
                        props.paymentList();
                        props.setStoreOpen(false);
                       
                    } else {
                        alert(response.data.message);
                        alert('취소처리를 실패하였습니다.');
                        props.paymentList();
                        props.setStoreOpen(false);
                      
                    }
                })
        }else if(checked.length === 0){
            alert('선택하세요');
        }
        
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

        let modalContractId = props.dataContracId;
        let modalPayPlanDate = checked;
       
        setSequenceChk('');

        if(checked.length > 0){
        let body = {
            modalContractId: modalContractId,
            modalPayPlanDate: modalPayPlanDate,
            payMethodM: payMethodM,
            newChecked: newChecked,
            checked: checked
        }
        // console.log('newChecked', body);
         

            if(sequenceChk ==''){
                alert('날짜먼저 선택한 후 체크하세요.');
                setChecked('');
            }
            else{
            axios.post('/api/s010100070/paymentUpdate', body)
            .then(response => {
                if (response.data.success) {
                    alert('납부처리 되었습니다.');
                  
                    setChecked('');
                    paymentStList();
                    props.setPayChecked('');
                    props.paymentList();
                    props.setStoreOpen(false);
                    
                } else {
                    alert(response.data.message);
                    alert('납부처리를 실패하였습니다.');
                    props.setPayChecked('');
                    props.paymentList();
                    props.setStoreOpen(false);
                }
            })
        
        }
       
    }else if(checked.length === 0){
        alert('선택하세요');
    }
    

    }

    const cancelConfirm = () => {
        alert('납부처리를 취소하였습니다.');
        props.setPayChecked('');
        props.setStoreOpen(false);
    
    }

    const payBtnHandler = useConfirm(
        paymentMemberNm+'('+ paymentCeoNm+')님의 계약건을 납부처리 하시겠습니까?',
        approvalConfirm,
        cancelConfirm
    );

    return (

        <Fragment>

            <form style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
            }}>

                <div className="memberInfoWrapper">
                    <div className="memberInfoWrap">
                        <h5 id="infoTitle">고객 납부 등록</h5>
                        <table id="memberDetailTable">
                            <tbody>
                            <tr>
                                <th>회원명</th>
                                <td>

                                    <Form.Control style={{ width: 12 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={paymentMemberNm} id="memberNm" name="memberNm"
                                        onChange={paymentMemberNmHandler} />

                                </td>
                                <th>계약기간</th>
                                <td>

                                    <Form.Control style={{ width: 15 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={paymentPeriod} id="paymentPeriod" name="paymentPeriod"
                                        onChange={paymentPeriodHandler} />

                                </td>
                                <th>납부방법</th>
                                <td >
                                    <Form.Control style={{ width: 5 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={payMethod|| ''} id="payMethod" name="payMethod"
                                        onChange={payMethodHandler} />
                                </td>
                            </tr>
                            <tr>
                                <th> 대표자</th>
                                <td>

                                    <Form.Control style={{ width: 7 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={paymentCeoNm} id="name" name="name"
                                        onChange={paymentCeoNmHandler} />

                                </td>
                                <th>연락처</th>
                                <td>
                                    
                                    <Form.Control style={{ width: 10 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={paymentEmpHp} id="ceoHp" name="ceoHp"
                                        onChange={paymentEmpHpHandler} />

                                </td>
                                <th>메일주소</th>
                                <td>

                                    <Form.Control style={{ width: 14 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={paymentEmpEmail} id="eAddr" name="eAddr"
                                        onChange={paymentEmpEmailHandler} />

                                </td>

                            </tr>

                            <tr>
                                <th>특약사항</th>
                                <td colSpan="5">

                                    <Form.Control as="textarea" rows={3} value={paymentEmpComment} id="comment"
                                        name="comment"
                                        onChange={paymentEmpCommentHandler} />
                                  
                                </td>
                            </tr>
                            </tbody>
                        </table>


                        <React.Fragment >
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>선택</TableCell>
                                        <TableCell>No</TableCell>
                                        <TableCell>납부예정금액</TableCell>
                                        <TableCell>납부예정일</TableCell>
                                        <TableCell>납부여부</TableCell>
                                        <TableCell>납부일자</TableCell>
                                        <TableCell>비     고</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                { displayUsers}
                                </TableBody>
                            </Table>
                            
                        </React.Fragment>
                        <div className="pageCenter">
                        <div id = "reactPage">
                                                <ReactPaginate
                                                    previousLabel = {"Previous"}
                                                    nextLabel = {"Next"}
                                                    pageCount = {pageCount}
                                                    onPageChange = {changePage}
                                                    containerClassName={"paginationBtns"}
                                                    previousLinkClassName={"previousBtn"}
                                                    nextLinkClassName={"nextBtn"}
                                                    disabledClassName={"paginationDisabled"}
                                                    activeClassName={"paginationActive"}   
                                                />
                                            </div>
                        </div>
                        <div id="btnAlign">
                            <Button variant="contained" color="primary" style={{ width: 70 }}
                                onClick={payBtnHandler}  >납부</Button>
                            <Button variant="contained" color="primary" style={{ width: 70 }}
                            onClick={payCancelBtnHandler}>취소</Button>
                            <Button variant="contained" color="primary" style={{ width: 110 }} className="new"
                                onClick={snsBtnHandler}  >SNS 전송</Button>
                            <Button variant="contained" color="primary" style={{ width: 100 }} className="memberId"
                                onClick={emailBtnHandler} >메일 전송</Button>
                            <Button variant="contained" color="primary" style={{ width: 130 }} className="contractId"
                                onClick={excelBtnHandler} >엑셀다운로드</Button>
                            <Button variant="contained" color="primary" style={{ width: 110 }} id="btnWidth">계산서발행</Button>
                            <Button variant="contained" color="primary" style={{ width: 70 }} className="contractId"
                                onClick={props.onPayHandleClickClose} >닫기</Button>
                        </div>
                    </div>
                </div>

            </form>
        </Fragment>

    );

}

export default S010100070;