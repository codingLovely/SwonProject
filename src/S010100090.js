import React, { Fragment, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import S010100100 from './S010100100';
import './css/S010100090.css';


import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import Dialog from '@material-ui/core/Dialog';


import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import { Link } from 'react-router-dom';

import Form from 'react-bootstrap/Form';

import { DatePicker } from "antd";
import "antd/dist/antd.css";
import moment from 'moment';

import xlsx from 'xlsx';
import ReactPaginate from 'react-paginate';

import {useStyles} from './Test';

let empNm = '';
let chkSt = '';
let memberId;
let empIdM;

function S010100090(props) {
    const classes = useStyles();

    const [open, setOpen] = React.useState(true);
    const [storeOpen, setStoreOpen] = React.useState(false);

    const [empInfo, setEmpInfo] = useState([].slice(0, 20));

    const [staffName, setStaffName] = useState('');
    const [memberNm, setMemberNm] = useState('');
    const [staffClass, setStaffClass] = useState('');
    const [staffClasses, setStaffClasses] = useState([{}])
    const [closeStatus, setCloseStatus] = useState('');
    const [startDate, setStartDate] = useState(new Date(moment().date('01')));
    const [endDate, setEndDate] = useState(new Date());

    const [empChecked, setEmpChecked] = useState([]);

    const [empName, setEmpName] = useState('');
    const [memId, setMemId] = useState(0);
    const [empId,setEmpId] = useState();
    const [dataForm, setdataForm] = useState('');
    const [retireChecked, setRetireChecked] = useState([]);

    const [pageNumber, setPageNumber] = useState(0);
    const usersPerPage = 20;
    const pagesVisited = pageNumber * usersPerPage;
    const pageCount = Math.ceil(empInfo.length / usersPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    }
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    // 직원 구분
    useEffect(() => {
        axios.post('/api/s010100090/classification')
            .then(response => {
                if (response.data.success) {
                    let arr = [{ key: '', value: '전체' }]

                    response.data.rows.map((data) =>
                        arr.push({
                            value: data.CD_V_MEANING, key: data.CD_V
                        }));

                    setStaffClasses(arr);

                } else {
                    alert(response.data.message);
                    alert("문의구분 데이터를 불러오는데 실패하였습니다.");
                }
            })
    }, [])

    useEffect(() => {
        empList();
    }, [])

    const empList = () => {

        let body = {
            staffName,
            memberNm,
            staffClass,
            retireChecked,
            startDate,
            endDate
        }

        axios.post('/api/s010100090/empList', body)
            .then(response => {
                if (response.data.success) {
                    setEmpInfo(response.data.rows);
                } else {
                    alert(response.data.message);
                    alert("직원 데이터를 불러오는데 실패하였습니다.");
                }
            })

    }


    const onSubmitHandler = (event) => {
        event.preventDefault();
    }

    const staffNameHandler = (event) => {
        setStaffName(event.currentTarget.value);
    }
    const memberNmHandler = (event) => {
        setMemberNm(event.currentTarget.value);
    }

    const staffClassHandler = (event) => {
        setStaffClass(event.currentTarget.value);
    }

    const closeStatusHandler = (event) => {
        setCloseStatus(event.currentTarget.value);
    }

    const onHandleClickClose = useCallback(() => {
        setStoreOpen(false);
        empList();
    });

    const onEmpSearchHandler = () => {
        empList();
    }

    

    const retireHandleToggle = (value) => {

        // 승인empId 현재 index값
        const currentIndex = retireChecked.indexOf(value);
        // 등록시 회사명

        //전체 Checked된 State에서 현재 누를 Checkbox가 있는지 확인
      
        const newChecked = [...retireChecked];
        // // console.log('newChecked',newChecked);
        // // console.log(retireChecked);
        if (currentIndex === -1) {
            newChecked.push(value)
        } else {
            newChecked.splice(currentIndex, 1)
        }
        setRetireChecked(newChecked);
     

    }

    const handleToggle = (value) => {

        // 승인empId 현재 index값
        const currentIndex = empChecked.indexOf(value);
    

        //전체 Checked된 State에서 현재 누를 Checkbox가 있는지 확인
        
        const newChecked = [...empChecked];

        if (currentIndex === -1) {
            newChecked.push(value)
        } else {
            newChecked.splice(currentIndex, 1)
        }
        setEmpChecked(newChecked);
        // console.log(empChecked);
        newChecked.length > 0 ? chkSt = 'check' : chkSt = '';

    }



    // 등록
    const onRegistHandler = () => {
        if (empChecked.length === 0) {
            alert('선택하세요');
        } else if (empChecked.length > 1) {
            alert('하나만 체크하세요');
        } else {
            const checkedList = empChecked[0].split(',');
            // console.log(checkedList[0]);
            memberId = checkedList[0];
            setEmpName(checkedList[2]);
            setMemId(checkedList[0]);
            setdataForm('I');
            // console.log('empNm',empNm);
            setStoreOpen(true);
        }
    }
    
    // 수정
    const onModifyHandler = (event) => {
        if (empChecked.length === 0) {
            alert('선택하세요');
        } else if (empChecked.length > 1) {
            alert('하나만 체크하세요');
        } else {
            const checkedList = empChecked[0].split(',');
            empIdM = checkedList[1];
            // console.log('empIdM',empIdM);
            setdataForm('U');
            setEmpId(empIdM);
            setStoreOpen(true);
    
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

    const approvalConfirm = (event) => {
        let checkedMemberId;

        // // console.log('checkedMemberId',checkedMemberId);
        // // console.log('empChecked',empChecked);

        for(let i = 0; empChecked.length > i; i++){
            
            // // console.log('empChecked[i].split',empChecked[i].split(','));
            checkedMemberId = empChecked[i].split(',');    
    }
    
    if (checkedMemberId == undefined ||checkedMemberId == null) {
        alert('승인할 회원을 선택하세요');
    // }else if(JSON.parse(sessionStorage.getItem("member"))[1] != checkedMemberId[0]){
    //     alert('자회사의 직원승인만 가능합니다.');
    }else{
            let arr = [];

            for(let i = 0; empChecked.length > i; i++){
                const checkedList = empChecked[i].split(',');
                // console.log('checkedList[1]',checkedList[1]);
                // console.log('checkedList[0]',checkedList[0]);
                // console.log('checkedList',checkedList);
               
                arr.push(checkedList[1]);

        }
        
            let body = {
                arr
            }
            
            axios.post('/api/s010100090/approval', body)
                .then(response => {
                    if (response.data.success) {
                        alert('승인처리 되었습니다.');
                        empList();
                        setEmpChecked('');
                    } else {
                        alert(response.data.message);
                        alert('승인처리에 실패하였습니다.');
                        setEmpChecked('');
                    }
                })
        }

    }

    const cancelConfirm = () => alert('승인 취소하였습니다.');

    const onApprovalHandler = useConfirm(
        "승인하시겠습니까?",
        approvalConfirm,
        cancelConfirm
    );


    const logoutConfirm = () => {

        axios.post('/api/s010100150/userLogout')
        .then(response => {
            if (response.data.logoutResult == true) {
            alert('로그아웃 하였습니다.');
            sessionStorage.removeItem('member');
            sessionStorage.clear();
            props.history.push('/');
            }else if(response.data.loginResult == false){
            alert(response.data.message);
            alert('아이디 또는 비밀번호를 확인하세요.');
            }
        })
    
        };
    
        const logounCancelConfirm = () => alert('취소하였습니다.');
    
        const onLogoutHandler = useConfirm(
            "로그아웃 하시겠습니까?",
            logoutConfirm,
            logounCancelConfirm
        );

    const excelHandler = () => {

        const ws = xlsx.utils.json_to_sheet(empInfo);
       

        ['회원명', 'member_id', '직번', '성명', '생년월일', '부서', 'emp_id','연락처','직업구분','승인여부','E-mail','password','입사일자','퇴사일자']
            .forEach((x, idx) => {
                const cellAdd = xlsx.utils.encode_cell({ c: idx, r: 0 });
                ws[cellAdd].v = x;

            })

        ws['!cols'] = [];
        ws['!cols'][1] = { hidden: true };
        ws['!cols'][6] = { hidden: true };


        const wb = xlsx.utils.book_new();

        xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
        xlsx.writeFile(wb, "상담현황.xlsx");

    }

 


    const displayEmpMembers = empInfo.slice(pagesVisited, pagesVisited + usersPerPage).map((empInfo, index) => {
        return (
            <TableRow key={index}>
                <TableCell>
                    <input type="checkbox" checked={empChecked.indexOf(empInfo.MEMBER_ID + ',' + empInfo.EMP_ID + ',' + empInfo.MEMBER_NM)===-1? false :true} onChange={()=> handleToggle(empInfo.MEMBER_ID + ',' + empInfo.EMP_ID + ',' + empInfo.MEMBER_NM)} id={empInfo.MEMBER_ID + ',' + empInfo.EMP_ID} className={empInfo.MEMBER_NM} />
                </TableCell>
                <TableCell>{empInfo.MEMBER_NM}</TableCell>
                <TableCell>{empInfo.EMP_NUMBER}</TableCell>
                <TableCell>{empInfo.NAME}</TableCell>
                <TableCell>{empInfo.BIRTH_DATE}</TableCell>
                <TableCell>{empInfo.DEPT_NM}</TableCell>
                <TableCell>{empInfo.EMP_HP}</TableCell>
                <TableCell>{empInfo.CEO_FLAG}</TableCell>
                <TableCell>{empInfo.EMP_TP}</TableCell>
                <TableCell>{empInfo.APPROVAL_FLAG}</TableCell>
                <TableCell>{empInfo.EMP_EMAIL}</TableCell>
                <TableCell>{empInfo.PWD}</TableCell>
                <TableCell>{empInfo.JOIN_DATE === '00-00-00'||null ? '' :empInfo.JOIN_DATE }</TableCell>
                <TableCell>{empInfo.RETIRE_DATE === '00-00-00'||null ? '' :empInfo.RETIRE_DATE}</TableCell>
            </TableRow>
        );
    }); 

    return (
        <Fragment>
            <div className={classes.root}>
                {/* 백그라운드 */}
                <CssBaseline />
                {/* 상단파란툴바 */}
                <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                    <Toolbar className={classes.toolbar}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        SwonTech 고객관리시스템
                        </Typography>
                        
                    </Toolbar>
                </AppBar>
                {/* 왼쪽 메뉴바 */}
                <Drawer
                    variant="permanent"
                    classes={{
                        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                    }}
                    open={open}
                >
                    <div className={classes.toolbarIcon}>
                        <IconButton onClick={handleDrawerClose}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        <div>
                            <div hidden ={sessionStorage.getItem('member') == null}>
                            <ListItem button>
                            <ListItemIcon>
                            <PeopleIcon />
                            </ListItemIcon>
                            <Link to="/member"><ListItemText primary="회원현황" /></Link>
                            </ListItem>
                            <ListItem button>
                            <ListItemIcon>
                                <ShoppingCartIcon />
                            </ListItemIcon>
                            <Link to ="/paymentStatus"><ListItemText primary="납부현황" /></Link>
                            </ListItem>
                            <ListItem button>
                            <ListItemIcon>
                            <DashboardIcon />
                            </ListItemIcon>
                            <Link to ="/consultationStatus"><ListItemText primary="상담현황" /></Link>
                            </ListItem>
                            <ListItem button>
                            <ListItemIcon>
                                <BarChartIcon />
                            </ListItemIcon>
                            <Link to ="/staff"><ListItemText primary="직원현황" /></Link>
                            </ListItem>
                            <ListItem button>
                            <ListItemIcon>
                            <DashboardIcon />
                            </ListItemIcon>
                            <Link to ="/contractStatus"><ListItemText primary="계약현황" /></Link>
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon>
                                <LayersIcon />
                                </ListItemIcon>
                                <span onClick ={onLogoutHandler}><ListItemText primary="로그아웃" /></span>
                            </ListItem>
                            </div>
                            <div hidden ={sessionStorage.getItem('member') != null}>
                            <ListItem button>
                                <ListItemIcon>
                                <LayersIcon />
                                </ListItemIcon>
                                <Link to ="/"><ListItemText primary="로그인" /></Link>
                            </ListItem>
                            </div>
                        </div></List>
                  
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} />
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={3}>
                            {/* Chart */}
                            <Grid item xs={12}>
                                <Paper className={classes.paper}>
                                    <form onSubmit={onSubmitHandler}>
                                        입사일자   &nbsp;
                                    {/* date클릭할 때 고정 */}

                                        <DatePicker
                                            locale='ko'
                                            selected={startDate}
                                            onChange={date => setStartDate(date)}
                                            selectsStart
                                            startDate={startDate}
                                            endDate={endDate}
                                            defaultValue={moment(moment().date('01'), 'YYYY-MM-DD')}
                                        />&nbsp; ~ &nbsp;
                                        <DatePicker
                                            locale='ko'
                                            selected={endDate}
                                            onChange={date => setEndDate(date)}
                                            selectsEnd
                                            startDate={startDate}
                                            endDate={endDate}
                                            minDate={startDate}
                                            defaultValue={moment(moment(), 'YYYY-MM-DD')}
                                        />

                                    &nbsp;&nbsp;회원명&nbsp;&nbsp;
                                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" type="text"
                                            value={memberNm} id="memberNm" name="memberNm"
                                            onChange={memberNmHandler} />

                                    &nbsp;
                                    성명&nbsp;&nbsp;
                                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" type="text"
                                            value={staffName} id="staffName" name="staffName"
                                            onChange={staffNameHandler} />

                                        &nbsp;&nbsp;

                                        직원구분&nbsp;&nbsp;
                                        <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" as="select"
                                            multiple={false} onChange={staffClassHandler} value={staffClass}>
                                            {staffClasses.map((item,index) => (
                                                <option key={index} value={item.key}>{item.value}</option>
                                            ))}

                                        </Form.Control>
                                        &nbsp;&nbsp;
                                        퇴사여부&nbsp;&nbsp;
                                        <input type="checkbox" checked = {retireChecked.indexOf("Y") ===-1 ? false:true} onChange={() => retireHandleToggle("Y")} />

                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                        <Button variant="contained" style={{ width: 80 }} color="primary" href="#contained-buttons"
                                            onClick={onEmpSearchHandler}>
                                            조회
                                        </Button>


                                    </form>
                                </Paper>
                            </Grid>

                            <table className="btn">
                                <thead>
                                    <tr>
                                        <td id="alignLeft">
                                            <Button variant="contained" style={{ width: 100 }} color="primary" href="#contained-buttons"
                                                onClick={onRegistHandler}> 등록 </Button>
                                            <Button variant="contained" style={{ width: 100 }} color="primary" href="#contained-buttons"
                                                onClick={onModifyHandler}> 수정 </Button>
                                            <span hidden ={JSON.parse(sessionStorage.getItem("member"))[0] === 'N'}>
                                            <Button variant="contained" style={{ width: 100 }} color="primary" href="#contained-buttons"
                                                onClick={onApprovalHandler}> 승인 </Button>
                                            </span>
                                        </td>
                                        <td id="alignRight">
                                            <Button variant="contained" style={{ width: 140 }} color="primary" href="#contained-buttons" onClick={excelHandler}> 엑셀다운로드 </Button>
                                        </td>
                                    </tr>
                                </thead>
                            </table>


                            {/* 결과 테이블 */}
                            <Grid item xs={12}>
                                <Paper className={classes.paper}>
                                    <React.Fragment>
                                        <Title>직원 현황</Title>
                                        <Table size="small">

                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>선택</TableCell>
                                                    <TableCell>회원명</TableCell>
                                                    <TableCell>직번</TableCell>
                                                    <TableCell>성명</TableCell>
                                                    <TableCell>생년월일</TableCell>
                                                    <TableCell>부서</TableCell>
                                                    <TableCell>연락처</TableCell>
                                                    <TableCell>대표자여부</TableCell>
                                                    <TableCell>직원구분</TableCell>
                                                    <TableCell>승인여부</TableCell>
                                                    <TableCell>E-mail</TableCell>
                                                    <TableCell>password</TableCell>
                                                    <TableCell>입사일자</TableCell>
                                                    <TableCell>퇴사일자</TableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {displayEmpMembers}
                                            </TableBody>
                                        </Table>
                                        <div id="reactPage">
                                            <ReactPaginate
                                                previousLabel={"Previous"}
                                                nextLabel={"Next"}
                                                pageCount={pageCount}
                                                onPageChange={changePage}
                                                containerClassName={"paginationBtns"}
                                                previousLinkClassName={"previousBtn"}
                                                nextLinkClassName={"nextBtn"}
                                                disabledClassName={"paginationDisabled"}
                                                activeClassName={"paginationActive"}
                                            />
                                        </div>
                                    </React.Fragment>

                                </Paper>
                            </Grid>
                        </Grid>

                    </Container>
                </main>
            </div>
            <Dialog
                    maxWidth={"lg"}
                    open={storeOpen}>
                    <S010100100 
                    name={empName} 
                    memId={memberId}
                    empIdM={empIdM} 
                    dataForm={dataForm}
                    empList={empList} 
                    onHandleClickClose={onHandleClickClose} 
                    setStoreOpen={setStoreOpen}
                    setEmpChecked={setEmpChecked}
                    />
            </Dialog>
        </Fragment>
    );

}

export default S010100090;