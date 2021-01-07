const express    = require('express');
const dbconfig   = require('./config/database.js')(); // 위에서 생성한 MySQL에 연결을 위한 코드(모듈)
const connection = dbconfig.init(); // node express 와 MySQL의 연동
const bodyParser = require('body-parser');
const { configure } = require('@testing-library/react');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 1. configuration 
app.set('port', process.env.PORT || 4001);



// 2. 상담현황 routing

//< 2-1.list of value
app.post('/api/s010100140/ask_tp',(req,res) => {
  //CD_TP ="CONTRACT_TP" and ATTRIBUTE2="ASK"
  connection.query('select CD_V,CD_V_MEANING from tb_s10_code where CD_TP ="CONTRACT_TP" and ATTRIBUTE2="ASK"', (error, rows) => {  //쿼리문 
    if (error) throw error;
    res.send({success: true,rows});
    console.log(rows);
  });
})

app.post('/api/s010100140/ask_method',(req,res) => {
  //CD_TP ="ASK_METHOD"
  connection.query('select CD_V,CD_V_MEANING from tb_s10_code where CD_TP ="ASK_METHOD"', (error, rows) => {  //쿼리문 
    if (error) throw error;
    res.send({success: true,rows});
  });
})

app.post('/api/s010100140/ask_path',(req,res) => {
  //CD_TP ="CONTRACT_TP" and ATTRIBUTE2="ASK"
  connection.query('select CD_V,CD_V_MEANING from tb_s10_code where CD_TP ="ACCESS_PATH" and ATTRIBUTE2="ASK"', (error, rows) => {  //쿼리문 
    if (error) throw error;
    res.send({success: true,rows});
  });
})

app.post('/api/s010100130/ask_tp',(req,res) => {
  //CD_TP ="ASK_METHOD"
  connection.query('select CD_V,CD_V_MEANING from tb_s10_code where CD_TP ="CONTRACT_TP" and ATTRIBUTE2="ASK"', (error, rows) => {  //쿼리문 
    if (error) throw error;
    res.send({success: true,rows});
  });
})
//2-1.끝>



//< 2-2. 상담등록

//콜백 function인 (req,res)
app.post('/api/s010100140',(req,res) => {
  //상담 등록할때 필요한 정보들을 client에서 가져온것을
  //데이터베이스에 넣어준다.
  console.log(req.body.ask_tp);
  //const consultRegist = new ConsultRegist(req.body)
  let sql = 
  'INSERT INTO '+
  'TB_S10_ASK010 ( ASK_TP, ASK_DATE, ASK_METHOD, ASK_PATH, ASK_NAME, ASK_INFO, ASK_CONTENT ) '+ 
  'VALUES ( ?, ?, ?, ?, ?, ?, ? )';

  let ask_tp = req.body.ask_tp;
  let ask_date = req.body.counseldate;
  let ask_method = req.body.method;
  let ask_path = req.body.path;
  let ask_name = req.body.cname;
  let ask_info = req.body.phone;
  let ask_content = req.body.content;

  let params =[ask_tp,ask_date,ask_method,ask_path,ask_name,ask_info,ask_content];

  connection.query(sql,params,(error, rows) => {  //쿼리문 
    if (error) throw error;
    res.send({success: true,rows});
  });
  })

//2-2.끝>



//<2-3.상담등록(s010100130) 리스트
app.post('/api/s010100130',(req,res) => {
    
  let sql = 
          'SELECT '+ 
            'ASK010.ASK_ID'+      
          ', CODE1.CD_V_MEANING AS "ASK_TP"'+
          ', DATE_FORMAT(ASK010.ASK_DATE,"%y-%m-%d") AS "ASK_DATE"'+
          ', CODE2.CD_V_MEANING AS "ASK_METHOD"'+
          ', CODE3.CD_V_MEANING AS "ASK_PATH"'+
          ', ASK010.ASK_NAME'+
          ', ASK_INFO '+
          'FROM TB_S10_ASK010 ASK010'+
          ' LEFT JOIN TB_S10_CODE CODE1'+
          ' ON ASK010.ASK_TP = CODE1.CD_V'+
          ' AND CODE1.CD_TP = "CONTRACT_TP"'+
          ' AND CODE1.ATTRIBUTE2 = "ASK"'+
          ' LEFT OUTER JOIN TB_S10_CODE CODE2'+
          ' ON ASK010.ASK_METHOD = CODE2.CD_V'+
          ' AND CODE2.CD_TP = "ASK_METHOD"'+
          ' LEFT OUTER JOIN TB_S10_CODE CODE3'+
          ' ON ASK010.ASK_PATH = CODE3.CD_V'+
          ' AND CODE3.CD_TP = "ACCESS_PATH"'+
          ' AND CODE3.ATTRIBUTE2 = "ASK"'

  //상담등록(TB_S10_ASK010 에 들어있는 모든 데이터 가져오기)
  connection.query(sql, (error, rows) => {
    if (error) throw error;
    res.send({success: true,rows});
   
  });
})
//2-3끝>



//<2-4. 상세보기 
app.get('/api/register/register_by_id', (req,res) => {

  //쿼리를 이용해서 가져올때는 body가 아닌type으로 가져온다
  let type = req.query.type
  let Rnum = req.query.id
  //console.log(Rnum)
 
  
  //num을 이용해서 DB에서 num과 같은 정보들을 가져온다.

  connection.query('SELECT * from register_info where num = '+ Rnum , (error, rows) => {//쿼리문 
    if (error) throw error;
    res.send({success: true,rows});
    //console.log(rows);
  });

})
//2-4.끝>



