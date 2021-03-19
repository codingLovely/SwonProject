import React, { Fragment, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import S010100150 from './S010100150';

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
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';


import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import { Link } from 'react-router-dom';

import "antd/dist/antd.css";


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


function ScreenLayout(props) {

    const classes = useStyles();

    const [open, setOpen] = useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

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

    const logoutConfirm = () => {

        axios.post('/api/s010100150/userLogout')
        .then(response => {
            if (response.data.logoutResult == true) {

            alert('로그아웃 하였습니다.');
            
            sessionStorage.removeItem('member');
            sessionStorage.clear();
            
            props.history.push('./');
            console.log(props.history);
          
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



    return (
        <div>
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
                    <form>
                        <div className={classes.appBarSpacer} />
                        

                    </form>
                </main>
            </div>
        </div>
    );

}

export default  ScreenLayout;