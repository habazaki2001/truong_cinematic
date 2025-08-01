import { useEffect, useState } from "react";
import './App.css'
import './reponsive.css';
import { BrowserRouter as Router, Routes, Route, Link, useLocation} from "react-router-dom";
import Footer from '../public/pages/Footer';
import Header from '../public/pages/Header';
import Home from '../public/pages/Home';
import ChiTiet from '../public/pages/ChiTiet';
import ReactDOM from 'react-dom'

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faFontAwesome } from "@fortawesome/free-brands-svg-icons";
import '@fortawesome/fontawesome-free/css/all.css';


library.add(fas, faTwitter, faFontAwesome);


import { PhimProvider,usePhim,ProtectedRoute   } from '../public/component/PhimContext'
import PhimBo from '../public/component/PhimBo';
import PhimLe from '../public/component/PhimLe';
import QuocGia from '../public/component/QuocGia';
import PhimDeCu from '../public/component/PhimDeCu';
import PhimMoi from '../public/component/PhimMoi';
import ScrollToTop from '../public/component/ScrollToTop';
import TheLoai from '../public/component/TheLoai';
import LoadingScreen from "../public/component/LoadingScreen";
import DangKy from '../public/admin/DangKy';
import DangNhap from '../public/admin/DangNhap';
import PrivateRoute from '../public/component/PrivateRoute';
import Admin from '../public/pages/Admin';
import NotFound from '../public/pages/NotFound';
import TimKiem from "../public/pages/TimKiem";
import { BackToTopButton} from '../public/component/TaskHandler';

function AppContent() {

  const location = useLocation();
  const { loading } = usePhim(); 
  const isAdminPage = location.pathname === '/Admin';

  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <>
      <LoadingScreen isLoading={loading} />
      {!loading && ( 
        <div id="wrapper">
          <ScrollToTop />
          <header key={user?.role || "guest"} className={isAdminPage ? 'hidden' : ''}><Header /></header>
          <main className={isAdminPage ? 'u_admin' : ''}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path="/XemPhim/:slug/*" element={<PrivateRoute element={<ChiTiet />} />} />
              <Route path='/QuocGia/:filter?' element={<QuocGia />} />
              <Route path="/PhimBo/:filter?" element={<PhimBo />} />
              <Route path='/PhimLe/:filter?' element={<PhimLe />} />
              <Route path="/TimKiem" element={<TimKiem />} />
              <Route path='/PhimDeCu?' element={<PhimDeCu />} />
              <Route path='/PhimMoi?' element={<PhimMoi />} />
              <Route path='/TheLoai/:filter?' element={<TheLoai />} />
              <Route path='/DangKy?' element={<DangKy />} />
              <Route path='/DangNhap?' element={<DangNhap />} />
              <Route path="/Admin" element={<ProtectedRoute user={user} />}>
                <Route path="/Admin" element={<Admin />} />
              </Route>
              <Route path='/not-found' element={<NotFound />} />
            </Routes>
          </main>
          <footer className={isAdminPage ? 'hidden' : ''}><Footer /></footer>
          <BackToTopButton />
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <PhimProvider>
      <Router>
        <AppContent />
      </Router>
    </PhimProvider>
  );
}
