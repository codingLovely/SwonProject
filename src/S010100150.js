import axios from 'axios';
import React,{Fragment} from 'react';
import {useState} from 'react';
import Navbar from'./Navbar.js';


function S010100150( props){
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
          <Navbar/>
            <form style = {{display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center',width:'100%',height:'50vh'}}
             onSubmit={onSubmitHandler}
            >
              
                <label style={{fontFamily:'Jua',width:'180px'}}>Email</label>
                <input style={{width:"300px"}} type = "email" value={E_mal} onChange={onEmailHandler} />
                <label style={{fontFamily:'Jua'}}>Password</label>
                <input style={{width:"300px"}} type = "password" value={Password} onChange={onPasswordHandler}/>
                <br/>
                <button type="submit">Login</button>
            
            
            </form>   
          </Fragment>
    )
}

export default S010100150;