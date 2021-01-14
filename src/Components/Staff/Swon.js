import React,{ Fragment,useState } from 'react';
import Main from'../Main/Main.js';

//<!--켈린더 라이브러리시작
import DatePicker, { registerLocale } from "react-datepicker";
import ko from 'date-fns/locale/ko';

registerLocale("ko", ko);
//켈린더 라이브러리 끝-->




function Swon (props) {

    
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

                    <h1>직원현황</h1>
                    <div id = "search">

                     성명
                    <input type="text" value = {staffName} id="staffName" name="staffName" size = "5"
                    onChange={staffNameHandler}/>
                    &nbsp; 


                    입사일자   
                    {/* date클릭할 때 고정 */}
                        <DatePicker
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                        /> ~ 
                        <DatePicker
                            selected={endDate}
                            onChange={date => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                        />
                    
                        {/* <input type="image" src="/examples/images/submit_icon.png" alt="제출버튼" height="30" width="30"/> */}
                        &nbsp;
                       
                        직원구분
                        <select onChange ={staffClassHandler} value ={staffClass}>  
                    {/*                         
                            {paymentState.map(item => ( 
                                <option key ={item.key} value ={item.key}>{item.value}</option>                          
                            ))}
                     */}
                     
                        </select>
                        종료
                        <select onChange ={closeStatusHandler} value ={closeStatus}>   
                        </select>
                        
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                        <button>조회</button>
                    </div>
                
                   
                    <table id = "btn">
                        <tr>
                            <td id = "btd"> <button className='loginBtn'  onClick={onRegistHandler}> 등록</button> </td>
                            <td id = "btd"> <button className='loginBtn'  onClick={onModifyHandler}> 수정</button> </td>    
                            <td id = "btd"> <button className='loginBtn'  onClick={onApprovalHandler}> 승인</button> </td>                        
                            <td id = "btd2"> <button>엑셀다운로드</button> </td>
                        </tr>
                    </table>

                    <table id = "list">
                        <tr>
                            <th>선택</th>
                            <th>직번</th>
                            <th>성명</th>
                            <th>주민번호</th>
                            <th>부서</th>
                            <th>연락처</th>
                            <th>E-mail</th>
                            <th>직원구분</th>
                            <th>승인여부</th>
                            <th>직급</th>
                        </tr>
    
                    </table>

                    </form>
                </div>
            </Fragment>
      );
    
  }
  
  export default Swon;