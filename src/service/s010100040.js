import axios from 'axios';

const MEMST_API_BASE_URL = "http://localhost:8081/api/s010100040";

class s010100040 {
   getMemStList(searchListValue) {
      return axios.post(MEMST_API_BASE_URL, searchListValue);
   }

   getSelectBox(searchValue) {
      return axios.get(MEMST_API_BASE_URL + "?cdTpValue="+searchValue+"");
   }

}

export default new s010100040();