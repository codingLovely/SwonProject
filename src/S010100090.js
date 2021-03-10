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
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { mainListItems, secondaryListItems } from './listItems';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import Dialog from '@material-ui/core/Dialog';

import Form from 'react-bootstrap/Form';

import { DatePicker } from "antd";
import "antd/dist/antd.css";
import moment from 'moment';

import xlsx from 'xlsx';
// //<!--켈린더 라이브러리시작
// import DatePicker, { registerLocale } from "react-datepicker";
// import ko from 'date-fns/locale/ko';
// registerLocale("ko", ko);
// //켈린더 라이브러리 끝-->

import ReactPaginate from 'react-paginate';
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
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

let empNm = '';
let chkSt = '';
let memberId;
let empIdM;
let empIdMarr =[];

function S010100090() {
    const classes = useStyles();

    const [open, setOpen] = React.useState(true);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };
    const [storeOpen, setStoreOpen] = React.useState(false);

    const [empInfo, setEmpInfo] = useState([].slice(0, 10));

    const [staffName, setStaffName] = useState('');
    const [memberNm, setMemberNm] = useState('');
    const [staffClass, setStaffClass] = useState('');
    const [staffClasses, setStaffClasses] = useState([{}])
    const [closeStatus, setCloseStatus] = useState('');
    const [startDate, setStartDate] = useState(new Date(moment().date('01')));
    const [endDate, setEndDate] = useState(new Date());

    const [checked, setChecked] = useState([]);

    const [empName, setEmpName] = useState('');
    const [memId, setMemId] = useState(0);
    const [empId,setEmpId] = useState();
    const [dataForm, setdataForm] = useState('');

    const [pageNumber, setPageNumber] = useState(0);
    const usersPerPage = 20;
    const pagesVisited = pageNumber * usersPerPage;
    const pageCount = Math.ceil(empInfo.length / usersPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    }



    // useEffect(() => {
    //     axios.post('/api/s010100150/session')
    //         .then(response => {
    //             if (response.data.success) {
                  

    //             } else {
    //                 alert(response.data.message);
    //             }
    //         })
    // }, [])
    
    // 직원 구분
    useEffect(() => {
        axios.post('/api/s010100090/classification')
            .then(response => {
                if (response.data.success) {
                    let arr = [{ key: '전체', value: '전체' }]

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

    const [retireChecked, setRetireChecked] = useState([]);

    const retireHandleToggle = (event) => {

        // 승인empId 현재 index값
        const currentIndex = retireChecked.indexOf(event.target.id);
        // 등록시 회사명

        //전체 Checked된 State에서 현재 누를 Checkbox가 있는지 확인
        const newChecked = retireChecked;
      

        if (currentIndex === -1) {
            newChecked.push(event.target.id)
        } else {
            newChecked.splice(currentIndex, 1)
        }
        setRetireChecked(newChecked);
     

    }

    const handleToggle = (event) => {

        // 승인empId 현재 index값
        const currentIndex = checked.indexOf(event.target.id);
        // 등록시 회사명
        empNm = event.target.className;
      

        //전체 Checked된 State에서 현재 누를 Checkbox가 있는지 확인
        const newChecked = checked;
      

        if (currentIndex === -1) {
            newChecked.push(event.target.id)
        } else {
            newChecked.splice(currentIndex, 1)
        }
        setChecked(newChecked);
        // console.log(checked);
        newChecked.length > 0 ? chkSt = 'check' : chkSt = '';

    }
    
    const onRegistHandler = (event) => {
        if (checked.length === 0) {
            alert('선택하세요');
        } else if (checked.length > 1) {
            alert('하나만 체크하세요');
        } else {
            const checkedList = checked[0].split(',');
            console.log(checkedList[0]);
            
            memberId = checkedList[0];
            setEmpName(empNm);
            setMemId(checkedList[0]);
            setdataForm('I');
            console.log('empNm',empNm);
            setStoreOpen(true);
            
        
        }
    }
    
    const onModifyHandler = (event) => {
        if (checked.length === 0) {
            alert('선택하세요');
        } else if (checked.length > 1) {
            alert('하나만 체크하세요');
        } else {
            const checkedList = checked[0].split(',');
            empIdM = checkedList[1];
            console.log('empIdM',empIdM);
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

        for(let i = 0; checked.length > i; i++){
           checkedMemberId = checked[i].split(',');    
    }

    if(JSON.parse(sessionStorage.getItem("member"))[1] != checkedMemberId[0]){
        alert('자회사의 직원승인만 가능합니다.');
    }else if (checked.length === 0) {
            alert('승인할 회원을 선택하세요');
        } else {
            let arr = [];

            for(let i = 0; checked.length > i; i++){
                const checkedList = checked[i].split(',');
                console.log('checkedList[1]',checkedList[1]);
                console.log('checkedList[0]',checkedList[0]);
                console.log('checkedList',checkedList);
               
                arr.push(checkedList[1]);

        }
            // console.log(arr);
            let body = {
                arr
            }
            
            axios.post('/api/s010100090/approval', body)
                .then(response => {
                    if (response.data.success) {
                        alert('승인처리 되었습니다.');
                        empList();
                    } else {
                        alert(response.data.message);
                        alert('승인처리에 실패하였습니다.');
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

    const excelHandler = (event) => {

        event.preventDefault();

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
                    <input type="checkbox" onChange={handleToggle} id={empInfo.MEMBER_ID + ',' + empInfo.EMP_ID} className={empInfo.MEMBER_NM} />
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
                            Dashboard
          </Typography>
                        <IconButton color="inherit">
                            <Badge badgeContent={4} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
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
                    <List>{mainListItems}</List>
                  
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
                                        <input type="checkbox" onChange={retireHandleToggle} id="Y" />

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
                <S010100100 name={empName} memId={memberId} empIdM={empIdM} dataForm={dataForm} empList={empList} onHandleClickClose={onHandleClickClose} setStoreOpen={setStoreOpen}/>
            </Dialog>
        </Fragment>
    );

}

export default S010100090;