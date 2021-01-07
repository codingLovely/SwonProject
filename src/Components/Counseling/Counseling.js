import React,{ Component, Fragment,useEffect,useState } from 'react';
import './Counseling.css';
import Main from'../Main/Main.js';
import axios from "axios";
import CounselStatus from './CounselStatus';
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


var Methods = []

function Counseling (props) {

    const[ConsultRegists, setConsultRegists] = useState([])

    useEffect(()=>{
        
        axios.post('/api/register/registers')
            .then(response => {
                if(response.data.success){
                    console.log(response.data.rows)
                    setConsultRegists(response.data.rows)
                }else{ 
                    alert("상세 정보 가져오기를 실패하였습니다.")
                }

            })

    },[])
    
    const[method, setMethod]=useState([])
    
    useEffect(()=>{
        axios.post('/api/register/insertMethod')
        .then(response => {
            if(response.data.success){
                console.log('insertMethod',response.data);
                let arr = [{value: '전체', text: '전체' }]

                response.data.rows.map((data) => 
                    arr.push({
                    value: '[' + data.CD_V + ']' + data.CD_V_MEANING, text: data.CD_V,
                }));
                
                Methods=arr;

                console.log('insertMethodArr',arr);
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

                //상담등록 저장버튼이벤트
                // const onhandleStoreClose = () => {
                //     setOpen(false);
                // }
            
     const onhandleClose = (event) => {
          
        axios.post('/api/register/registers')
        .then(response => {
            if(response.data.success){
                console.log(response.data.rows)
                setConsultRegists(response.data.rows)
            }else{ 
                alert("상담등록 페이지 가져오기를 실패하였습니다.")
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
               console.log(response.data)
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
    const [startDate, setStartDate] = useState(new Date("2020/01/01"));
    const [endDate, setEndDate] = useState(new Date("2022/01/01"));
    //캘린더 속성 끝--> 


    //<!--onSubmit
      const onSubmitHandler=(event)=>{
        event.preventDefault();

        // if(method.valueOf('전체') ||!startDate||!endDate||!searchName){
        //     return alert("값을 입력하세요")
        // }

         const body = {
            startDate,
            searchName,
            method,
            endDate
        }
        
        //console.log(body);
        
        axios.post("/api/register/search",body)
        .then(response => {
            if(response?.data?.success){
                console.log('search',response.data.rows);
                setConsultRegists(response.data.rows);
            }else{
                alert('검색에 실패하였습니다.')
            }
        })

      }
    //onSubmit끝-->
    
    


    const[searchName, setSearchName] = useState("")

    const MethodChangeHandler=(event)=>{
        setMethod(event.currentTarget.value);
    }

    const nameSearchHandler=(event)=>{
        setSearchName(event.currentTarget.value);
    }

    //console.log('ConsultRegists',ConsultRegists);

    const resultTable = ConsultRegists.map((ConsultRegists,index)=>{

        return<tr>
                <td name ="cname" variant="outlined" color="primary" onClick={handleClickOpen} id={ConsultRegists.num}><u>{ConsultRegists.num}
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

                <td>{ConsultRegists.roomtype}</td>
                <td>{ConsultRegists.counseldate}</td>
                <td>{ConsultRegists.method}</td>
                <td>{ConsultRegists.cname}</td>
                <td>{ConsultRegists.phone}</td>
                <td>{ConsultRegists.path}</td>
                
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
                       
                        문의구분 
                        <select onChange ={MethodChangeHandler} value ={method}>   
                        
                            {Methods.map(item => ( 
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
                                 <CounselStatus/>
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

                        
                            {resultTable}
                       

                    </table>

                    </form>
                </div>
            </Fragment>
      );
    
  }
  
  export default Counseling;