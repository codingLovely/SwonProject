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

import Pagination from './utils/Pagination';

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


let sequenceChk = [];

function S010100070(props) {
    //const classes = useStyles();
    // const [open, setOpen] = React.useState(true);
    // const [mOpen, setMOpen] = React.useState(false);
    // const [storeOpen, setStoreOpen] = React.useState(false);

    // const handleDrawerOpen = () => {
    //     setOpen(true);
    // };

    // const handleDrawerClose = () => {
    //     setOpen(false);
    // };

    const [paymentMemberNm, setPaymentMemberNm] = useState('');
    const [paymentPeriod, setPaymentPeriod] = useState('');
    const [paymentCeoNm, setPaymentCeoNm] = useState('');
    const [paymentEmpHp, setPaymentEmpHp] = useState('');
    const [paymentEmpEmail, setPaymentEmpEmail] = useState('');
    const [paymentEmpComment, setPaymentEmpComment] = useState('');
    const [paymentStatusList, setPaymentStatusList] = useState([]);
    const [payMethod, setPayMethod] = useState('');
    // 페이징
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(12);
    const indexOfLastPost = currentPage * postsPerPage;

    const [checked, setChecked] = useState([]);

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
        axios.get(`/api/payStList/insert/tb_s10_contract020_by_id?id=${dataContracId}`)
            .then(response => {
                if (response.data.success) {
                    //초기값 세팅
                    response.data.rows.map((row) => {
                        if (row.PAYED_DATE === null || row.PAYED_DATE === undefined) row.PAYED_DATE = makeYYMMDD(new Date());
                        if (row.CONTRACT_COMMENT === null || row.CONTRACT_COMMENT === undefined) row.CONTRACT_COMMENT = '';
                        console.log('row', row);
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
                    setPayMethod(response.data.rows[0].PAY_METHOD_M);

                } else {
                    alert("데이터 조회를 실패하였습니다.")
                }

            })
    }

    useEffect(() => {
        paymentStList();
    }, [])

    let newChecked;


    const toggleHandler = (event) => {

        const currentIndex = checked.indexOf(event.target.id);
        // const currentIndex = checked.findIndex((items,idx) => 
        // {return items.PAY_PLAN_DATE !== event.target.id});
        //전체 Checked된 State에서 현재 누를 Checkbox가 있는지 확인
        // console.log('event.target.id[0]',event.target.id);
        // console.log('event.target.className',event.target.className[0]);
        newChecked = checked;

        if (currentIndex === -1) {
            newChecked.push(event.target.id)
        } else {
            newChecked.splice(currentIndex, 1)
        }
        setChecked(newChecked);

        sequenceChk.push('2');
      

        // console.log('newChecked', newChecked);
    }

    const snsBtnHandler = (event) => {

    }
    const emailBtnHandler = (event) => {

    }
 
    const excelBtnHandler = (event) => {
        event.preventDefault();

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
        //console.log('year',year);
        let month = value.getMonth() + 1;
        let date = value.getDate();
        month = month < 10 ? '0' + month : month;
        date = date < 10 ? '0' + date : date;
        return year + '.' + month + '.' + date;
    }


    const s010100070R = paymentStatusList.map((paymentStatus, index) => {
        let insertPayDate = paymentStatus.PAYED_DATE
            ? new Date('20' + paymentStatus.PAYED_DATE)
            : new Date();

        return (
            <TableRow key={index}>
                <TableCell>
                    <input type="checkbox" onChange={toggleHandler} id={paymentStatus.PAY_PLAN_DATE + ',' + paymentStatus.PAYED_DATE + ',' + paymentStatus.CONTRACT_COMMENT} />
                </TableCell>
                <TableCell id={paymentStatus.CONTRACT_ID}>{paymentStatus.CONTRACT_ID}</TableCell>
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

                                    // sequenceChk.push('1');
                            }
                        }
                        selectsStart
                        startDate={insertPayDate}
                        dateFormat="yyyy.MM.dd (eee)"
                    />
                </TableCell>
                <TableCell>
                    <Form.Control as="textarea" cols="20" rows="2"
                        value={paymentStatus.CONTRACT_COMMENT}
                        size="5"
                        id={paymentStatus.PAY_PLAN_DATE}
                        onChange={(e) => {
                            setPaymentStatusList(
                                paymentStatusList.map((changePaymentStatus, chIndex) =>
                                    chIndex === index ?
                                        { ...changePaymentStatus, CONTRACT_COMMENT: e.target.value }
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
        // console.log(checked);
        // console.log('modalContractId', modalContractId);

        let body = {
            modalContractId: modalContractId,
            modalPayPlanDate: modalPayPlanDate,
            payMethodM: payMethodM,
            newChecked: newChecked
        }
        console.log('newChecked', body);

        axios.post('/api/payStList/paymentUpdate', body)
            .then(response => {
                if (response.data.success) {
                    alert('납부처리되었습니다.');
                    paymentStList();
                } else {
                    alert('납부처리를 실패하였습니다.');
                }
            })
        // paymentStList();
        newChecked = [];
    
    

    }

    const cancelConfirm = () => alert('납부처리를 취소하였습니다.');

    const payBtnHandler = useConfirm(
        paymentMemberNm+'('+ paymentCeoNm+')님의 계약건을 납부처리 하시겠습니까?',
        approvalConfirm,
        cancelConfirm
    );

    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = s010100070R.slice(indexOfFirstPost, indexOfLastPost);
    const paginate = pageNumber => setCurrentPage(pageNumber);

    const [payMethodM, setPayMethodM] = useState('');

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
                                        type="text" value={payMethod} id="payMethod" name="payMethod"
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
                                        <TableCell>납부예정일</TableCell>
                                        <TableCell>납부여부</TableCell>
                                        <TableCell>납부일자</TableCell>
                                        <TableCell>비     고</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentPosts}
                                </TableBody>
                            </Table>
                            
                        </React.Fragment>
                        <div className="pageCenter">
                            <Pagination postsPerPage={postsPerPage} totalPosts={s010100070R.length} paginate={paginate} />
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