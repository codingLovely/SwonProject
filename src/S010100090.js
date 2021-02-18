import React, { Fragment, useState } from 'react';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
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

import { DatePicker } from "antd";
import "antd/dist/antd.css";

// //<!--켈린더 라이브러리시작
// import DatePicker, { registerLocale } from "react-datepicker";
// import ko from 'date-fns/locale/ko';
// registerLocale("ko", ko);
// //켈린더 라이브러리 끝-->

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


function S010100090(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };



    const [staffName, setStaffName] = useState('')
    const [staffClass, setStaffClass] = useState('')
    const [closeStatus, setCloseStatus] = useState('')


    //<!--캘린더 속성 
    const [startDate, setStartDate] = useState(new Date('2020/01/01'));
    const [endDate, setEndDate] = useState(new Date('2022/01/01'));
    //캘린더 속성 끝--> 


    //<!--onSubmit
    const onSubmitHandler = (event) => {
        event.preventDefault();
    }
    //onSubmit끝-->

    const staffNameHandler = (event) => {
        setStaffName(event.currentTarget.value);
    }

    const staffClassHandler = (event) => {
        setStaffClass(event.currentTarget.value);
    }

    const closeStatusHandler = (event) => {
        setCloseStatus(event.currentTarget.value);
    }

    const onRegistHandler = (event) => {

    }
    const onModifyHandler = (event) => {

    }
    const onApprovalHandler = (event) => {

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
                                <Paper className={classes.paper}>
                                    <form onSubmit={onSubmitHandler}>



                                                                            성명&nbsp;
                                   <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" type="text"
                                             value={staffName} id="staffName" name="staffName" 
                                             onChange={staffNameHandler} />

                                    &nbsp;


                                    입사일자   &nbsp;
                                    {/* date클릭할 때 고정 */}
                                        <DatePicker
                                            selected={startDate}
                                            onChange={date => setStartDate(date)}
                                            selectsStart
                                            startDate={startDate}
                                            endDate={endDate}
                                        />&nbsp; ~ &nbsp;
                                        <DatePicker
                                            selected={endDate}
                                            onChange={date => setEndDate(date)}
                                            selectsEnd
                                            startDate={startDate}
                                            endDate={endDate}
                                            minDate={startDate}
                                        />

                                        {/* <input type="image" src="/examples/images/submit_icon.png" alt="제출버튼" height="30" width="30"/> */}
                                        &nbsp;

                                        직원구분&nbsp;
                                        <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" as="select"
                                            multiple={false} onChange={staffClassHandler} value={staffClass}>
                                                {/* {paymentState.map(item => ( 
                                                    <option key ={item.key} value ={item.key}>{item.value}</option>                          
                                                ))} */}
                                        </Form.Control>
                                       &nbsp;
                                        종료&nbsp;
                                        <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" as="select"
                                            multiple={false}  onChange={closeStatusHandler} value={closeStatus}>
                                                {/* {paymentState.map(item => ( 
                                                    <option key ={item.key} value ={item.key}>{item.value}</option>                          
                                                ))} */}
                                        </Form.Control>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                        <Button variant="contained" style={{ width: 80 }} color="primary" href="#contained-buttons">
                                        조회
                                        </Button>


                                    </form>
                                </Paper>
                            </Grid>

                            <table className="btn">
                                    <thead>
                                        <tr>
                                            <td >
                                                <Button variant="contained" style={{ width: 100 }} color="primary" href="#contained-buttons"> 등록 </Button>
                                                <Button variant="contained" style={{ width: 100 }} color="primary" href="#contained-buttons"> 수정 </Button>
                                                <Button variant="contained" style={{ width: 100 }} color="primary" href="#contained-buttons"> 승인 </Button>
                                                <Button variant="contained" style={{ width: 140 }} color="primary" href="#contained-buttons"> 엑셀다운로드 </Button>
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
                                                    <TableCell>직번</TableCell>
                                                    <TableCell>성명</TableCell>
                                                    <TableCell>주민번호</TableCell>
                                                    <TableCell>부서</TableCell>
                                                    <TableCell>연락처</TableCell>
                                                    <TableCell>E-mail</TableCell>
                                                    <TableCell>직원구분</TableCell>
                                                    <TableCell>승인여부</TableCell>
                                                    <TableCell>직급</TableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                           
                                            </TableBody>
                                            </Table>
                                            
                                        </React.Fragment>
                
                                </Paper>
                            </Grid>
                        </Grid>
                        <Box pt={4}>

                        </Box>
                    </Container>
                </main>
            </div>









        </Fragment>
    );

}

export default S010100090;