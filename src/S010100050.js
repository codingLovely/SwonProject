import React, { useState, useEffect, useCallback } from 'react';
import './css/S010100050.css';
import S010100010 from './S010100010';
import s010100040 from './service/s010100040';
import s010100050 from './service/s010100050';
import Base64Downloader from 'react-base64-downloader';
import DaumPostcode from 'react-daum-postcode';

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

import ReactPaginate from 'react-paginate';
import {useStyles} from './Test';

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

    const dataMemId = props.dataMemId;


    const [conOpen, setConOpen] = React.useState(false);
    const [newOpen, setNewOpen] = React.useState(false);
    const [detailMemberId, setDetailMemberId] = useState('');
    const [mEndFlag, setMEndFlag] = useState('');

    const [pageNumber, setPageNumber] = useState(0);
    const usersPerPage =20;
    const pagesVisited = pageNumber * usersPerPage;
    const pageCount = Math.ceil(detailAllInfo / usersPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    }

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(3);
    const indexOfLastPost = currentPage * postsPerPage;

    // 첨부파일업로드
    const [detailIdCardFile, setDetailIdCardFile] = useState(null);
    const [detailIdCardFileName, setDetailIdCardFileName] = useState('');


    const [detailBusiCardFile, setDetailBusiCardFile] = useState(null);
    const [detailBusiCardFileName, setDetailBusiCardFileName] = useState('');


    const [idCardImg,setIdCardImg] = useState('');
    const [busiLicfImg,setBusiLicfImg] = useState('');
    const [realIdCardFileName,setRealIdCardFileName] = useState('');
    const [realRegistCardFileName,setRealRegistCardFileName] = useState('');


    useEffect(() => {
    let cdTpValue='MEMBER_TP';
        
        s010100040.getSelectBox(cdTpValue).then((res) => {
            
            if(res.status === 200){
                
                let arr = [{ key: '선택', value: '선택' }]

                res.data.map((data) =>
                    arr.push({
                        value: data.cd_v_meaning,
                        key: data.cd_v
                    }));

                memberTpDetail = arr;
            } else {
                alert(" 데이터를 불러오는데 실패하였습니다.");
            }
        });


    }, [])

    const detailMemberList = () => {
        let memberId = dataMemId;
        
        s010100050.getDetailMemInfo(memberId).then((res) => {
            if(res.status === 200){
                
                    setDetailAllInfo(res.data);
                    setDetailMemberId(res.data[0].memberId);
                if((res.data[0].retireDate) === '00-00-00'){
                    setEndDateTest('');
                }else{
                    setEndDateTest(res.data[0].retireDate);
                }

                    setDetailMemberNm(res.data[0].memberNm);
                    setDetailMemberTp(res.data[0].memberTp);
                    setDetailName(res.data[0].name);
                    setMEndFlag(res.data[0].countMemberConEndFlag);
                    setDetailZipcode(res.data[0].zipcode);
                    setDetailAddress(res.data[0].empAddress);
                    setDetailDetailAddress(res.data[0].empDetailAddress);

                if(res.data[0].regNo){
                    setDetailFstRegNo((res.data[0].regNo).split('-')[0]);
                    setDetailSndRegNo((res.data[0].regNo).split('-')[1]);
                    setDetailThdRegNo((res.data[0].regNo).split('-')[2]);    
                }else{
                    setDetailFstRegNo('');
                    setDetailSndRegNo('');
                    setDetailThdRegNo('');
                }
                if(res.data[0].empHp){
                    setDetailFstEmpHp((res.data[0].empHp).split('-')[0]);
                    setDetailSndEmpHp((res.data[0].empHp).split('-')[1]);
                    setDetailThdEmpHp((res.data[0].empHp).split('-')[2]);
                }else{
                    setDetailFstEmpHp('');
                    setDetailSndEmpHp('');
                    setDetailThdEmpHp('');
                }
                if(res.data[0].empEmail){
                    setDetailEmpEmail((res.data[0].empEmail).split('@')[0]);
                    setDetailDomain((res.data[0].empEmail).split('@')[1]);
                }else{
                    setDetailEmpEmail('');
                    setDetailDomain('');                    
                }
                // const idCardImg = new Buffer.from(res.data[0].ID_CARD_IMAGE).toString();
                // const busiLicfImg = new Buffer.from(res.data[0].BUSI_LICS_IMAGE).toString(); 
                    setIdCardImg(res.data[0].idCardImg);
                    setBusiLicfImg(res.data[0].busiLicfImg);
                    setRealIdCardFileName(res.data[0].realIdCardFileName);
                    setRealRegistCardFileName(res.data[0].realBusiCardFileName);

            } else {
                alert('상세정보 데이터를 불러오는데 실패하였습니다.');
            }
        })
    }

    useEffect(() => {
        detailMemberList();
    }, [])

    const detailIdCardHandleFileChange = (event) => {
        setDetailIdCardFile(event.currentTarget.files[0]);
        setDetailIdCardFileName(event.currentTarget.value);
        
        let imageType = event.currentTarget.files[0].type;
        
        if((imageType != 'image/png')&&(imageType != 'image/jpg')&&(imageType != 'image/jpeg')){
            alert('.jpg, .jpeg, .png 확장자만 업로드 가능합니다.');
            setDetailIdCardFile('');
            setDetailIdCardFileName('');
        }
    }   

    const detailBusiCardHandleFileChange = (event) => {
        setDetailBusiCardFile(event.currentTarget.files[0]);
        setDetailBusiCardFileName(event.currentTarget.value);

        let imageType = event.currentTarget.files[0].type;
        
        if((imageType != 'image/png')&&(imageType != 'image/jpg')&&(imageType != 'image/jpeg')){
            alert('.jpg, .jpeg, .png 확장자만 업로드 가능합니다.');
            setDetailBusiCardFile('');
            setDetailBusiCardFileName('');
        }
    }

    const [detailIdCardImg,setDetailIdCardImg] = useState('');
    const [detailBusiLicfImg,setDetailBusiLicfImg] = useState('');
    // setState을 파라미터로
    const encodeIdFileBase64 = (idCardfile) => {
        let reader = new FileReader();
        if(idCardfile){
            reader.readAsDataURL(idCardfile);
            reader.onload = () => {
                let Base64 = reader.result;
                // console.log(Base64);
                setDetailIdCardImg(Base64);
               
            };
            
            reader.onerror = function (error){
                console.log('error : ',error);
            }
        }
    };

    const encodeBusiFileBase64 = (idCardfile) => {
        let reader = new FileReader();
        if(idCardfile){
            reader.readAsDataURL(idCardfile);
            reader.onload = () => {
                let Base64 = reader.result;
                // console.log(Base64);
                setDetailBusiLicfImg(Base64);
               
            };
            
            reader.onerror = function (error){
                console.log('error : ',error);
            }
        }
    };

    encodeIdFileBase64(detailIdCardFile);
    encodeBusiFileBase64(detailBusiCardFile);

    // 회원정보수정 함수
    const tempAddMember = () => {
        
        let realDetailIdCardFileName;
        let realDetailBusiCardFileName;

        if(detailIdCardFileName){
            realDetailIdCardFileName = detailIdCardFileName.split('\\')[2].split('.')[0];    
        }
        
        if(detailBusiCardFileName){
            realDetailBusiCardFileName = detailBusiCardFileName.split('\\')[2].split('.')[0];
        }
        
        let detailMemInfo ={
            memberId : props.dataMemId,
            idCardImg : detailIdCardImg,
            busiLicfImg : detailBusiLicfImg,
            realIdCardFileName : realDetailIdCardFileName,
            realBusiCardFileName : realDetailBusiCardFileName,
            memberNm : detailMemberNm,
            regNo : detailFstRegNo +"-"+ detailSndRegNo +"-"+ detailThdRegNo,
            memberTp : detailMemberTp,
            name : detailName,
            empHp : detailFstEmpHp +"-"+ detailSndEmpHp +"-"+ detailThdEmpHp,
            empEmail : detailDomain +"@"+ detailEmpEmail,
            zipcode : detailZipcode,
            empAddress : detailAddress,
            empDetailAddress: detailDetailAddress
        }

        s010100050.updateDetailMemInfo(detailMemInfo).then((res) => {
            if(res.status === 200){
                alert('정상적으로 수정 되었습니다.');
                props.setModalOpen(false);
                props.memberList();
            } else {
                alert('수정에 실패하였습니다.');
            }
        });

    }

    // 회원정보 수정
    const onModifyHandler = () => {
        tempAddMember();
    }

    const onDetailMemberNmHandler = (event) => {
        setDetailMemberNm(event.currentTarget.value);
    }

    const onDetailFstRegNoHandler = (event) => {
        const regexData = getRegexData(/[^0-9]/g, event.currentTarget.value);
        setDetailFstRegNo(regexData);
    }

    const onDetailSndRegNoHandler = (event) => {
        const regexData = getRegexData(/[^0-9]/g, event.currentTarget.value);
        setDetailSndRegNo(regexData);
    }
    const onDetailThdRegNoHandler = (event) => {
        const regexData = getRegexData(/[^0-9]/g, event.currentTarget.value);
        setDetailThdRegNo(regexData);
    }

    const onDetailMemberTpHandler = (event) => {
        setDetailMemberTp(event.currentTarget.value);
    }

    const onDetailNameHandler = (event) => {
        setDetailName(event.currentTarget.value);
    }

    const onDetailFstEmpHpHandler = (event) => {
        const regexData = getRegexData(/[^0-9]/g, event.currentTarget.value);
        setDetailFstEmpHp(regexData);
    }

    const onDetailSndEmpHpHandler = (event) => {
        const regexData = getRegexData(/[^0-9]/g, event.currentTarget.value);
        setDetailSndEmpHp(regexData);
    }

    const onDetailThdEmpHpHandler = (event) => {
        const regexData = getRegexData(/[^0-9]/g, event.currentTarget.value);
        setDetailThdEmpHp(regexData);
    }

    const onDetailEmpEmailHandler = (event) => {
        const regexData = getRegexData(/[^-A-Za-z0-9_]/g, event.currentTarget.value);
        setDetailEmpEmail(regexData);
    }

    const onDetailDomainHandler = (event) => {
        const regexData = getRegexData(/[^-A-Za-z0-9_]/g, event.currentTarget.value);
        setDetailDomain(regexData);
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

    const onSubmitDetailHandler = () => {

    }

    const onAllContractEndHandler = () => {

        let memberId = dataMemId;
       
        s010100050.updateMemStEndFlag(memberId).then((res) => {
            if(res.status === 200){
                alert('종료처리 되었습니다.');
                detailMemberList();
            } else {
                alert('종료처리를 실패 하였습니다.');
            }
        });
    
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
    const onNewContractHandler = useCallback(() => {
        setNewOpen(false);
        detailMemberList();
    });

    const onNewOpenContractHandler = (event) => {
        setNewOpen(true);
    }

    const getRegexData = (regex, data) => {
        return data.replace(regex, "");
    }


    const displayUsers = detailAllInfo.slice(pagesVisited, pagesVisited + usersPerPage).map((detailAllInfo, index) => {
        return (
            <TableRow key={index}>
                <TableCell onClick={onDetailClickOpen} className='underLineForDetail' id={detailAllInfo.contractId}>{detailAllInfo.contractId}</TableCell>
                <TableCell>{detailAllInfo.contractDate}</TableCell>
                <TableCell>{detailAllInfo.contractTp}</TableCell>
                <TableCell>{detailAllInfo.contractRoom}</TableCell>
                <TableCell>{detailAllInfo.contractTerm}개월 ({detailAllInfo.startDate} ~ {detailAllInfo.endDate})</TableCell>
                <TableCell>{detailAllInfo.contractSt}</TableCell>
                <TableCell>{detailAllInfo.payDate}일</TableCell>
                <TableCell>{detailAllInfo.monthlyFee}</TableCell>
                <TableCell>{detailAllInfo.contractLocker}</TableCell>
                <TableCell>{detailAllInfo.endFlag}</TableCell>
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

                                    <Form.Control style={{ width: 12 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={detailMemberNm} id="detailMemberNm" name="detailMemberNm"
                                        onChange={onDetailMemberNmHandler} />

                                </td>
                                <th>사업자번호</th>
                                <td colSpan="2">

                                    <Form.Control style={{ width: 5 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={detailFstRegNo||''} id="detailRegNo" name="detailRegNo"
                                        onChange={onDetailFstRegNoHandler} maxLength="3"/>
                                &nbsp; - &nbsp;

                                <Form.Control style={{ width: 3 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={detailSndRegNo} id="detailRegNo" name="detailRegNo"
                                        onChange={onDetailSndRegNoHandler} maxLength="2"/>
                                &nbsp; - &nbsp;

                                <Form.Control style={{ width: 7 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={detailThdRegNo} id="detailRegNo" name="detailRegNo"
                                        onChange={onDetailThdRegNoHandler} maxLength="5"/>

                                </td>
                                <th>회원구분</th>
                                <td>

                                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm" as="select" multiple={false} onChange={onDetailMemberTpHandler} value={detailMemberTp || ''}>
                                        {memberTpDetail.map((item, index) => (
                                            <option key={index} value={item.key}>{item.value}</option>
                                        ))}
                                    </Form.Control>

                                </td>
                                <th>퇴실일자</th>
                                <td>

                                    <Form.Control style={{ width: 8 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={endDateTest} disabled />

                                </td>
                            </tr>

                            <tr>
                                <th rowSpan="2">대표자</th>

                                <th>성명</th>
                                <td>

                                    <Form.Control style={{ width: 6 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={detailName} id="detailName" name="detailName"
                                        onChange={onDetailNameHandler} />
                                </td>
                                <th>연락처</th>
                                <td colSpan="2">

                                    <Form.Control style={{ width: 5 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={detailFstEmpHp} id="detailEmpHp" name="detailEmpHp"
                                        onChange={onDetailFstEmpHpHandler} maxLength="3"/>

                                     &nbsp; - &nbsp;
                                     <Form.Control style={{ width: 5 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={detailSndEmpHp} id="detailEmpHp" name="detailEmpHp"
                                        onChange={onDetailSndEmpHpHandler} maxLength="4"/>


                                     &nbsp; - &nbsp;
                                    <Form.Control style={{ width: 5 + 'em', display: 'inline' }} size="sm"
                                        type="text" value={detailThdEmpHp} id="detailEmpHp" name="detailEmpHp"
                                        onChange={onDetailThdEmpHpHandler} maxLength="4"/>

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
                                     
                                    >
                                        <Fade in={isPostOpen}>
                                            <div className={classes.paper}>
                                                <DaumPostcode  style={postCodeStyle} onComplete={handleComplete} />
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
                                {/* onClick={onIdDownloadHandler} */}
                                <th rowSpan="2" colSpan="2">첨부파일</th>
                                <td colSpan="8">
                                <label htmlFor="file">대표자신분증:</label>&nbsp;
                                    <Base64Downloader
                                        base64={idCardImg}
                                        downloadName={realIdCardFileName}
                                        Tag="a"
                                        extraAttributes={{ href: '#' }}
                                        className="my-class-name"
                                        style={{ color: 'orange' }}
                                    >
                                      {realIdCardFileName}
                                    </Base64Downloader>
                                    &nbsp;
                                   
                                <input type='file'
                                        file={detailIdCardFile}
                                        name='detailIdCardFile'
                                        value={detailIdCardFileName}
                                        onChange={detailIdCardHandleFileChange}
                                    />
                                <div className = 'fileStar'> * jpg,jpeg,png 파일만 가능합니다.</div>
                                </td>

                            </tr>
                            <tr>
                                <td colSpan="8">
                                <label htmlFor="file">사업자등록증:</label>&nbsp;
                                <Base64Downloader
                                        base64={busiLicfImg}
                                        downloadName={realRegistCardFileName}
                                        Tag="a"
                                        extraAttributes={{ href: '#' }}
                                        className="my-class-name"
                                        style={{ color: 'orange' }}
                                    >
                                       {realRegistCardFileName}
                                    </Base64Downloader>
                                    &nbsp;
                                   
                                <input type='file'
                                        file={detailBusiCardFile}
                                        name='detailBusiCardFile'
                                        value={detailBusiCardFileName}
                                        onChange={detailBusiCardHandleFileChange}
                                />
                                <div className = 'fileStar'> * jpg,jpeg,png 파일만 가능합니다.</div>
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
                                {displayUsers}
                            </TableBody>
                        </Table>

                    </React.Fragment>
                    {/* </Paper> */}
                    {/* </Grid> */}
                    <div className="pageCenter">
                        <div id="reactPage">
                            <ReactPaginate
                                previousLabel={"Previous"}
                                nextLabel={"Next"}
                                pageCount={pageCount}
                                onPageChange={changePage}
                                containerClassName={"paginationBtns"}
                                previousLinkClassName={"previousBtn"}
                                nextLinkClassName={"nextBtn"}
                                disabledClassName={"paginationDisabled"}
                                activeClassName={"paginationActive"}
                            />
                        </div>
                    </div>

                    <div id="btnAlign">

                        <Button variant="contained" color="primary" style={{ width: 100 }} id="btn-centerN" onClick={onNewOpenContractHandler} >
                            신규계약
                        </Button>
                        <Button variant="contained" color="primary" style={{ width: 100 }} id="btn-centerN" onClick={onModifyHandler} >
                            수정하기
                        </Button>
                        <Button variant="contained" color="primary" style={{ width: 100 }} id="btn-centerN" onClick={onAllContractEndHandler} >
                            종료
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
                <S010100010 dataNum={rNum} cDataForm={'I'} detailMemberList={detailMemberList} onConContractHandler={onConContractHandler} setConOpen={setConOpen} />
            </Dialog>

            {/*신규계약 멤버ID클릭*/}
            <Dialog
                maxWidth={"lg"}
                open={newOpen}
                onClose={onNewContractHandler}>
                <S010100010 dataMem={detailMemberId} newDataForm={'N'} detailMemberList={detailMemberList} onNewContractHandler={onNewContractHandler} setNewOpen={setNewOpen} />
            </Dialog>

        </form>

    );

}

export default S010100050;