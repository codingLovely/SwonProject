import React, {useState} from 'react';
import './css/S010100130.css';
import axios from 'axios';

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
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Button from '@material-ui/core/Button';


import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LayersIcon from '@material-ui/icons/Layers';
import { Link } from 'react-router-dom';
import "antd/dist/antd.css";
import Form from 'react-bootstrap/Form';
import {useStyles} from './Test';




function S010100151(props) {

    const classes = useStyles();

    const [open, setOpen] = React.useState(true);

    const [email, setEmail] = useState("")
    const [empRegNo, setEmpRegNo] = useState("")
    const [fstResidentRegiNum, setFstResidentRegiNum] = useState('');
    const [sndResidentRegiNum, setSndResidentRegiNum] = useState('');

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onFstResidentRegiNumHandler = (event) => {
        setFstResidentRegiNum(event.currentTarget.value);
    }


    const onSndResidentRegiNumHandler = (event) => {
        setSndResidentRegiNum(event.currentTarget.value);
    }


    const onSubmitHandler = (event) => {

        event.preventDefault();
        if(email.length === 0) {
            alert('이메일을 입력하세요.');
        }else if(fstResidentRegiNum.length === 0 || sndResidentRegiNum.length === 0){
            alert('주민번호를 입력하세요.');
        }else{
            let body = {
                email: email,
                fstResidentRegiNum: fstResidentRegiNum,
                sndResidentRegiNum: sndResidentRegiNum
            }
           // console.log(body);
    
            axios.post('/api/s010100151/findPwd', body)
                .then(response => {
                    if (response.data.success == true) {
                        alert('비밀번호가 초기화 되었습니다.');
                        props.history.push('/');
                    } else if (response.data.success == false) {
                        alert(response.data.message);
                        alert('이메일 또는 주민번호를 확인하세요..');
                    }
                })
        }
     
        
        
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
                        <div>
                        <ListItem button>
                            <ListItemIcon>
                            <LayersIcon />
                            </ListItemIcon>
                            <span hidden ={sessionStorage.getItem('member') != null}>
                            <Link to ="/"><ListItemText primary="로그인" /></Link>
                            </span>
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

                                <Typography component="h1" variant="h5">
                                    비밀번호 초기화
                                </Typography>

                                <Form onSubmit={onSubmitHandler} >
                                   
                                        <Form.Group>
                                            <Form.Label>Email address</Form.Label>
                                            <Form.Control type="email" placeholder="이메일을 입력하세요" 
                                                value={email}
                                                onChange={onEmailHandler} 
                                                id="email"
                                                name="email"
                                                />
                                            <Form.Text className="text-muted">
                                                We'll never share your email with anyone else.
                                        </Form.Text>
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Label>주민번호</Form.Label>
                                            <Form.Control type="password" placeholder="주민번호를 앞자리를 입력하세요" 
                                                value={fstResidentRegiNum}
                                                onChange={onFstResidentRegiNumHandler} 
                                                name="empRegNo"
                                                
                                                id="empRegNo"
                                               />
                                        </Form.Group>
                                        <Form.Group >
                                            <Form.Control type="password" placeholder="주민번호를 뒷자리를 입력하세요" value={sndResidentRegiNum}
                                                onChange={onSndResidentRegiNumHandler}
                                                name="empRegNo"
                                                id="empRegNo"
                                               />
                                        </Form.Group>
                                   
                                    <Button type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            className={classes.submit}
                                        > 초기화 </Button>
                                </Form>
                            </div>

                        </Container>

                    </Grid>

                </Container>
            </main>
        </div>
    );

}

export default S010100151;