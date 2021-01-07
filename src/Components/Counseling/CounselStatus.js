import React, { useState,useEffect} from 'react';
import Main from'../Main/Main.js';
import Axios from 'axios';
import { addDays } from 'date-fns';
//datepicker 시작
import DatePicker, { registerLocale } from "react-datepicker";
import ko from 'date-fns/locale/ko';
import "./CounselStatus.css";
registerLocale("ko", ko);

//datepicker끝

let RoomTypes = []
let Methods = []
let Paths = []

var registNums = 0;

function CounselStatus(props) {

    //Lov(List of Value)를 데이터 베이스에서 가져오기 
        //select
        const[RoomType,setRoomType] = useState(1)
        const[Method, setMethod] = useState(1)
        const[Path, setPath] = useState(1)

        //문의구분
        useEffect(()=>{
            Axios.post('/api/register/roomType')
            .then(response => {
                if(response.data.success){
                    //console.log('roomType',response.data);
                    let arr = [{value: '전체', text: '전체' }]

                    response.data.rows.map((data) => 
                        arr.push({
                        value: '[' + data.CD_V + ']' + data.CD_V_MEANING, text: data.CD_V,
                    }));
                    
                    RoomTypes = arr;

                    //console.log('roomTypeArr',arr);
                }else{
                    alert("문의구분 데이터를 불러오는데 실패하였습니다.");
                }
            })

            
            
        },[])

        //문의방법

        useEffect(()=>{
            Axios.post('/api/register/methodA')
            .then(response => {
                if(response.data.success){
                    //console.log('method',response.data);
                    let arr = [{value: '전체', text: '전체' }]

                    response.data.rows.map((data) => 
                        arr.push({
                        value: '[' + data.CD_V + ']' + data.CD_V_MEANING, text: data.CD_V,
                    }));
                    
                    Methods = arr;

                    //console.log('method',arr);
                }else{
                    alert("문의구분 데이터를 불러오는데 실패하였습니다.");
                }
            })
        },[])

        //접근경로

        useEffect(()=>{
            Axios.post('/api/register/pathA')
            .then(response => {
                if(response.data.success){
                    //console.log('Paths',response.data);
                    let arr = [{value: '전체', text: '전체' }]

                    response.data.rows.map((data) => 
                        arr.push({
                        value: '[' + data.CD_V + ']' + data.CD_V_MEANING, text: data.CD_V,
                    }));
                    
                    Paths = arr;

                    //console.log('Paths',arr);
                }else{
                    alert("문의구분 데이터를 불러오는데 실패하였습니다.");
                }
            })
        },[])
    //Lov끝    


    
    //datepicker속성 및 이벤트 시작
    const [StartDate, setStartDate] = useState(new Date());
    //datepicker속성 및 이벤트 끝
    console.log(StartDate.getMonth()+1);
    console.log(StartDate);
    
    const[CounselName, setCounselName] = useState("")
    const[UserPhone, setUserPhone] = useState("")
    const[Content, setContent] = useState("")


    const onNameHandler=(event)=>{
        setCounselName(event.currentTarget.value);
    }

    const MethodHandler=(event)=>{
        setMethod(event.currentTarget.value);
    }

    const PathHandler=(event)=>{
        setPath(event.currentTarget.value);
    }

    const onPhoneHandler=(event)=>{
        setUserPhone(event.currentTarget.value);
    }

    const onContentHandler=(event)=>{
        setContent(event.currentTarget.value);
    }

    const RoomTypeChangeHandler=(event)=>{
        setRoomType(event.currentTarget.value);
    }


    const handleFormSubmit=(event)=> {
        
        event.preventDefault();
        //console.log(RoomType)
    
        // if(RoomType.valueOf('전체') ||!CounselName||Method.valueOf('전체')||Path.valueOf('전체')||!UserPhone||!Content){
        //     return alert("값을 입력하세요")
        // }

        
        
        //서버에 채운 값들을 request로 보낸다.
        const body = {
            roomtype: RoomType,
            counseldate: StartDate,
            cname: CounselName,
            method: Method,
            path: Path,
            phone: UserPhone,
            content: Content
            
        }
        
        
        Axios.post("/api/register",body)
        .then(response => {
            if(response.data.success){
                alert('정상적으로 등록되었습니다.')
               // props.history.push('/counseling')
            }else{
                alert('등록에 실패하였습니다.')
            }
        })

    }

    return (
      <form onSubmit={handleFormSubmit}>
          {/* <Main/>
          <h1>상담등록</h1> */}
          <table>
            <tr>
                <th>문의구분</th>
                    <td>
                        <select onChange ={RoomTypeChangeHandler} value ={RoomType}>   
                        
                            {RoomTypes.map(item => ( 
                                <option key ={item.key} value ={item.key}>{item.value}</option>                          
                            ))}
                        
                        </select>
                    </td>

                <th>문의일자</th>
                    <td>   
                    <DatePicker
                        locale="ko"
                        selected={StartDate}
                        onChange={date => setStartDate(date)}
                        minDate={new Date()}
                        maxDate={addDays(new Date(), 0)}  
                        dateFormat="yyyy.MM.dd (eee)"
                    />

                    </td>
                <th>문의자명</th>
                    <td>
                    <input type="text" value = {CounselName}id="counselName" name="counselName" size = "7"
                    onChange={onNameHandler}/>
                    </td>  
            </tr>

            <tr>
                <th>문의방법</th>
                    <td>
                        <select value={Method} onChange={MethodHandler} >
                        {Methods.map(item=>(
                                <option key = {item.key} value = {item.key}>{item.value}</option>
                        ))}
                        </select>
                    </td>
                <th>접근경로</th>
                    <td>
                        <select value={Path} onChange={PathHandler} >
                            {Paths.map(item =>(
                                <option key = {item.key} value = {item.key}>{item.value}</option>
                            ))}
                            
                        </select>
                    </td>

                <th>문의자연락처</th>
                    <td>
                    <input type = "text" value = {UserPhone}id = "userPhone" name = "userPhone" size = "7"
                    onChange={onPhoneHandler}/>
                    </td>  
            </tr>


            <tr>
                <th>상담내용</th>
                    <td colSpan="5">
                        <textarea rows ="5" cols = "100" value = {Content}id="content" name = "content"
                        onChange={onContentHandler}></textarea>
                    </td>
            </tr>
          </table>
          <div id = "popbtn"> 
            <button type = "submit">저장</button>
            {/* <button>닫기</button> */}
          </div>
      </form>
    );
  }


export default CounselStatus;