import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { post } from 'axios';
import './css/S010100050.css';
import S010100010 from './S010100010';

import DaumPostcode from 'react-daum-postcode';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import Dialog from '@material-ui/core/Dialog';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import Form from 'react-bootstrap/Form';

import Pagination from "./utils/Pagination";


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24,
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));


let num = '';
let rNum = 0;
let memberTpDetail = [];

function S010100050(props) {

    const [isPostOpen, setIsPostOpen] = useState(false);
    const classes = useStyles();

    const handleOpen = () => {
        setIsPostOpen(true);
    };

    const handleClose = () => {
        setIsPostOpen(false);
    };

    const [detailAllInfo, setDetailAllInfo] = useState([]);

    const [nameForDetailCModal, setNameForDetailCModal] = useState('');

    // 회원정보
    const [detailMemberNm, setDetailMemberNm] = useState('');

    const [detailFstRegNo, setDetailFstRegNo] = useState('');
    const [detailSndRegNo, setDetailSndRegNo] = useState('');
    const [detailThdRegNo, setDetailThdRegNo] = useState('');

    const [detailMemberTp, setDetailMemberTp] = useState('')
    const [detailName, setDetailName] = useState('');

    const [detailFstEmpHp, setDetailFstEmpHp] = useState('');
    const [detailSndEmpHp, setDetailSndEmpHp] = useState('');
    const [detailThdEmpHp, setDetailThdEmpHp] = useState('');

    const [detailEmpEmail, setDetailEmpEmail] = useState('');
    const [detailDomain, setDetailDomain] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [detailZipcode, setDetailZipcode] = useState('');
    const [detailDetailAddress, setDetailDetailAddress] = useState('');

    //const [startAsk_date, setStartAsk_date] = useState(new Date());
    const [endDateTest, setEndDateTest] = useState('');

    const [detailCeoIdCardImg, setDetailCeoIdCardImg] = useState('')
    const [detailRegistCardImg, setDetailRegistCardImg] = useState('')

    const dataMemId = props.dataMemId;


    const [conOpen, setConOpen] = React.useState(false);
    const [newOpen, setNewOpen] = React.useState(false);
    const [detailMemberId, setDetailMemberId] = useState('');
    const [mEndFlag,setMEndFlag] = useState('');


    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(3);
    const indexOfLastPost = currentPage * postsPerPage;

    // 첨부파일업로드
    const [idCardFile, setIdCardFile] = useState(null);
    const [idCardFileName, setIdCardFileName] = useState('');
    const [registCardFile, setRegistCardFile] = useState(null);
    const [registCardFileName, setRegistCardFileName] = useState('');

    const idCardHandleFileChange = (event) => {
        // file: event.currentTarget.idCardFiles[0];
        setIdCardFile(event.currentTarget.files[0]);
        setIdCardFileName(event.currentTarget.value);
    }

    const registCardHandleFileChange = (event) => {
        // file: event.currentTarget.registCardFiles[0];
        setRegistCardFile(event.currentTarget.files[0]);
        setRegistCardFileName(event.currentTarget.value);
    }


    useEffect(() => {

        axios.get('/api/memDetail/memberTpDetail')
            .then(response => {
                if (response.data.success) {
                    let arr = [{ key: '선택', value: '선택' }]

                    response.data.rows.map((data) =>
                        arr.push({
                            value: data.CD_V_MEANING,
                            key: data.CD_V
                        }));

                    memberTpDetail = arr;
                } else {
                    alert(" 데이터를 불러오는데 실패하였습니다.");
                }
            })


    }, [])

    const detailMemberList = () => {
        let body = {
            dataMemId: dataMemId
        }
        // console.log('dataMemId',dataMemId);

        axios.post('/api/memDetail/detailMember_by_id', body)
            .then(response => {
                if (response.data.success) {
                    //console.log('memberId', response.data.rows[0]);

                    const memberId = response.data.rows[0].MEMBER_ID;
                    const modalMemberNm = response.data.rows[0].MEMBER_NM;
                    const modalRegNo = response.data.rows[0].REG_NO;
                    const modalMemberTp = response.data.rows[0].MEMBER_TP;
                    const modalName = response.data.rows[0].NAME;
                    const modalEmpHp = response.data.rows[0].EMP_HP;
                    const modalEmpEmail = response.data.rows[0].EMP_EMAIL;
                    const modalZip = response.data.rows[0].ZIP_CODE;
                    const modalAddr = response.data.rows[0].ADDRESS;
                    const modalDetailAddr = response.data.rows[0].DETAIL_ADDRESS;
                    //const modalAddress = zip + ' ' + addr + ' ' + detailAddr;
                    const modalEndDate = response.data.rows[0].END_DATE;
                    const modalIdImg = response.data.rows[0].CEO_IMAGE_ID;
                    const modalRegistImg = response.data.rows[0].CEO_IMAGE_REGISTER;
                    const modalEndFlag = response.data.rows[0].END_FLAG;

                    const modalRegNos = modalRegNo.split('-');
                    const modalEmpHps = modalEmpHp.split('-');
                    const modalEmpEmails = modalEmpEmail.split('@');

                    // console.log('response.data.rows[0].MEMBER_ST',response.data.rows[0].MEMBER_ST);
                    setDetailAllInfo(response.data.rows);
                    setDetailMemberId(memberId);

                    setEndDateTest(modalEndDate);

                    setDetailMemberNm(modalMemberNm);

                    setDetailFstRegNo(modalRegNos[0]);
                    setDetailSndRegNo(modalRegNos[1]);
                    setDetailThdRegNo(modalRegNos[2]);

                    setDetailMemberTp(modalMemberTp);
                    setDetailName(modalName);

                    setDetailFstEmpHp(modalEmpHps[0]);
                    setDetailSndEmpHp(modalEmpHps[1]);
                    setDetailThdEmpHp(modalEmpHps[2]);

                    setDetailEmpEmail(modalEmpEmails[0]);
                    setDetailDomain(modalEmpEmails[1]);
                    setMEndFlag(modalEndFlag);
                    //setStartAsk_date(new Date(modalEndDate));

                    setDetailZipcode(modalZip);
                    setDetailAddress(modalAddr);
                    setDetailDetailAddress(modalDetailAddr);
                    setDetailCeoIdCardImg(modalIdImg);
                    setDetailRegistCardImg(modalRegistImg);
                } else {
                    alert('상세정보 데이터를 불러오는데 실패하였습니다.');
                }
            })
    }

    useEffect(() => {
        detailMemberList();
    }, [])

    // 회원정보수정 함수
    const tempAddMember = () => {
        const url = '/api/memDetail/modifyMember';
        const formData = new FormData();
        // console.log('memberId',memberId);
        const dataMemId = props.dataMemId;
        // console.log('dataMemId', dataMemId);

        // 회원이름 및 전화번호 memberId
        // formData.append('dataName',dataName);
        // formData.append('dataEmpHp',dataEmpHp);
        formData.append('dataMemId', dataMemId);
        // 첨부파일
        formData.append('idCardFile', idCardFile);
        formData.append('registCardFile', registCardFile);
        formData.append('idCardFileName', idCardFileName);
        formData.append('registCardFileName', registCardFileName);

        // console.log('idCardFile',idCardFile);
        // console.log('idCardFileName',typeof idCardFileName);
        // 회원명
        formData.append('detailMemberNm', detailMemberNm);
        // 사업자번호
        formData.append('detailFstRegNo', detailFstRegNo);
        formData.append('detailSndRegNo', detailSndRegNo);
        formData.append('detailThdRegNo', detailThdRegNo);
        // 회원구분
        formData.append('detailMemberTp', detailMemberTp);
        // 성명
        formData.append('detailName', detailName);
        // 연락처
        formData.append('detailFstEmpHp', detailFstEmpHp);
        formData.append('detailSndEmpHp', detailSndEmpHp);
        formData.append('detailThdEmpHp', detailThdEmpHp);
        // email
        formData.append('detailDomain', detailDomain);
        formData.append('detailEmpEmail', detailEmpEmail);
        // 주소
        formData.append('detailZipcode', detailZipcode);
        formData.append('detailAddress', detailAddress);
        formData.append('detailDetailAddress', detailDetailAddress);


        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return post(url, formData, config);
    }

    // 회원정보 수정
    const onModifyHandler = (event) => {
        event.preventDefault();
        
        tempAddMember().then((response) => {
            alert('정상적으로 수정 되었습니다.');
            detailMemberList();
        })
    }

    const onDetailMemberNmHandler = (event) => {
        setDetailMemberNm(event.currentTarget.value);
    }

    const onDetailFstRegNoHandler = (event) => {
        setDetailFstRegNo(event.currentTarget.value);
    }

    const onDetailSndRegNoHandler = (event) => {
        setDetailSndRegNo(event.currentTarget.value);
    }
    const onDetailThdRegNoHandler = (event) => {
        setDetailThdRegNo(event.currentTarget.value);
    }

    const onDetailMemberTpHandler = (event) => {
        setDetailMemberTp(event.currentTarget.value);
    }

    const onDetailNameHandler = (event) => {
        setDetailName(event.currentTarget.value);
    }

    const onDetailFstEmpHpHandler = (event) => {
        setDetailFstEmpHp(event.currentTarget.value);
    }

    const onDetailSndEmpHpHandler = (event) => {
        setDetailSndEmpHp(event.currentTarget.value);
    }

    const onDetailThdEmpHpHandler = (event) => {
        setDetailThdEmpHp(event.currentTarget.value);
    }

    const onDetailEmpEmailHandler = (event) => {
        setDetailEmpEmail(event.currentTarget.value);
    }

    const onDetailDomainHandler = (event) => {
        setDetailDomain(event.currentTarget.value);
    }

    const onDetailZipcodeHandler = (event) => {
        setDetailZipcode(event.currentTarget.value);
    }

    const onDetailAddressHandler = (event) => {
        setDetailAddress(event.currentTarget.value);
    }

    const onDetailDetailAddressHandler = (event) => {
        setDetailDetailAddress(event.currentTarget.value);
    }

    const onSubmitDetailHandler = (event) => {

    }

    const onDetailClickOpen = (event) => {
        num = event.target.innerHTML;
        rNum = parseInt(num);
        setNameForDetailCModal(rNum);
        setConOpen(true);
    }


    const onConContractHandler = useCallback(() => {
        setConOpen(false);
        detailMemberList();
    });

    // 신규계약 닫기
    const onNewContractHandler = useCallback(()=> {
        setNewOpen(false);
        detailMemberList();
    });

    const onNewOpenContractHandler = (event) => {
        setNewOpen(true);
    }

    const onIdDownloadHandler = (event) => {
        event.preventDefault();
        console.log('dataMemId', dataMemId);

        axios.get(`/api/s01010050/download/tb_s10_member010_by_id?id=${dataMemId}&type=single`)
            .then(response => {
                if (response) {
                    alert('res');
                    // console.log(response);

                } else {
                    alert("다운로드에 실패하였습니다.");
                }
            })
    }

    const onRegDownloadHandler = (event) => {
        // event.preventDefault();

        // axios.get('/api/s010100150/regDownload')
        //     .then(response => {
        //         if (response) {
        //             alert('res');


        // } else {
        //             alert("다운로드에 실패하였습니다.");
        //         }
        //     })
    }


    const s010100050R = detailAllInfo.map((detailAllInfo, index) => {
        return (
            <TableRow key={index}>
                <TableCell onClick={onDetailClickOpen} className='underLineForDetail' id={detailAllInfo.CONTRACT_ID}>{detailAllInfo.CONTRACT_ID}</TableCell>
                <TableCell>{detailAllInfo.CONTRACT_DATE}</TableCell>
                <TableCell>{detailAllInfo.CONTRACT_TP}</TableCell>
                <TableCell>{detailAllInfo.CONTRACT_ROOM}</TableCell>
                <TableCell>{detailAllInfo.CONTRACT_TERM}개월 ({detailAllInfo.START_DATE} ~ {detailAllInfo.END_DATE})</TableCell>
                <TableCell>{detailAllInfo.MEMBER_ST}</TableCell>
                <TableCell>{detailAllInfo.PAY_DATE}일</TableCell>
                <TableCell>{detailAllInfo.MONTHLY_FEE}</TableCell>
                <TableCell>{detailAllInfo.CONTRACT_LOCKER}</TableCell>
                <TableCell>{detailAllInfo.END_FLAG}</TableCell>
            </TableRow>
        )

    });


    const postCodeStyle = {
        display: "block",
        top: "50%",
        width: "400px",
        height: "500px",
        padding: "10px",
    };

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = "";

        if (data.addressType === "R") {
            if (data.bname !== "") {
                extraAddress += data.bname;
            }
            if (data.buildingName !== "") {
                extraAddress +=
                    extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }
        setDetailZipcode(data.zonecode);
        setDetailAddress(fullAddress);
    };


    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = s010100050R.slice(indexOfFirstPost, indexOfLastPost);
    const paginate = pageNumber => setCurrentPage(pageNumber);


    return (
        <form style={{
            display: 'flex',
            flexDirection: 'column14',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
        }}
            encType='multipart/form-data'
            onSubmit={onSubmitDetailHandler}
        >
            <div className="memberInfoWrapper">
                <div className="memberInfoWrap">
                    {/* 회원정보란 */}
                    <h5 id="infoTitle">회원 정보</h5>
                    
                    <table id="memberDetailTable">
                    <tbody>
                        <tr>
                            <th colSpan="2">회원명</th>
                            
                            <td>

                                <Form.Control style={{ width: 5 + 'em', display: 'inline' }} size="sm"
                                    type="text" value={detailMemberNm} id="detailMemberNm" name="detailMemberNm"
                                    onChange={onDetailMemberNmHandler} />

                            </td>
                            <th>사업자번호</th>
                            <td colSpan="2">

                                <Form.Control style={{ width: 5 + 'em', display: 'inline' }} size="sm"
                                    type="text" value={detailFstRegNo} id="detailRegNo" name="detailRegNo"
                                    onChange={onDetailFstRegNoHandler} />
                                &nbsp; - &nbsp;

                                <Form.Control style={{ width: 3 + 'em', display: 'inline' }} size="sm"
                                    type="text" value={detailSndRegNo} id="detailRegNo" name="detailRegNo"
                                    onChange={onDetailSndRegNoHandler} />
                                &nbsp; - &nbsp;

                                <Form.Control style={{ width: 7 + 'em', display: 'inline' }} size="sm"
                                    type="text" value={detailThdRegNo} id="detailRegNo" name="detailRegNo"
                                    onChange={onDetailThdRegNoHandler} />

                            </td>
                            <th>회원구분</th>
                            <td>

                                <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" as="select" multiple={false} onChange={onDetailMemberTpHandler} value={detailMemberTp|| ''}>
                                    {memberTpDetail.map((item,index) => (
                                        <option key={index} value={item.key}>{item.value}</option>
                                    ))}
                                </Form.Control>

                            </td>
                            <th>퇴실일자</th>
                            <td>

                                <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm"
                                    type="text" value={endDateTest} disabled />

                            </td>
                        </tr>

                        <tr>
                            <th rowSpan="2">대표자</th>

                            <th>성명</th>
                            <td>

                                <Form.Control style={{ width: 5 + 'em', display: 'inline' }} size="sm"
                                    type="text" value={detailName} id="detailName" name="detailName"
                                    onChange={onDetailNameHandler} />
                            </td>
                            <th>연락처</th>
                            <td colSpan="2">

                                <Form.Control style={{ width: 5 + 'em', display: 'inline' }} size="sm"
                                    type="text" value={detailFstEmpHp} id="detailEmpHp" name="detailEmpHp"
                                    onChange={onDetailFstEmpHpHandler} />

                                     &nbsp; - &nbsp;
                                     <Form.Control style={{ width: 5 + 'em', display: 'inline' }} size="sm"
                                    type="text" value={detailSndEmpHp} id="detailEmpHp" name="detailEmpHp"
                                    onChange={onDetailSndEmpHpHandler} />


                                     &nbsp; - &nbsp;
                                    <Form.Control style={{ width: 5 + 'em', display: 'inline' }} size="sm"
                                    type="text" value={detailThdEmpHp} id="detailEmpHp" name="detailEmpHp"
                                    onChange={onDetailThdEmpHpHandler} />

                            </td>
                            <th>E-mail</th>

                            <td colSpan="3">

                                <Form.Control style={{ width: 7 + 'em', display: 'inline' }} size="sm"
                                    type="text" value={detailEmpEmail} id="detailEmpEmail" name="detailEmpEmail"
                                    onChange={onDetailEmpEmailHandler} />


                            &nbsp; @ &nbsp;
                            <Form.Control style={{ width: 10 + 'em', display: 'inline' }} size="sm"
                                    type="text" value={detailDomain} id="detailEmpEmail" name="detailEmpEmail"
                                    onChange={onDetailDomainHandler} />


                            </td>
                        </tr>
                        <tr>
                        <th>주소</th>
                        <td colSpan="8">

                            <Form.Control style={{ width: 7 + 'em', display: 'inline' }} size="sm"
                                type="text" value={detailZipcode} id="detailAddress" name="detailAddress"
                                onChange={onDetailZipcodeHandler} />


                            &nbsp;
                            <Button variant="contained" color="primary" style={{ width: 70 }} onClick={handleOpen}>우편</Button>&nbsp;

                            <Modal
                                className={classes.modal}
                                open={isPostOpen}
                                onClose={handleClose}
                                closeAfterTransition
                                BackdropComponent={Backdrop}
                                BackdropProps={{
                                    timeout: 500,
                                }}
                            >
                                <Fade in={isPostOpen}>
                                    <div className={classes.paper}>
                                        <DaumPostcode autoClose style={postCodeStyle} onComplete={handleComplete} />
                                    </div>
                                </Fade>
                            </Modal>

                            <Form.Control style={{ width: 30 + 'em', display: 'inline' }} size="sm"
                                type="text" value={detailAddress} id="detailAddress" name="detailAddress"
                                onChange={onDetailAddressHandler} />



                            <Form.Control style={{ width: 45 + 'em', display: 'inline' }} size="sm"
                                type="text" value={detailDetailAddress} id="detailAddress" name="detailAddress"
                                onChange={onDetailDetailAddressHandler} />


                        </td>
                        </tr>
                        <tr>

                            <th rowSpan="2" colSpan="2">첨부파일</th>
                            <td colSpan="8">
                                <a href='#' onClick={onIdDownloadHandler} >{detailCeoIdCardImg}</a>&nbsp;
                                <input type='file'
                                    file={idCardFile}
                                    name='idCardFile'
                                    value={idCardFileName}
                                    onChange={idCardHandleFileChange}
                                />
                            </td>

                        </tr>
                        <tr>
                            <td colSpan="8">
                                <a href='#' onClick={onRegDownloadHandler}>{detailRegistCardImg}</a>&nbsp;
                                <input type='file'
                                    file={registCardFile}
                                    name='registCardFile'
                                    value={registCardFileName}
                                    onChange={registCardHandleFileChange}
                                />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                   
                    <React.Fragment >
                        <Title>상담 현황</Title>
                        <Table size="small">

                            <TableHead>
                                <TableRow>
                                    <TableCell>계약ID</TableCell>
                                    <TableCell>계약일자</TableCell>
                                    <TableCell>계약상품</TableCell>
                                    <TableCell>호    실</TableCell>
                                    <TableCell>계약기간</TableCell>
                                    <TableCell>계약상태</TableCell>
                                    <TableCell>매월입금일</TableCell>
                                    <TableCell>월회비</TableCell>
                                    <TableCell>사물함</TableCell>
                                    <TableCell>종료여부</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                              {currentPosts}
                            </TableBody>
                        </Table>
                        <div id="reactPage">
                            {/* <ReactPaginate
                                                    previousLabel = {"Previous"}
                                                    nextLabel = {"Next"}
                                                    pageCount = {pageCount}
                                                    onPageChange = {changePage}
                                                    containerClassName={"paginationBtns"}
                                                    previousLinkClassName={"previousBtn"}
                                                    nextLinkClassName={"nextBtn"}
                                                    disabledClassName={"paginationDisabled"}
                                                    activeClassName={"paginationActive"}   
                                                /> */}
                        </div>
                    </React.Fragment>
                    {/* </Paper> */}
                    {/* </Grid> */}
                    <div className="pageCenter">
                            <Pagination postsPerPage={postsPerPage} totalPosts={s010100050R.length} paginate={paginate} />
                        </div>

                    <div id="btnAlign">
            
                        <Button variant="contained" color="primary" style={{ width: 100 }} id="btn-centerN" onClick={onNewOpenContractHandler} >
                            신규계약
                        </Button>
                        <Button variant="contained" color="primary" style={{ width: 100 }} id="btn-centerN" onClick={onModifyHandler} >
                            수정하기
                        </Button>
                        <Button variant="contained" color="primary" style={{ width: 70 }} id="btn-centerN" onClick={props.onHandleDetailClickClose} >
                            닫기
                        </Button>
                    </div>
                </div>
            </div>

            {/*계약ID클릭*/}
            <Dialog
                maxWidth={"lg"}
                open={conOpen}
                onClose={onConContractHandler}>
                <S010100010 dataNum={rNum} cDataForm={'I'} endFlag = {mEndFlag} onConContractHandler={onConContractHandler}/>
            </Dialog>

            {/*신규계약 멤버ID클릭*/}
            <Dialog
                maxWidth={"lg"}
                open={newOpen}
                onClose={onNewContractHandler}>
                <S010100010 dataMem={detailMemberId} newDataForm={'N'} onNewContractHandler={onNewContractHandler}/>
            </Dialog>

        </form>

    );

}

export default S010100050;