import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import S010100040 from './S010100040';
import S010100130 from './S010100130';
import S010100140 from './S010100140';
import S010100010 from './S010100010';
import S010100050 from './S010100050';
import LoginPage from './Components/LoginPage/LoginPage';
import PaymentStatus from './Components/PaymentStatus/PaymentStatus';
import Swon from './Components/Staff/Swon';
import Main from './Components/Main/Main';

export default () => (
  <Router>
          {/* 메인 */}
          <Route exact path = "/" component = {Main}></Route>


          {/* 회원현황 */}
          <Route exact path = "/S010100040" component = {S010100040}></Route> 
          {/* 납부현황 */}
          <Route exact path = "/paymentStatus" component = {PaymentStatus}></Route>
          {/* 상담현황 */}
          <Route exact path = "/S010100130" component = {S010100130}></Route>
          {/* 직원관리 */}
          <Route exact path = "/swon" component = {Swon}></Route>
          {/* 로그인/로그아웃*/}
          <Route exact path = "/login" component = {LoginPage}></Route>



          {/* 상담등록 */}
          <Route exact path = "/S010100140" component = {S010100140}></Route>
          {/* 이용계약서  */}
          <Route exact path = "/S010100010" component = {S010100010}></Route>
          {/* 회원상세정보 */}
          <Route exact path = "/S010100050" component = {S010100050}></Route>
  </Router>
)

