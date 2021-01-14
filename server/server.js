const express    = require('express');
const dbconfig   = require('./config/database.js')(); // 위에서 생성한 MySQL에 연결을 위한 코드(모듈)
const connection = dbconfig.init(); // node express 와 MySQL의 연동
const bodyParser = require('body-parser');
const { configure } = require('@testing-library/react');
const bcrypt = require('bcrypt');
//const { request } = require('express');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 1. configuration 
app.set('port', process.env.PORT || 4001);



// 2. 상담등록 routing


app.post('/api/s010100140/selectTest',(req,res) => {
  let firstVal = req.body.firstVal;
  let secondVal = req.body.secondVal;
  //console.log(firstVal);
  let sql = 'SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP ="'+firstVal+'" AND ATTRIBUTE2 ="'+secondVal+'"';

  connection.query(sql, (error, rows) => {  //쿼리문 
        if (error) throw error;
        res.send({success: true,rows});
        //console.log(rows);
      });
})

//< 2-1.list of value
// app.post('/api/s010100140/ask_tp',(req,res) => {
//   //CD_TP ="CONTRACT_TP" and ATTRIBUTE2="ASK"
//   connection.query('select CD_V,CD_V_MEANING from tb_s10_code where CD_TP ="CONTRACT_TP" and ATTRIBUTE2="ASK"', (error, rows) => {  //쿼리문 
//     if (error) throw error;
//     res.send({success: true,rows});
//     console.log(rows);
//   });
// })

// app.post('/api/s010100140/ask_method',(req,res) => {
//   //CD_TP ="ASK_METHOD"
//   connection.query('select CD_V,CD_V_MEANING from tb_s10_code where CD_TP ="ASK_METHOD"', (error, rows) => {  //쿼리문 
//     if (error) throw error;
//     res.send({success: true,rows});
//   });
// })

// app.post('/api/s010100140/ask_path',(req,res) => {
//   //CD_TP ="CONTRACT_TP" and ATTRIBUTE2="ASK"
//   connection.query('select CD_V,CD_V_MEANING from tb_s10_code where CD_TP ="ACCESS_PATH" and ATTRIBUTE2="ASK"', (error, rows) => {  //쿼리문 
//     if (error) throw error;
//     res.send({success: true,rows});
//   });
// })


app.post('/api/s010100010/contract',(req,res) => {
    //CD_TP ="CONTRACT_TP" and ATTRIBUTE2="ASK"
    let sql = 'SELECT t1.CD_V,t1.CD_V_MEANING,t2.CD_V '+
              'FROM TB_S10_CODE t1 '+
              'RIGHT JOIN TB_S10_CODE t2 '+
              'ON t1.CD_TP = t2.CD_V '+
              'WHERE t2.CD_TP = "CONTRACT_TP"'

    connection.query(sql, (error, rows) => {  //쿼리문 
      if (error) throw error;
      res.send({success: true,rows});
    });
  })


