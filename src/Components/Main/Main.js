import { Component } from 'react';
import { Link } from 'react-router-dom';





class Main extends Component {
    render() {
      return (
            <header id="header" className="clearfix">
                <nav className="nav">
                    <ul className="clearfix">
                        <li><Link to="/member">회원현황</Link>
                        </li>
                        <li><Link to ="/paymentStatus">납부현황</Link>
                        </li>
                        <li><Link to ="/S010100130">상담현황</Link>
                        </li>
                        <li><Link to ="/swon">직원현황</Link>
                        {/* /staff가 맞고 insert한 뒤 /staff로 변경하기 */}
                        </li>
                        <li><Link to ="/login">로그인/로그아웃</Link>
                        </li>
                        
                    </ul>
                </nav>
            </header>
        
      );
    }
  }
  
  export default Main;