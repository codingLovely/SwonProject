import React, { useState,useEffect} from 'react';
import Main from'../Main/Main.js';
import Axios from 'axios';

//datepicker 시작
import DatePicker, { registerLocale } from "react-datepicker";
import ko from 'date-fns/locale/ko';
registerLocale("ko", ko);
//datepicker끝

let RoomTypes = []
let Methods = []
let Paths = []

var registNums = 0;

function Member(props) {


    const handleFormSubmit=(event)=> {
        
        event.preventDefault();
      
    }
    const[userName,setUserName] = useState("")
    const[bnum,setBnum] = useState("")
    const[ownerName,setOwnerName] = useState("")
    const[userSort,setUserSort] = useState([])
    const[endStatus,setEndStatus] = useState("")
    const[status,setStatus] = useState("")
    return (
      <form onSubmit={handleFormSubmit}>
          <Main/>
          <h1>회원현황</h1>
          <table >
            <tr>
                <th>회원명</th>
                    <td>
                        <input type = "text" value = {userName} id = "userName" name = "userName" size = "7"
                        />
                    </td>  
                    {/* onChange={onPhoneHandler} */}
                <th>사업자번호</th>
                    <td>
                        <input type = "text" value = {bnum} id = "bnum" name = "bnum" size = "7"
                        />
                    </td>
                <th>대표자명</th>
                    <td>
                        <input type = "text" value = {ownerName} id = "ownerName" name = "ownerName" size = "7"
                        />
                    </td>
                <th>회원구분</th>
                    <td>
                        <select value ={userSort}>   {/*  onChange ={RoomTypeChangeHandler}  */}
                        
                            {/* {RoomTypes.map(item => (  */}
                                <option></option>                          
                            {/* ))} */}
                        
                        </select>
                    </td>
                <th>회원구분</th>
                    <td>
                        <select value ={userSort}>   {/*  onChange ={RoomTypeChangeHandler}  */}
                        
                            {/* {RoomTypes.map(item => (  */}
                                <option></option>                          
                            {/* ))} */}
                        
                        </select>
                    </td>
                <th>종류</th>
                    <td>
                        <select value ={endStatus}>  {/*  onChange ={RoomTypeChangeHandler}  */}
                        
                            {/* {RoomTypes.map(item => (  */}
                                <option></option>                          
                            {/* ))} */}
                        
                        </select>
                    </td>
                <th>상태</th>
                    <td>
                        <select value ={status}>   {/*  onChange ={RoomTypeChangeHandler}  */}
                        
                            {/* {RoomTypes.map(item => (  */}
                                <option></option>                          
                            {/* ))} */}
                        
                        </select>
                    </td>
                    
                    <td>
                    <div > 
                        <button type = "submit">조회</button>
                
                    </div>
                    </td>

                
            </tr>
               
            
          </table>
          <table>
            <tr>
                <td>
                    <button>신규회원</button>
                    <button>SNS</button>
                    <button>메일전송</button>
                    <button>엑셀다운로드</button>
                </td>
            </tr>
          </table>
          
          <table>
                <tr>
                    <th>No</th>
                    <th>문의 구분</th>
                    <th>문의일자</th>
                    <th>문의방법</th>
                    <th>문의자명</th>
                    <th>연락처</th>
                    <th>접근경로</th>
                </tr>
          </table>

      </form>

      
    );
  }


export default Member;