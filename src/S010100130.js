import React, { Fragment, useEffect, useState, useCallback } from 'react';
import './css/S010100130.css';
import axios from 'axios';
import S010100140 from './S010100140';

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
let chkSt = '';

function S010100130(props) {

    const classes = useStyles();

    const [open, setOpen] = React.useState(true);
    const [mOpen, setMOpen] = React.useState(false);
    const [storeOpen, setStoreOpen] = React.useState(false);
    
    const [data] = useState('I');

    const [numForDetail, setNumForDetail] = useState('');
    const [tb_s10_ask010, setTb_s10_ask010] = useState([].slice(0,20));
    const [ask_tps, setAsk_tps] = useState([{}])
    const [startAsk_date, setStartAsk_date] = useState(new Date());
    const [endAsk_date, setEndAsk_date] = useState(new Date());

    // 문의구분
    const [ask_tp, setAsk_tp] = useState('');
    // 문의자명
    const [ask_name, setAsk_name] = useState('');
    // 삭제
    const [checkForDelete, setCheckForDelete] = useState(true);
    const [checked, setChecked] = useState([]);

    // 페이징
    const [pageNumber,setPageNumber] = useState(0);
    const usersPerPage = 20;
    const pagesVisited = pageNumber * usersPerPage;
    const pageCount = Math.ceil(tb_s10_ask010.length/usersPerPage);
    
    const changePage = ({selected}) => {
        setPageNumber(selected);
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const searchAsk = () => {
        const body = {
            startAsk_date,
            ask_name,
            ask_tp,
            endAsk_date
        }
        // // console.log('startAsk_date',startAsk_date);
        // // console.log('endAsk_date',endAsk_date);

        axios.post("/api/s010100130/search", body).then(response => {
            if (response.data.success) {
                // // console.log('검색결과:'+response.data.rows);
                setTb_s10_ask010(response.data.rows);
            } else {
                alert('검색에 실패하였습니다.')
            }
        })
    }

    useEffect(() => {
        searchAsk();
    }, []);

    // 문의 구분
    useEffect(() => {
        axios.post('/api/s010100130/ask_tp')
            .then(response => {
                if (response.data.success) {
                    //// console.log('Lov-ask_tp',response.data);
                    let arr = [{ key: '전체', value: '전체' }]

                    response.data.rows.map((data) =>
                        arr.push({
                            value: data.CD_V_MEANING, key: data.CD_V
                        }));

                    setAsk_tps(arr);

                } else {
                    alert("문의구분 데이터를 불러오는데 실패하였습니다.");
                }
            })
    }, [])
    
    // 상담등록 모달
    const onHandleClickOpen = () => {
        //// console.log('상담열기');
        setStoreOpen(true);

    };
    

    const onHandleClickClose = useCallback(() => {
        setStoreOpen(false);
        searchAsk();
    });

    // 상세보기 모달
    const onDetailHandleClickOpen = (event) => {
        //// console.log('target',event.target.id);
        num = event.target.id;
        rNum = parseInt(num);
        setNumForDetail(rNum);
        setMOpen(true);
    };

    const onDetailHandleClickClose = useCallback(() => {
        setMOpen(false);
        searchAsk();

    });
    

    const handleToggle = (value) => {

        const currentIndex = checked.indexOf(value);
        // 전체 Checked된 State에서 현재 누를 Checkbox가 있는지 확인
        const newChecked = [...checked];

        if (currentIndex === -1) {
        
            newChecked.push(value)
        } else {
            newChecked.splice(currentIndex, 1)
        }
        setChecked(newChecked);

        newChecked.length > 0 ? chkSt = 'check' : chkSt = ''; 
        // // console.log('chkSt',chkSt);
        // // console.log('newChecked.length',newChecked.length);

    }

    const onAsk_tpHandler = (event) => {
        setAsk_tp(event.currentTarget.value);
    }

    const onAsk_nameHandler = (event) => {
        setAsk_name(event.currentTarget.value);
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

        if (checked.length === 0) {
            alert('삭제할 사용자를 선택하세요');
        }  else {
            let askIdArray = checked;
       
            axios.post('/api/s010100130/delete', askIdArray)
                .then(response => {
                    if (response.data.success) {
                            alert('삭제 하였습니다.');
                            searchAsk();
                    } else {
                        alert(response.data.message);
                        alert("삭제에 실패하였습니다.")
                    }
                })
            chkSt = '';        
        
            setChecked([]);
            setCheckForDelete(true);
        }

    }

    const cancelConfirm = () => alert('삭제를 취소하였습니다.');

    const onHandleDelete = useConfirm(
        "삭제하시겠습니까?",
        approvalConfirm,
        cancelConfirm
    );


    // 조회 
    const onHandleFormSubmit = (event) => {
        event.preventDefault();

        const body = {
            startAsk_date,
            ask_name,
            ask_tp,
            endAsk_date
        }
    
        axios.post("/api/s010100130/search", body).then(response => {
            if (response.data.success) {
                // // console.log('검색결과:'+response.data.rows);
                setTb_s10_ask010(response.data.rows);
            } else {
                alert('검색에 실패하였습니다.')
            }
        })

    }


    const logoutConfirm = () => {

    axios.post('/api/s010100150/userLogout')
    .then(response => {
        if (response.data.logoutResult == true) {
        alert('로그아웃 하였습니다.');
        sessionStorage.removeItem('member');
        sessionStorage.clear();
        props.history.push('/');
        // console.log(sessionStorage.getItem('member'));
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
        // const body = {
        //     startAsk_date,
        //     ask_name,
        //     ask_tp,
        //     endAsk_date
        // }

        // axios.post('/api/s010100130/xlsx', body).then(response => {
        //     if (response.data.success) {
        //         setAskXlsx(response.data.rows);
        //         console.log(response.data.rows);
        //     } else {
        //         alert('검색에 실패하였습니다.')
        //     }
       


        const ws = xlsx.utils.json_to_sheet(tb_s10_ask010);
        // console.log(tb_s10_ask010);

        ['NO', '문의구분', '문의일자', '문의방법', '접근경로', '문의자명', '연락처']
            .forEach((x, idx) => {
                const cellAdd = xlsx.utils.encode_cell({ c: idx, r: 0 });
                ws[cellAdd].v = x;

            })

        ws['!cols'] = [];
        ws['!cols'][0] = { hidden: true };


        const wb = xlsx.utils.book_new();

        xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
        xlsx.writeFile(wb, "상담현황.xlsx");
    // })
    }

    
    
    const displayUsers = tb_s10_ask010.slice(pagesVisited,pagesVisited + usersPerPage).map((tb_s10_ask010, index) => {
        return (
            <TableRow key={tb_s10_ask010.ASK_ID}>
                    <TableCell >
                <input  key={tb_s10_ask010.ASK_ID+1} checked ={checked.indexOf(tb_s10_ask010.ASK_ID) === -1 ? false : true}type="checkbox" onChange={()=>handleToggle(tb_s10_ask010.ASK_ID)} id={tb_s10_ask010.ASK_ID} />
                </TableCell>
                <TableCell onClick={onDetailHandleClickOpen} id={tb_s10_ask010.ASK_ID} className='underLineForDetail'>{tb_s10_ask010.ASK_ID}</TableCell>
                <TableCell >{tb_s10_ask010.ASK_TP}</TableCell>
                <TableCell >{tb_s10_ask010.ASK_DATE}</TableCell>
                <TableCell >{tb_s10_ask010.ASK_METHOD}</TableCell>
                <TableCell >{tb_s10_ask010.ASK_NAME}</TableCell>
                <TableCell >{tb_s10_ask010.ASK_INFO}</TableCell>
                <TableCell >{tb_s10_ask010.ASK_PATH}</TableCell>
            </TableRow>
           
        );
    });


    
   
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
                    <Divider/>
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
                    <form onSubmit={onHandleFormSubmit}>
                        <div className={classes.appBarSpacer} />
                        <Container maxWidth="lg" className={classes.container}>
                            <Grid container spacing={3}>
                                {/* Chart */}
                                <Grid item xs={12}>
                                    <Paper style={{ padding: 16 }}>

                                        <div className="gridInline">

                                            문의일자
                                            &nbsp;
                                        
                                            <DatePicker
                                                locale="ko"
                                                selected={startAsk_date}
                                                onChange={date => setStartAsk_date(date)}
                                                selectsStart
                                                startDate={startAsk_date}
                                                // endDate={endAsk_date.setHours(9, 0, 0, 0)}
                                                endDate={endAsk_date}
                                                dateFormat="yyyy.MM.dd"
                                                defaultValue={moment(moment(),'YYYY-MM-DD')}
                                            />
                                          &nbsp;
                                        ~ &nbsp;
                                        <DatePicker
                                                locale="ko"
                                                selected={endAsk_date}
                                                onChange={date => setEndAsk_date(date)}
                                                selectsEnd
                                                startDate={startAsk_date}
                                                endDate={endAsk_date}
                                                minDate={startAsk_date}
                                                defaultValue={moment(moment(),'YYYY-MM-DD')}
                                            />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                            문의구분
                                            &nbsp;

                                                                <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" as="select" multiple={false} onChange={onAsk_tpHandler} value={ask_tp}>
                                                                    {ask_tps.map((item,index) => (
                                                                        <option key={index} value={item.key}>{item.value}</option>
                                                                    ))}

                                                                </Form.Control>
                                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;


                                            문의자명
                                            &nbsp;
                                            <Form.Control style={{ width: 7 + 'em', display: 'inline' }} size="sm" type="text" value={ask_name} id="ask_name" name="ask_name" onChange={onAsk_nameHandler} />
                                            &nbsp;
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
                                            <td colSpan="5"id = "alignLeft" >
                                                
                                                    <Button variant="contained" color="primary" style={{ width: 100 }} onClick={onHandleClickOpen} >
                                                        상담등록
                                                    </Button>
                                                    <Button variant="contained" color="primary"  style={{ width: 100 }} onClick={onHandleDelete}
                                                        value="삭제하기" >
                                                        삭제하기
                                                    </Button>
                                                
                                            </td>
                                            
                                            <td  id="alignRight"><Button variant="contained" style={{ width: 150 }} color="primary" onClick={excelHandler}>엑셀다운로드</Button></td>
                                        </tr>                                
                                    </thead>
                                </table>


                                {/*상담현황 테이블 */}
                                <Grid item xs={12}>
                                    <Paper className={classes.paper}>
                                    <React.Fragment>
                                            <Title>상담 현황</Title>
                                            <Table size="small">

                                            <TableHead>
                                                <TableRow>
                                                <TableCell>선택</TableCell>
                                                <TableCell>No</TableCell>
                                                <TableCell>문의구분</TableCell>
                                                <TableCell>문의일자</TableCell>
                                                <TableCell>문의방법</TableCell>
                                                <TableCell>문의자명</TableCell>
                                                <TableCell>연락처</TableCell>
                                                <TableCell>접근경로</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                { displayUsers}
                                            </TableBody>
                                            </Table>
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
                                        </React.Fragment>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Container>
                    </form>
                </main>
            </div>
           
            <Dialog
                maxWidth={"lg"}
                open={mOpen}>
                <S010100140 
                    dataForm={"U"} 
                    num={numForDetail} 
                    searchAsk ={searchAsk} 
                    onDetailHandleClickClose={onDetailHandleClickClose} 
                    setMOpen={setMOpen}/>
            </Dialog>
                      
            <Dialog
                maxWidth={"lg"}
                open={storeOpen}>
                <S010100140 
                    dataForm={data} 
                    num={numForDetail} 
                    searchAsk ={searchAsk} 
                    onHandleClickClose={onHandleClickClose} 
                    setStoreOpen={setStoreOpen} />
            </Dialog>
           
        </Fragment>
    );

}

export default S010100130;