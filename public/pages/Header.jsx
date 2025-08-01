import Navbar from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link ,useNavigate  } from 'react-router-dom';
import { isAuthenticated, API_URL } from "../component/PhimContext";
import { useState } from "react";
import { motion } from "framer-motion";


export default function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const handleLogout = () => {
    localStorage.removeItem("token"); // Xoá token khi đăng xuất
    localStorage.removeItem("user");
    navigate("/DangNhap"); // Chuyển hướng về trang Đăng Nhập
  };

   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [showLoginMenu, setShowLoginMenu] = useState(false);

   function handleShowNav () {
      setIsMenuOpen(prev => !prev);
   }

  return (
    <div className="h_box">
        <h1 id="logo"><Link to='/'><img src="/asset/images/logo.png" width="140" alt="" /></Link></h1>
        <div className={`h_bar sp ${isMenuOpen ? 'active' : ''}`}  onClick={() => handleShowNav()}><FontAwesomeIcon icon="fa-solid fa-bars"/></div>
        <span className={`close_nav bg_close_nav ${isMenuOpen ? 'active' : ''}`} onClick={() => handleShowNav()}></span>
        <Navbar isOpen={isMenuOpen} onClose={handleShowNav}></Navbar>
        <div className={`h_login ${showLoginMenu ? 'active' : ''}`} onClick={() => setShowLoginMenu(!showLoginMenu)}>
            {!isAuthenticated() ? (
                  <p className='avt_login'><FontAwesomeIcon icon="fa-solid fa-user" /></p>
              ) : (
                  <p className="avt_login"><img src={`${API_URL}${user?.avatar}`} alt="Avatar" className="user_avatar" /></p>
            )}
            <motion.div 
              className="sub_login"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: showLoginMenu ? 'auto' : 0, opacity: showLoginMenu ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
                <ul className="list_login">
                    {!isAuthenticated() ? (
                      <>
                        <li>
                          <Link to="/DangKy" className="txt_login">Đăng Ký</Link>
                        </li>
                        <li>
                          <Link to="/DangNhap" className="txt_login">Đăng nhập</Link>
                        </li>
                      </>
                    ) : (
                      <>
                       {user && user.role === "admin" && (
                          <li>
                            <Link to="/Admin" className="txt_login">Page Admin</Link>
                          </li>
                        )}
                        <li>
                          <span className="txt_login" onClick={handleLogout}>Đăng xuất</span>
                        </li>
                      </>
                    )}
                </ul>
            </motion.div>
        </div>
    </div>
  )
}
