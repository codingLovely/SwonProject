// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Title from './Title';

// // Generate Order Data
// function createData(id, date, name, shipTo, paymentMethod, amount) {
//   return { id, date, name, shipTo, paymentMethod, amount };
// }

// const rows = [
//   createData(0, '16 Mar, 2019', 'Elvis Presley', 'Tupelo, MS', 'VISA ⠀•••• 3719', 312.44),
//   createData(1, '16 Mar, 2019', 'Paul McCartney', 'London, UK', 'VISA ⠀•••• 2574', 866.99),
//   createData(2, '16 Mar, 2019', 'Tom Scholz', 'Boston, MA', 'MC ⠀•••• 1253', 100.81),
//   createData(3, '16 Mar, 2019', 'Michael Jackson', 'Gary, IN', 'AMEX ⠀•••• 2000', 654.39),
//   createData(4, '15 Mar, 2019', 'Bruce Springsteen', 'Long Branch, NJ', 'VISA ⠀•••• 5919', 212.79),
// ];


// function preventDefault(event) {
//   event.preventDefault();
// }

// const useStyles = makeStyles((theme) => ({
//   seeMore: {
//     marginTop: theme.spacing(3),
//   },
// }));

// export default function Orders() {

//   const classes = useStyles();

//   useEffect(() => {
//     searchAsk();
// }, [])


// const searchAsk = () => {
//     const body = {
//         startAsk_date,
//         ask_name,
//         ask_tp,
//         endAsk_date
//     }

//     axios.post("/api/s010100130/search", body).then(response => {
//         if (response.data.success) {
//             //console.log('검색결과:'+response.data.rows);
//             setTb_s10_ask010(response.data.rows);
//         } else {
//             alert('검색에 실패하였습니다.')
//         }
//     })
// }
//   return (
//     <React.Fragment>
//       <Title>상담 현황</Title>
//       <Table size="small">

//         <TableHead>
//           <TableRow>
//             <TableCell>No</TableCell>
//             <TableCell>문의구분</TableCell>
//             <TableCell>문의일자</TableCell>
//             <TableCell>문의방법</TableCell>
//             <TableCell>문의자명</TableCell>
//             <TableCell>연락처</TableCell>
//             <TableCell>접근경로</TableCell>
//           </TableRow>
//         </TableHead>

//         <TableBody>
//         {tb_s10_ask010.map((tb_s10_ask010, index) => {
//             <TableRow key={tb_s10_ask010.ASK_ID}>
//             <input type="checkbox" onChange={handleToggle} id={tb_s10_ask010.ASK_ID} />
//             <TableCell  onClick={onDetailHandleClickOpen} id={tb_s10_ask010.ASK_ID} >{index + 1}</TableCell>
//             <TableCell>{tb_s10_ask010.ASK_TP}</TableCell>
//             <TableCell>{tb_s10_ask010.ASK_DATE}</TableCell>
//             <TableCell>{tb_s10_ask010.ASK_METHOD}</TableCell>
//             <TableCell>{tb_s10_ask010.ASK_NAME}</TableCell>
//             <TableCell>{tb_s10_ask010.ASK_INFO}</TableCell>
//             <TableCell>{tb_s10_ask010.ASK_PATH}</TableCell>
//             </TableRow>
//     })}

//         </TableBody>
//       </Table>
     
//     </React.Fragment>
//   );
// }