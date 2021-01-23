//<<상담등록 페이지>>

import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { addDays } from 'date-fns';
import './css/S010100140.css';
//datepicker 시작
import DatePicker, { registerLocale } from "react-datepicker";
import ko from 'date-fns/locale/ko'
registerLocale("ko", ko);
//datepicker끝





function S010100140(props) {
    
     //console.log(props.dataForm);
     //console.log(props.num);


            const rNum = props.num;
            //console.log('rNum',rNum);
            //const modal = props.modal;

            useEffect(()=>{
            //if(isNaN(rNum)){ return alert('숫자를 클릭하세요') }

                    if (props.dataForm === 'U'){

                    axios.get(`/api/s010100140/tb_s10_ask010_by_id?id=${rNum}&type=single`)
                    .then(response => {
                            if(response.data.success){
                                //console.log(response.data)
                                const askTp = (response.data.rows[0].ASK_TP);
                                const askDate = (response.data.rows[0].ASK_DATE);
                                const askMethod = (response.data.rows[0].ASK_METHOD);
                                const askName = (response.data.rows[0].ASK_NAME);
                                const askPath = (response.data.rows[0].ASK_PATH);
                                const askInfo = (response.data.rows[0].ASK_INFO);
                                const askContent = (response.data.rows[0].ASK_CONTENT);

                                setModalAskDate(askDate);
                                //console.log('askDate', askDate);
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
        const[modalAskTp, setModalAskTp]= useState('')
        const[modalAskMethod, setModalAskMethod] = useState('')
        const[modalAskPath, setModalAskPath] = useState('')


        const[modalContractTpLov, setModalContractTpLov]= useState([{key: '', value: 'waiting...'}])
        const[modalAskMethodLov, setModalAskMethodLov] = useState( [{key: '', value: 'waiting...'}])
        const[modalAccessPathLov, setModalAccessPathLov] = useState( [{key: '', value: 'waiting...'}])

        useEffect(()=>{
            getContractTpLov();
            getAskMethodLov();
            getAccessPathLov();

        },[]);

    const getContractTpLov = () => {
        getLovByCdTp('CONTRACT_TP','ASK');
    };
    const getAskMethodLov = () => {
        getLovByCdTp('ASK_METHOD','');
    };
    const getAccessPathLov = () => {
        getLovByCdTp('ACCESS_PATH','ASK');
    };
    /**
     * desc : LOV에 필요한 항목을 받아 DB조회 후 조회값을 반환하는 로직
     * */
    async function getLovByCdTp(cdTp, attribute2) {
        let arr = [{ key: '선택', value: '선택' }];
        return await axios.post('/api/s010100140/selectTest',{firstVal:cdTp,secondVal:attribute2})
        .then(response => {
            if(response.data.success){
                //console.log('modalAskTp',response.data.rows);
                response.data.rows.map((data) =>
                    arr.push({
                    value: data.CD_V_MEANING,
                    key: data.CD_V
                }));
                //return arr;
                switch (cdTp){
                    case 'CONTRACT_TP' : setModalContractTpLov(arr); break;
                    case 'ASK_METHOD' : setModalAskMethodLov(arr); break;
                    case 'ACCESS_PATH' : setModalAccessPathLov(arr); break;
                }
                if(cdTp === 'CONTRACT_TP')
                setModalAccessPathLov(arr);
            }else{
                alert("문의구분 데이터를 불러오는데 실패하였습니다.")
            }
        }).catch(() =>{
              alert("문의구분 데이터를 불러오는데 실패하였습니다.");
        })
        return arr;
        console.log('arr',arr);
    }

    //<Lov끝>


    //datepicker속성 및 이벤트 시작
    const [modalAskDate, setModalAskDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date());
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

    const onChangeHandler = (event)=> {
        // DatePicker.value
    }

    const onModifyHandler = ()=>{

        const body = {
            modalAskId : rNum,
            modalAskTp: modalAskTp,
            modalAskDate: modalAskDate,
            modalAskName: modalAskName,
            modalAskMethod: modalAskMethod,
            modalAskPath: modalAskPath,
            modalAskInfo: modalAskInfo,
            modalAskContent: modalAskContent
        }

        axios.post('/api/s010100140/modify',body)
        .then(response => {
            if(response.data.success){
                alert('정상적으로 수정되었습니다.')
            }else{
                alert('수정에 실패하였습니다.')
            }
        })


    }

    //상담등록저장버튼클릭시
    const onHandleSubmit=(event)=> {

        event.preventDefault();
        //   //문의구분 NUll체크
        //   if(modalAskTp == null ||modalAskTp == ''||modalAskTp == '전체'){
        //     return alert("문의구분을 선택하세요.");
        // }

        if(modalAskTp == null ||modalAskTp == ''){
            return alert("문의구분을 선택하세요.");
        }

         //문의방법 NUll체크
         if(modalAskMethod == null || modalAskMethod == ''){
            // alert('111');
            // alert((modalAskMethod == null)+ ',' + (modalAskMethod == '' ));
            return alert("문의방법을 선택하세요.");
        }
        
         //접근경로 NUll체크
         if(modalAskPath == null || modalAskPath == ''){
            return alert("접근경로를 선택하세요.");
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
             console.log('setModalAskDate',setModalAskDate);


        axios.post("/api/s010100140",body)
        .then(response => {
            if(response.data.success){
                alert('정상적으로 등록되었습니다.')
            }else{
                alert('등록에 실패하였습니다.')
            }
        })

    }
    // console.log(startDate);

    return (
            <form onSubmit={onHandleSubmit} id = "formWrapper">
            {/* <h1>상담등록</h1> */}
            <div id ="wrapper">
                <table className ="buttonTable">
                    <tbody>
                    <tr>
                        <th>문의구분</th>
                            <td>
                                <select multiple={false} onChange ={onAskTpHandler} value ={modalAskTp} >

                                    {modalContractTpLov.map(item => (
                                        <option key ={item.key} value ={item.key}>{item.value}</option>
                                    ))}
                                    
                                </select>

                            </td>

                        <th>문의일자</th>
                            <td>
                                <DatePicker
                                    locale="ko"
                                    selected={new Date()}
                                    value={modalAskDate}
                                    onChange={date => setModalAskDate(date)}
                                    minDate={new Date()}
                                    maxDate={addDays(new Date(), 0)}
                                    dateFormat="yy/MM/dd (eee)"

                                />
                                {/* <DatePicker*/}
                                {/*     locale="ko"*/}
                                {/*     selected={startDate.setHours(9, 0, 0, 0)}*/}
                                {/*     value={startDate}*/}
                                {/*     onChange={date => setStartDate(date)}*/}
                                {/*     dateFormat="yy/MM/dd (eee)"*/}
                                {/*     onClick={onChangeHandler}*/}
                                {/* />*/}
                            </td>

                        <th>문의자명</th>
                            <td>
                                <input type="text" 
                                    value = {modalAskName} 
                                    id="modalAskName" 
                                    name="modalAskName" 
                                    size = "7"
                                    onChange={onAskNameHandler}
                                />
                            </td>
                    </tr>

                    <tr>
                        <th>문의방법</th>
                            <td>
                                <select multiple={false} value={modalAskMethod} onChange={onAskMethodHandler}  >
                                    {modalAskMethodLov.map(item=>(
                                            <option key = {item.key} value = {item.key}>{item.value}</option>
                                    ))}

                                </select>
                            </td>

                        <th>접근경로</th>
                            <td>
                                <select multiple={false} value={modalAskPath} onChange={onAskPathHandler}  >
                                    {modalAccessPathLov.map(item =>(
                                        <option key = {item.key} value = {item.key}>{item.value}</option>
                                    ))}

                                </select>
                            </td>

                        <th>문의자연락처</th>
                            <td>
                                <input type = "text" value = {modalAskInfo}id = "modalAskInfo" name = "modalAskInfo" size = "7"
                                onChange={onAskInfoHandler} />
                            </td>
                    </tr>


                    <tr>
                        <th>상담내용</th>
                            <td colSpan="5">
                                <textarea rows ="5" cols = "100" value = {modalAskContent} id="modalAskContent" name = "modalAskContent"
                                onChange={onAskContentHandler} ></textarea>
                            </td>
                    </tr>
                    </tbody>                        
                </table>

            </div>
                <input type ="button" className = "popBtn" value="수정하기" onClick = {onModifyHandler}hidden = {props.dataForm !== 'U'}/>
                {/* <button>닫기</button> */}
                <input className = "popBtn" type = "submit" hidden = {props.dataForm === 'U'}/>

            </form>
        
    );
  }
export default S010100140;