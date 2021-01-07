import React,{ Component, Fragment,useState } from 'react';
import Main from'../Main/Main.js';

//<!--켈린더 라이브러리시작
import DatePicker, { registerLocale } from "react-datepicker";
import ko from 'date-fns/locale/ko';

registerLocale("ko", ko);
//켈린더 라이브러리 끝-->




function  MemberInfo (props) {

    
    const[staffName, setStaffName] = useState("")
    const[staffClass, setStaffClass] = useState([])
    const[closeStatus, setCloseStatus] = useState([])
    
    
    //<!--캘린더 속성 
    const [startDate, setStartDate] = useState(new Date("2020/01/01"));
    const [endDate, setEndDate] = useState(new Date("2022/01/01"));
    //캘린더 속성 끝--> 


    //<!--onSubmit
      const onSubmitHandler=(event)=>{
        event.preventDefault();
      }
    //onSubmit끝-->
    
    const staffNameHandler=(event)=>{
        setStaffName(event.currentTarget.value);
    }

    const staffClassHandler=(event)=>{
        setStaffClass(event.currentTarget.value);
    }
    
    const closeStatusHandler=(event)=>{
        setCloseStatus(event.currentTarget.value);
    }

    const onRegistHandler = (event)=>{

    }
    const onModifyHandler = (event)=>{
        
    }
    const onApprovalHandler = (event)=>{
        
    }
  
      return (
            <Fragment>
                <Main/>
                <div style={{display:'flex', justifyContent:'center',alignItems:'center',width:'100%'}}>
                    <form style = {{display:'flex', flexDirection:'column'}}
                     onSubmit={onSubmitHandler}
                    >

                    <h1>회원상세정보</h1>
                    <table>
                        <tr>
                            <th>회원명</th>
                            <td>에스원테크</td>
                            <th>사업자번호</th>
                            <td>105-22-2222</td>
                            <th>회원구분</th>
                            <td>법인</td>
                            <th>퇴실일자</th>
                        </tr>
                    </table>
                   
                    계약정보
                    <table id = "list">
                        <tr>
                            <th>계약ID</th>
                            <th>계약일자</th>
                            <th>계약상품</th>
                            <th>호실</th>
                            <th>계약기간</th>
                            <th>계약상태</th>
                            <th>매월입금일</th>
                            <th>월회비</th>
                            <th>사물함</th>
                            <th>종료여부</th>
                        </tr>
    
                    </table>

                    </form>
                </div>
            </Fragment>
      );
    
  }
  
  export default MemberInfo;