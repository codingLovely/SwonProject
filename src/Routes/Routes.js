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
import S010100160 from '../S010100160';
import S010100151 from '../S010100151';
import PrivateRoute from '../utils/PrivateRoute';

import LeaseAgreement from '../utils/LeaseAgreement';
//export default
 function Routes (props){
   return(
  <Router>
          {/* 메인 */}
          <Route exact path = "/" component = {S010100150}></Route>
          <Route exact path = "/findemailPwd" component = {S010100151}></Route>
          {/* 회원현황 */}
          {/* <Route exact path = "/member" component = {S010100040}></Route>  */}
          {/* <PrivateRoute exact path = "/member" component = {S010100040} /> */}
          {/* 납부현황 */}
          {/* <PrivateRoute exact path = "/paymentStatus" component = {S010100060} /> */}
          {/* 상담현황 */}
          {/* <PrivateRoute exact path = "/consultationStatus" component = {S010100130} /> */}
          {/* 직원현황 */}
          {/* <PrivateRoute exact path = "/staff" component = {S010100090} /> */}
          {/* 계약현황 */}
          {/* <PrivateRoute exact path = "/contractStatus" component = {S010100160} /> */}

          <Route exact path = "/member" component = {S010100040} />
         
          <Route exact path = "/paymentStatus" component = {S010100060} />
         
          <Route exact path = "/consultationStatus" component = {S010100130} />
        
          <Route exact path = "/staff" component = {S010100090} />
          
          <Route exact path = "/contractStatus" component = {S010100160} /> 
          
          <Route exact path = "/login" component = {S010100150}></Route>
          {/* 상담등록 */}
          {/* <PrivateRoute exact path = "/registration" component = {S010100140} /> */}
          {/* 이용계약서  */}
          {/* <PrivateRoute exact path = "/useContract" component = {S010100010} /> */}
          {/* 회원상세현황 */}
          {/* <PrivateRoute exact path = "/memberDetails" component = {S010100050} />
          임대차계약서 */}
          {/* <PrivateRoute exact path = "/leasAgreement" component = {LeaseAgreement} /> */}

         
           <Route exact path = "/registration" component = {S010100140} />
        
          <Route exact path = "/useContract" component = {S010100010} />
        
          <Route exact path = "/memberDetails" component = {S010100050} />
        
          <Route exact path = "/leasAgreement" component = {LeaseAgreement} /> *\
          
          

  </Router>
  );
 }
export default Routes;
