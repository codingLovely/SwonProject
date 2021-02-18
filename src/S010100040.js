import React, { Fragment, useState, useEffect } from 'react';
import S010100010 from './S010100010';
import S010100050 from './S010100050';
import './css/S010100040.css';
import axios from "axios";
import ReactPaginate from 'react-paginate';

//엑셀다운로드
import xlsx from 'xlsx';

//<!--모달창 라이브러리
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
//모달창 라이브러리 끝-->

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
import Form from 'react-bootstrap/Form';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';

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

// let memberName = '';
// let memberEmpHp = '';
let memberId = '';

function S010100040(props) {

    const [memberNm, setMemberNm] = useState('')
    const [regNo, setRegNo] = useState('')
    const [memberTp, setMemberTp] = useState('')
    const [contractStatus, setContractStatus] = useState('')
    const [memberSt, setMemberSt] = useState('')
    const [name, setName] = useState('')
    const [numForDetailModal, setNumForDetailModal] = useState('')
    const [empHpForDetailModal, setEmpHpForDetailModal] = useState('')
    const [tbMember, setTbMember] = useState([].slice(0,5))

    //select박스
    const [memberStatus, setMemberStatus] = useState([{}]);
    const [memberType, setMemberType] = useState([{}]);

    //<!--모달창 속성 및 이벤트
    const [open, setOpen] = React.useState(true);
    const [storeOpen, setStoreOpen] = React.useState(false);

    const [memberIdModal, setMemberIdModal] = useState(0);

    const classes = useStyles();
    const [modalOpen, setModalOpen] = React.useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    //select박스
    useEffect(() => {

        axios.get('/api/memStList/selectMemberTp')
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

    const endStatus = [{ key: '전체', value: '전체' },
    { key: 'Y', value: 'Y' },
    { key: 'N', value: 'N' }]

    useEffect(() => {

        axios.get('/api/memStList/selectMemberSt')
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

        axios.post('/api/memStList/searchMember', body)
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
        memberId = event.target.id;
        //memberName = event.target.innerHTML;
        //memberIdM = event.target.className;

        //setEmpHpForDetailModal(memberEmpHp);
        //setNumForDetailModal(memberName);
        setMemberIdModal(memberId);
        //console.log();
        setModalOpen(true);
    }

    const onHandleDetailClickClose = () => {
        memberList();
        setModalOpen(false);
    }

    const onSNSHandler = (event) => {

    }

    const onEmailHandler = (event) => {

    }

    // 엑셀다운로드
    const excelHandler = (event) => {
        event.preventDefault();

        const ws = xlsx.utils.json_to_sheet(tbMember);

        ['NO', '사업자번호', '회원명', '회원구분', '상태', '대표자 성명', '대표자 연락처', '대표자 E-mail', '종료여부']
            .forEach((x, idx) => {
                const cellAdd = xlsx.utils.encode_cell({ c: idx, r: 0 });
                ws[cellAdd].v = x;
            })

        ws['!cols'] = [];
        ws['!cols'][0] = { hidden: true };

        const wb = xlsx.utils.book_new();

        xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
        xlsx.writeFile(wb, "회원현황.xlsx");
    }

    const [pageNumber,setPageNumber] = useState(0);
    const usersPerPage = 20;
    const pagesVisited = pageNumber * usersPerPage;
    
    const displayMemSt = tbMember.slice(pagesVisited,pagesVisited + usersPerPage).map((tbMember, index) => {
        return (
            <TableRow key={index}>
            <TableCell id={tbMember.MEMBER_ID} >{index + 1}</TableCell>
            <TableCell>{tbMember.MEMBER_NM}</TableCell>
            <TableCell>{tbMember.REG_NO}</TableCell>
            <TableCell onClick={onHandleDetailClickOpen} className='underLineForDetail' id={tbMember.MEMBER_ID}>{tbMember.NAME}</TableCell>
            <TableCell>{tbMember.EMP_HP}</TableCell>
            <TableCell>{tbMember.EMP_EMAIL}</TableCell>
            <TableCell>{tbMember.MEMBER_TP}</TableCell>
            <TableCell>{tbMember.MEMBER_ST}</TableCell>
            <TableCell>{tbMember.END_FLAG}</TableCell>
            </TableRow>
         )
    });

 

    const pageCount = Math.ceil(tbMember.length/usersPerPage);
    const changePage = ({selected}) => {
        setPageNumber(selected);
    }

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
                    <Divider />
                    <List>{secondaryListItems}</List>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} />
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={3}>
                            {/* Chart */}
                            <Grid item xs={12}>
                                <Paper style={{ padding: 16 }}>
                                    <form onSubmit={onSearchSubmitHandler}>
                                        회원명&nbsp;
                                            <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" type="text"
                                            value={memberNm} id="memberNm" name="memberNm" onChange={memberNmHandler} />

                   &nbsp;&nbsp;&nbsp;&nbsp;


                    사업자번호 &nbsp;
                    <Form.Control style={{ width: 10 + 'em', display: 'inline' }} size="sm" type="text"
                                            value={regNo} id="regNo" name="regNo"
                                            onChange={regNoHandler} />

                   &nbsp;&nbsp;&nbsp;&nbsp;


                    대표자명 &nbsp;
                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" type="text"
                                            value={name} id="name" name="name"
                                            onChange={nameHandler} />

                    &nbsp;&nbsp;&nbsp;&nbsp;

                    회원구분 &nbsp;
                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" as="select"
                                            multiple={false} onChange={memberTpHandler} value={memberTp}>
                                            {memberType.map(item => (
                                                <option key={item.key} value={item.key}>{item.value}</option>
                                            ))}

                                        </Form.Control>

                                            &nbsp;&nbsp;&nbsp;&nbsp;

                    종료 &nbsp;
                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" as="select"
                                            multiple={false} onChange={contractStatusHandler} value={contractStatus}>
                                            {endStatus.map(item => (
                                                <option key={item.key} value={item.key}>{item.value}</option>
                                            ))}

                                        </Form.Control>

                                            &nbsp;&nbsp;&nbsp;&nbsp;

                    상태 &nbsp;
                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" as="select"
                                            multiple={false} onChange={memberStHandler} value={memberSt}>
                                            {memberStatus.map(item => (
                                                <option key={item.key} value={item.key}>{item.value}</option>
                                            ))}

                                        </Form.Control>


                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                    <Button variant="contained" style={{ width: 80 }} color="primary" onClick={onSearchSubmitHandler}>
                                            조회
                                    </Button>
                                    </form>
                                </Paper>
                            </Grid>

                            <table className="btn">
                                <thead>
                                    <tr>
                                        <td colSpan="5">
                                            <Button variant="contained" style={{ width: 100 }} color="primary" onClick={onHandleClickOpen} >
                                                신규회원
                                            </Button>
                                            <Button variant="contained" style={{ width: 100 }} color="primary" onClick={onSNSHandler} >
                                                SNS
                                            </Button>
                                            <Button variant="contained" style={{ width: 100 }} color="primary" onClick={onEmailHandler} >
                                                메일전송
                                            </Button>
                                        </td>
                                    
                                        <td  id="alignRight">
                                           
                                        </td>
                                        <td  id="alignRight">
                                           
                                        </td>
                                        <td colSpan = "5" id="alignRight">
                                            <Button variant="contained" style={{ width: 140 }} color="primary" onClick={excelHandler}>
                                                엑셀다운로드
                                            </Button>
                                        </td>
                                    </tr>
                                </thead>
                            </table>

                            {/* 결과 테이블 */}
                            <Grid item xs={12}>
                                <Paper className={classes.paper}>
                                    <React.Fragment>
                                            <Title>회원 현황</Title>
                                            <Table size="small">

                                            <TableHead>
                                                <TableRow>
                                                    <TableCell rowSpan="2">No</TableCell>
                                                    <TableCell rowSpan="2">회원명</TableCell>
                                                    <TableCell rowSpan="2">사업자번호</TableCell>
                                                    <TableCell colSpan="3">대표자</TableCell>
                                                    <TableCell rowSpan="2">회원구분</TableCell>
                                                    <TableCell rowSpan="2">상태</TableCell>
                                                    <TableCell rowSpan="2">종료여부</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>성명</TableCell>
                                                    <TableCell>연락처</TableCell>
                                                    <TableCell>E-mail</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                            {displayMemSt}
                                            </TableBody>
                                            </Table>
                                            
                                        </React.Fragment>

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
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </main>
            </div>

            <Dialog
                maxWidth={"lg"}
                open={modalOpen}
                onClose={onHandleDetailClickClose}>
                <S010100050 dataMemId={memberIdModal} dataForm={"U"} />
                {/* dataName={numForDetailModal} dataEmpHp={empHpForDetailModal} */}
                <DialogActions>
                    <input type="button" id="contractBtn" onClick={onHandleDetailClickClose} color="primary" value='닫기' />
                </DialogActions>
            </Dialog>

            <Dialog
                maxWidth={"lg"}
                open={storeOpen}
                onClose={onHandleClickClose}>
                <S010100010 />
                <DialogActions>
                    <input type="button" onClick={onHandleClickClose} color="primary" value="닫기" />
                </DialogActions>
            </Dialog>

        </Fragment>
    );

}

export default S010100040;