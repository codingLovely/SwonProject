//상담현황
import React,{ Component, Fragment,useEffect,useState } from 'react';
import './S010100130.css';
import Main from'./Components/Main/Main';
import axios from "axios";
import S010100140 from './S010100140';
import { Link } from 'react-router-dom';

//<!--모달창 라이브러리
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
//모달창 라이브러리 끝-->

//<!--켈린더 라이브러리시작
import DatePicker, { registerLocale } from "react-datepicker";
import ko from 'date-fns/locale/ko';

registerLocale("ko", ko);
//켈린더 라이브러리 끝-->

var rNum = '';
var Rnum = 0;


var ask_tps = []

function S010100130 (props) {

    const[tb_s10_ask010, setTb_s10_ask010] = useState([])

    useEffect(()=>{
        
        axios.post('/api/s010100130')
            .then(response => {
                if(response.data.success){
                    console.log(response.data.rows)
                    setTb_s10_ask010(response.data.rows)
                }else{ 
                    alert("상세 정보 가져오기를 실패하였습니다.")
                }

            })

    },[])
    //문의 구분
    const[ask_tp, setAsk_tp]=useState([])
    
    useEffect(()=>{
        axios.post('/api/s010100130/ask_tp')
        .then(response => {
            if(response.data.success){
                console.log('insertMethod',response.data);
                let arr = [{key: '전체', value: '전체' }]

                response.data.rows.map((data) => 
                    arr.push({
                    value:data.CD_V_MEANING, key: data.CD_V
                }));
                
                ask_tps=arr;

                //console.log('insertMethodArr',arr);
            }else{
                alert("문의구분 데이터를 불러오는데 실패하였습니다.");
            }
        })

        
        
    },[])

    //<!--모달창 속성 및 이벤트 
    const [open, setOpen] = React.useState(false);
    const [storeOpen, setStoreOpen] = React.useState(false);
    const [CRegists,setCRegists] = useState({});



    //상담등록 모달
    const onhandleClickOpen = () => {
        setStoreOpen(true); 
     
     };  

            
     const onhandleClose = (event) => {
          
        axios.post('/api/s010100130')
        .then(response => {
            if(response.data.success){
                console.log(response.data.rows)
                setTb_s10_ask010(response.data.rows)
            }else{ 
                alert("상세 정보 가져오기를 실패하였습니다.")
            }

        })


        setStoreOpen(false);
       };
    //상담등록 모달 끝

    
    //상세보기 모달
    const handleClickOpen = (e) => {
       setOpen(true); 
       rNum = e.target.innerHTML
       Rnum= parseInt(rNum);
       //console.log(Rnum)

       axios.get(`/api/register/register_by_id?id=${Rnum}&type=single`) 
       .then(response => {
           if(response.data.success){
               //console.log(response.data)
               setCRegists(response.data.rows[0])
               //console.log(response.data.consultRegistInfo.num)
           }else{
               alert("상세 정보 가져오기를 실패하였습니다.")
           }

       })
    };  

    const handleClose = () => {
        setOpen(false);
      };
      //상세보기 모달 끝 
    //모달창 속성 및 이벤트 끝-->


    //<!--캘린더 속성 
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    //캘린더 속성 끝--> 


    // 조회 <!--onSubmit
      const onSubmitHandler=(event)=>{
        event.preventDefault();

        // if(method.valueOf('전체') ||!startDate||!endDate||!searchName){
        //     return alert("값을 입력하세요")
        // }

         const body = {
            startDate,
            searchName,
            ask_tp,
            endDate
        }
        
        console.log("조회조건", body);
        
        axios.post("/api/s010100130/search",body).then(response => {
            if(response.data.success){
                //console.log('search',response.data.rows);
                setTb_s10_ask010(response.data.rows);
            }else{
                alert('검색에 실패하였습니다.')
            }
        })

      }
    //onSubmit끝-->






    const[searchName, setSearchName] = useState("")

    const ask_tpChangeHandler=(event)=>{
        setAsk_tp(event.currentTarget.value);
    }

    const nameSearchHandler=(event)=>{
        setSearchName(event.currentTarget.value);
    }

   

    const s010100130R = tb_s10_ask010.map((tb_s10_ask010,index)=>{

        return<tr>
                <td name ="cname" variant="outlined" color="primary" onClick={handleClickOpen} id={tb_s10_ask010.ASK_ID}><u>{tb_s10_ask010.ASK_ID}
                </u></td>
                {/* 모달창 시작 */}
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{CRegists.cname+"님의 상담내용 입니다."}</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {CRegists.content}
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        확인
                    </Button>
                    </DialogActions>
                </Dialog>
                {/* 모달창 끝*/}

                <td>{tb_s10_ask010.ASK_TP}</td>
                <td>{tb_s10_ask010.ASK_DATE}</td>
                <td>{tb_s10_ask010.ASK_METHOD}</td>
                <td>{tb_s10_ask010.ASK_NAME}</td>
                <td>{tb_s10_ask010.ASK_INFO}</td>
                <td>{tb_s10_ask010.ASK_PATH}</td>
                
            </tr>
    })

  
      return (
            <Fragment>
                <Main/>
                
                <div style={{display:'flex', justifyContent:'center',alignItems:'center',width:'100%'}}>
                    <form style = {{display:'flex', flexDirection:'column'}}
                     onSubmit={onSubmitHandler}
                    >

                    <h1>상담현황</h1>
                    <div id = "search">
                        
                        문의일자   
                    {/* date클릭할 때 고정 */}
                        <DatePicker
                            locale="ko"
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            dateFormat="yy/MM/dd (eee)"
                        /> ~ 
                        <DatePicker
                            locale="ko"
                            selected={endDate}
                            onChange={date => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            dateFormat="yy/MM/dd(eee)"
                        />
                    
                        {/* <input type="image" src="/examples/images/submit_icon.png" alt="제출버튼" height="30" width="30"/> */}
                        &nbsp;
                       
                        문의구분 
                        <select onChange ={ask_tpChangeHandler} value ={ask_tp}>   
                        
                            {ask_tps.map(item => ( 
                                <option key ={item.key} value ={item.key}>{item.value}</option>                          
                            ))}
                    
                        </select>
                        &nbsp; 

                        문의자명
                         <input type="text" value = {searchName} id="searchlName" name="searchName" size = "5"
                          onChange={nameSearchHandler}/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                        <button>조회</button>
                    </div>
                
                   
                    <table id = "btn">
                        <tr>
                            <td id = "btd"> <button className='loginBtn'  onClick={onhandleClickOpen} >상담등록</button> </td>                    
                            <td id = "btd2"> <button>엑셀다운로드</button> </td>
                        </tr>
                    </table>

                    {/* 모달창 시작 --> 504에러 */}
                        <Dialog
                            open={storeOpen}
                            onClose={onhandleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title"><h1>상담등록</h1></DialogTitle>
                            <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                 <S010100140/>
                            </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                            {/* <Button onClick={onhandleStoreClose} color="primary" autoFocus>
                                저장
                            </Button> */}
                            <Button onClick={onhandleClose} color="primary">
                                닫기
                            </Button>
                            </DialogActions>
                        </Dialog>
                     {/* // 모달창 끝        */}

                    

                    <table id = "list">
                        <tr>
                            <th>No</th>
                            <th>문의 구분</th>
                            <th>문의일자</th>
                            <th>문의방법</th>
                            <th>문의자명</th>
                            <th>연락처</th>
                            <th>접근경로</th>
                        </tr>

                        
                            {s010100130R}
                       

                    </table>

                    </form>
                </div>
            </Fragment>
      );
    
  }
  
  export default S010100130;