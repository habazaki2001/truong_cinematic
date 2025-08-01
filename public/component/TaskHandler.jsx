// useScrollPosition.js
import { useState, useEffect } from "react";

export const useScrollPosition = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
}

export const BackToTopButton = () => {
  const scrollY = useScrollPosition();

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <p className={`to_top ${scrollY > 100 ? "show" : ""}`} onClick={handleClick}>
      <img width="80" height="80" loading="lazy" src="/asset/images/btn_top.jpg" />
    </p>
  );
}


export const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className={`h_bar ${open ? "active" : ""}`} onClick={() => setOpen(!open)} />
      <nav className={open ? "show_nav" : ""}>...</nav>
      <div className={`bg_close_nav ${open ? "active" : ""}`} onClick={() => setOpen(false)} />
    </>
  );
}


