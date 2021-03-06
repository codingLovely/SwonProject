import React, { Fragment, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './css/S010100050.css';
import S010100010 from './S010100010';


import clsx from 'clsx';
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

import { DatePicker } from "antd";
import "antd/dist/antd.css";
import moment from 'moment';

import Form from 'react-bootstrap/Form';

import ReactPaginate from 'react-paginate';

import xlsx from 'xlsx';
import {useStyles} from './Test';

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

  

        axios.post('/api/s010100160/search', body).then(response => {
            if (response.data.success) {
                setContractList(response.data.rows);
            } else {
                alert(response.data.message);
                alert('데이터를 불러오는데 실패 하였습니다.')
            }
        })

    }

    useEffect(() => {

        axios.post('/api/s010100160/contractTp')
            .then(response => {
                if (response.data.success) {
                    
                    let arr = [{ key: '', value: '전체' }]
                    response.data.rows.map((data) =>
                        arr.push({
                            value: data.CD_V_MEANING,
                            key: data.CD_V
                        }));

                    setContractTps(arr);
                } else {
                    alert(response.data.message);
                    alert(" 데이터를 불러오는데 실패하였습니다.");
                }
            })


    }, [])

    useEffect(() => {

        axios.post('/api/s010100160/contractSt')
            .then(response => {
                if (response.data.success) {
                    let arr = [{ key: '', value: '전체' }]

                    response.data.rows.map((data) =>
                        arr.push({
                            value: data.CD_V_MEANING,
                            key: data.CD_V
                        }));
                        //arr.push({key: 'Y', value: '종료' });
                        
                        setContractSts(arr);
                } else {
                    alert(response.data.message);
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
                        SwonTech 고객관리시스템
                    </Typography>
                    
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
                        </div>
                </List>
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