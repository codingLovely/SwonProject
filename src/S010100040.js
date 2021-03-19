import React, { Fragment, useState, useEffect, useCallback } from 'react';
import axios from "axios";
import './css/S010100040.css';
import S010100010 from './S010100010';
import S010100050 from './S010100050';

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

import { DatePicker } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';

import ReactPaginate from 'react-paginate';

import xlsx from 'xlsx';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
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


let memberId = '';

function S010100040(props) {

    const classes = useStyles();

    const [modalOpen, setModalOpen] = React.useState(false);

    const [memberNm, setMemberNm] = useState('')
    const [regNo, setRegNo] = useState('')
    const [memberTp, setMemberTp] = useState('')
    const [contractStatus, setContractStatus] = useState('')
    const [memberSt, setMemberSt] = useState('')
    const [name, setName] = useState('')
    const [tbMember, setTbMember] = useState([].slice(0, 20))

    const [memberStatus, setMemberStatus] = useState([{}]);
    const [memberType, setMemberType] = useState([{}]);

    const [startDate, setStartDate] = useState(moment().date('01'));
    const [endDate, setEndDate] = useState(moment());

    const [open, setOpen] = React.useState(true);
    const [storeOpen, setStoreOpen] = React.useState(false);
    const [memberIdModal, setMemberIdModal] = useState(0);

    const [pageNumber, setPageNumber] = useState(0);
    const usersPerPage = 20;
    const pagesVisited = pageNumber * usersPerPage;
    const pageCount = Math.ceil(tbMember.length / usersPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };


    useEffect(() => {

        axios.get('/api/s010100040/selectMemberTp')
            .then(response => {
                if (response.data.success) {
                    let arr = [{ key: '', value: '전체' }]

                    response.data.rows.map((data) =>
                        arr.push({
                            value: data.CD_V_MEANING,
                            key: data.CD_V

                        }));

                    setMemberType(arr);

                } else {
                    alert(response.data.message);
                    alert("회원상태 데이터를 불러오는데 실패하였습니다.");
                }
            })
    }, [])


    useEffect(() => {

        axios.get('/api/s010100040/selectMemberSt')
            .then(response => {
                if (response.data.success) {
                    let arr = [{ key: '', value: '전체' }]

                    response.data.rows.map((data) =>
                        arr.push({
                            value: data.CD_V_MEANING,
                            key: data.CD_V

                        }));

                    setMemberStatus(arr);

                } else {
                    alert(response.data.message);
                    alert("회원상태 데이터를 불러오는데 실패하였습니다.");
                }
            })
    }, [])

    // 조회
    const memberList = () => {
        const body = {
            startDate,
            endDate,
            memberNm,
            regNo,
            name,
            memberTp,
            contractStatus,
            memberSt
        }

        console.log('startDate',startDate);
        console.log('endDate',endDate);

        axios.post('/api/s010100040/searchMember', body)
            .then(response => {
                if (response.data.success) {
                    setTbMember(response.data.rows);
                    // // console.log('response.data.success',response.data.rows);
                } else {
                    alert(response.data.message);
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

    const onHandleClickClose = useCallback(() => {
        setStoreOpen(false);
        memberList();
    });

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
        setMemberIdModal(memberId);
        setModalOpen(true);
    }

    const onHandleDetailClickClose = useCallback(() => {
        memberList();
        setModalOpen(false);
    });

    const onSNSHandler = (event) => {

    }

    const onEmailHandler = (event) => {

    }

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

    const displayMemSt = tbMember.slice(pagesVisited, pagesVisited + usersPerPage).map((tbMember, index) => {
        return (
            <TableRow key={index}>
                <TableCell id={tbMember.MEMBER_ID} >{tbMember.MEMBER_ID}</TableCell>
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
    
      const cancelConfirm = () => alert('취소하였습니다.');
    
      const onLogoutHandler = useConfirm(
          "로그아웃 하시겠습니까?",
          approvalConfirm,
          cancelConfirm
      );

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
                                <div hidden ={sessionStorage.getItem('member') === null}>
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
                                        <span onClick={onLogoutHandler}><ListItemText primary="로그아웃" /></span>
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
                        </div>
                    </List>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} />
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={3}>
                            {/* Chart */}
                            <Grid item xs={12}>
                                <Paper style={{ padding: 16 }}>
                                    <form onSubmit={onSearchSubmitHandler}>
                                        <div className = "searchMenu">
                                            계약일자 
                                            &nbsp;
                                            <DatePicker
                                            locale='ko'
                                            selected={startDate}
                                            onChange={date => setStartDate(moment(date))}
                                            selectsStart
                                            startDate={startDate}
                                            endDate={endDate}
                                            defaultValue={startDate}
                                        /> &nbsp;~&nbsp;
                                        <DatePicker
                                            locale='ko'
                                            selected={endDate}
                                            onChange={date => setEndDate(moment(date))}
                                            selectsEnd
                                            startDate={startDate}
                                            endDate={endDate}
                                            // minDate={startDate}
                                            defaultValue={endDate}
                                        />
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

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
                                                {memberType.map((item,index) => (
                                                    <option key={index} value={item.key}>{item.value}</option>
                                                ))}

                                            </Form.Control>

                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            </div>
                                        <div className = "searchMenu">
                                    
                    상태 &nbsp;
                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" as="select"
                                                multiple={false} onChange={memberStHandler} value={memberSt}>
                                                {memberStatus.map((item,index) => (
                                                    <option key={index} value={item.key}>{item.value}</option>
                                                ))}

                                            </Form.Control>


                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                    <Button variant="contained" style={{ width: 80 }} color="primary" onClick={onSearchSubmitHandler}>
                                                조회
                                    </Button>
                                        </div>
                                    </form>
                                </Paper>
                            </Grid>

                            <table className="btn">
                                <thead>
                                    <tr>
                                        <td colSpan="5" id="alignLeft">
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


                                        <td colSpan="5" id="alignRight">
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
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </main>
            </div>
            {/* 이름클릭 상세보기 */}
            <Dialog
                maxWidth={"lg"}
                open={modalOpen}
                onClose={onHandleDetailClickClose}>
                <S010100050 
                    dataMemId={memberIdModal} 
                    dataForm={"U"} 
                    memberList={memberList}
                    onHandleDetailClickClose={onHandleDetailClickClose} 
                    setModalOpen={setModalOpen} 
                    setModalOpen={setModalOpen}/>
            </Dialog>

            {/* 신규등록 */}
            <Dialog
                maxWidth={"lg"}
                open={storeOpen}
                onClose={onHandleClickClose}>
                <S010100010 
                    onHandleClickClose={onHandleClickClose} 
                    setStoreOpen={setStoreOpen} 
                    memberList={memberList}/>
            </Dialog>

        </Fragment>
    );

}

export default S010100040;