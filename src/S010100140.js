import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/S010100140.css';

import Button from '@material-ui/core/Button';

import Form from 'react-bootstrap/Form';

import DatePicker, { registerLocale } from "react-datepicker";
import ko from 'date-fns/locale/ko'

registerLocale("ko", ko);




function S010100140(props) {

    const rNum = props.num;
    // 상세보기
    useEffect(() => {
      
        if (props.dataForm === 'U') {

            axios.get(`/api/s010100140/tb_s10_ask010_by_id?id=${rNum}&type=single`)
                .then(response => {
                    if (response.data.success) {
                        // // console.log(response.data)
                        const askTp = (response.data.rows[0].ASK_TP);
                        const askDate = (response.data.rows[0].ASK_DATE);
                        const askMethod = (response.data.rows[0].ASK_METHOD);
                        const askName = (response.data.rows[0].ASK_NAME);
                        const askPath = (response.data.rows[0].ASK_PATH);
                        const askInfo = (response.data.rows[0].ASK_INFO);
                        const askContent = (response.data.rows[0].ASK_CONTENT);
    
                        setModalAskTp(askTp);
                        setModalAskName(askName);
                        setModalAskMethod(askMethod);
                        setModalAskPath(askPath);
                        setModalAskInfo(askInfo);
                        setModalAskContent(askContent);
                        setStartDate(new Date(askDate));
                    } else {
                        alert(response.data.message);
                        alert("상세 정보 가져오기를 실패하였습니다.")
                    }
                })
        }

    }, [])

    //select-option
    const [modalAskTp, setModalAskTp] = useState('')
    const [modalAskMethod, setModalAskMethod] = useState('')
    const [modalAskPath, setModalAskPath] = useState('')

    const [modalContractTpLov, setModalContractTpLov] = useState([{ key: '', value: '선택' }])
    const [modalAskMethodLov, setModalAskMethodLov] = useState([{ key: '', value: '선택' }])
    const [modalAccessPathLov, setModalAccessPathLov] = useState([{ key: '', value: '선택' }])

    useEffect(() => {
        getContractTpLov();
        getAskMethodLov();
        getAccessPathLov();
    }, []);

    const getContractTpLov = () => {
        getLovByCdTp('CONTRACT_TP', 'ASK');
    };
    const getAskMethodLov = () => {
        getLovByCdTp('ASK_METHOD', '');
    };
    const getAccessPathLov = () => {
        getLovByCdTp('ACCESS_PATH', 'ASK');
    };

    /**
     * desc : LOV에 필요한 항목을 받아 DB조회 후 조회값을 반환하는 로직
     * */

    async function getLovByCdTp(cdTp, attribute2) {
        let arr = [{ key: '', value: '선택' }];
        return await axios.post('/api/s010100140/selectTest', { firstVal: cdTp, secondVal: attribute2 })
            .then(response => {
                if (response.data.success) {
                   // console.log('modalAskTp',response.data.rows);
                    response.data.rows.map((data) =>
                        arr.push({
                            value: data.CD_V_MEANING,
                            key: data.CD_V
                        }));
                    
                    switch (cdTp) {
                        case 'CONTRACT_TP': setModalContractTpLov(arr); break;
                        case 'ASK_METHOD': setModalAskMethodLov(arr); break;
                        case 'ACCESS_PATH': setModalAccessPathLov(arr); break;
                    }
                    if (cdTp === 'CONTRACT_TP')
                        setModalAccessPathLov(arr);
                } else {
                    alert(response.data.message);
                    alert("문의구분 데이터를 불러오는데 실패하였습니다.")
                }
            }).catch(() => {
               
                alert("문의구분 데이터를 불러오는데 실패하였습니다.");
            })
     
    }

    const [startDate, setStartDate] = useState(new Date());
  
    const [modalAskName, setModalAskName] = useState("")
    const [modalAskInfo, setModalAskInfo] = useState("")
    const [modalAskContent, setModalAskContent] = useState("")


    const onAskTpHandler = (event) => {
        setModalAskTp(event.currentTarget.value);
    }

    const onAskMethodHandler = (event) => {
        setModalAskMethod(event.currentTarget.value);
    }

    const onAskPathHandler = (event) => {
        setModalAskPath(event.currentTarget.value);
    }

    const onAskNameHandler = (event) => {
        setModalAskName(event.currentTarget.value);
    }

    const onAskInfoHandler = (event) => {
        setModalAskInfo(event.currentTarget.value);
    }

    const onAskContentHandler = (event) => {
        setModalAskContent(event.currentTarget.value);
    }
    



    const useConfirm = (message = null, onConfirm, onCancel) => {
        if (!onConfirm || typeof onConfirm !== "function") {
            return;
        }
        if (onCancel && typeof onCancel !== "function") {
            return;
        }

        const confirmAction = () => {
            if (window.confirm(message)) {
                onConfirm();
            } else {
                onCancel();
            }
        };

        return confirmAction;
    };

    const approvalConfirm = () => {

        const body = {
            modalAskId: rNum,
            modalAskTp: modalAskTp,
            modalAskDate: startDate,
            modalAskName: modalAskName,
            modalAskMethod: modalAskMethod,
            modalAskPath: modalAskPath,
            modalAskInfo: modalAskInfo,
            modalAskContent: modalAskContent
        }

        axios.post('/api/s010100140/modify', body)
            .then(response => {
                if (response.data.success) {
                    alert('정상적으로 수정되었습니다.');
                    props.setMOpen(false);
                    props.searchAsk();
                } else {
                    alert(response.data.message);
                    alert('수정에 실패하였습니다.')
                }
            })

    }

    const cancelConfirm = () => alert('수정을 취소하였습니다.');

    const onModifyHandler = useConfirm(
        modalAskName+'님의 정보를 수정하시겠습니까?',
        approvalConfirm,
        cancelConfirm
    );



    // 상담 등록 저장 버튼 클릭시
    const onHandleSubmit = (event) => {
        event.preventDefault();
        //   //문의구분 NUll체크
        if (!modalAskTp || modalAskTp === '선택') {
            return alert("문의구분을 선택하세요.");
        }

        //문의방법 NUll체크
        if (!modalAskMethod) {
           
            return alert("문의방법을 선택하세요.");
        }

        //접근경로 NUll체크
        if (!modalAskPath) {
            return alert("접근경로를 선택하세요.");
        }

        const body = {
            modalAskTp: modalAskTp,
            modalAskDate: startDate,
            modalAskName: modalAskName,
            modalAskMethod: modalAskMethod,
            modalAskPath: modalAskPath,
            modalAskInfo: modalAskInfo,
            modalAskContent: modalAskContent
        }

        axios.post('/api/s010100140/insert', body)
            .then(response => {
                if (response.data.success) {
                    alert('정상적으로 등록되었습니다.');
                    props.setStoreOpen(false);
                    props.searchAsk();
                } else {
                    alert(response.data.message);
                    alert('등록에 실패하였습니다.')
                }
            })

    }

    return (

        <form onSubmit={onHandleSubmit} >
        
            <div className="askInfoWrapper">
                <div className="memberInfoWrap">
                    {/* 회원정보란 */}
                    <h5 id="infoTitle">상담 등록</h5>

                    <table id="memberDetailTable">
                        <tbody>
                            <tr>
                                <th>문의구분</th>
                                <td>

                                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" as="select" multiple={false} onChange={onAskTpHandler} value={modalAskTp}>
                                        {modalContractTpLov.map(item => (
                                            <option key={item.key} value={item.key}>{item.value}</option>
                                        ))}
                                    </Form.Control>

                                </td>

                                <th>문의일자</th>
                                <td>
                                
                                    <DatePicker
                                        className="dateSize"
                                        locale="ko"
                                        selected={startDate.setHours(9, 0, 0, 0)}
                                        onChange={date => setStartDate(date)}
                                        dateFormat="yyyy-MM-dd (eee)"
                                    />

                                </td>

                                <th>문의자명</th>
                                <td>
                                    <Form.Control style={{ width: 7 + 'em', display: 'inline' }} size="sm"
                                        type="text"
                                        value={modalAskName}
                                        id="modalAskName"
                                        name="modalAskName"
                                        onChange={onAskNameHandler} />
                                </td>
                            </tr>

                            <tr>
                                <th>문의방법</th>
                                <td>
                                    <Form.Control style={{ width: 10 + 'em', display: 'inline' }} size="sm" as="select" multiple={false} value={modalAskMethod} onChange={onAskMethodHandler}>
                                        {modalAskMethodLov.map(item => (
                                            <option key={item.key} value={item.key}>{item.value}</option>
                                        ))}

                                    </Form.Control>

                                </td>

                                <th>접근경로</th>
                                <td>
                                    <Form.Control style={{ width: 7 + 'em', display: 'inline' }} size="sm" as="select" multiple={false} value={modalAskPath} onChange={onAskPathHandler}>
                                        {modalAccessPathLov.map(item => (
                                            <option key={item.key} value={item.key}>{item.value}</option>
                                        ))}

                                    </Form.Control>

                                </td>

                                <th>문의자연락처</th>
                                <td>
                                    <Form.Control style={{ width: 10 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={modalAskInfo} id="modalAskInfo" name="modalAskInfo" onChange={onAskInfoHandler} />
                                </td>
                            </tr>


                            <tr>
                                <th>상담내용</th>

                                <td colSpan="5">
                                    <Form.Control as="textarea" rows={3} value={modalAskContent} id="modalAskContent" name="modalAskContent"
                                        onChange={onAskContentHandler} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div id="btnAlign">
                <Button variant="contained" color="primary" style={{ width: 100 }} className="popBtn" onClick={onModifyHandler} hidden={props.dataForm !== 'U'} >수정하기</Button>
                <Button variant="contained" color="primary" style={{ width: 100 }} className="popBtn" type="submit" hidden={props.dataForm === 'U'} >등록하기</Button>
                <Button variant="contained" color="primary" style={{ width: 100 }} className="popBtn" hidden={props.dataForm !== 'U'} onClick={props.onDetailHandleClickClose}>닫기</Button>
                <Button variant="contained" color="primary" style={{ width: 100 }} className="popBtn" hidden={props.dataForm === 'U'} onClick={props.onHandleClickClose}>닫기</Button>
            </div>
        </form>

    );
}
export default S010100140;