import React, { Fragment, useState, useEffect, useRef } from 'react';
import './css/S010100070.css';
import axios from 'axios';
//엑셀다운로드
import xlsx from 'xlsx';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Form from 'react-bootstrap/Form';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';

import Pagination from './utils/Pagination';

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
        paddingRight: 24, // keep right padding when drawer closed
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
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [mOpen, setMOpen] = React.useState(false);
    const [storeOpen, setStoreOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const [paymentMemberNm, setPaymentMemberNm] = useState('');
    const [paymentPeriod, setPaymentPeriod] = useState('');
    const [paymentCeoNm, setPaymentCeoNm] = useState('');
    const [paymentEmpHp, setPaymentEmpHp] = useState('');
    const [paymentEmpEmail, setPaymentEmpEmail] = useState('');
    const [paymentEmpComment, setPaymentEmpComment] = useState('');
    const [paymentStatusList, setPaymentStatusList] = useState([]);

    //페이징
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(12);
    const indexOfLastPost = currentPage * postsPerPage;

    const [checked, setChecked] = useState([]);

    // const []
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

    //데이터 들고오는 API
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
        //let dateChangeChk 

        console.log('newChecked', newChecked);
    }

    // console.log('sequenceChk[0]',sequenceChk[0]);
    // console.log('sequenceChk[1]',sequenceChk[1]);

    //납부 버튼,
    const payBtnHandler = () => {

         
        // if( sequenceChk[0] == '2' && sequenceChk[1] =='1'){//[2][1]이라면
        //     console.log('sequenceChk[0]',sequenceChk[0]);
        //     alert('체크해제 후 납부일자를 선택한 다음 체크하세요.');
        //     sequenceChk[0]='';
        //     sequenceChk[1]='';
            
        // }else if(sequenceChk[0] == '2' && sequenceChk[1] == null ){
        //     alert('오늘날짜는 성공쓰..?');
        //     sequenceChk[0]='';
        //     sequenceChk[1]='';
        // }else if(sequenceChk[0] == '1' && sequenceChk[1] =='2'){
        //     alert('성공쓰');
        //     sequenceChk[0]='';
        //     sequenceChk[1]='';}
    
        let modalContractId = props.dataContracId;
        let modalPayPlanDate = checked;
        // console.log(checked);
        // console.log('modalContractId', modalContractId);

        let body = {
            //id -> date
            modalContractId: modalContractId,
            modalPayPlanDate: modalPayPlanDate,
            payMethodM: payMethodM,
            //insertPayDate: insertPayDate,
            //paymentStatusList:paymentStatusList
            newChecked: newChecked
        }
        console.log('newChecked', body);

        axios.post('/api/payStList/paymentUpdate', body)
            .then(response => {
                if (response.data.success) {
                    alert('완료되었습니다.');
                } else {
                    alert('실패하였습니다.');
                }
            })
        //paymentStList();
        newChecked = [];
    
    }

    const snsBtnHandler = (event) => {

    }
    const emailBtnHandler = (event) => {

    }
    //엑셀다운로드
    const excelBtnHandler = (event) => {
        event.preventDefault();

        const ws = xlsx.utils.json_to_sheet(paymentStatusList);

        ['대표자', '연락처', 'E-mail', '회원명', '계약상태', '계약기간', '계약기간', '납부일자', '특약사항', '계약기간(개월)', '납부예정일', 'contract_id', '납부여부', '비고']
            .forEach((x, idx) => {
                const cellAdd = xlsx.utils.encode_cell({ c: idx, r: 0 });
                ws[cellAdd].v = x;

            })

        ws['!cols'] = [];
        // ws['!cols'][4] = {hidden:true};
        // ws['!cols'][7] = {hidden:true};
        ws['!cols'][11] = { hidden: true };


        const wb = xlsx.utils.book_new();

        xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
        xlsx.writeFile(wb, "고객납부등록.xlsx");
    }


    let dataContracId = props.dataContracId;

