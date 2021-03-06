const express = require('express');
// const dbconfig = require('./config/database.js')(); // 위에서 생성한 MySQL에 연결을 위한 코드(모듈)
// const connection = dbconfig.init(); // node express 와 MySQL의 연동
const bodyParser = require('body-parser');
// const multer = require('multer');
// const { configure } = require('@testing-library/react');
// const bcrypt = require('bcrypt');
// const { request } = require('express');
const app = express();

// let upload = multer({ dest: './src/uploads' })
// let mime = require('mime');
// let fs = require('fs');

const moment = require('moment');

require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");





/** configuration */  
app.set('port', process.env.PORT || 4001);

// Request용량 50mb로 증가
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

/** 회원현황 */ 
// 이용계약서
app.use('/api/s010100010',require('./route/s010100010'));
// 회원목록
// app.use('/api/s010100040',require('./route/s010100040'));
// 회원상세
app.use('/api/s010100050',require('./route/s010100050'));

/** 납부현황 */
// 납부목록
app.use('/api/s010100060',require('./route/s010100060'));
// 납부상세
app.use('/api/s010100070',require('./route/s010100070'));

/** 직원현황 */
// 직원목록
app.use('/api/s010100090',require('./route/s010100090'));
// 직원등록 및 수정
app.use('/api/s010100100',require('./route/s010100100'));

/** 상담현황 */
// 상담목록
app.use('/api/s010100130',require('./route/s010100130'));
// 상담등록 및 수정
app.use('/api/s010100140',require('./route/s010100140'));

/** 로그인/로그아웃 */
// 로그인 및 로그아웃
app.use('/api/s010100150',require('./route/s010100150'));
// 비밀번호 초기화
app.use('/api/s010100151',require('./route/s010100151'));

/** 계약현황 */
// 계약목록
app.use('/api/s010100160',require('./route/s010100160'));


/** 에러시 클라이언트로 메세지 전달 */
app.use(function (error, req, res, next) {
    res.json({ message: error.message })
})

/** 연결 알림 */
const server = app.listen(app.get('port'), () => {
   

    require('moment-timezone');
    moment.tz.setDefault("Asia/Seoul");

    console.log('portNumber : ' + app.get('port') + "connected");
    console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
})
