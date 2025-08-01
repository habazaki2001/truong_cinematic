import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // Mỗi khi đường dẫn thay đổi, cuộn lên đầu trang

  return null;
};

export default ScrollToTop;
