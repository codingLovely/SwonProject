import axios from 'axios';

const PAYMENTLIST_API_BASE_URL = "http://localhost:8081/api/s010100060";

class s010100060 {
    
    // 납부현황 리스트
    getPaymentInfo(paymentSearchVal) {
       return axios.post(PAYMENTLIST_API_BASE_URL,paymentSearchVal);
    } 

}

export default new s010100060();