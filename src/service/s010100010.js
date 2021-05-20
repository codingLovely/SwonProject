import axios from 'axios';

const MEMST_INSERT_API_BASE_URL = "http://localhost:8081/api/s010100010";

class s010100010 {

    // 신규회원 insert(저장 / 임시저장)
    createMember(memberInfo) {
       return axios.post(MEMST_INSERT_API_BASE_URL, memberInfo);
    }

    // 기존신규회원 계약추가 
    addContract(contractInfo) {
    return axios.post(MEMST_INSERT_API_BASE_URL+"/addContract", contractInfo);
    }

    // 종료처리
    updateEndFlag(contractId) {
        return axios.get(MEMST_INSERT_API_BASE_URL+"/endFlag?contractId="+contractId);
    }
    
    // 중복확인 (사업자번호 / 전화번호)
    duplicateVerification(checkValue,checkValLength){
        return axios.get(MEMST_INSERT_API_BASE_URL +"/verification?checkValue="+checkValue+"&checkValLength="+checkValLength);
    }

    // 중복확인 (이용기간)
    duplicatePeriodOfUse(periodOfUseInfo){
        return axios.post(MEMST_INSERT_API_BASE_URL +"/periodOfUse",periodOfUseInfo);
    }

    // 수정하기
    modifyMemberConInfo(memberConInfo) {
        return axios.post(MEMST_INSERT_API_BASE_URL +"/modify", memberConInfo);
    }
    
    //삭제하기 
    deleteMemberConInfo(contractId){
        return axios.get(MEMST_INSERT_API_BASE_URL +"/delete?contractId="+contractId);
    }

    // 이용계약서 selectBox
    getSelectBox(fstValue,sndValue) {
        return axios.get(MEMST_INSERT_API_BASE_URL + "?cdTpValue="+fstValue+"&attr2="+sndValue);
    }

    // 계약구분 -> 호실 하이어라키
    getContractStHier(contractStValue) {
        return axios.get(MEMST_INSERT_API_BASE_URL + "/list?contractStValue="+contractStValue+"");
    }

    // 호실 -> 사물함 하이어라키
    getRoomLockerHier() {
        return axios.get(MEMST_INSERT_API_BASE_URL + "/roomLockerList");
    }

    // 월회비 / 예치금 하이어라키
    getMonthlyMoney(cdTpRoom) {
        return axios.get(MEMST_INSERT_API_BASE_URL + "/monthlyMoney?monthlyMoney="+cdTpRoom+"");
    }

}

export default new s010100010();