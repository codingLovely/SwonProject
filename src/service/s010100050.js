import axios from 'axios';

const DETAILMEMINFO_API_BASE_URL = "http://localhost:8081/api/s010100050";

class s010100050 {
    
    // 회원정보 상세보기
    getDetailMemInfo(memberId) {
       return axios.get(DETAILMEMINFO_API_BASE_URL + "?memId=" + memberId);
    } 

    // 수정하기
    updateDetailMemInfo(detailMemInfo) {
       return axios.post(DETAILMEMINFO_API_BASE_URL + "/updateDetailMemInfo",detailMemInfo);
    }
    updateMemStEndFlag

    // 종료처리
    updateMemStEndFlag(memberId) {
        return axios.get(DETAILMEMINFO_API_BASE_URL + "/endFlag?memId=" + memberId);
    }
}

export default new s010100050();