//<<상담현황 페이지>>
import React, { Fragment, useEffect, useState } from 'react';
import './css/S010100130.css';
import axios from 'axios';
import S010100140 from './S010100140';
import Pagination from "./utils/Pagination";
import 'react-datepicker/dist/react-datepicker.css';

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
import Orders from './Orders';
import Button from '@material-ui/core/Button';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';

import Form from 'react-bootstrap/Form';

//엑셀다운로드
import xlsx from 'xlsx';

//<!--모달창 라이브러리
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
//모달창 라이브러리 끝-->

//<!--켈린더 라이브러리시작
import DatePicker, { registerLocale } from "react-datepicker";
import ko from 'date-fns/locale/ko';
registerLocale("ko", ko);

// import 'react-datepicker/dist/react-datepicker-cssmodules.min.css';
//켈린더 라이브러리 끝-->


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


let num = '';
let rNum = 0;

function S010100130(props) {

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


    const [data] = useState('I');
    //console.log(data);
    const [numForDetail, setNumForDetail] = useState('')
    //TB_S10_ASK010 테이블 조회
    const [tb_s10_ask010, setTb_s10_ask010] = useState([])
    const [deleteAskOpen, setDeleteAskOpen] = React.useState(false);

    //페이징
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(20);

    const [ask_tps, setAsk_tps] = useState([{}])

    useEffect(() => {
        searchAsk();
    }, [])


    const searchAsk = () => {
        const body = {
            startAsk_date,
            ask_name,
            ask_tp,
            endAsk_date
        }

        axios.post("/api/s010100130/search", body).then(response => {
            if (response.data.success) {
                //console.log('검색결과:'+response.data.rows);
                setTb_s10_ask010(response.data.rows);
            } else {
                alert('검색에 실패하였습니다.')
            }
        })
    }
    //<Lov(List of Value)를 데이터 베이스에서 가져오기

    //select-option
    const [ask_tp, setAsk_tp] = useState('')

    //문의 구분
    useEffect(() => {
        axios.post('/api/s010100130/ask_tp')
            .then(response => {
                if (response.data.success) {
                    //console.log('Lov-ask_tp',response.data);
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
    //lov 끝>

    //<상담등록 모달
    const onHandleClickOpen = (event) => {
        //console.log('상담열기');
        setStoreOpen(true);

    };

    //상담등록 닫기 할 때 새로고침해서 가져오는 것
    const onHandleClickClose = (event) => {
        setStoreOpen(false);
        searchAsk();
    };
    //상담등록 모달 끝>


    // //<상세보기 모달
    const onDetailHandleClickOpen = (event) => {
        //console.log('target',event.target.id);
        num = event.target.id;
        rNum = parseInt(num);
        setNumForDetail(rNum);
        setMOpen(true);
    };

    const onDetailHandleClickClose = () => {
        setMOpen(false);
        searchAsk();

    };
    //상세보기 모달 끝>
    //모달창 속성 및 이벤트 끝--!>


    const [checkForDelete, setCheckForDelete] = useState(true);

    const onDeleteHandle = () => {
        setCheckForDelete(false);
    }

    const onBackHandle = () => {
        setCheckForDelete(true);
        setChecked([]);
    }

    const [checked, setChecked] = useState([]);

    const handleToggle = (e) => {
        //console.log('event', e.target.id);


        const currentIndex = checked.indexOf(e.target.id);
        //전체 Checked된 State에서 현재 누를 Checkbox가 있는지 확인
        const newChecked = checked;

        if (currentIndex === -1) {
            newChecked.push(e.target.id)
        } else {
            newChecked.splice(currentIndex, 1)
        }
        setChecked(newChecked);

    }

    //문의자명 속성
    const [ask_name, setAsk_name] = useState("")

    //문의구분 select-option이벤트
    const onAsk_tpHandler = (event) => {
        setAsk_tp(event.currentTarget.value);
    }

    //문의자명 input type = "text"이벤트
    const onAsk_nameHandler = (event) => {
        setAsk_name(event.currentTarget.value);
    }

    const onHandleDelete = (event) => {
        setDeleteAskOpen(true);
    }

    const handleClose = (event) => {
        setDeleteAskOpen(false);
    }

    const deleteHandle = (event) => {
        let askIdArray = checked;
        //console.log(askIdArray);
        //'/api/s010100130/delete'
        axios.post('/api/s010100130/delete', askIdArray)
            .then(response => {
                if (response.data.success) {
                    // //console.log('상담닫기',response.data.rows)
                    // setTb_s10_ask010(response.data.rows)
                } else {
                    alert("error")
                }

            })

        setDeleteAskOpen(false);

        const body = {
            startAsk_date,
            ask_name,
            ask_tp,
            endAsk_date
        }

        axios.post("/api/s010100130/search", body).then(response => {
            if (response.data.success) {
                //console.log('검색결과:'+response.data.rows);
                setTb_s10_ask010(response.data.rows);
            } else {
                alert('검색에 실패하였습니다.')
            }
        })

        setChecked([]);
        onBackHandle();
    }


    //캘린더 속성
    const [startAsk_date, setStartAsk_date] = useState(new Date());
    const [endAsk_date, setEndAsk_date] = useState(new Date());


    // 조회 <!--onSubmit
    const onHandleFormSubmit = (event) => {
        //console.log('조회', event);

        event.preventDefault();

        // if(method.valueOf('전체')||!startDate||!endDate||!searchName){
        //     return alert("값을 입력하세요")
        // }

        const body = {
            startAsk_date,
            ask_name,
            ask_tp,
            endAsk_date
        }

        //console.log('ask_tp', ask_tp);
        //console.log("조회조건", body);
        // alert('startDate day:'+startAsk_date.getDay());
        // alert('endDate year:'+endAsk_date.getFullYear());
        // alert('endDate day:'+endAsk_date.getDate());
        // alert('endDate month:'+endAsk_date.getMonth()+1);
        // alert(endAsk_date.getFullYear() + '/' + (endAsk_date.getMonth()+1) +'/'+endAsk_date.getDate());
        // alert('startDate:'+startAsk_date.getMonth());

        axios.post("/api/s010100130/search", body).then(response => {
            if (response.data.success) {
                //console.log('검색결과:'+response.data.rows);
                setTb_s10_ask010(response.data.rows);
            } else {
                alert('검색에 실패하였습니다.')
            }
        })

    }

    const excelHandler = (event) => {

        event.preventDefault();

        const ws = xlsx.utils.json_to_sheet(tb_s10_ask010);
        console.log(tb_s10_ask010);

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

    }

    const s010100130R =tb_s10_ask010.map((tb_s10_ask010, index) => {
        return (
            <TableRow key={tb_s10_ask010.ASK_ID}>
            <TableCell id="chkLine" hidden={checkForDelete}>
            <input type="checkbox" onChange={handleToggle} id={tb_s10_ask010.ASK_ID} />
            </TableCell>
            <TableCell  onClick={onDetailHandleClickOpen} id={tb_s10_ask010.ASK_ID} >{index + 1}</TableCell>
            <TableCell>{tb_s10_ask010.ASK_TP}</TableCell>
            <TableCell>{tb_s10_ask010.ASK_DATE}</TableCell>
            <TableCell>{tb_s10_ask010.ASK_METHOD}</TableCell>
            <TableCell>{tb_s10_ask010.ASK_NAME}</TableCell>
            <TableCell>{tb_s10_ask010.ASK_INFO}</TableCell>
            <TableCell>{tb_s10_ask010.ASK_PATH}</TableCell>
            </TableRow>
         )
    });
    // const s010100130R = tb_s10_ask010.map((tb_s10_ask010, index) => {
    //     return (
    //         <tr className='dataTable'>
    //             <td id="chkLine" hidden={checkForDelete}>
    //                 {/*밑줄처리*/}
    //                 <span id="underLine"><input type="checkbox" onChange={handleToggle} id={tb_s10_ask010.ASK_ID} /></span></td>

    //             {/*<input type = "checkbox" onChange={onCheckboxHandler} id={tb_s10_ask010.ASK_ID}/>*/}
    //             <td className="cname" name="cname" variant="outlined" color="primary" onClick={onDetailHandleClickOpen} id={tb_s10_ask010.ASK_ID}>
    //                 {index + 1}</td>
    //             <td>{tb_s10_ask010.ASK_TP}</td>
    //             <td >{tb_s10_ask010.ASK_DATE}</td>
    //             <td>{tb_s10_ask010.ASK_METHOD}</td>
    //             <td>{tb_s10_ask010.ASK_NAME}</td>
    //             <td >{tb_s10_ask010.ASK_INFO}</td>
    //             <td>{tb_s10_ask010.ASK_PATH}</td>
    //         </tr>
    //     )
    // });

    //Get current tb_s10_ask010;
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = s010100130R.slice(indexOfFirstPost, indexOfLastPost);


    //Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);
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
                                        {/* date클릭할 때 고정 */}
                                            <DatePicker
                                                locale="ko"
                                                selected={startAsk_date}//Front = 한국시 BackEnd = 표준시 9시간차이
                                                onChange={date => setStartAsk_date(date)}
                                                selectsStart
                                                startDate={startAsk_date}
                                                endDate={endAsk_date.setHours(9, 0, 0, 0)}
                                                dateFormat="yyyy.MM.dd"
                                            />&nbsp;
                                        ~ &nbsp;
                                        <DatePicker
                                                locale="ko"
                                                selected={endAsk_date}//Front = 한국시 BackEnd = 표준시 9시간차이
                                                onChange={date => setEndAsk_date(date)}
                                                selectsEnd
                                                startDate={startAsk_date}
                                                endDate={endAsk_date}
                                                minDate={startAsk_date}
                                                dateFormat="yyyy.MM.dd"
                                            />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;


                                        {/* <input type="image" src="/examples/images/submit_icon.png" alt="제출버튼" height="30" width="30"/> */}


                                            문의구분
                                            &nbsp;

                                                                <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" as="select" multiple={false} onChange={onAsk_tpHandler} value={ask_tp}>
                                                                    {ask_tps.map(item => (
                                                                        <option key={item.key} value={item.key}>{item.value}</option>
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
                                            <td colSpan="5" >
                                                <Button variant="contained" color="primary" style={{ width: 100 }} onClick={onHandleClickOpen} >
                                                    상담등록
                                                </Button>
                                                <Button variant="contained" color="primary" hidden={!checkForDelete} style={{ width: 100 }} onClick={onDeleteHandle}
                                                    value="삭제하기" >
                                                    삭제하기
                                                        </Button>
                                                <Button variant="contained" color="primary" onClick={onHandleDelete} value="삭제"
                                                    hidden={checkForDelete} >
                                                    삭제
                                                        </Button>
                                                <Dialog
                                                    open={deleteAskOpen}
                                                    onClose={onHandleDelete}>
                                                    <DialogTitle id="alert-dialog-title">{"체크한 행을 삭제할까요?"}</DialogTitle>
                                                    <DialogActions>
                                                        <Button onClick={deleteHandle} color="primary">
                                                            네
                                                        </Button>
                                                        <Button onClick={handleClose} color="primary" autoFocus>
                                                            아니오
                                                        </Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </td>
                                            <td  id="alignRight"><Button variant="contained" style={{ width: 150 }} color="primary">엑셀다운로드</Button></td>
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
                                                <TableCell id='chkWidth' hidden={checkForDelete}></TableCell>
                                                <TableCell id='chkWidth' hidden={checkForDelete}>No</TableCell>
                                                <TableCell id='chkWidth' hidden={!checkForDelete} >No</TableCell>
                                                <TableCell>문의구분</TableCell>
                                                <TableCell>문의일자</TableCell>
                                                <TableCell>문의방법</TableCell>
                                                <TableCell>문의자명</TableCell>
                                                <TableCell>연락처</TableCell>
                                                <TableCell>접근경로</TableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                            {currentPosts}
                                            </TableBody>
                                            </Table>
                                            
                                        </React.Fragment>

                                    </Paper>
                                </Grid>
                            </Grid>
                            <Pagination postsPerPage={postsPerPage} totalPosts={s010100130R.length} paginate={paginate} /> 

                        </Container>
                    </form>
                </main>
            </div>


            {/* 모달창 시작*/}
            <Dialog
                maxWidth={"lg"}
                open={mOpen}>
                <S010100140 dataForm={"U"} num={numForDetail} />
                <DialogActions>
                    <input type="button" onClick={onDetailHandleClickClose} color="primary" value='닫기' />
                </DialogActions>
            </Dialog>
            {/* // 모달창 끝 */}


            {/* 모달창 시작*/}
            <Dialog
                maxWidth={"lg"}
                open={storeOpen}
            >
                <S010100140 dataForm={data} num={numForDetail} />
                <DialogActions>
                    <input type="button" onClick={onHandleClickClose} color="primary" value='닫기' />
                </DialogActions>
            </Dialog>
            {/* // 모달창 끝 */}

        </Fragment>
    );

}

export default S010100130;