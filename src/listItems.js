// import React from 'react';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import ListSubheader from '@material-ui/core/ListSubheader';
// import DashboardIcon from '@material-ui/icons/Dashboard';
// import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
// import PeopleIcon from '@material-ui/icons/People';
// import BarChartIcon from '@material-ui/icons/BarChart';
// import LayersIcon from '@material-ui/icons/Layers';
// import { Link } from 'react-router-dom';

// export const mainListItems = (

//   <div>
//     <div hidden ={sessionStorage.getItem('member') == null}>
//     <ListItem button>
//       <ListItemIcon>
//       <PeopleIcon />
//       </ListItemIcon>
//       <Link to="/member"><ListItemText primary="회원현황" /></Link>
//     </ListItem>
//     <ListItem button>
//       <ListItemIcon>
//         <ShoppingCartIcon />
//       </ListItemIcon>
//       <Link to ="/paymentStatus"><ListItemText primary="납부현황" /></Link>
//     </ListItem>
//     <ListItem button>
//       <ListItemIcon>
//       <DashboardIcon />
//       </ListItemIcon>
//       <Link to ="/consultationStatus"><ListItemText primary="상담현황" /></Link>
//     </ListItem>
//     <ListItem button>
//       <ListItemIcon>
//         <BarChartIcon />
//       </ListItemIcon>
//       <Link to ="/staff"><ListItemText primary="직원현황" /></Link>
//     </ListItem>
//     <ListItem button>
//       <ListItemIcon>
//       <DashboardIcon />
//       </ListItemIcon>
//       <Link to ="/contractStatus"><ListItemText primary="계약현황" /></Link>
//     </ListItem>
//     <ListItem button>
//         <ListItemIcon>
//           <LayersIcon />
//         </ListItemIcon>
//         <Link to ="/"><ListItemText primary="로그아웃" /></Link>
//       </ListItem>
//     </div>
//    <div hidden ={sessionStorage.getItem('member') != null}>
//       <ListItem button>
//         <ListItemIcon>
//           <LayersIcon />
//         </ListItemIcon>
//         <Link to ="/"><ListItemText primary="로그인" /></Link>
//       </ListItem>
//     </div>
//   </div>
// );

// export const secondaryListItems = (
//    <div>
  
//    </div>
// );