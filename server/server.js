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
  let sql = `SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP = '${firstVal}' AND ATTRIBUTE2 = '${secondVal}'`;

  connection.query(sql, (error, rows) => {  //쿼리문 
        if (error) throw error;
        res.send({success: true,rows});
      });
})


app.post('/api/s010100010/roomLocker',(req,res) => {

  //console.log(firstVal);
  let sql = 'SELECT CD_V,CD_V_MEANING FROM TB_S10_CODE WHERE CD_TP ="L"';

  connection.query(sql, (error, rows) => {  //쿼리문 
        if (error) throw error;
        res.send({success: true,rows});
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
    let sql = 'SELECT CD_V,CD_V_MEANING FROM tb_s10_code WHERE CD_TP = "CONTRACT_TP" AND ATTRIBUTE2="ASK"';
  connection.query(sql, (error, rows) => {  //쿼리문
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
  //console.log(req.body);
  let sql = 
            'INSERT INTO '+
            'TB_S10_ASK010 ( ASK_TP, ASK_DATE, ASK_METHOD, ASK_PATH, ASK_NAME, ASK_INFO, ASK_CONTENT ) '+ 
            'VALUES ( ?, ?, ?, ?, ?, ?, ? )';

  let ask_tp = req.body.modalAskTp;
  let ask_date = req.body.modalAskDate;
  let ask_method = req.body.modalAskMethod;
  let ask_path = req.body.modalAskPath;
  let ask_name = req.body.modalAskName;
  let ask_info = req.body.modalAskInfo;
  let ask_content = req.body.modalAskContent;

  let params =[ask_tp,ask_date,ask_method,ask_path,ask_name,ask_info,ask_content];

  connection.query(sql,params,(error) => {  //쿼리문 
    if (error) throw error;
    res.send({success: true});
  });
  })

//2-2.끝>

//< 2-2. 상담등록수정
//콜백 function인 (req,res)
app.post('/api/s010100140/modify',(req,res) => {
  //상담 등록할때 필요한 정보들을 client에서 가져온것을
  //데이터베이스에 넣어준다.
  console.log(req.body);

  let ask_id = req.body.modalAskId;
  let ask_tp = req.body.modalAskTp;
  let ask_date = req.body.modalAskDate;
  let ask_method = req.body.modalAskMethod;
  let ask_path = req.body.modalAskPath;
  let ask_name = req.body.modalAskName;
  let ask_info = req.body.modalAskInfo;
  let ask_content = req.body.modalAskContent;

  let sql =
            'UPDATE '+
            ' TB_S10_ASK010 '+
            'SET ASK_TP="'+ask_tp+'",'+
            ' ASK_DATE="'+ask_date+'",'+
            ' ASK_METHOD="'+ask_method+'",'+
            ' ASK_PATH="'+ask_path+'",'+
            ' ASK_NAME="'+ask_name+'",'+
            ' ASK_INFO="'+ask_info+'",'+
            ' ASK_CONTENT="'+ask_content+'"'+
            ' LAST_UPDATE_DATE = sysdate()'+
            ' WHERE ASK_ID='+ ask_id +
            ' LIMIT 1'

        connection.query(sql, (error, rows) => {  //쿼리문
              if (error) throw error;
              res.send({success: true,rows});
            });

 })

//2-2.끝>



//<2-3.상담현황(s010100130) 조회
app.get('/api/s010100130',(req,res) => {
    
  let sql = 
            'SELECT '+ 
              'ASK010.ASK_ID'+      
            ', CODE1.CD_V_MEANING AS "ASK_TP"'+
            ', DATE_FORMAT(ASK010.ASK_DATE,"%y-%m-%d") AS "ASK_DATE"'+
            ', CODE2.CD_V_MEANING AS "ASK_METHOD"'+
            ', CODE3.CD_V_MEANING AS "ASK_PATH"'+
            ', ASK010.ASK_NAME'+
            ', ASK_INFO '+
            ', LAST_DELETE_FLAG '+
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
            ' WHERE ASK010.LAST_DELETE_FLAG != "*"'+
            ' ORDER BY ASK_ID DESC'

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
    //console.log(rows);
  });

})
//2-4.끝>

app.get('/api/s01010010/tb_s10_contract010_by_id', (req,res) => {

  let type = req.query.type
  let contractId = req.query.id
  //console.log(Rnum)
  let sql = 
            'SELECT '+ 
            ' MEM.MEMBER_NM, MEM.REG_NO, CODE1.CD_V AS "MEMBER_TP", CODE2.CD_V AS "MEMBER_ST", '+
            ' EMP.NAME, EMP.EMP_HP, EMP.EMP_EMAIL, EMP.ADDRESS, '+
            ' CON.CONTRACT_ID, CON.CONTRACT_DATE, CODE3.CD_V AS "CONTRACT_TP", '+
            ' CON.CONTRACT_TERM, CON.PAY_DATE, CON.CONTRACT_MONEY, '+
            ' CON.END_FLAG ,CODE4.CD_V AS "PAY_METHOD",CODE5.CD_V AS "CONTRACT_PATH" '+
            'FROM TB_S10_MEMBER010 MEM '+
            ' INNER JOIN TB_S10_EMP010 EMP '+
            ' ON MEM.CEO_ID = EMP.EMP_ID '+
            ' INNER JOIN TB_S10_CONTRACT010 CON '+
            ' ON MEM.MEMBER_ID = CON.MEMBER_ID '+
            ' INNER JOIN TB_S10_CODE CODE1 '+
            ' ON MEM.MEMBER_TP = CODE1.CD_V '+
            ' AND CODE1.CD_TP ="MEMBER_TP" '+
            ' INNER JOIN TB_S10_CODE CODE2 '+
            ' ON MEM.MEMBER_ST = CODE2.CD_V '+
            ' AND CODE2.CD_TP ="MEMBER_ST" '+
            ' INNER JOIN TB_S10_CODE CODE3 '+
            ' ON CON.CONTRACT_TP = CODE3.CD_V '+
            ' AND CODE3.CD_TP ="CONTRACT_TP" '+
            ' AND CODE3.ATTRIBUTE1 = "CONTRACT" '+
            '  INNER JOIN TB_S10_CODE CODE4 '+
            ' ON CON.PAY_METHOD = CODE4.CD_V '+
            ' AND CODE4.CD_TP ="PAY_METHOD" '+ 
            ' INNER JOIN TB_S10_CODE CODE5 '+
            ' ON CON.CONTRACT_PATH = CODE5.CD_V '+ 
            ' AND CODE5.CD_TP ="ACCESS_PATH" '+
            ' WHERE CON.CONTRACT_ID = "'+contractId+'"'

  connection.query(sql , (error, rows) => {//쿼리문 
    if (error) throw error;
    res.send({success: true,rows});
    //console.log(rows);
  });

})
//2-4.끝>



//<2-5.검색하기
app.post('/api/s010100130/search',(req,res)=>{
  
  //console.log(req.body);

  let startDate = req.body.startAsk_date;
  let endDate = req.body.endAsk_date;
  let ask_tp = req.body.ask_tp;
  let searchName = req.body.ask_name;



   // console.log(req.body.searchName);
   //console.log(startDate);
   //console.log(endDate);
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
            ' WHERE ASK010.ASK_DATE BETWEEN DATE_FORMAT("'+startDate+'","%y-%m-%d") AND DATE_FORMAT("'+endDate+'","%y-%m-%d") ';
            
            if(ask_tp != null && ask_tp != "전체")
              sql +=' AND ASK010.ASK_TP= "'+ask_tp+'" ';
            if(searchName != null && searchName != "")
              sql += ' AND ASK010.ASK_NAME LIKE "%'+searchName+'%"'

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
          console.log('date',rows);
        })

     }else{res.send({success: true,rows});}
    //console.log('search Rows값',rows);   
  });

})
//2-5.끝>