app.post('/api/s010100010/accessPath',(req,res) => {
  
  let sql = 'SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = "ACCESS_PATH" AND ATTRIBUTE1 ="CONTRACT"';

  connection.query(sql, (error, rows) => {  //쿼리문 
        if (error) throw error;
        res.send({success: true,rows});
        //console.log(rows);
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
  //console.log(req.body.ask_tp);
  let sql = 
            'INSERT INTO '+
            'TB_S10_ASK010 ( ASK_TP, ASK_DATE, ASK_METHOD, ASK_PATH, ASK_NAME, ASK_INFO, ASK_CONTENT ) '+ 
            'VALUES ( ?, ?, ?, ?, ?, ?, ? )';

  let ask_tp = req.body.ask_tp;
  let ask_date = req.body.ask_date;
  let ask_method = req.body.ask_method;
  let ask_path = req.body.ask_path;
  let ask_name = req.body.ask_name;
  let ask_info = req.body.ask_info;
  let ask_content = req.body.ask_content;

  let params =[ask_tp,ask_date,ask_method,ask_path,ask_name,ask_info,ask_content];

  connection.query(sql,params,(error) => {  //쿼리문 
    if (error) throw error;
    res.send({success: true});
  });
  })

//2-2.끝>



//<2-3.상담현황(s010100130) 조회
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

//<3-1.회원현황(s010100010) 조회

app.post('/api/s010100010',(req,res) => {
  let sql = 
          'SELECT'+
          ' member010.MEMBER_ID '+ 
          ', member010.REG_NO '+
          ', member010.MEMBER_TP '+
          ', member010.MEMBER_ST '+
          ', member010.MEMBER_NM '+
          ', code1.CD_V_MEANING AS "MEMBER_TP" '+
          ', emp010.NAME '+
          ', emp010.EMP_HP '+
          ', emp010.EMP_EMAIL '+
          'FROM TB_S10_MEMBER010 member010 '+
          'INNER JOIN TB_S10_EMP010 emp010 '+
          'ON member010.CEO_ID = emp010.EMP_ID '+
          'LEFT OUTER JOIN TB_S10_CODE code1 '+
          'ON member010.MEMBER_TP = code1.CD_V '+
          'AND CODE1.CD_TP = "MEMBER_TP" ';

  //MEMBER010 EMP010 JOIN 에 들어있는 모든 데이터 가져오기)
  connection.query(sql, (error, rows) => {
    if (error) throw error;
    res.send({success: true,rows});
   
  });

})

//끝>



//<2-4. 상세보기 
app.get('/api/s010100140/tb_s10_ask010_by_id', (req,res) => {

  //쿼리를 이용해서 가져올때는 body가 아닌type으로 가져온다
  let type = req.query.type
  let rNum = req.query.id
  //console.log(Rnum)
  let sql = 
            'SELECT '+ 
              'ASK010.ASK_ID'+      
            ', CODE1.CD_V AS "ASK_TP"'+
            ', DATE_FORMAT(ASK010.ASK_DATE,"%y-%m-%d") AS "ASK_DATE"'+
            ', CODE2.CD_V AS "ASK_METHOD"'+
            ', CODE3.CD_V AS "ASK_PATH"'+
            ', ASK010.ASK_NAME'+
            ', ASK_INFO '+
            ', ASK_CONTENT '+
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
            ' where ASK_ID = '+ rNum

  connection.query(sql , (error, rows) => {//쿼리문 
    if (error) throw error;
    res.send({success: true,rows});
    console.log(rows);
  });

})
//2-4.끝>



//<2-5.검색하기
app.post('/api/s010100130/search',(req,res)=>{
  
  //console.log(req.body);

  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  let ask_tp = req.body.ask_tp;
  let searchName = req.body.searchName;

    console.log('ask_tp',req.body.ask_tp);
  // console.log(req.body.searchName);
  // console.log(startDate);
  // console.log(endDate);

 
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
    console.log('search Rows값',rows);   
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

// app.post('api/s010100100',(req,res)=>{

//   let EMP_EMAIL = req.body; 
//   let PWD =req.body;
//     bcrypt.hash(PW1, null, null, function(err, hash){     
      
//       let sql ='INSERT INTO TB_S10_EMP010(EMP_EMAIL,PWD) VALUES (?,?)';
//       let params =[EMP_EMAIL,PWD]; 
    
//       connection.query(sql, params, function(err, rows){          
//       res.send({success:true})
//      })
//    })
// })


//<이용계약서 등록
app.post('/api/s010100010/insertMember010',(req,res)=>{

  let sqlMember = 
            'INSERT INTO '+
            'TB_S10_MEMBER010 ( MEMBER_NM, REG_NO, MEMBER_TP) '+ 
            'VALUES (?, ?, ?)';

  let memberNm = req.body.memberNm;
    // 전화번호
    let firstRegNo = req.body.firstRegNo;
    let secondRegNo = req.body.secondRegNo;
    let thirdRegNo = req.body.thirdRegNo;
  let regNo = firstRegNo + secondRegNo + thirdRegNo;

  let memberTp = req.body.memberTp;
  
  let memberParams =[memberNm,regNo,memberTp];

  connection.query(sqlMember,memberParams,(error) => {  //쿼리문 
    // if (error) throw error;
    // res.send({success: true});
  });


  let sqlEmp = 
          'INSERT INTO '+
          'TB_S10_EMP010(NAME,EMP_HP,EMP_EMAIL,ZIP_CODE,ADDRESS,DETAIL_ADDRESS) '+ 
          'VALUES (?, ?, ?, ?, ? ,?)';

  let empIdName = req.body.empIdName;

    let firstEmpHp = req.body.firstEmpHp;
    let secondEmpHp = req.body.secondEmpHp;
    let thirdEmpHp = req.body.thirdEmpHp;
  let empHp = firstEmpHp + secondEmpHp + thirdEmpHp;

    let empEmailId = req.body.empEmailId;
    let domainAddress = req.body.domainAddress;
  let empEmail = empEmailId + domainAddress;

  let zipcode = req.body.zipcode;
  let empAddress = req.body.empAddresss;
  let empDetailAddress = req.body.empDetailAddress;


  let empParams = [empIdName,empHp,empEmail,zipcode,empAddress,empDetailAddress];

  connection.query(sqlEmp,empParams,(error) => {  //쿼리문 
    // if (error) throw error;
    // res.send({success: true});
  });


  let sqlContract = 
          'INSERT INTO '+
          'TB_S10_CONTRACT010(CONTRACT_TP,CONTRACT_TERM,PAY_DATE,PAY_METHOD,CONTRACT_MONEY,CONTRACT_PATH) '+ 
          'VALUES (?, ?, ?, ?, ? ,?)';

  let contractTp = req.body.contractTp;
  let contractTerm = req.body.contractTerm;
  let payDate = req.body.payDate;
  let payMethod = req.body.payMethod;
  let contractMoney = req.body.contractMoney;
  let contractPath = req.body.contractPath;

  let contractParams = [contractTp, contractTerm, payDate, payMethod,contractMoney,contractPath];

  connection.query(sqlContract,contractParams,(error) => {  //쿼리문 
    if (error) throw error;
    res.send({success: true});
  });

})


app.post('/api/s010100040/searchMember',(req,res)=>{
 
  let memberNm = req.body.memberNm;
  let regNo = req.body.regNo;
  let name = req.body.name;
  let memberTp = req.body.memberTp;
  let contractStatus = req.body.contractStatus;

  let sql = 
          'SELECT'+
          ' member010.MEMBER_ID '+ 
          ', member010.REG_NO '+
          ', member010.MEMBER_TP '+
          ', member010.MEMBER_ST '+
          ', member010.MEMBER_NM '+
          ', code1.CD_V_MEANING AS "MEMBER_TP" '+
          ', emp010.NAME '+
          ', emp010.EMP_HP '+
          ', emp010.EMP_EMAIL '+
          'FROM TB_S10_MEMBER010 member010 '+
          'INNER JOIN TB_S10_EMP010 emp010 '+
          'ON member010.CEO_ID = emp010.EMP_ID '+
          'LEFT OUTER JOIN TB_S10_CODE code1 '+
          'ON member010.MEMBER_TP = code1.CD_V '+
          'AND CODE1.CD_TP = "MEMBER_TP"'+
          'WHERE member010.MEMBER_NM = "'+memberNm+'"'+
          ' AND member010.REG_NO = "'+regNo+'"'+
          ' AND emp010.NAME = "'+name+'"'+
          ' AND member010.MEMBER_TP = "'+memberTp+'"'+
          ' AND member010.MEMBER_ST = "'+contractStatus+'"'

          connection.query(sql,(error,rows) => {
            if(error) throw error;
            res.send({success:true, rows})
          })

})


//연결알려주기
const server = app.listen(app.get('port'), () => {
  server.setTimeout( 3 * 60 * 1000 );
  console.log('포트 넘버 : ' + app.get('port') + "연결됐어요");
});