// 만약 선택을 체크한 뒤 납부일자를 클릭하면(오늘날짜가 아니라 다른날짜로변경..ㄴ) 
// 납부일자를 먼저 선택한후 체크하세요.
//2 -> 1 [1][2] [2][1]

    // const [s010100070R, setS010100070R] = useState([]);
    const makeYYMMDD = (value) => {
        let year = (value.getFullYear() + '').substring(2);
        //console.log('year',year);
        let month = value.getMonth() + 1;
        let date = value.getDate();
        month = month < 10 ? '0' + month : month;
        date = date < 10 ? '0' + date : date;
        return year + '.' + month + '.' + date;
    }


    //뿌려주는 곳
    const s010100070R = paymentStatusList.map((paymentStatus, index) => {
        let insertPayDate = paymentStatus.PAYED_DATE
            ? new Date('20' + paymentStatus.PAYED_DATE)
            : new Date();

        return (
            <TableRow key={index}>
                {/*CONTRACT_ID와 날짜를 함께 들고가야한다.*/}
                <TableCell name="uname" variant="outlined" color="primary">
                    <input type="checkbox" onChange={toggleHandler} id={paymentStatus.PAY_PLAN_DATE + ',' + paymentStatus.PAYED_DATE + ',' + paymentStatus.CONTRACT_COMMENT} />
                </TableCell>
                <TableCell id={paymentStatus.CONTRACT_ID}>{index + 1}</TableCell>
                <TableCell>{paymentStatus.PAY_PLAN_DATE}</TableCell>
                <TableCell>{paymentStatus.PAYED_FLAG}</TableCell>
                <TableCell key={paymentStatus.PAY_PLAN_DATE} id={paymentStatus.PAY_PLAN_DATE}>
                    {/* api보고 바뀐 이벤트 값 들고오는거 찾아서 했어요 */}
                    <DatePicker
                        //ref = {payDateRef}
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

                                    sequenceChk.push('1');
                            }
                        }
                        selectsStart
                        startDate={insertPayDate}
                        dateFormat="yyyy.MM.dd (eee)"
                    />
                </TableCell>
                <TableCell>
                    {/* {paymentStatus.CONTRACT_COMMENT} */}
                    <Form.Control as="textarea" cols="20" rows="2"
                        value={paymentStatus.CONTRACT_COMMENT}
                        size="5"
                        id={paymentStatus.PAY_PLAN_DATE}
                        onChange={(e) => {
                            //   console.log('비고',e.target.value);
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

    

    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = s010100070R.slice(indexOfFirstPost, indexOfLastPost);

    //Change page
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
                            <tr>
                                <th>회원명</th>
                                <td>
                                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={paymentMemberNm} id="memberNm" name="memberNm"
                                        onChange={paymentMemberNmHandler} />

                                    {/* <input type="text" value={paymentMemberNm} id="memberNm" name="memberNm" size="5"
                                           onChange={paymentMemberNmHandler}/> */}
                                </td>
                                <th>계약기간</th>
                                <td colSpan="3">
                                    <Form.Control style={{ width: 15 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={paymentPeriod} id="regNo" name="regNo"
                                        onChange={paymentPeriodHandler} />

                                    {/* <input type="text" value={paymentPeriod} id="regNo" name="regNo" size="27"
                                           onChange={paymentPeriodHandler}/> */}
                                </td>
                            </tr>
                            <tr>
                                <th> 대표자</th>
                                <td>

                                    <Form.Control style={{ width: 7 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={paymentCeoNm} id="name" name="name"
                                        onChange={paymentCeoNmHandler} />

                                    {/* <input type="text" value={paymentCeoNm} id="name" name="name" size="7"
                                           onChange={paymentCeoNmHandler}/> */}

                                </td>
                                <th>연락처</th>
                                <td>
                                    <Form.Control style={{ width: 10 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={paymentEmpHp} id="ceoHp" name="ceoHp"
                                        onChange={paymentEmpHpHandler} />

                                    {/* <input type="text" value={paymentEmpHp} id="name" name="name" size="13"
                                            onChange={paymentEmpHpHandler}/> */}
                                </td>
                                <th>메일주소</th>
                                <td>
                                    <Form.Control style={{ width: 14 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={paymentEmpEmail} id="eAddr" name="eAddr"
                                        onChange={paymentEmpEmailHandler} />

                                    {/* <input type="text" value={paymentEmpEmail} id="name" name="name" size="20"
                                           onChange={paymentEmpEmailHandler}/> */}
                                </td>

                            </tr>

                            <tr>
                                <th>특약사항</th>
                                <td colSpan="5">
                                    <Form.Control as="textarea" rows={3} value={paymentEmpComment} id="comment"
                                        name="comment"
                                        onChange={paymentEmpCommentHandler} />
                                    {/* <textarea type="text" cols="90" rows="3" value={paymentEmpComment} id="comment"
                                              name="name"
                                              size="5"
                                              onChange={paymentEmpCommentHandler}/> */}
                                </td>
                            </tr>
                        </table>


                        <React.Fragment >
                            <Title></Title>
                            <Table size="small">

                                <TableHead>
                                    <TableRow>
                                        <TableCell>선택</TableCell>
                                        <TableCell>No</TableCell>
                                        <TableCell>납부예정일</TableCell>
                                        <TableCell>납부여부</TableCell>
                                        <TableCell>납부일자</TableCell>
                                        <TableCell>비      고</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* {currentPosts} */}{currentPosts}
                                </TableBody>
                            </Table>
                            
                        </React.Fragment>



                        {/* <table id='paymentList'>
                            <thead>
                                <tr>
                                    <th>선택</th>
                                    <th>No</th>
                                    <th>납부예정일</th>
                                    <th>납부여부</th>
                                    <th>납부일자</th>
                                    <th>비고</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPosts}
                            </tbody>
                        </table> */}

                        <div className="pageCenter">
                            <Pagination postsPerPage={postsPerPage} totalPosts={s010100070R.length} paginate={paginate} />
                        </div>
                        <div id="btnAlign">
                            <Button variant="contained" color="primary" style={{ width: 70 }}
                                onClick={payBtnHandler} value="납부" >납부</Button>
                            <Button variant="contained" color="primary" style={{ width: 110 }} className="new"
                                onClick={snsBtnHandler} value="SNS전송"  >SNS 전송</Button>
                            <Button variant="contained" color="primary" style={{ width: 100 }} className="memberId"
                                onClick={emailBtnHandler} value="메일전송"  >메일 전송</Button>
                            <Button variant="contained" color="primary" style={{ width: 130 }} className="contractId"
                                onClick={excelBtnHandler} value="엑셀다운로드" >엑셀다운로드</Button>
                            <Button variant="contained" color="primary" style={{ width: 110 }} id="btnWidth">계산서발행</Button>
                        </div>
                    </div>
                </div>

            </form>
        </Fragment>

    );

}

export default S010100070;