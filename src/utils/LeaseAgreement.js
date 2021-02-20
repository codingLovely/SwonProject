import React,{Fragment, useState, useEffect}from 'react';
import axios from 'axios';
import './utilsCss/LeaseAgreement.css';

function LeaseAgreement (props){

    // 계약시작년도,월,일
    const [startYear,setStartYear] = useState('');
    const [startMonth,setStartMonth] = useState('');
    const [startDay,setStartDay] = useState('');
    
    // 계약종료년도,월,일
    const [endYear,setEndYear] = useState('');
    const [endMonth,setEndMonth] = useState('');
    const [endDay,setEndDay] = useState('');

    const [contractMoney,setContractMoney] = useState('');
    const [roomLockerTp,setRoomLockerTp] = useState('');
    const [contractPayDate,setContractPayDate] = useState('');
    const [vatMoney, setVatMoney] = useState(0);

    const [companyName,setCompanyName] = useState('');
    const [ceoName,setCeoName] = useState('');
    const [bLicenseNum,setBLicenseNum] = useState('');
    const [companyAddr,setCompanyAddr] = useState('');
    const [ceoTel,setCeoTel] = useState('');


    useEffect(() => {
      const rNum = props.dataNum;
      axios.get(`/api/memStList/tb_s10_contract010_by_id?id=${rNum}&type=single`)
          .then(response => {
              if (response.data.success) {

                const modalCContractDate = response.data.rows[0].CONTRACT_DATE;
                const modalCContractMoney = response.data.rows[0].PAYED_PLAN_MONEY;
               
                const modalCContractTpValM = response.data.rows[0].CONTRACT_ROOM_M;
                const modalCPayDate = response.data.rows[0].PAY_DATE;

                //VAT(10%)적용한 modalCContractMoney 값
                let VatMoney = modalCContractMoney*(10/100);
               
                const modalCStartDate = response.data.rows[0].START_DATE;
                const modalCEndDate = response.data.rows[0].END_DATE;
                
                let wasteStartYear = modalCStartDate.substring(0, 4);
                let wasteStartMonth = modalCStartDate.substring(5, 7);
                let wasteStartDay = modalCStartDate.substring(8, 10);

                let wasteEndYear = modalCEndDate.substring(0, 4);
                let wasteEndMonth = modalCEndDate.substring(5, 7);
                let wasteEndDay = modalCEndDate.substring(8, 10);

                const modalCMemberNm = response.data.rows[0].MEMBER_NM;
                const modalCRegNo = response.data.rows[0].REG_NO;
                const modalCName = response.data.rows[0].NAME;
                const modalCEmpHp = response.data.rows[0].EMP_HP;
            
                const modalCZipCode = response.data.rows[0].ZIP_CODE;
                const modalCAddress = response.data.rows[0].ADDRESS;
                const modalCDetailAddress = response.data.rows[0].DETAIL_ADDRESS;
                
                
                setStartYear(wasteStartYear);
                setStartMonth(wasteStartMonth);
                setStartDay(wasteStartDay);

                setEndYear(wasteEndYear);
                setEndMonth(wasteEndMonth);
                setEndDay(wasteEndDay);

                setContractMoney(modalCContractMoney);
                setVatMoney(VatMoney);
                setRoomLockerTp(modalCContractTpValM);
                setContractPayDate(modalCPayDate);

                setCompanyName(modalCMemberNm);
                setCeoName(modalCName);

                setBLicenseNum(modalCRegNo);
                setCompanyAddr(modalCZipCode + ' ' + modalCAddress + ' ' + modalCDetailAddress);
                setCeoTel(modalCEmpHp);

              } else {
                  alert("상세 정보 가져오기를 실패하였습니다.")
              }
          })
        }, [])

        // 현재날짜 출력
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth()+1; 
        let yyyy = today.getFullYear();

        if(dd<10) {
            dd='0'+dd
        } 

        if(mm<10) {
            mm='0'+mm
        } 

    return(
             <div>
                    <Fragment>
                        <div className = "agreementWrapper">
                        <h1> 임 대 차 계 약 서 </h1>
                        <br/>
                            <div className = "paragraph">
                            <h3> 갑 : ㈜에스원테크   최현수</h3>								
                            <h3> 을 : {companyName}	{ceoName}	</h3>							
                            </div>     

                            <div className = "paragraph">                                
                                위 '갑'과 '을'은  {yyyy}년 {mm}월 {dd}일 다음과 같이 회원 가입을 체결 한다.									
                            </div>   

                            <div className = "paragraph">
                                <h3>1. 본 계약의 목적</h3>                        								
                                    본 계약은 '갑'이 '을'에게 '갑'의 사무실 및 부대시설을 사용 할 수 있는 권리를 허용함과 동시에 '을'이									
                                    필요로하는 서비스를 제공함에 있어서 '갑-을'간의 권리의무에 관한 사항을 정하기 위한 목적에서 체결 한다.									
                            </div> 

                            <div className = "paragraph">                                   
                            <h3>2. 을의 권리의 책임</h3>
                                    <ul>								
                                        <li>
                                            1) '갑'은 '을'에게 제2항 및 제3항에 규정된 바와 같이 '갑'의 사무실 및 기타 부대시설을 사용할 수 있는									
                                                권리를 부여한다.									
                                        </li>
                                        <li>
                                            2) '을'이 사용 할 수 있는 사무실의 내역은 다음과 같다.<br/>								
                                            &emsp;&nbsp;대상 : 서울시 강남구 봉은사로63길 11, 3,4층      {roomLockerTp}(삼성동,명화빌딩)<br/>									
                                            &emsp;&nbsp;용도 : 업무용<br/>									
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;월회비  :         {contractMoney}원<br/>									
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VAT     :         {vatMoney}원<br/>									
                                        </li>
                                        <li>
                                            3) '을'은 상기한 제3항의 사무실 제공과 동시에 부대시설 (회의실, 접견실, 휴게실, OA기기)을 '갑'이									
                                            정한 원칙에 의거하여 사용할 수 있다.									
                                        </li>
                                        <li>
                                            4) '을'은 사무실과 부대시설을 사용함에 있어서 선량한 관리자의 주의 의무를 다해야 하며, 사무실과									
                                            부대시설에 야기된 제반 손상이나 훼손에 대하여 자신의 비용으로 이를 처리해야 한다.									
                                        </li>
                                        <li>
                                            5) '을'은 건물주 및 '갑'의 이해관계인에게 손해 등 문제가 발생할 우려가 있는 경우, 즉시 '갑'에게 사전									
                                            고지를 해야 하며 그렇지 않을 경우, 이로 인해 발생하는 '갑'의 모든 손해 (6개월간의 월회비와 법적인									
                                            문제 해결을 위한 제반 경비)에 대하여 배상을 한다.									
                                        </li>
                                        <li>
                                            6) 상기 5)항에 대하여 '을'은 '갑'에게 관련 정보제공, 법적인 문제인 경우 이를 해결하기 위해 적극									
                                            협조한다.(또한, 채권 가압류의 경우 즉시항고, 이의신청 등을 진행하기 위한 업무협조를 포함한다.)									
                                        </li>    
                                    </ul>
                                </div>

                                <div className = "paragraph">                 
                                <h3>3. 계약기간</h3>									
                                <ul>
                                    <li>
                                        1) 본 계약의 계약기간은 {startYear}년 {startMonth}월 {startDay}일부터 {endYear}년 {endMonth}월 {endDay}일까지로 한다.									
                                    </li>            
                                </ul>
                                </div>  

                                <div className = "paragraph">                                    
                                <h3>4. 예치금</h3>									
                                <ul>
                                    <li>
                                        1) '을'은 본 계약서에 서명함과 동시에 예치금 {contractMoney}원을 '갑'에게 지급하여야 한다.									
                                    </li>
                                    <li>            
                                        2) 위 제1항에 명시된 예치금은 본 계약기간 동안 '갑'이 보유하며, 계약기간 만료 또는 종료 시 '을'이									
                                            '갑'에게 사무실 및 부대시설을 원상 복구하여 반환하고, '갑'에게 지급할 모든 금액의 지급을 완료하고,									
                                            사업자 주소지와 전화를 7일 이내에 옮긴다.									
                                        이것이 확인된 후 3일 이내에 예치금을 반환하기로 한다. 단, 예치금에는 이자가 발생하지 않는 것으로									
                                        한다.
                                    </li>           
                                </ul>	
                                </div>           

                                                                    
                                <div className = "paragraph">                                               
                                <h3>5. 회비 및 부가서비스 이용대금의 지급</h3>									
                                    <ul>
                                        <li>
                                            1) '을'은 매월  {contractPayDate} 일에 월 회비를 '갑'에게 지급하여야 하며, 그 지급일이 공휴일인 경우에는 익일까지									
                                            납부해야 한다.
                                        </li>
                                        <li>								
                                            2) 월 회비나 부가서비스 이용대금이 납부기한까지 전액 납부되지 않은 경우, '갑'은 본 계약에 의하여									
                                            부여된 여타 권리와는 별도로 연체료 월 2%를 을에게 청구할 수 있다.									
                                        </li>	        
                                    </ul>            
                                </div>

                                <div className = "paragraph">                                    
                                <h3>6. '갑'의 면책사항</h3>		
                                    <ul>
                                        <li>
                                            1) 본 계약서의 내용은 사정에 의하여 변동될 수 있으며, '갑'은 이러한 변경에 대하여 '을'에게									
                                            사전고지하고 상호 합의가 있는 경우, '을'은 본 계약 위반의 책임을 지지 아니한다.									
                                        </li>
                                        <li>
                                            2) '을'이나 제3자가 다음과 같은 원인에 의하여 다치거나 재산상의 손해를 입게 된 경우 									
                                            '갑'은 이에 대하여 여하한 배상책임도 부담하지 않는다.	
                                            <ul>
                                                <li>								
                                                - 배수관, 스프링쿨러, 연기 혹은 기타 물질이 건물에서 누출 될 경우									
                                                </li>
                                                <li>
                                                - 건물의 서비스와 설비에 결함이 있는 경우									
                                                </li>
                                                <li>
                                                - 건물의 보안이나 보호
                                                </li>
                                            </ul>    
                                        </li>
                                        <li>									
                                            3) '갑'이 '을'에게 제공하는 세무전문서비스는 '을'과 '갑'의 제휴세무사가 직접 계약을 체결하기로 한다.									
                                            세무전문서비스의 제공과 관련하는 발생하는 문제에 대하여 '갑'은 책임을 지지 아니한다.									
                                        </li>
                                    </ul>           
                                </div>

                                <div className = "paragraph">                                    
                                <h3>7. 계약의 양도 금지</h3>									
                                '을'은 본 계약상의 권리나 의무를 '갑'의 동의 없이 제3자에게 양도하거나 처분할 수 없다.									
                                </div>

                                <div className = "paragraph">                                    
                                <h3>8. 계약의 해지 및 갱신</h3>
                                    <ul>
                                        <li>								
                                            1) '을'이 본 계약의 해지 및 갱신을 원하는 경우, 본 계약서 제 3조에 명시된 계약기간의 만료 15일 전까지									
                                            그러한 의사를 '갑'에게 반드시 통지 해야한다.									
                                        </li>
                                        <li>        
                                            2) 계약 만료일 15일전에 의사표시를 하지않는 경우에는, 계약만료를 통보한 날로부터 15일 이후를									
                                            계약만료일로 하며, 해당 기간의 사용료를 손해배상금으로 '갑'에게  지급한다.									
                                        </li>
                                        <li>        
                                            3) 월회비 할인률이 적용된 경우,  '을'의 사정으로 계약만료일 이전에 중도 해지할 경우는 해당기간 동안									
                                            할인 받은 총금액을 최종 정산시 일괄 반환한다.									
                                        </li>
                                        <li>       
                                            4) '갑'이 부득이한 사정으로 인하여 중도에 본 계약을 해지하고자 하는 경우 '갑'은 1개월 전에 해지의사를									
                                            '을'에게 표시하여야 한다.
                                        </li>
                                        <li>    									
                                            5) 다음의 경우에는 '갑'이 일방적으로 계약을 해지 할 수 있다.
                                                <ul>
                                                <li>
                                                    - '을' 이 30일 이내 2회 이상 '갑'으로부터 납부 권고를 받고도 월 이용회비를 납부하지 않은 경우									
                                                </li>
                                                <li>
                                                    - '갑' 이 규정한 ‘회원이용안내’의 규칙을 준수하지 않고 질서를 문란하여 타 회원에게 피해를									
                                                    입힌 경우									
                                                </li>
                                                <li>
                                                    - '을'이  '갑' 의 사전 승인 없이 회원계약을 제 3자에게 인도한 경우									
                                                </li>
                                                <li>
                                                    - '을' 의 업무가 반사회적이거나, 현행 법률에 저촉되어 물의가 될 것으로 판단되는 경우									
                                                </li>
                                                <li>
                                                    - '을' 로 인해  '갑' 과  '갑'의 이해당사자에게 법적인 문제(채권 가압류등) 및 피해가 발생한 경우									
                                                </li>
                                                </ul>
                                            </li>
                                    
                                    </ul>
                                </div>

                                <div className = "paragraph">                                    
                                <h3>9. 위 제8조 제5항에 의거하여 '갑'이 일방적으로 본 계약을 해지 할 경우</h3>
                                    <ul>	
                                        <li>								
                                            1) 해지 3일 전에 서면 또는 전자메일로 통보하며 계약해지에 따른 월회비나 서비스 이용대금을 정산하고									
                                            '을'의 회원자격을 박탈한다.
                                        </li>
                                        <li>									
                                            2) '을'은 계약해지를 통보 받은 날로부터 3일 이내에 '갑'의 유치물품을 퇴거해야 하며, 퇴거하지 않을 경우									
                                            '을'의 유치물품에 대한 분실이나 도난에 대해 '갑'은 책임을 지지 않는다.									
                                        </li>
                                        <li>                            
                                            3) 본 계약서에 명시된 월회비나 서비스 이용대금을 전액 납부하지 않은 경우, '갑'은 사무실 또는 건물에									
                                            있는 '을'의 자산에 대하여 최우선적인 담보권을 취득한다. 만일 '을'이 '갑'의 서면 통지를 받은									
                                            날로부터 10일 내에 미지급된 금액을 납부하지 않을 경우, '갑'은 '을'의 동의 없이 '갑'이 자산을 이전									
                                            및 임의 처분할 권리를 가진다.
                                        </li>
                                    </ul>									
                                </div>

                                <div className = "paragraph">                                    
                                <h3>10. 분쟁의 해결</h3>
                                    <ul>
                                        <li>									
                                            1) '갑'과 '을'간에 본 계약과 관련하여 분쟁이 야기되는 경우, 해당 분쟁은 대한상사중재원에게 상사중재에 									
                                                의하여 상호 해결하는데 동의한다.
                                        </li>
                                        <li>									
                                            2) 본 계약의 준거법은 대한국민법으로 한다.
                                        </li>
                                        <li>									
                                            3) '을'이 계약을 해지하고자 할 경우에는 해지를 희망하는 날로부터 15일전에 '갑'에게 서면 통지하여야									
                                                하며, '갑'은 사용료를 일할 정산한다.									
                                        </li>        
                                    </ul>
                                </div>                                    
                                <br/>
                                                             
                                <div className = "paragraph">
                                이상과 같은 합의를 증명하기 위하여 본 계약을 체결하며, 양 당사자는 계약서에 각기 서명 날인하여 1부씩									
                                이를 보관 한다.		
                                </div>							
                                                                    
                                <div className = "paragraph" id = "processOfSign">      
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>센터매니저</td>
                                                <td></td>
                                                <td></td>
                                                <td>상기내용을 잘 주지시켰음</td>
                                                <td></td>
                                                <td></td>
                                                <td>서명</td>
                                            </tr> 
                                            <tr>
                                                <td>이용자</td>
                                                <td></td>
                                                <td></td>
                                                <td>상기내용을 완전히 숙지하였음</td>
                                                <td></td>
                                                <td></td>
                                                <td>서명</td>
                                            </tr>                             
                                													
                                        </tbody>        
                                    </table>            
                                </div>                                    
                                                                    
                                                                    
                                <div className = "paragraph">                                    
                                임대인 : ㈜에스원테크 &emsp;&emsp;서명(인)<br/>             									
                                &emsp;&emsp;&emsp;&nbsp;&nbsp; 최현수<br/>									
                                법인등록번호 110111-4806381<br/>           									
                                사업등록번호 105-87-68698<br/>              									
                                주소 : 서울시 강남구 봉은사로63길 11, 3,4층<br/>  									
                                연락처 : 070-4355-2312<br/>                 									
                                </div>                                   
                                <br/>
                                <div className = "paragraph">                                   
                                임차인 : {companyName} &emsp;&emsp;서명(인)<br/>									
                                &emsp;&emsp;&emsp;&nbsp;&nbsp; {ceoName}
                                <br/>                        
                                법인등록번호 :								<br/>
                                사업자등록번호 : 	{bLicenseNum}								<br/>	
                                주소 : {companyAddr}									<br/>
                                <br/>                                                    
                                연락처 : {ceoTel} <br/>
                                </div>
                        </div>                                    
                    </Fragment>
                </div>


     );
}
export default LeaseAgreement;