//<3-1.회원정보 상세정보
app.post('/api/s010100050/detailMember_by_id',(req,res)=>{

 let type = req.query.type
 let regNo = req.query.id

 let sql = 
            'SELECT '+ 
            ' MEM.MEMBER_NM,MEM.REG_NO,CODE1.CD_V_MEANING AS "MEMBER_TP",CODE2.CD_V_MEANING AS "MEMBER_ST", '+
            ' EMP.NAME,EMP.EMP_HP,EMP.EMP_EMAIL,EMP.ADDRESS, '+
            ' CON.CONTRACT_ID,CON.CONTRACT_DATE,CODE3.CD_V_MEANING AS "CONTRACT_TP", '+
            ' CON.CONTRACT_TERM,CON.PAY_DATE,CON.CONTRACT_MONEY, '+
            ' CON.END_FLAG '+
            'FROM TB_S10_MEMBER010 MEM '+
            ' INNER JOIN TB_S10_EMP010 EMP '+
            ' ON MEM.CEO_ID = EMP.EMP_ID '+
            ' INNER JOIN TB_S10_CONTRACT010 CON '+
            ' ON MEM.MEMBER_ID = CON.MEMBER_ID '+
            ' INNER JOIN TB_S10_CODE CODE1 '+
            ' ON MEM.MEMBER_TP = CODE1.CD_V '+
            ' AND CODE1.CD_TP ="MEMBER_TP" '+
            ' INNER JOIN TB_S10_CODE CODE2 '+
            ' ON MEM.MEMBER_ST = CODE2.CD_V '+
            ' AND CODE2.CD_TP ="MEMBER_ST" '+
            ' INNER JOIN TB_S10_CODE CODE3 '+
            ' ON CON.CONTRACT_TP = CODE3.CD_V '+
            ' AND CODE3.CD_TP ="CONTRACT_TP" '+
            ' AND CODE3.ATTRIBUTE1 = "CONTRACT" '+
            ' WHERE MEM.REG_NO = "'+regNo+'"'+
            ' ORDER BY CON.CONTRACT_ID DESC'

 connection.query(sql , (error, rows) => {//쿼리문 
   if (error) throw error;
   res.send({success: true,rows});
   //console.log(rows);
 });
})
//3-1.끝>





