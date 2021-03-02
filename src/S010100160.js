import React, { Fragment, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './css/S010100050.css';
import S010100010 from './S010100010';


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
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import { DatePicker } from "antd";
import "antd/dist/antd.css";
import moment from 'moment';

import Form from 'react-bootstrap/Form';

import ReactPaginate from 'react-paginate';

import xlsx from 'xlsx';

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

let num = '';
let rNum = 0;
function S010100160(props) {

    const classes = useStyles();

    const [open, setOpen] = React.useState(true);

    const [startDate, setStartDate] = useState(new Date(moment().date('01')));
    const [endDate, setEndDate] = useState(new Date());

    // 문의구분
    const [contractTp, setContractTp] = useState('');
    // 문의자명
    const [contractSt, setContractSt] = useState('');
    const [contractTps, setContractTps] = useState([{}]);
    const [contractSts,setContractSts] = useState([{}]);
    
    const [contractList,setContractList] = useState([].slice(0,10));
    const [conOpen, setConOpen] = React.useState(false);
    // 페이징
    const [pageNumber,setPageNumber] = useState(0);
    const usersPerPage = 20;
    const pagesVisited = pageNumber * usersPerPage;
    const pageCount = Math.ceil(contractList.length/usersPerPage);
     
  
     const changePage = ({selected}) => {
         setPageNumber(selected);
     }
 
     const handleDrawerOpen = () => {
         setOpen(true);
     };
 
     const handleDrawerClose = () => {
         setOpen(false);
     };

     const allOfcontractList = () => {

        const body = {
            startDate,
            endDate,
            contractTp,
            contractSt
        }

        //console.log('startDate',startDate);
        //console.log('endDate',endDate);

        //console.log('ask_tp', ask_tp);
        //console.log("조회조건", body);
        // alert('startDate day:'+startAsk_date.getDay());
        // alert('endDate year:'+endAsk_date.getFullYear());
        // alert('endDate day:'+endAsk_date.getDate());
        // alert('endDate month:'+endAsk_date.getMonth()+1);
        // alert(endAsk_date.getFullYear() + '/' + (endAsk_date.getMonth()+1) +'/'+endAsk_date.getDate());
        // alert('startDate:'+startAsk_date.getMonth());

        axios.post('/api/contractList/search', body).then(response => {
            if (response.data.success) {
  
                // for(let i = 0; i < response.data.rows.length; i++){
                //     if(response.data.rows[i].END_FLAG == 'Y'){
                //         response.data.rows[i].MEMBER_ST = '종료';
                //     }
                // }
                setContractList(response.data.rows);
                          
            } else {
                alert('데이터를 불러오는데 실패 하였습니다.')
            }
        })

    }

    useEffect(() => {

        axios.post('/api/contractList/contractTp')
            .then(response => {
                if (response.data.success) {
                    
                    let arr = [{ key: '전체', value: '전체' }]
                    response.data.rows.map((data) =>
                        arr.push({
                            value: data.CD_V_MEANING,
                            key: data.CD_V
                        }));

                    setContractTps(arr);
                } else {
                    alert(" 데이터를 불러오는데 실패하였습니다.");
                }
            })


    }, [])

    useEffect(() => {

        axios.post('/api/contractList/contractSt')
            .then(response => {
                if (response.data.success) {
                    let arr = [{ key: '전체', value: '전체' }]

                    response.data.rows.map((data) =>
                        arr.push({
                            value: data.CD_V_MEANING,
                            key: data.CD_V
                        }));
                        //arr.push({key: 'Y', value: '종료' });
                        
                        setContractSts(arr);
                } else {
                    alert(" 데이터를 불러오는데 실패하였습니다.");
                }
            })


    }, [])

    useEffect(() => {
        allOfcontractList();
    }, [])

  
    const onContractTpHandler = (event) => {
        setContractTp(event.currentTarget.value);
    }

    const onContractStHandler = (event) => {
        setContractSt(event.currentTarget.value);
    }

    const onDetailClickOpen = (event) =>{
        num = event.target.innerHTML;
        rNum = parseInt(num);
        //setNameForDetailCModal(rNum);
        setConOpen(true);
     }

     const onConContractHandler  = useCallback(() => {
        setConOpen(false);
    });

    const onHandleFormSubmit = () => {
        allOfcontractList();
    }
  
    const s010100050R = contractList.slice(pagesVisited,pagesVisited + usersPerPage).map((contractList, index) => {
        return (
            <TableRow key={index}>
                <TableCell onClick={onDetailClickOpen} className='underLineForDetail' id={contractList.CONTRACT_ID}>{contractList.CONTRACT_ID}</TableCell>
                <TableCell>{contractList.MEMBER_NM}</TableCell>
                <TableCell>{contractList.CONTRACT_DATE}</TableCell>
                <TableCell>{contractList.CONTRACT_TP}</TableCell>
                <TableCell>{contractList.CONTRACT_ROOM}</TableCell>
                <TableCell>{contractList.CONTRACT_TERM}개월 ({contractList.START_DATE} ~ {contractList.END_DATE})</TableCell>
                <TableCell>{contractList.CONTRACT_ST}</TableCell>
                <TableCell>{contractList.PAY_DATE}일</TableCell>
                <TableCell>{contractList.MONTHLY_FEE}</TableCell>
                <TableCell>{contractList.CONTRACT_LOCKER}</TableCell>
            </TableRow>
        )

    });
    const excelHandler = (event) => {

        event.preventDefault();

        const ws = xlsx.utils.json_to_sheet(contractList);
        //console.log(tb_s10_ask010);

        ['회원명', '사업자번호','회원구분','No', '계약기간', '계약기간', '계약상태', '계약구분', '사물함', '호실' ,'계약기간','매월입금일','월회비','계약상태','시작날짜']
            .forEach((x, idx) => {
                const cellAdd = xlsx.utils.encode_cell({ c: idx, r: 0 });
                ws[cellAdd].v = x;
            })

        ws['!cols'] = [];
        ws['!cols'][1] = { hidden: true };
        ws['!cols'][2] = { hidden: true };
        ws['!cols'][6] = { hidden: true };
        ws['!cols'][11] = { hidden: true };
        ws['!cols'][14] = { hidden: true };


        const wb = xlsx.utils.book_new();

        xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
        xlsx.writeFile(wb, "계약현황.xlsx");

    }





    return (
        <Fragment>

        <div className={classes.root}>
            {/* 백그라운드 */}
            <CssBaseline />
            {/* 상단 파란색 툴바 */}
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

            {/* 왼쪽메뉴바 */}
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


            {/* 메인화면  */}
            <main className={classes.content}>
                    <div className={classes.appBarSpacer} />
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={3}>
                            {/* Chart */}
                            <Grid item xs={12}>
                                <Paper style={{ padding: 16 }}>

                                    <div className="gridInline">

                                        계약일자
                                        &nbsp;
                                    
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

                                        계약구분
                                        &nbsp;

                                                            <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" as="select" multiple={false} onChange={onContractTpHandler} value={contractTp}>
                                                                {contractTps.map((item,index) => (
                                                                    <option key={index} value={item.key}>{item.value}</option>
                                                                ))}

                                                            </Form.Control>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;


                                        계약상태
                                        &nbsp;

                                                            <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" as="select" multiple={false} onChange={onContractStHandler} value={contractSt}>
                                                                {contractSts.map((item,index) => (
                                                                    <option key={index} value={item.key}>{item.value}</option>
                                                                ))}

                                                            </Form.Control>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                        <Button variant="contained" style={{ width: 80, display: 'inline' }} color="primary" onClick={onHandleFormSubmit}>
                                            조회
                                        </Button>
                                    </div>
                                </Paper>
                            </Grid>

                            <table className="btn">
                                <thead>
                                    <tr>
                               
                                        <td  id="alignRight"><Button variant="contained" style={{ width: 150 }} color="primary" onClick={excelHandler}>엑셀다운로드</Button></td>
                                    </tr>                                
                                </thead>
                            </table>


                            {/*계약 현황 테이블 */}
                            <Grid item xs={12}>
                                <Paper className={classes.paper}>
                                <React.Fragment >
                        <Title>계약 현황</Title>
                        <Table size="small">

                            <TableHead>
                                <TableRow>
                                    <TableCell>계약ID</TableCell>
                                    <TableCell>회원명</TableCell>
                                    <TableCell>계약일자</TableCell>
                                    <TableCell>계약구분</TableCell>
                                    <TableCell>호    실</TableCell>
                                    <TableCell>계약기간</TableCell>
                                    <TableCell>계약상태</TableCell>
                                    <TableCell>매월입금일</TableCell>
                                    <TableCell>월회비</TableCell>
                                    <TableCell>사물함</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                               {s010100050R}
                            </TableBody>
                        </Table>
                        <div id="reactPage">
                             <ReactPaginate
                                previousLabel = {"Previous"}
                                nextLabel = {"Next"}
                                pageCount = {pageCount}
                                onPageChange = {changePage}
                                containerClassName={"paginationBtns"}
                                previousLinkClassName={"previousBtn"}
                                nextLinkClassName={"nextBtn"}
                                disabledClassName={"paginationDisabled"}
                                activeClassName={"paginationActive"}  /> 
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
                open={conOpen}
                onClose={onConContractHandler}>
                <S010100010 dataNum={rNum} cDataForm={'I'} onConContractHandler={onConContractHandler}/>
            </Dialog>

    </Fragment>

    );

}

export default S010100160;