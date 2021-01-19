import React,{ Fragment,useState } from 'react';
import Navbar from'./Navbar';

//<!--켈린더 라이브러리시작
import DatePicker, { registerLocale } from "react-datepicker";
import ko from 'date-fns/locale/ko';

registerLocale("ko", ko);
//켈린더 라이브러리 끝-->




function S010100060 (props) {

    
    const[userName, setUserName] = useState('')
    const[paymentStatus, setPaymentStatus]=useState('')
    
    //<!--캘린더 속성 
    const [startDate, setStartDate] = useState(new Date('2020/01/01'));
    const [endDate, setEndDate] = useState(new Date('2022/01/01'));
    //캘린더 속성 끝--> 


    //<!--onSubmit
      const onSubmitHandler=(event)=>{
        event.preventDefault();
      }
    //onSubmit끝-->
    
    const nameSearchHandler=(event)=>{
        setUserName(event.currentTarget.value);
    }

    const paymentStatusHandler=(event)=>{
        setPaymentStatus(event.currentTarget.value);
    }
    
    const onPaymenthandler=()=>{
        
    }


  
      return (
            <Fragment>
                <Navbar/>
                    <form style = {{display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center',width:'100%'}}
                     onSubmit={onSubmitHandler}
                    >

                        <h1>고객납부현황</h1>
                        <div id = "search">
                            
                        납부예정일   
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
                            회원명
                            <input type="text" value = {userName} id="userName" name="userName" size = "5"
                            onChange={nameSearchHandler}/>
                            &nbsp; 

                            납부여부
                            <select multiple={false} onChange ={paymentStatusHandler} value ={paymentStatus}>   
                        {/*                         
                                {paymentState.map(item => ( 
                                    <option key ={item.key} value ={item.key}>{item.value}</option>                          
                                ))}
                        */}
                            </select>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                            <button>조회</button>
                        </div>
                    
                    
                        <table id = "btn">
                            <thead>
                                <tr>
                                    <td id = "btd"> <button className='loginBtn'  onClick={onPaymenthandler}> 납부</button> </td>                    
                                    <td id = "btd2"> <button>엑셀다운로드</button> </td>
                                </tr>
                            </thead>
                        </table>

                        <table id = "list">
                            <thead>
                                <tr>
                                    <th>선택</th>
                                    <th>No</th>
                                    <th>회원명</th>
                                    <th>납부예정일</th>
                                    <th>납부여부</th>
                                    <th>납부일자</th>
                                    <th>계약기간</th>
                                    <th>대표자</th>
                                </tr>
                            </thead>
        
                        </table>

                    </form>
             
            </Fragment>
      );
    
  }
  
  export default S010100060;