app.post('/api/s010100130/delete',(req,res)=>{

let askIdArray = req.body;
let sql = '';
let resultRows=[];
let error = '';

//배열에 담겨있는 숫자 분리해서 넣기
    for (let i = 0; i < askIdArray.length; i++ ){

          sql =
            'UPDATE '+
            ' TB_S10_ASK010 ' +
            ' SET LAST_DELETE_FLAG = "*",'+
            ' LAST_DELETE_DATE = sysdate()'+
            ' WHERE ASK_ID='+ askIdArray[i] +
            ' LIMIT 1';

       //console.log(sql);

       connection.query(sql , (error, resultRows) => {//쿼리문
       });
    }//for
         if (error) throw error;
         res.send({success: true})
        //console.log(resultRows);
})


app.post('/api/s010100010/contHier',(req,res)=>{
    let contractTp = req.body.contractTpBody;

    let sql = 'SELECT ' +
        'CODE1.CD_V,CODE1.CD_V_MEANING ' +
        'FROM TB_S10_CODE CODE1 ' +
        'INNER JOIN TB_S10_CODE CODE2 ' +
        'ON CODE1.CD_TP = CODE2.CD_V ' +
        'WHERE CODE2.CD_V = "'+contractTp+'"'

    connection.query(sql, (error, rows) => {//쿼리문
        if(error) throw error;
        res.send({success: true,rows})


  });

})

//3. 로그인 routing
//로그인 기능을 위한 라우터
app.post('/api/users/login',(req,res)=>{
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  let Email = req.body.Email;
  let Password = req.body.PASSWORD;

  //console.log('Email',Email);
  //console.log('Password',Password);
  // connection.query('SELECT * from users where Email="'+ Email+'" and PASSWORD = "'+Password+'"', (error, rows) => {//쿼리문
  //   if(error) throw error;
  //   //console.log(rows)
  //   if(rows > 0){
  //     return res.send({loginResult:true});
  //   }else{
  //     return res.send({loginResult:false});
  //   }
  // })
})

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
  let memberId;
  let ceoId;
  //let ceoId;
  let sql = 
            'SELECT MEMBER_ID '+
            'FROM ( '+
              'SELECT '+
                 'MEMBER_ID '+
                ',ROW_NUMBER() OVER(ORDER BY MEMBER_ID DESC) AS RN '+
                'FROM TB_S10_MEMBER010 MEM010 '+
                ') MEM010 '+
            'WHERE RN = 1';
 connection.query(sql , (error, rows) => {//쿼리문
   if (error) throw error;
    memberId = rows[0].MEMBER_ID+1;
 });

