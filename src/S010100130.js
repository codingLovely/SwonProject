//<<상담현황 페이지>>
import React,{Fragment,useEffect,useState } from 'react';
import './css/S010100130.css';
import Navbar from'./Navbar';
import axios from "axios";
import S010100140 from './S010100140';


//모달창 따로 분리해서 태그로 쓸 것
//<!--모달창 라이브러리
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
//모달창 라이브러리 끝-->

//<!--켈린더 라이브러리시작
import DatePicker, { registerLocale } from "react-datepicker";
import ko from 'date-fns/locale/ko';
registerLocale("ko", ko);
//켈린더 라이브러리 끝-->




var num = '';
var rNum = 0;

var ask_tps = []

function S010100130 (props) {
    const[data] = useState('I');
    //console.log(data);
    const[numForDetail,setNumForDetail] = useState('')
    //TB_S10_ASK010 테이블 조회
    const[tb_s10_ask010, setTb_s10_ask010] = useState([])

    useEffect(()=>{
        
        axios.post('/api/s010100130')
            .then(response => {
                if(response.data.success){
                    //console.log('TB_S10_ASK010 조회',response.data.rows)
                    setTb_s10_ask010(response.data.rows)
                }else{ 
                    alert("데이터 조회를 실패하였습니다.")
                }

            })

    },[])

    //<Lov(List of Value)를 데이터 베이스에서 가져오기
    
     //select-option
    const[ask_tp, setAsk_tp]=useState('')

    //문의 구분
    useEffect(()=>{
        axios.post('/api/s010100130/ask_tp')
        .then(response => {
            if(response.data.success){
                //console.log('Lov-ask_tp',response.data);
                let arr = [{key: '전체', value: '전체' }]

                response.data.rows.map((data) => 
                    arr.push({
                    value:data.CD_V_MEANING, key:data.CD_V
                }));
                
                ask_tps=arr;
                
            }else{
                alert("문의구분 데이터를 불러오는데 실패하였습니다.");
            }
        })
    },[])
    //lov 끝>


    //<!--모달창 속성 및 이벤트 
    const [open, setOpen] = React.useState(false);
    const [storeOpen, setStoreOpen] = React.useState(false);

            //<상담등록 모달
            const onHandleClickOpen = (event) => {
                //console.log('상담열기');
                setStoreOpen(true); 

            };  
                    
            //상담등록 닫기 할 때 새로고침해서 가져오는 것
            const onHandleClickClose = (event) => {
               
                axios.post('/api/s010100130')
                .then(response => {
                    if(response.data.success){
                        //console.log('상담닫기',response.data.rows)
                        setTb_s10_ask010(response.data.rows)
                    }else{ 
                        alert("상세 정보 가져오기를 실패하였습니다.")
                    }

                })
                setStoreOpen(false);
            };
            //상담등록 모달 끝>

            
            // //<상세보기 모달
             const  onDetailHandleClickOpen = (event) => {
                //console.log('target',event.target.id);
                num = event.target.id;
                rNum = parseInt(num);
                setNumForDetail(rNum);
                setOpen(true);
            };  

            const onDetailHandleClickClose = () => {
                setOpen(false);
            };
             //상세보기 모달 끝>
    //모달창 속성 및 이벤트 끝--!>
    
  
    //문의자명 속성
    const[ask_name, setAsk_name] = useState("") 

    //문의구분 select-option이벤트
    const onAsk_tpHandler=(event)=>{
        setAsk_tp(event.currentTarget.value);
    }

    //문의자명 input type = "text"이벤트
    const onAsk_nameHandler=(event)=>{
        setAsk_name(event.currentTarget.value);
    }

    //캘린더 속성 
    const [startAsk_date, setStartAsk_date] = useState(new Date());
    const [endAsk_date, setEndAsk_date] = useState(new Date());
 
    // 조회 <!--onSubmit
    const onHandleFormSubmit=(event)=>{
        console.log('조회',event);
        event.preventDefault();

        // if(method.valueOf('전체')||!startDate||!endDate||!searchName){
        //     return alert("값을 입력하세요")
        // }

            const body = {
                startAsk_date,
                ask_name,
                ask_tp,
                endAsk_date
           }
        
        //console.log("조회조건", body);
        
        axios.post("/api/s010100130/search",body).then(response => {
            if(response.data.success){
                console.log('search',response.data.rows);
                setTb_s10_ask010(response.data.rows);
            }else{
                alert('검색에 실패하였습니다.')
            }
        })

    }
//onSubmit끝-->
    const s010100130R = tb_s10_ask010.map((tb_s10_ask010,index)=>{
        return (
                <tr>
                        <td key={index+1} className ="cname" name ="cname" variant="outlined" color="primary" onClick={onDetailHandleClickOpen} id={tb_s10_ask010.ASK_ID}> {index+1}</td>
                        <td key={index+2} >{tb_s10_ask010.ASK_TP}</td>
                        <td key={index+3}>{tb_s10_ask010.ASK_DATE}</td>
                        <td key={index+4}>{tb_s10_ask010.ASK_METHOD}</td>
                        <td key={index+5}>{tb_s10_ask010.ASK_NAME}</td>
                        <td key={index+6}>{tb_s10_ask010.ASK_INFO}</td>
                        <td key={index+7}>{tb_s10_ask010.ASK_PATH}</td>
                </tr>
    )});

   
      return (
            <Fragment>
                <Navbar/>
                
                    <form style = {{display:'flex', flexDirection:'column',justifyContent:'center',alignItems:'center',width:'100%'}} onSubmit={onHandleFormSubmit}>
                    
                        <h1>상담현황</h1>
                        <div id = "search">
                            
                        문의일자   
                        {/* date클릭할 때 고정 */}
                        <DatePicker
                            locale="ko"
                            selected={startAsk_date.setHours(9,0,0,0)}//Front = 한국시 BackEnd = 표준시 9시간차이
                            onChange={date => setStartAsk_date(date)}
                            selectsStart
                            startDate={startAsk_date}
                            endDate={endAsk_date}
                            dateFormat="yyyy.MM.dd"
                        /> ~ 
                        <DatePicker
                            locale="ko"
                            selected={endAsk_date.setHours(9,0,0,0)}//Front = 한국시 BackEnd = 표준시 9시간차이
                            onChange={date => setEndAsk_date(date)}
                            selectsEnd
                            startDate={startAsk_date}
                            endDate={endAsk_date}
                            minDate={startAsk_date}
                            dateFormat="yyyy.MM.dd"
                        />
                        
                        {/* <input type="image" src="/examples/images/submit_icon.png" alt="제출버튼" height="30" width="30"/> */}
                        &nbsp;
                        
                        문의구분 
                        <select multiple={false} onChange ={onAsk_tpHandler} value ={ask_tp}>   
                        
                            {ask_tps.map(item => ( 
                                <option key ={item.key} value ={item.key}>{item.value}</option>                          
                            ))}
                    
                        </select>
                        &nbsp; 

                        문의자명
                        <input type="text" value = {ask_name} id="ask_name" name="ask_name" size = "5" onChange={onAsk_nameHandler}/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        
                        <button type = "submit" onClick={onHandleFormSubmit}>조회</button>

                        </div>
                    
                    
                        <table id = "btn">
                            <thead>
                                <tr>
                                    <td id = "btd"> <input type = "button" className='loginBtn'  onClick={onHandleClickOpen} value = "상담등록" /> </td>                    
                                    <td id = "btd2"> <input type = "button" value = '엑셀다운로드' /> </td>
                                </tr>
                            </thead>
                        </table>
                         {/* 모달창 시작*/}
                         <Dialog
                            maxWidth = {"lg"}
                            open={open}>
                            <S010100140 dataForm={"U"} num = {numForDetail}/>
                            <DialogActions>
                                <input type = "button" onClick={onDetailHandleClickClose} color="primary" value = '닫기'/>
                            </DialogActions>
                        </Dialog>
                        {/* // 모달창 끝 */}


                        {/* 모달창 시작*/}
                        <Dialog
                            maxWidth = {"lg"}
                            open={storeOpen}
                        >
                            <S010100140 dataForm={data} num = {numForDetail}/>
                            <DialogActions>
                                <input type = "button" onClick={onHandleClickClose} color="primary" value = '닫기'/>
                            </DialogActions>
                        </Dialog>
                        {/* // 모달창 끝 */}

                        <table id = "list">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>문의 구분</th>
                                    <th>문의일자</th>
                                    <th>문의방법</th>
                                    <th>문의자명</th>
                                    <th>연락처</th>
                                    <th>접근경로</th>
                                </tr>
                            </thead>
                            <tbody>
                                {s010100130R}                       
                                </tbody>
                        </table>
                             
                    </form>

              
            </Fragment>
      );
    
  }
  
  export default S010100130;