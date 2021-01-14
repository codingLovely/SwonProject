//<<상담등록 페이지>>

import React, { Fragment, useState, useEffect} from 'react';
import axios from 'axios';
import { addDays } from 'date-fns';
//datepicker 시작
import DatePicker, { registerLocale } from "react-datepicker";
import ko from 'date-fns/locale/ko';
registerLocale("ko", ko);
//datepicker끝

let valueArr = [[],[],[]];
let queryArr = [['CONTRACT_TP','ASK'],['ASK_METHOD',''],['ACCESS_PATH','ASK']];


function S010100140(props) {
     //console.log(props.dataForm);
     //console.log(props.num);


            //console.log('140props',props);

             let rNum = props.num;
             //console.log('rNum',rNum);

            useEffect(()=>{
            if (props.dataForm === 'U'){
            axios.get(`/api/s010100140/tb_s10_ask010_by_id?id=${rNum}&type=single`)
            .then(response => {
                    if(response.data.success){
                        console.log(response.data)
                        const askTp = (response.data.rows[0].ASK_TP);
                        const askDate = (response.data.rows[0].ASK_DATE);
                        const askMethod = (response.data.rows[0].ASK_METHOD);
                        const askName = (response.data.rows[0].ASK_NAME);
                        const askPath = (response.data.rows[0].ASK_PATH);
                        const askInfo = (response.data.rows[0].ASK_INFO);
                        const askContent = (response.data.rows[0].ASK_COnTENT);

                        //setModalAskDate(askDate);
                        console.log('askTp', askTp);
                        setModalAskTp(askTp);
                        setModalAskName(askName);
                        setModalAskMethod(askMethod);
                        setModalAskPath(askPath);
                        setModalAskInfo(askInfo);
                        setModalAskContent(askContent);
                    }else{
                        alert("상세 정보 가져오기를 실패하였습니다.")
                    }
                })
            }
            },[])





    //<Lov(List of Value)를 데이터 베이스에서 가져오기

    //select-option
        const[modalAskTp, setModalAskTp]= useState(1)
        const[modalAskMethod, setModalAskMethod] = useState(1)
        const[modalAskPath, setModalAskPath] = useState(1)

        useEffect(()=>{
        for(let i = 0; i<queryArr.length; i++){

            let firstVal = queryArr[i][0];
            let secondVal = queryArr[i][1];


                axios.post('/api/s010100140/selectTest',{firstVal:firstVal,secondVal:secondVal})
                .then(response => {
                    if(response.data.success){
                        //console.log('modalAskTp',response.data.rows);
                        let arr = [{ key: '전체', value: '전체' }]

                        response.data.rows.map((data) =>
                            arr.push({
                            value: data.CD_V_MEANING,
                            key: data.CD_V
                        }));


                        valueArr[i] = arr;
                        //console.log(valueArr[2]);
                    }else{
                        alert("문의구분 데이터를 불러오는데 실패하였습니다.");
                    }
                })

        }
    },[])    

    //<Lov끝>


    //datepicker속성 및 이벤트 시작
    const [modalAskDate, setModalAskDate] = useState(new Date());
    //datepicker속성 및 이벤트 끝


    //input type ="text"
    const[modalAskName, setModalAskName] = useState("")
    const[modalAskInfo, setModalAskInfo] = useState("")
    const[modalAskContent, setModalAskContent] = useState("")

    //select-option 이벤트들
    const onAskTpHandler=(event)=>{
        console.log(event.currentTarget.value);
        setModalAskTp(event.currentTarget.value);
    }

    const onAskMethodHandler=(event)=>{
        setModalAskMethod(event.currentTarget.value);
    }

    const onAskPathHandler=(event)=>{
        setModalAskPath(event.currentTarget.value);
    }

    //input type = "text" 이벤트들
    const onAskNameHandler=(event)=>{
        setModalAskName(event.currentTarget.value);
    }

    const onAskInfoHandler=(event)=>{
        setModalAskInfo(event.currentTarget.value);
    }

    const onAskContentHandler=(event)=>{
        setModalAskContent(event.currentTarget.value);
    }

    //console.log(modalAskTp,modalAskPath,modalAskMethod);

    //상담등록저장버튼클릭시
    const onHandleSubmit=(event)=> {

        event.preventDefault();

        if(modalAskTp === 1||modalAskMethod === 1||modalAskPath === 1){
            return alert("값을 입력하세요");
        }

        //서버에 채운 값들을 request로 보낸다.
        const body = {
            modalAskTp: modalAskTp,
            modalAskDate: modalAskDate,
            modalAskName: modalAskName,
            modalAskMethod: modalAskMethod,
            modalAskPath: modalAskPath,
            modalAskInfo: modalAskInfo,
            modalAskContent: modalAskContent
        }


        axios.post("/api/s010100140",body)
        .then(response => {
            if(response.data.success){
                alert('정상적으로 등록되었습니다.')
            }else{
                alert('등록에 실패하였습니다.')
            }
        })

    }

    return (
        <form onSubmit={onHandleSubmit}>
          {/* <Main/>
          <h1>상담등록</h1> */}

          <table>
            <tr>
                <th>문의구분</th>
                    <td>
                        <select onChange ={onAskTpHandler} value ={modalAskTp}>

                            {valueArr[0].map(item => (
                                <option key ={item.key} value ={item.key}>{item.value}</option>
                            ))}

                        </select>

                    </td>

                <th>문의일자</th>
                    <td>
                        <DatePicker
                            locale="ko"
                            selected={modalAskDate}
                            onChange={date => setModalAskDate(date)}
                            minDate={new Date()}
                            maxDate={addDays(new Date(), 0)}
                            dateFormat="yy/MM/dd (eee)"
                        />
                    </td>

                <th>문의자명</th>
                    <td>
                        <input type="text" value = {modalAskName} id="modalAskName" name="modalAskName" size = "7"
                        onChange={onAskNameHandler}/>
                    </td>
            </tr>

            <tr>
                <th>문의방법</th>
                    <td>
                        <select value={modalAskMethod} onChange={onAskMethodHandler} >

                            {valueArr[1].map(item=>(
                                    <option key = {item.key} value = {item.key}>{item.value}</option>
                            ))}

                        </select>
                    </td>

                <th>접근경로</th>
                    <td>
                        <select value={modalAskPath} onChange={onAskPathHandler} >

                            {valueArr[2].map(item =>(
                                <option key = {item.key} value = {item.key}>{item.value}</option>
                            ))}

                        </select>
                    </td>

                <th>문의자연락처</th>
                    <td>
                        <input type = "text" value = {modalAskInfo}id = "modalAskInfo" name = "modalAskInfo" size = "7"
                        onChange={onAskInfoHandler}/>
                    </td>
            </tr>


            <tr>
                <th>상담내용</th>
                    <td colSpan="5">
                        <textarea rows ="5" cols = "100" value = {modalAskContent} id="modalAskContent" name = "modalAskContent"
                        onChange={onAskContentHandler}></textarea>
                    </td>
            </tr>

          </table>

          <div id = "popbtn">
            <input type = "submit" />저장
            {/* <button>닫기</button> */}
          </div>

        </form>
    );
  }
export default S010100140;