//  connection.query(csql , (error, rows) => {//쿼리문
//   if (error) throw error;
//    ceoId = rows[0].CEO_ID+1;
// });

  connection.beginTransaction(function(error){

          let sqlMember = 
          'INSERT INTO '+
          'TB_S10_MEMBER010 ( MEMBER_NM, REG_NO, MEMBER_TP,CREATED_DATE,CEO_ID) '+
          'VALUES (?, ?, ?, SYSDATE(),?)';

            let memberNm = req.body.memberNm;
            // 전화번호
            let firstRegNo = req.body.firstRegNo;
            let secondRegNo = req.body.secondRegNo;
            let thirdRegNo = req.body.thirdRegNo;
            let regNo = firstRegNo + secondRegNo + thirdRegNo;

            let memberTp = req.body.memberTp;

            let memberParams =[memberNm,regNo,memberTp,memberId];

          //@@@@@@@
          let sqlEmp = 
          'INSERT INTO '+
          'TB_S10_EMP010(NAME,EMP_HP,EMP_EMAIL,ZIP_CODE,ADDRESS,DETAIL_ADDRESS,CREATED_DATE) '+ 
          'VALUES (?, ?, ?, ?, ? ,? ,SYSDATE())';
            
            let empIdName = req.body.empIdName;
            //console.log('empIdName:',empIdName);
            let firstEmpHp = req.body.firstEmpHp;
            let secondEmpHp = req.body.secondEmpHp;
            let thirdEmpHp = req.body.thirdEmpHp;
            let empHp = firstEmpHp + secondEmpHp + thirdEmpHp;
            //console.log('empHp:',empHp);
            let empEmailId = req.body.empEmailId;
            let domainAddress = req.body.domainAddress;
            let empEmail = empEmailId + domainAddress;

            let zipcode = req.body.zipcode;
            let empAddress = req.body.empAddresss;
            let empDetailAddress = req.body.empDetailAddress;


            let empParams = [empIdName,empHp,empEmail,zipcode,empAddress,empDetailAddress];
          
          //@@@@@@@@@@
          let sqlContract = 
          'INSERT INTO '+
          'TB_S10_CONTRACT010(CONTRACT_TP,CONTRACT_TERM,PAY_DATE,PAY_METHOD,CONTRACT_MONEY,CONTRACT_PATH,CREATED_DATE,CONTRACT_DATE,MEMBER_ID ) '+ 
          'VALUES (?, ?, ?, ?, ? ,?,SYSDATE(),SYSDATE(),?)';

            let contractTp = req.body.contractTp;
            let contractTerm = req.body.contractTerm;
            let payDate = req.body.payDate;
            let payMethod = req.body.payMethod;
            let contractMoney = req.body.contractMoney;
            let contractPath = req.body.contractPath;

            let contractParams = [contractTp, contractTerm, payDate, payMethod,contractMoney,contractPath,memberId];

            let contractTpVal = req.body.contractTpVal;
            let roomLockerTp = req.body.roomLockerTp;
            console.log(contractTpVal);

            //@@@@@@@@@
            let sqlRoom = 'UPDATE TB_S10_CODE SET ATTRIBUTE3 = '+memberId+' WHERE CD_V ="'+contractTpVal+'"'
            let sqlL = 'UPDATE TB_S10_CODE SET ATTRIBUTE4 = '+memberId+' WHERE CD_V ="'+roomLockerTp+'"'

          if(error) throw error;
          
          connection.query(sqlMember,memberParams,function(error,result){
            //console.log(result);   
              if (error){
                connection.rollback(function(){
                  console.log('1.error');
                  throw error;
                });
              }
            
            connection.query(sqlEmp,empParams,function(error,result){
              //console.log(result);   
               if (error){
                connection.rollback(function(){
                  console.log('2.error');
                  throw error;
                });
              }
                    
              connection.query(sqlContract,contractParams, function(error, result){  //쿼리문 
                //console.log(result);
                
                  if (error){
                    connection.rollback(function(){
                      console.log('3.error');
                      throw error;
                    });
                  }
                          
                  connection.query(sqlRoom, function(error, result){  //쿼리문 
                    //console.log(result);
                    
                      if (error){
                        connection.rollback(function(){
                          console.log('3.error');
                          throw error;
                        });
                      }
                                
                    connection.query(sqlL, function(error, result){  //쿼리문 
                      //console.log(result);
                      
                        if (error){
                          connection.rollback(function(){
                            console.log('3.error');
                            throw error;
                          });
                        }
                          
                          connection.commit(function(err) {
                            if (err) {
                              connection.rollback(function() {
                                throw err;
                              });
                            }

                            console.log('success!');
                            res.send({success: true});
                      });//commit
                 });
               });       
            });//contract
         });//emp
      });//member
  });//transaction
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
})