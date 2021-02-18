import React, {Fragment, useState, useEffect, useRef} from 'react';
import './css/S010100070.css';
import axios from 'axios';
//엑셀다운로드
import xlsx from 'xlsx';

import Pagination from'./utils/Pagination';


import DatePicker, {registerLocale} from 'react-datepicker';
import ko from 'date-fns/locale/ko';
registerLocale("ko", ko);



let payDateSt = '';
function S010100070(props) {

    const [paymentMemberNm, setPaymentMemberNm] = useState('');
    const [paymentPeriod, setPaymentPeriod] = useState('');
    const [paymentCeoNm, setPaymentCeoNm] = useState('');
    const [paymentEmpHp, setPaymentEmpHp] = useState('');
    const [paymentEmpEmail, setPaymentEmpEmail] = useState('');
    const [paymentEmpComment, setPaymentEmpComment] = useState('');
    const [paymentStatusList, setPaymentStatusList] = useState([]);

    //페이징
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(12);
    const indexOfLastPost = currentPage * postsPerPage;

    const [checked, setChecked] = useState([]);

    // const []
    const paymentMemberNmHandler = (event) => {
        setPaymentMemberNm(event.currentTarget.value);
    }

    const paymentPeriodHandler = (event) => {
        setPaymentPeriod(event.currentTarget.value);
    }

    const paymentCeoNmHandler = (event) => {
        setPaymentCeoNm(event.currentTarget.value);
    }

    const paymentEmpHpHandler = (event) => {
        setPaymentEmpHp(event.currentTarget.value);
    }

    const paymentEmpEmailHandler = (event) => {
        setPaymentEmpEmail(event.currentTarget.value);
    }

    const paymentEmpCommentHandler = (event) => {
        setPaymentEmpComment(event.currentTarget.value);
    }

     //데이터 들고오는 API
     const paymentStList = () =>{
        axios.get(`/api/payStList/insert/tb_s10_contract020_by_id?id=${dataContracId}`)
            .then(response => {
                if (response.data.success) {
                    //초기값 세팅
                    response.data.rows.map((row) => {
                        if(row.PAYED_DATE === null || row.PAYED_DATE === undefined) row.PAYED_DATE = makeYYMMDD(new Date());
                        if(row.CONTRACT_COMMENT === null || row.CONTRACT_COMMENT === undefined) row.CONTRACT_COMMENT = '';
                        console.log('row', row);
                    })
                   

                    setPaymentStatusList(response.data.rows);
                    setPaymentMemberNm(response.data.rows[0].MEMBER_NM);
                    setPaymentPeriod(response.data.rows[0].CONTRACT_TERM + '개월 ' +
                        '(' + response.data.rows[0].START_DATE + ' ~ ' + response.data.rows[0].END_DATE + ')');
                    setPaymentCeoNm(response.data.rows[0].NAME);
                    setPaymentEmpHp(response.data.rows[0].EMP_HP);
                    setPaymentEmpEmail(response.data.rows[0].EMP_EMAIL);
                    setPaymentEmpComment(response.data.rows[0].COMMENT);
                    setPayMethodM(response.data.rows[0].PAY_METHOD);

                } else {
                    alert("데이터 조회를 실패하였습니다.")
                }

            })
        }

     useEffect(() => {
        paymentStList();
     }, [])

     let newChecked;

    
     const toggleHandler = (event) => {
      
        const currentIndex = checked.indexOf(event.target.id);
        // const currentIndex = checked.findIndex((items,idx) => 
        // {return items.PAY_PLAN_DATE !== event.target.id});
        //전체 Checked된 State에서 현재 누를 Checkbox가 있는지 확인
        // console.log('event.target.id[0]',event.target.id);
        // console.log('event.target.className',event.target.className[0]);
        newChecked = checked;

        if (currentIndex === -1) {
            newChecked.push(event.target.id)
        } else {
            newChecked.splice(currentIndex, 1)
        }
        setChecked(newChecked);
        
        console.log('newChecked',newChecked);
     }


    //납부 버튼
    const payBtnHandler = (event) => {

        let modalContractId = props.dataContracId;
        let modalPayPlanDate = checked;
        console.log(checked);
        console.log('modalContractId',modalContractId);

        let body = {
            //id -> date
            modalContractId: modalContractId,
            modalPayPlanDate: modalPayPlanDate,
            payMethodM:payMethodM,
            //insertPayDate: insertPayDate,
            //paymentStatusList:paymentStatusList
            newChecked:newChecked
        }
        console.log('newChecked', body);

        axios.post('/api/payStList/paymentUpdate',body)
           .then(response => {
                if (response.data.success) {
                    alert('완료되었습니다.');
               } else {
                   alert('실패하였습니다.');
               }
           })
            //paymentStList();
            newChecked=[];
        }
        
    const snsBtnHandler = (event) => {

    }
    const emailBtnHandler = (event) => {

    }  
    //엑셀다운로드
    const excelBtnHandler = (event) => {
        event.preventDefault();

        const ws = xlsx.utils.json_to_sheet(paymentStatusList);

        ['대표자','연락처','E-mail','회원명','계약상태','계약기간','계약기간','납부일자','특약사항','계약기간(개월)','납부예정일','contract_id','납부여부','비고']
        .forEach((x,idx) => {
            const cellAdd = xlsx.utils.encode_cell({c:idx,r:0});
            ws[cellAdd].v = x;
            
        })

        ws['!cols'] = [];
        // ws['!cols'][4] = {hidden:true};
        // ws['!cols'][7] = {hidden:true};
        ws['!cols'][11] = {hidden:true};
        

        const wb = xlsx.utils.book_new();

        xlsx.utils.book_append_sheet(wb,ws,"Sheet1");
        xlsx.writeFile(wb,"고객납부등록.xlsx");
    }


    let dataContracId = props.dataContracId;

    
 

// const [s010100070R, setS010100070R] = useState([]);
const makeYYMMDD = (value) => {
    let year = (value.getFullYear()+'').substring(2);
    //console.log('year',year);
    let month = value.getMonth() + 1;
    let date = value.getDate();
    month = month < 10 ? '0' + month : month;
    date = date < 10 ? '0' + date : date;
    return year+'.'+month+'.'+date;
}


//뿌려주는 곳
const s010100070R = paymentStatusList.map((paymentStatus, index) => {
    let insertPayDate = paymentStatus.PAYED_DATE 
                        ? new Date('20' + paymentStatus.PAYED_DATE) 
                        : new Date();

        return (
            <tr className='dataTable'>
                {/*CONTRACT_ID와 날짜를 함께 들고가야한다.*/}
                <td name="uname" variant="outlined" color="primary">
                    <input type="checkbox" onChange={toggleHandler} id={paymentStatus.PAY_PLAN_DATE+','+paymentStatus.PAYED_DATE+','+paymentStatus.CONTRACT_COMMENT}/>
                </td>
                <td id = {paymentStatus.CONTRACT_ID}>{index + 1}</td>
                <td>{paymentStatus.PAY_PLAN_DATE}</td>
                <td>{paymentStatus.PAYED_FLAG}</td>
                <td key = {paymentStatus.PAY_PLAN_DATE} id={paymentStatus.PAY_PLAN_DATE}>
                    {/* api보고 바뀐 이벤트 값 들고오는거 찾아서 했어요 */}
                    <DatePicker
                        //ref = {payDateRef}
                        id = {paymentStatus.PAY_PLAN_DATE}
                        locale="ko"
                        selected={insertPayDate.setHours(9, 0, 0, 0)}
                        onChange={
                             date => {setPaymentStatusList(
                             paymentStatusList.map(changePaymentStatus =>
                             changePaymentStatus.PAY_PLAN_DATE === paymentStatus.PAY_PLAN_DATE ?
                             {...changePaymentStatus, PAYED_DATE : makeYYMMDD(date)}
                             : changePaymentStatus
                             ))}
                             
                            
                            }
                        selectsStart
                        startDate={insertPayDate}
                        dateFormat="yyyy.MM.dd"
                    />
                </td>
                <td>
                    {/* {paymentStatus.CONTRACT_COMMENT} */}
                    <textarea type="text" cols="20" rows="2" 
                              value = {paymentStatus.CONTRACT_COMMENT}
                              size = "5" 
                              id = {paymentStatus.PAY_PLAN_DATE} 
                              onChange={ (e) => {
                                //   console.log('비고',e.target.value);
                                setPaymentStatusList(
                                    paymentStatusList.map((changePaymentStatus,chIndex) =>
                                    chIndex === index ?
                                    {...changePaymentStatus, CONTRACT_COMMENT : e.target.value}
                                    : changePaymentStatus
                                    ))}
                              }
                              />
                </td>
    
    
            </tr>
        )
    });



    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = s010100070R.slice(indexOfFirstPost, indexOfLastPost);
    //Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    const[payMethodM,setPayMethodM] = useState('');

    return (
        <div>
            <Fragment>

                <form style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%'
                }}>
                    

                    <h1>고객납부등록</h1>
                    <div id='list'>
                        <table className='resultTable'>
                            <tr>
                                <td>
                                    회원명&nbsp;&nbsp;&nbsp;&nbsp;
                                    <input type="text" value={paymentMemberNm} id="memberNm" name="memberNm" size="5"
                                           onChange={paymentMemberNmHandler}/>
                                    &nbsp;&nbsp;&nbsp;
                                    계약기간 &nbsp;
                                    <input type="text" value={paymentPeriod} id="regNo" name="regNo" size="27"
                                           onChange={paymentPeriodHandler}/>
                                    &nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    대표자 &nbsp;&nbsp;&nbsp;
                                    <input type="text" value={paymentCeoNm} id="name" name="name" size="7"
                                           onChange={paymentCeoNmHandler}/>
                                    &nbsp;

                                    연락처 &nbsp;&nbsp;&nbsp;
                                    <input type="text" value={paymentEmpHp} id="name" name="name" size="13"
                                           onChange={paymentEmpHpHandler}/>
                                    &nbsp;
                                    메일주소 &nbsp;
                                    <input type="text" value={paymentEmpEmail} id="name" name="name" size="20"
                                           onChange={paymentEmpEmailHandler}/>

                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <span id="commentTitle">특약사항</span>&nbsp;
                                    <textarea type="text" cols="90" rows="3" value={paymentEmpComment} id="name"
                                              name="name"
                                              size="5"
                                              onChange={paymentEmpCommentHandler}/>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <table id='paymentList'>
                    <thead>
                        <tr>
                            <th>선택</th>
                            <th>No</th>
                            <th>납부예정일</th>
                            <th>납부여부</th>
                            <th>납부일자</th>
                            <th>비고</th>
                        </tr>
                        </thead>
                     <tbody>
                     {currentPosts}
                    </tbody>
                   </table>
                   <Pagination postsPerPage={postsPerPage} totalPosts={s010100070R.length} paginate={paginate} />
                    <div>
                        <input type="button"
                               onClick={payBtnHandler} value="납부"/>
                        <input type="button" className="new"
                               onClick={snsBtnHandler} value="SNS 전송"/>
                        <input type="button" className="memberId"
                               onClick={emailBtnHandler} value="메일 전송"/>
                        <input type="button" className="contractId"
                               onClick={excelBtnHandler} value="엑셀다운로드"/>
                        <input type="button" id="btnWidth" value="계산서발행"/>
                    </div>
                </form>
            </Fragment>

        </div>
    );

}

export default S010100070;