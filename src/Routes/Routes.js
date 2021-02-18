import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import S010100010 from '../S010100010';
import S010100040 from '../S010100040';
import S010100050 from '../S010100050';
import S010100060 from '../S010100060';
import S010100090 from '../S010100090';
import S010100130 from '../S010100130';
import S010100140 from '../S010100140';
import S010100150 from '../S010100150';
import Dashboard from '../Dashboard';

import LeaseAgreement from '../utils/LeaseAgreement';
//export default
 function Routes (){
   return(
  <Router>
          {/* 메인 */}
          <Route exact path = "/" component = {S010100130}></Route>


          {/* 회원현황 */}
          <Route exact path = "/member" component = {S010100040}></Route> 
          {/* 납부현황 */}
          <Route exact path = "/paymentStatus" component = {S010100060}></Route>
          {/* 상담현황 */}
          <Route exact path = "/consultationStatus" component = {S010100130}></Route>
          {/* 직원현황 */}
          <Route exact path = "/staff" component = {S010100090}></Route>
          {/* 로그인/로그아웃*/}
          <Route exact path = "/login" component = {S010100150}></Route>

          {/* 상담등록 */}
          <Route exact path = "/registration" component = {S010100140}></Route>
          {/* 이용계약서  */}
          <Route exact path = "/useContract" component = {S010100010}></Route>
          {/* 회원상세현황 */}
          <Route exact path = "/memberDetails" component = {S010100050}></Route>
          {/* 임대차계약서 */}
          <Route exact path = "/leasAgreement" component = {LeaseAgreement}></Route>
          
          

  </Router>
  );
 }
export default Routes;
