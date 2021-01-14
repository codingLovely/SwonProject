// import { Component, Fragment } from 'react';
// import {useDispatch} from 'react-redux';
//import {loginUser} from '../_actions/user_action';
import axios from 'axios';
import React,{Fragment} from 'react';
import {useState} from 'react';
import Main from'../Main/Main.js'


function LoginPage( props){
  // const dispatch = useDispatch();

  const [E_mal,setE_mal] = useState("")
  const [Password, setPassword] = useState("")

  const onEmailHandler = (event) => {
    setE_mal(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }

  const onSubmitHandler = (event) => {
    event.preventDefault();

    let body = {
        Email: E_mal,
        PASSWORD: Password
    }

   axios.post('/api/users/login',body)
        .then(response => {
            if (response.data.loginResult) {
                alert('로그인 되었습니다.')
                //props.history.push('/counseling')
                console.log(response.data.loginResult)
            } else {
                alert('아이디와 비밀번호를 확인하세요')
            }
        })
      }

    return (
      <Fragment>
          <Main/>
          <div style={{display:'flex', justifyContent:'center',alignItems:'center',width:'100%',height:'50vh'}}>
            <form style = {{display:'flex', flexDirection:'column'}}
             onSubmit={onSubmitHandler}
            >
              
                <label style={{fontFamily:'Jua',width:'180px'}}>Email</label>
                <input style={{width:"300px"}} type = "email" value={E_mal} onChange={onEmailHandler} />
                <label style={{fontFamily:'Jua'}}>Password</label>
                <input style={{width:"300px"}} type = "password" value={Password} onChange={onPasswordHandler}/>
                <br/>
                <button type="submit">Login</button>
            
            
            </form>
          </div>
         
          </Fragment>
    )
}

export default LoginPage