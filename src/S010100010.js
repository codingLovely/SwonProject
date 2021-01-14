import React, { Fragment, useState, useEffect } from 'react';
import axios from "axios";


//<!--켈린더 라이브러리시작
import DatePicker, { registerLocale } from "react-datepicker";
import ko from 'date-fns/locale/ko';
registerLocale("ko", ko);
//켈린더 라이브러리 끝-->


let valueArr = [[],[],[],[],[]];
let queryArr = [['MEMBER_TP',''],['CONTRACT_TP','ASK'],['L',''],['PAY_METHOD',''],['CONTRACT_PATH','']];

const payDates = [{key:1,value:'1일'},
                {key:2,value:'2일'},
                {key:3,value:'3일'},
                {key:4,value:'4일'},
                {key:5,value:'5일'},
                {key:6,value:'6일'},
                {key:7,value:'7일'},
                {key:8,value:'8일'},
                {key:9,value:'9일'},
                {key:10,value:'10일'}]

var payMethods =[];

// const payDates = new Array(31)

// for(let i = 0; i < payDates.length; i++){
//     payDates[i] = i+1;
// }


function S010100010(props) {

    //회원정보
    const [memberNm, setMemberNm] = useState("")
    const [firstRegNo, setFisrtRegNo] = useState("")
    const [secondRegNo, setSecondRegNo] = useState("")
    const [thirdRegNo, setThirdRegNo] = useState("")
    const [memberTp, setMemberTp] = useState([])
    const [empIdName, setEmpIdName] = useState("")
    const [firstEmpHp, setFirstEmpHp] = useState("")
    const [secondEmpHp, setSecondEmpHp] = useState("")
    const [thirdEmpHp, setThirdEmpHp] = useState("")
    const [empEmailId, setEmpEmailId] = useState("")
    const [domainAddress, setDomainAddress] = useState("")
    const [zipcode,setZipcode] = useState("")
    const [empAddress, setEmpAddress] = useState("")
    const [empDetailAddress, setEmpDetailAddress] = useState("")


    //계약정보
    const [contractTp, setContractTp] = useState("")
    const [contractTpVal, setContractTpVal] = useState("")
    const [roomLockerTp, setRoomLockerTp] = useState(0)
    const [contractMoney, setContractMoney] = useState("")
    const [contractTerm, setContractTerm] = useState("")
    const [payDate, setPayDate] = useState(1)
    const [comment, setComment] = useState("")
    const [payMethod, setPayMethod] = useState("")


//<Lov시작>
    for(let i = 0; i<queryArr.length; i++){
                
        let firstVal = queryArr[i][0];
        let secondVal = queryArr[i][1];
            axios.post('/api/s010100140/selectTest',{firstVal:firstVal,secondVal:secondVal})
            .then(response => {
                if(response.data.success){
                    console.log('ask_tp',response.data.rows);
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

    useEffect(()=>{
        axios.post('/api/s010100010/accessPath')
        .then(response => {
            if(response.data.success){
                //console.log('Lov-ask_tp',response.data);
                let arr = [{key: '전체', value: '전체' }]

                response.data.rows.map((data) => 
                    arr.push({
                    value:data.CD_V_MEANING, key:data.CD_V
                }));
                
                payMethods=arr;
                
            }else{
                alert("문의구분 데이터를 불러오는데 실패하였습니다.");
            }
        })
    },[])

var contractTpVals = [{key:'R2_302',value:'302호'},
                      {key:'R2_409',value:'409호'},
                      {key:'R2_410',value:'410호'},
                      {key:'R2_411',value:'411호'},
                      {key:'R2_412',value:'412호'},
                     ]
//<하이라키->호실
// useEffect(()=>{
//     axios.post('/api/s010100010/contract')
//     .then(response => {
//         if(response.data.success){
//             console.log('ContractTpVal',response.data);
//             let arr = [{key: '전체', value: '전체'}]

//             response.data.rows.map((data) => 
//                 arr.push({
//                 value:data.CD_V_MEANING, key:data.CD_V
//             }));
            
//             contractTpVals=arr;
            
//         }else{
//             alert("문의구분 데이터를 불러오는데 실패하였습니다.");
//         }
//     })
// },[])
//>



    const onContractTpHandler = (event) => {
        setContractTp(event.currentTarget.value);
    }

    const onContractTpValHandler = (event) => {
        setContractTpVal(event.currentTarget.value);
    }

    const onRoomLockerTpHandler = (event) => {
        setRoomLockerTp(event.currentTarget.value);
    }

    const onContractMoneyHandler = (event) => {
        setContractMoney(event.currentTarget.value);
    }

    const onContractTermHandler = (event) => {
        setContractTerm(event.currentTarget.value);
    }

    const onPayDateHandler = (event) => {
        setPayDate(event.currentTarget.value);
    }

    const onCommentHandler = (event) => {
        setComment(event.currentTarget.value);
    }

    const onPayMethodHandler = (event) => {
        setPayMethod(event.currentTarget.value);
    }


    //<!--onSubmit
    const onSubmitHandler=(event)=> {
        event.preventDefault();
        
        if(!empIdName||!firstEmpHp||!secondEmpHp||!thirdEmpHp||
            !empEmailId||!domainAddress){
            
                return alert("값을 입력하세요");
        }
        
        //서버에 채운 값들을 request로 보낸다.
        const body = {
            //회원정보
            memberNm: memberNm,
            firstRegNo: firstRegNo,
            secondRegNo: secondRegNo,
            thirdRegNo: thirdRegNo,
            memberTp: memberTp,
            empIdName: empIdName,
            firstEmpHp: firstEmpHp,
            secondEmpHp: secondEmpHp,
            thirdEmpHp: thirdEmpHp,
            zipcode: zipcode,
            empEmailId: empEmailId,
            domainAddress: domainAddress,
            empAddress: empAddress,
            empDetailAddress: empDetailAddress,
            //계약정보
            contractTp: contractTp,
            contractTpVal: contractTpVal,
            roomLockerTp : roomLockerTp,
            contractMoney : contractMoney,
            contractTerm : contractTerm,
            payDate: payDate,
            payMethod: payMethod
        }

        axios.post('/api/s010100010/insertMember010',body)
        .then(response => {
            if(response.data.success){
                alert('member가 정상적으로 등록되었습니다.')
            }else{
                alert('등록에 실패하였습니다.')
            }
        })
    }
    //onSubmit끝-->




    const onMemberNmHandler = (event) => {
        setMemberNm(event.currentTarget.value);
    }

    const onFirstRegNoHandler = (event) => {
        setFisrtRegNo(event.currentTarget.value);
    }

    const onSecondRegNoHandler = (event) => {
        setSecondRegNo(event.currentTarget.value);
    }

    const onThirdRegNoHandler = (event) => {
        setThirdRegNo(event.currentTarget.value);
    }

    const onMemberTpHandler = (event) => {
        setMemberTp(event.currentTarget.value);
    }

    const onEmpIdNameHandler = (event) => {
        setEmpIdName(event.currentTarget.value);
    }

    const onFirstEmpHpHandler = (event) => {
        setFirstEmpHp(event.currentTarget.value);
    }

    const onSecondEmpHpHandler = (event) => {
        setSecondEmpHp(event.currentTarget.value);
    }

    const onThirdEmpHpHandler = (event) => {
        setThirdEmpHp(event.currentTarget.value);
    }

    const onEmpEmailIdHandler = (event) => {
        setEmpEmailId(event.currentTarget.value);
    }

    const onDomainAddressHandler = (event) => {
        setDomainAddress(event.currentTarget.value);
    }

    const onZipcodeHandler = (event) => {
        setZipcode(event.currentTarget.value);
    }

    const onEmpAddressHandler = (event) => {
        setEmpAddress(event.currentTarget.value);
    }

    const onEmpDetailAddressHandler = (event) => {
        setEmpDetailAddress(event.currentTarget.value);
    }


    return (
        <Fragment>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <form style={{ display: 'flex', flexDirection: 'column' }}
                    onSubmit={onSubmitHandler}
                >

                    <table>
                        {/* 회원정보란 */}
                        <tr>
                            <th rowSpan="6">회원정보</th>
                        </tr>

                        <tr>
                            <th>회원명</th>
                            <td>
                                <input type="text" value={memberNm} id="memberNm" name="memberNm" size="5"
                                    onChange={onMemberNmHandler} /></td>

                            <th>사업자 번호</th>
                            <td colSpan="2">
                                <input type="text" value={firstRegNo} id="firstRegNo" name="firstRegNo" size="3"
                                    onChange={onFirstRegNoHandler} />
                         -
                        <input type="text" value={secondRegNo} id="secondRegNo" name="secondRegNo" size="3"
                                    onChange={onSecondRegNoHandler} />
                         -
                        <input type="text" value={thirdRegNo} id="thirdRegNo" name="thirdRegNo" size="3"
                                    onChange={onThirdRegNoHandler} />

                                <button>중복체크</button>
                            </td>
                            <th>회원구분</th>
                            <td colSpan="2">
                                <select onChange={onMemberTpHandler} value={memberTp}>

                                    {valueArr[0].map(item => ( 
                                                 <option key ={item.key} value ={item.key}>{item.value}</option>                          
                                             ))}
                                </select>
                            </td>
                        </tr>

                        <tr>
                            <th>대표자<span class="star">(*)</span></th>
                            <td>
                                <input type="text" value={empIdName} id="empIdName" name="empIdName" size="5"
                                    onChange={onEmpIdNameHandler} /></td>

                            <th>연락처<span class="star">(*)</span></th>
                            <td colSpan="2">
                                <input type="text" value={firstEmpHp} id="firstEmpHp" name="firstEmpHp" size="5"
                                    onChange={onFirstEmpHpHandler} />
                         -
                        <input type="text" value={secondEmpHp} id="secondEmpHp" name="secondEmpHp" size="5"
                                    onChange={onSecondEmpHpHandler} />
                         -
                        <input type="text" value={thirdEmpHp} id="thirdEmpHp" name="thirdEmpHp" size="5"
                                    onChange={onThirdEmpHpHandler} />
                            </td>

                            <th>E-mail<span class="star">(*)</span></th>
                            <td colSpan="2">
                                <input type="text" value={empEmailId} id="empEmailId" name="empEmailId" size="5"
                                    onChange={onEmpEmailIdHandler} />
                        @
                        <input type="text" value={domainAddress} id="domainAddress" name="domainAddress" size="5"
                                    onChange={onDomainAddressHandler} />
                            </td>
                        </tr>
                        <tr>
                            <th rowSpan="2">대표자 주소</th>
                            
                            <td colSpan="9">
                                
                            <input type="text" value={zipcode} id="zipcode" name="zipcode" size="10"
                                onChange={onZipcodeHandler} />

                                
                                 <input type="text" value={empAddress} id="empAddress" name="empAddress" size="30"
                                onChange={onEmpAddressHandler} />
                            </td>

                        </tr>
                        <tr>
                            <td colSpan="9"><input type="text" value={empDetailAddress} id="empDetailAddress" name="empDetailAddress" size="30"
                                onChange={onEmpDetailAddressHandler} />
                            </td>
                        </tr>

                        <tr>
                            <th>첨부파일</th>
                            <td colSpan="4"><input type="text" /><button>파일 선택</button></td>
                            <td colSpan="5"><input type="text" /><button>파일 선택</button></td>
                        </tr>


                        {/* 계약정보란 */}
                        <tr>
                            <th rowSpan="7">계약정보</th>
                        </tr>
                        <tr>
                            <th>계약구분</th>
                            <td>
                                <select onChange={onContractTpHandler} value={contractTp}>

                                    {valueArr[1].map(item => ( 
                                                 <option key ={item.key} value ={item.key}>{item.value}</option>                          
                                             ))}
                                </select></td>

                            <th>호실</th>
                            <td>
                                <select onChange={onContractTpValHandler} value={contractTpVal}>
                                        
                                    {contractTpVals.map(item => ( 
                                                 <option key ={item.key} value ={item.key}>{item.value}</option>                          
                                             ))} 
                                </select>
                            </td>

                            <th>사물함</th>
                            <td>
                                <select onChange={onRoomLockerTpHandler} value={roomLockerTp}>

                                    {valueArr[2].map(item => ( 
                                                 <option key ={item.key} value ={item.key}>{item.value}</option>                          
                                             ))}
                                </select>
                            </td>

                            <th>월회비</th>
                            <td>
                                <input type="text" value={contractMoney} id="contractMoney" name="contractMoney" size="5"
                                    onChange={onContractMoneyHandler} />
                            </td>
                        </tr>

                        <tr>
                            <th>이용기간</th>
                            <td><input type="text" value={contractTerm} id="contractTerm" name="contractTerm" size="10"
                                onChange={onContractTermHandler} />개월
                        </td>

                            <th>입금일</th>
                            <td>
                                <select onChange={onPayDateHandler} value={payDate}>

                                     {payDates.map(item => ( 
                                                 <option key ={item.key} value ={item.key}>{item.value}</option>                          
                                             ))} 
                                </select>
                            </td>

                            <th>납부방법</th>
                            <td>
                                <select onChange={onPayMethodHandler} value={payMethod}>

                                    {valueArr[3].map(item => ( 
                                                 <option key ={item.key} value ={item.key}>{item.value}</option>                          
                                             ))}
                                </select>
                            </td>
                            <th>납부액</th>
                            <td><input type="text" value={contractMoney} id="contractMoney" name="contractMoney" size="10"
                                onChange={onContractMoneyHandler} /></td>
                        </tr>

                        <tr>
                            <th>특약사항</th>
                            <td colSpan="9">
                                계약기간 만료 또는 종료시 사업지 주소지와 전화를 7일이내 이전해야 하고,<br />
                        계약을 해지할 경우 7일이전에 서면 또는 구두 통보해야함.<br />
                                <textarea value={comment} id="comment" name="comment" onChange={onCommentHandler}></textarea>
                            </td>
                        </tr>

                        <tr>
                            <th>이용범위</th>
                            <td colSpan="9">
                                사무공간 제공과 부대시설(회의실,접견실,휴게실,IT기기,유무선 통신망)을 이용 가능
                        </td>
                        </tr>

                        <tr >
                            <th>센터</th>
                            <td>(주)에스원테크</td>

                            <th colSpan="2">전화번호</th>
                            <td colSpan="2">070-4355-2312</td>

                            <th>E-mail</th>
                            <td>swonbiz@s-onetech.com</td>
                        </tr>

                        <tr>
                            <th>성명</th>
                            <td>이정희</td>

                            <th colSpan="2">FAX번호</th>
                            <td colSpan="2">070-4015-3344/02-6203-4433</td>

                            <th>계약접근경로</th>
                            <td>
                                <select onChange={onPayMethodHandler} value={payMethod}>

                                    {valueArr[4].map(item => ( 
                                                 <option key ={item.key} value ={item.key}>{item.value}</option>                          
                                             ))}
                                </select>
                            </td>
                        </tr>


                        <tr>
                            <td colSpan="9">

                                <tr>
                                    <td colSpan="9">
                                        -에스원비즈 삼성센터(이하 "갑")과 상기 회원(이하 "을")은 "갑"이 제공하는 서비스를 "을"이 이용함에 있어서 수반되는 사항을 본
                                        이용계약서 약관대로 체결하고, 본 계약의 성립을 증명하기 위하여 본 이용계약서 2부를 작성하여 기명, 날인하고 각 한 부씩 보관한다.
                                <br />-본 이용계약서로는 임대차계약서를 대신할 수 없음
                                </td>
                                </tr>
                                <tr >
                                    <td colSpan="9">
                                        2020년  월    일
                                </td>
                                </tr>

                                <tr>
                                    <td rowSpan="4">
                                        갑:
                                </td>

                                </tr>

                                <tr>
                                    <td>
                                        서울특별시 강남구 봉은사로 63길 11 명화빌딩 3, 4층(삼성동)	을 :
                                </td>
                                </tr>
                                <tr>
                                    <td>
                                        ㈜ 에스원테크  최현수 (인)
                                </td>
                                </tr>
                                <tr>
                                    <td>                                                 (인)
                                    계좌번호 : 우리은행  1005-002-433395
                                </td>
                                </tr>
                            </td>
                        </tr>
                    </table>

                    <div id="btn-center">
                        <button>임시저장</button>
                        <button type = "submit">저장</button>
                        <button>출력</button>
                        <button>임대차 계약서</button>
                        <button>삭제</button>
                        <button>닫기</button>
                    </div>
                </form>
            </div>
        </Fragment>
    );

}

export default S010100010;