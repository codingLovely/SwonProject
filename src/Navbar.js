import { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/Navbar.css';



class Navbar extends Component {
    render() {
      return (
          <div id = "wrap">
            <header id="header" className="clearfix">
                <nav className="nav">
                    <ul className="clearfix">
                        <li><Link to="/member">회원현황</Link>
                        </li>
                        <li><Link to ="/paymentStatus">납부현황</Link>
                        </li>
                        <li><Link to ="/consultationStatus">상담현황</Link>
                        </li>
                        <li><Link to ="/staff">직원현황</Link>
                        {/* /staff가 맞고 insert한 뒤 /staff로 변경하기 */}
                        </li>
                        <li><Link to ="/login">로그인/로그아웃</Link>
                        </li>
                        <li><Link to ="/Dashboard">로그인/로그아웃</Link>
                        </li>
                    </ul>
                </nav>
             </header>
            </div>
        
      );
    }
  }
  
  export default Navbar;