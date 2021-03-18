import React, { Fragment, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import S010100070 from './S010100070';

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


let paymentState = [{ key: '', value: '전체' },
{ key: 'Y', value: 'Y' },
{ key: 'N', value: 'N' }]

function S010100060(props) {

    const classes = useStyles();

    const [open, setOpen] = React.useState(true);
    const [userName, setUserName] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [payChecked, setPayChecked] = useState([]);

    const [startDate, setStartDate] = useState(new Date(moment().date('01')));
    const [endDate, setEndDate] = useState(new Date());

    const [payStatusList, setPayStatusList] = useState([].slice(0, 5));
    const [storeOpen, setStoreOpen] = useState(false);
    const [dataAllContract, setDataAllContract] = useState('');

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    const paymentList = () => {

        let body = {
            startDate: startDate,
            endDate: endDate
        }

    
        axios.post('/api/s010100060/list', body)
            .then(response => {
                if (response.data.success) {
                    // // console.log('list60', response.data.rows);
                    setPayStatusList(response.data.rows);
                } else {
                    alert(response.data.message);
                    alert('데이터 조회를 실패하였습니다.')
                }

            })

    }
    useEffect(() => {
        // let startDates = startDate.getFullYear() + '.' + (startDate.getMonth() + 1) + '.' + startDate.getDate();
        // let endDates = endDate.getFullYear() + '.' + (endDate.getMonth() + 1) + '.' + endDate.getDate();

        paymentList();
    }, [])

    const paymentSearchHandler = () => {
        // let startDates = startDate.getFullYear() + '.' + (startDate.getMonth() + 1) + '.' + startDate.getDate();
        // let endDates = endDate.getFullYear() + '.' + (endDate.getMonth() + 1) + '.' + endDate.getDate();

        paymentList();
    }


    const onSubmitHandler = (event) => {
        event.preventDefault();
    }

    const nameSearchHandler = (event) => {
        setUserName(event.currentTarget.value);
    }

    const paymentStatusHandler = (event) => {
        setPaymentStatus(event.currentTarget.value);
    }

    const onPayHandleClickClose = useCallback(() => {
        setStoreOpen(false);
        paymentSearchHandler();
        // setPayChecked('');
       
    });


    const handleToggle = (value) => {
        // console.log('event', e.target.id);
        const currentIndex = payChecked.indexOf(value);
        //전체 Checked된 State에서 현재 누를 Checkbox가 있는지 확인
        const newChecked = [...payChecked];

        if (currentIndex === -1) {
            newChecked.push(value)
        } else {
            newChecked.splice(currentIndex, 1)
        }

        setPayChecked(newChecked);

         // console.log('currentIndex', currentIndex);
         // console.log('checked', checked);

    }

    const onPaymenthandler = () => {
        if (payChecked.length === 0) {
            alert('선택하세요');
        } else if (payChecked.length > 1) {
            alert('하나만 체크하세요');
        } else {
            setDataAllContract(payChecked);
            // console.log(checked);
            setStoreOpen(true);
            // setPayChecked('');
        }
    }

    const excelHandler = (event) => {
        event.preventDefault();

        const ws = xlsx.utils.json_to_sheet(payStatusList);
        // console.log(payStatusList);

        ['회원명', '납부예정일', '납부여부', '납부일자', '계약기간', '계약기간', '대표자 성명', '대표자 연락처', '대표자 E-mail', '계약ID']
            .forEach((x, idx) => {
                const cellAdd = xlsx.utils.encode_cell({ c: idx, r: 0 });
                ws[cellAdd].v = x;

            })

        ws['!cols'] = [];
        ws['!cols'][9] = { hidden: true };


        const wb = xlsx.utils.book_new();

        xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
        xlsx.writeFile(wb, '고객납부현황.xlsx');

    }
   

    const [pageNumber, setPageNumber] = useState(0);
    const usersPerPage = 20;
    const pagesVisited = pageNumber * usersPerPage;

    const displayPayStList = payStatusList.slice(pagesVisited, pagesVisited + usersPerPage).map((payStatusList, index) => {
        return (
            <TableRow key={payStatusList.CONTRACT_ID}>
                <TableCell><input type='checkbox' checked = {payChecked.indexOf(payStatusList.CONTRACT_ID) === -1 ? false:true} onChange={()=>handleToggle(payStatusList.CONTRACT_ID)} id={payStatusList.CONTRACT_ID} /></TableCell>
                <TableCell>{payStatusList.CONTRACT_ID}</TableCell>
                <TableCell>{payStatusList.MEMBER_NM}</TableCell>
                <TableCell>{payStatusList.PAY_PLAN_DATE}</TableCell>
                <TableCell>{payStatusList.PAYED_FLAG}</TableCell>
                <TableCell>{payStatusList.PAYED_DATE=== '00-00-00'||null ? '' :payStatusList.PAYED_DATE}</TableCell>
                <TableCell>{payStatusList.START_DATE} ~ {payStatusList.END_DATE}</TableCell>
                <TableCell>{payStatusList.NAME}</TableCell>
                <TableCell>{payStatusList.EMP_HP}</TableCell>
                <TableCell>{payStatusList.EMP_EMAIL}</TableCell>
            </TableRow>
        )
    });


    const pageCount = Math.ceil(payStatusList.length / usersPerPage);
    const changePage = ({ selected }) => {
        setPageNumber(selected);
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
    
        axios.post('/api/s010100150/userLogout')
        .then(response => {
          if (response.data.logoutResult == true) {
            alert('로그아웃 하였습니다.');
            sessionStorage.removeItem('member');
            sessionStorage.clear();
            props.history.push('/');
            // console.log (sessionStorage.getItem('member'));
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
                <AppBar position='absolute' className={clsx(classes.appBar, open && classes.appBarShift)}>
                    <Toolbar className={classes.toolbar}>
                        <IconButton
                            edge='start'
                            color='inherit'
                            aria-label='open drawer'
                            onClick={handleDrawerOpen}
                            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography component='h1' variant='h6' color='inherit' noWrap className={classes.title}>
                        SwonTech 고객관리시스템
                        </Typography>
                        
                    </Toolbar>
                </AppBar>
                {/* 왼쪽 메뉴바 */}
                <Drawer
                    variant='permanent'
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
                    <Container maxWidth='lg' className={classes.container}>
                        <Grid container spacing={3}>
                            {/* Chart */}
                            <Grid item xs={12}>
                                <Paper className={classes.paper}>
                                    <form
                                        onSubmit={onSubmitHandler}
                                    >
                                        납부예정일&nbsp;
                   
                                        <DatePicker
                                            locale='ko'
                                            selected={startDate}
                                            onChange={date => setStartDate(date)}
                                            selectsStart
                                            startDate={startDate}
                                            endDate={endDate}
                                            defaultValue={moment(moment().date('01'),'YYYY-MM-DD')}
                                        /> &nbsp;~&nbsp;
                                        <DatePicker
                                            locale='ko'
                                            selected={endDate}
                                            onChange={date => setEndDate(date)}
                                            selectsEnd
                                            startDate={startDate}
                                            endDate={endDate}
                                            minDate={startDate}
                                            defaultValue={moment(moment(),'YYYY-MM-DD')}
                                        />

                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    회원명&nbsp;

                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size='sm' type='text'
                                            value={userName}
                                            id='userName'
                                            name='userName'
                                            onChange={nameSearchHandler} />

                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    납부여부&nbsp;
                    
                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size='sm' as='select'
                                            multiple={false} onChange={paymentStatusHandler} value={paymentStatus}>
                                            {paymentState.map(item => (
                                                <option key={item.key} value={item.key}>{item.value}</option>
                                            ))}

                                        </Form.Control>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button variant='contained' style={{ width: 80 }} color='primary' onClick={paymentSearchHandler}>
                                            조회
                    </Button>

                                    </form>

                                </Paper>
                            </Grid>
                            <table className='btn'>
                                <thead>
                                    <tr>
                                        <td id="alignLeft">
                                            <Button variant='contained' style={{ width: 80 }} color='primary' onClick = {onPaymenthandler}> 납부 </Button>
                                        </td>
                                        <td id="alignRight">
                                            <Button variant='contained' style={{ width: 140 }} color='primary' onClick = {excelHandler} >엑셀다운로드 </Button>
                                        </td>
                                    </tr>
                                </thead>
                            </table>

                            {/* 결과 테이블 */}
                            <Grid item xs={12}>
                                <Paper className={classes.paper}>
                                    <React.Fragment>
                                        <Title>납부 현황</Title>
                                        <Table size='small'>

                                            <TableHead>
                                                <TableRow>
                                                    <TableCell rowSpan='2'>선택</TableCell>
                                                    <TableCell rowSpan='2'>No</TableCell>
                                                    <TableCell rowSpan='2'>회원명</TableCell>
                                                    <TableCell rowSpan='2'>납부예정일</TableCell>
                                                    <TableCell rowSpan='2'>납부여부</TableCell>
                                                    <TableCell rowSpan='2'>납부일자</TableCell>
                                                    <TableCell rowSpan='2'>계약기간</TableCell>
                                                    <TableCell colSpan='3'>대표자</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>성명</TableCell>
                                                    <TableCell>연락처</TableCell>
                                                    <TableCell>E-mail</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {displayPayStList}
                                            </TableBody>
                                        </Table>

                                    </React.Fragment>
                                    <div id='reactPage'>
                                        <ReactPaginate
                                            previousLabel={'Previous'}
                                            nextLabel={'Next'}
                                            pageCount={pageCount}
                                            onPageChange={changePage}
                                            containerClassName={'paginationBtns'}
                                            previousLinkClassName={'previousBtn'}
                                            nextLinkClassName={'nextBtn'}
                                            disabledClassName={'paginationDisabled'}
                                            activeClassName={'paginationActive'}
                                        />
                                    </div>

                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </main>
            </div>

            <Dialog
                maxWidth={'lg'}
                open={storeOpen}
                onClose={onPayHandleClickClose}>
                <S010100070 
                    dataContracId={dataAllContract} 
                    onPayHandleClickClose={onPayHandleClickClose} 
                    setStoreOpen={setStoreOpen}
                    setPayChecked={setPayChecked}
                    paymentList = {paymentList}
                />
            </Dialog>
        </Fragment>
    );

}

export default S010100060;