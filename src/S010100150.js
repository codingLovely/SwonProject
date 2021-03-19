import React from 'react';
import axios from 'axios';
import { useState } from 'react';
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
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import logos from './css/logos.png';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';

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
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },

}));



function S010100150(props) {

  const classes = useStyles();

  const [open, setOpen] = React.useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
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

  const approvalConfirm = () => {

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

  const cancelConfirm = () => alert('취소하였습니다.');

  const onLogoutHandler = useConfirm(
      "로그아웃 하시겠습니까?",
      approvalConfirm,
      cancelConfirm
  );


  const onSubmitHandler = (event) => {
    event.preventDefault();
    let body = {
      email: email,
      password: password
    }

    axios.post('/api/s010100150/userLogin', body)
      .then(response => {
        if (response.data.loginResult == true) {
          alert('로그인 되었습니다.');
          let arr = [response.data.cf,response.data.mI];
          
          sessionStorage.setItem('member',JSON.stringify(arr));
          props.history.push('/member');       
        }else if(response.data.pwdResult == false){
          alert('비밀번호를 확인하세요');
        }else if(response.data.loginResult == false){
          // alert(response.data.message);
          alert('가입되어 있지 않은 사용자 입니다.');
        }
      })
  }

  return (

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
            <div id = "hey" hidden ={sessionStorage.getItem('member') === null}>
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

            <div hidden = {sessionStorage.getItem('member') != null}>
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
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <div className={classes.paper}>
              <img  src={logos} width="true"></img>

                <div hidden ={sessionStorage.getItem('member') != null}>
                  <Typography component="h1" variant="h5">
                    로그인
                  </Typography>
                </div>
                <div hidden ={sessionStorage.getItem('member') === null} style={{marginTop:'5px'}}>
                  <Typography component="h1" variant="h5">
                    로그아웃
                  </Typography>
                </div>
                <form onSubmit={onSubmitHandler} >
                  <div hidden ={sessionStorage.getItem('member') != null}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="이메일을 입력하세요"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      value={email}
                      onChange={onEmailHandler}
                    />
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="비밀번호를 입력하세요"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={onPasswordHandler}
                    />
                  </div>
                  <div hidden ={sessionStorage.getItem('member') != null}> 
                    <Button type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    > 로그인 </Button>
                  </div>
                  
                  <div hidden ={sessionStorage.getItem('member') === null}>
                    <Button onClick = {onLogoutHandler}
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    > 로그아웃 </Button>
                  </div>
                  <Grid container>
                    <Grid item>
                      <Link href="/findemailPwd" variant="body2">
                      <span hidden ={sessionStorage.getItem('member') != null}>
                        비밀번호초기화
                      </span>
                      </Link>
                    </Grid>
                  </Grid>
     
                </form>
              </div>

            </Container>

          </Grid>
         
        </Container>
      </main>
    </div>

  )
}

export default S010100150;