//<2-5.검색하기
app.post('/api/s010100130/search',(req,res)=>{
  
  console.log(req.body);

  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  let ask_tp = req.body.ask_tp;
  let searchName = req.body.searchName;

  console.log(req.body.ask_tp);
  console.log(req.body.searchName);
  console.log(startDate);
  console.log(endDate);

 
  let sql = 
            'SELECT '+ 
              'ASK010.ASK_ID'+      
            ', CODE1.CD_V_MEANING AS "ASK_TP"'+
            ', DATE_FORMAT(ASK010.ASK_DATE,"%y-%m-%d") AS "ASK_DATE"'+
            ', CODE2.CD_V_MEANING AS "ASK_METHOD"'+
            ', CODE3.CD_V_MEANING AS "ASK_PATH"'+
            ', ASK010.ASK_NAME'+
            ', ASK_INFO '+
            'FROM TB_S10_ASK010 ASK010'+
            ' LEFT JOIN TB_S10_CODE CODE1'+
            ' ON ASK010.ASK_TP = CODE1.CD_V'+
            ' AND CODE1.CD_TP = "CONTRACT_TP"'+
            ' AND CODE1.ATTRIBUTE2 = "ASK"'+
            ' LEFT OUTER JOIN TB_S10_CODE CODE2'+
            ' ON ASK010.ASK_METHOD = CODE2.CD_V'+
            ' AND CODE2.CD_TP = "ASK_METHOD"'+
            ' LEFT OUTER JOIN TB_S10_CODE CODE3'+
            ' ON ASK010.ASK_PATH = CODE3.CD_V'+
            ' AND CODE3.CD_TP = "ACCESS_PATH"'+
            ' AND CODE3.ATTRIBUTE2 = "ASK"'+
            ' WHERE ASK010.ASK_DATE BETWEEN DATE_FORMAT("'+startDate+'","%y-%m-%d") AND DATE_FORMAT("'+endDate+'","%y-%m-%d") '+ 
            ' AND ASK010.ASK_TP= "'+ask_tp+'" '+ 
            ' AND ASK010.ASK_NAME LIKE "%'+searchName+'%"'

  connection.query(sql , (error, rows) => {//쿼리문 
    if (error) throw error;
    
    if ((ask_tp.valueOf('전체'))&&(!searchName)){

      let init_sql =
                    'SELECT '+  
                      'ASK010.ASK_ID'+      
                    ', CODE1.CD_V_MEANING AS "ASK_TP"'+
                    ', DATE_FORMAT(ASK010.ASK_DATE,"%y-%m-%d") AS "ASK_DATE"'+
                    ', CODE2.CD_V_MEANING AS "ASK_METHOD"'+
                    ', CODE3.CD_V_MEANING AS "ASK_PATH"'+
                    ', ASK010.ASK_NAME'+
                    ', ASK_INFO '+
                    'FROM TB_S10_ASK010 ASK010'+
                    ' LEFT JOIN TB_S10_CODE CODE1'+
                    ' ON ASK010.ASK_TP = CODE1.CD_V'+
                    ' AND CODE1.CD_TP = "CONTRACT_TP"'+
                    ' AND CODE1.ATTRIBUTE2 = "ASK"'+
                    ' LEFT OUTER JOIN TB_S10_CODE CODE2'+
                    ' ON ASK010.ASK_METHOD = CODE2.CD_V'+
                    ' AND CODE2.CD_TP = "ASK_METHOD"'+
                    ' LEFT OUTER JOIN TB_S10_CODE CODE3'+
                    ' ON ASK010.ASK_PATH = CODE3.CD_V'+
                    ' AND CODE3.CD_TP = "ACCESS_PATH"'+
                    ' AND CODE3.ATTRIBUTE2 = "ASK"'+
                    ' WHERE ASK010.ASK_DATE BETWEEN DATE_FORMAT("'+startDate+'","%y-%m-%d") AND DATE_FORMAT("'+endDate+'","%y-%m-%d") '

        connection.query(init_sql,(error,rows) => {
          if(error) throw error;
          res.send({success:true, rows})
        })

     }else{res.send({success: true,rows});}
    //console.log('search Rows값',rows);   
  });

})
//2-5.끝>




//3. 로그인 routing
//로그인 기능을 위한 라우터
// app.post('/api/users/login',(req,res)=>{
//   //요청된 이메일을 데이터베이스에서 있는지 찾는다.
//   let Email = req.body.Email;
//   let Password = req.body.PASSWORD;

//   //console.log('Email',Email);
//   //console.log('Password',Password);
//   connection.query('SELECT * from users where Email = "'+Email+'" and PASSWORD = "'+Password+'"', (error, rows) => {//쿼리문 
//     if(error) throw error;
//     //console.log(rows)
//     if(rows > 0){
//       return res.send({loginResult:true});
//     }else{
//       return res.send({loginResult:false});
//     }
//   })      
// })


//연결알려주기
app.listen(app.get('port'), () => {
  console.log('포트 넘버 : ' + app.get('port') + "연결됐어요");
});