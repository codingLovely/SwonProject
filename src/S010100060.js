import React, { Fragment, useEffect, useState } from 'react';
import Navbar from './Navbar';
import S010100070 from "./S010100070";
import Pagination from "./utils/Pagination";
//엑셀다운로드
import xlsx from 'xlsx';

//<!--켈린더 라이브러리시작
import DatePicker, { registerLocale } from "react-datepicker";
import ko from 'date-fns/locale/ko';
import axios from "axios";
import Dialog from "@material-ui/core/Dialog";
import S010100010 from "./S010100010";
import DialogActions from "@material-ui/core/DialogActions";
registerLocale("ko", ko);

//켈린더 라이브러리 끝-->
let paymentState = [{ key: '전체', value: '전체' },
{ key: 'Y', value: 'Y' },
{ key: 'N', value: 'N' }]

function S010100060(props) {

    const [userName, setUserName] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [checked, setChecked] = useState([]);

    //<!--캘린더 속성 
    const [startDate, setStartDate] = useState(new Date('2021/02/01'));
    const [endDate, setEndDate] = useState(new Date('2021/03/01'));
    //캘린더 속성 끝--> 

    const [payStatusList, setPayStatusList] = useState([]);
    const [storeOpen, setStoreOpen] = useState(false);
    const [dataAllContract, setDataAllContract] = useState('');

    //페이징
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const indexOfLastPost = currentPage * postsPerPage;


    useEffect(() => {
        let startDates = startDate.getFullYear() + '.' + (startDate.getMonth() + 1) + '.' + startDate.getDate();
        let endDates = endDate.getFullYear() + '.' + (endDate.getMonth() + 1) + '.' + endDate.getDate();

        let body = {
            startDate: startDates,
            endDate: endDates
        }
        axios.post('/api/s010100060/list', body)
            .then(response => {
                if (response.data.success) {
                    console.log('list60', response.data.rows);
                    setPayStatusList(response.data.rows);
                } else {
                    alert("데이터 조회를 실패하였습니다.")
                }

            })
    }, [])

    const paymentSearchHandler = (event) => {

        let startDates = startDate.getFullYear() + '.' + (startDate.getMonth() + 1) + '.' + startDate.getDate();
        let endDates = endDate.getFullYear() + '.' + (endDate.getMonth() + 1) + '.' + endDate.getDate();

        let body = {
            startDate: startDates,
            endDate: endDates,
            userName: userName,
            paymentStatus: paymentStatus
        }

        
    
        axios.post('/api/s010100060/list', body)
            .then(response => {
                if (response.data.success) {
                    console.log('list60', response.data.rows);
                    setPayStatusList(response.data.rows);
                } else {
                    alert("데이터 조회를 실패하였습니다.")
                }

            })
    }

    //<!--onSubmit
    const onSubmitHandler = (event) => {
        event.preventDefault();
    }
    //onSubmit끝-->

    const nameSearchHandler = (event) => {
        setUserName(event.currentTarget.value);
    }

    const paymentStatusHandler = (event) => {
        setPaymentStatus(event.currentTarget.value);
    }


    const onPayHandleClickClose = () => {
        setStoreOpen(false);
    }


    const handleToggle = (e) => {
        console.log('event', e.target.id);
        const currentIndex = checked.indexOf(e.target.id);
        //전체 Checked된 State에서 현재 누를 Checkbox가 있는지 확인
        const newChecked = checked;

        if (currentIndex === -1) {
            newChecked.push(e.target.id)
        } else {
            newChecked.splice(currentIndex, 1)
        }

        setChecked(newChecked);
        //빽주고
        //state를 넣어준다
        //e.target.checked = false;

        console.log('currentIndex', currentIndex);
        console.log('checked', checked);

        // handleFilters(filters,tb_s10_ask010);

    }

    const onPaymenthandler = () => {
        if (checked.length === 0) {
            alert('선택하세요');
        } else if (checked.length > 1) {
            alert('하나만 체크하세요');
        } else {
            setDataAllContract(checked);
            //console.log(checked);
            setStoreOpen(true);
        }
    }

    const excelHandler = (event) => {
        event.preventDefault();

        const ws = xlsx.utils.json_to_sheet(payStatusList);
        console.log(payStatusList);

        ['회원명', '납부예정일', '납부여부', '납부일자', '계약기간', '계약기간', '대표자 성명', '대표자 연락처', '대표자 E-mail', '계약ID']
            .forEach((x, idx) => {
                const cellAdd = xlsx.utils.encode_cell({ c: idx, r: 0 });
                ws[cellAdd].v = x;

            })

        ws['!cols'] = [];
        ws['!cols'][9] = { hidden: true };


        const wb = xlsx.utils.book_new();

        xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
        xlsx.writeFile(wb, "고객납부현황.xlsx");

    }

    const s010100060R = payStatusList.map((payStatusList, index) => {
        return (
            <tr class='dataTable'>
                <td><input type="checkbox" onChange={handleToggle} id={payStatusList.CONTRACT_ID} /></td>
                <td name="uname" variant="outlined" color="primary">
                    {payStatusList.CONTRACT_ID}
                </td>
                <td>{payStatusList.MEMBER_NM}</td>
                <td>{payStatusList.PAY_PLAN_DATE}</td>
                <td>{payStatusList.PAYED_FLAG}</td>
                <td>{payStatusList.PAYED_DATE}</td>
                <td>{payStatusList.START_DATE} ~ {payStatusList.END_DATE}</td>
                <td>{payStatusList.NAME}</td>
                <td>{payStatusList.EMP_HP}</td>
                <td>{payStatusList.EMP_EMAIL}</td>
            </tr>
        )
    });

    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = s010100060R.slice(indexOfFirstPost, indexOfLastPost);
    //Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <Fragment>
            <Navbar />
            <form style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
            }}
                onSubmit={onSubmitHandler}
            >

                <h1>고객납부현황</h1>
                <div id="search">

                    납부예정일&nbsp;
                    {/* date클릭할 때 고정 */}
                    <DatePicker
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        dateFormat="yyyy.MM.dd"
                    /> ~&nbsp;
                    <DatePicker
                        selected={endDate}
                        onChange={date => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        dateFormat="yyyy.MM.dd"
                    />

                    {/* <input type="image" src="/examples/images/submit_icon.png" alt="제출버튼" height="30" width="30"/> */}
                    &nbsp;
                    회원명&nbsp;
                    <input
                        type="text"
                        value={userName}
                        id="userName"
                        name="userName"
                        size="5"
                        onChange={nameSearchHandler}
                    />
                    &nbsp;

                    납부여부&nbsp;
                    <select multiple={false} onChange={paymentStatusHandler} value={paymentStatus}>

                        {paymentState.map(item => (
                            <option key={item.key} value={item.key}>{item.value}</option>
                        ))}

                    </select>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <input type="button" value="조회" onClick={paymentSearchHandler}></input>
                </div>

                <table id="btn">
                    <thead>
                        <tr>
                            <td id="btd">
                                <button className='loginBtn' onClick={onPaymenthandler}> 납부</button>
                            </td>
                            <td id="btd2">
                                <input type="button" onClick={excelHandler} value="엑셀다운로드"></input>
                            </td>
                        </tr>
                    </thead>
                </table>

                <table id="list">
                    <thead>
                        <tr>
                            <th rowSpan="2">선택</th>
                            <th rowSpan="2">No</th>
                            <th rowSpan="2">회원명</th>
                            <th rowSpan="2">납부예정일</th>
                            <th rowSpan="2">납부여부</th>
                            <th rowSpan="2">납부일자</th>
                            <th rowSpan="2">계약기간</th>
                            <th colSpan="3">대표자</th>
                        </tr>
                        <tr>
                            <th>성명</th>
                            <th>연락처</th>
                            <th>E-mail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts}
                    </tbody>
                </table>
                <Pagination postsPerPage={postsPerPage} totalPosts={s010100060R.length} paginate={paginate} />
                <Dialog
                    maxWidth={"lg"}
                    open={storeOpen}
                    onClose={onPayHandleClickClose}>
                    <S010100070 dataContracId={dataAllContract} />
                    <DialogActions>
                        <input type="button" onClick={onPayHandleClickClose} color="primary" value="닫기">
                        </input>
                    </DialogActions>
                </Dialog>

            </form>

        </Fragment>
    );

}

export default S010100060;