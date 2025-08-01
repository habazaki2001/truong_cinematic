import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link  } from 'react-router-dom';
import { useState ,useEffect,useRef   } from "react";
import { useNavigate } from "react-router-dom";
import { usePhim } from "../component/PhimContext";  
import { motion, AnimatePresence } from "framer-motion";
import DropMenu from "../component/DropMenu";

export default function Navbar({ isOpen, onClose }) {
    const { phim } = usePhim();  
    const [searchTerm, setSearchTerm] = useState("");  
    const [suggestions, setSuggestions] = useState([]);  
    const navigate = useNavigate();  
    const searchRef = useRef(null); 
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (searchTerm.trim()) {
          const filteredMovies = phim.filter((p) => 
            p.title.toLowerCase().startsWith(searchTerm.toLowerCase())
          );
          setSuggestions(filteredMovies.slice(0, 5));  // Lấy tối đa 5 gợi ý
        } else {
          setSuggestions([]);
        }
      }, [searchTerm, phim]);

      console.log("Search Term:", searchTerm);

      const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
          navigate(`/TimKiem?query=${encodeURIComponent(searchTerm.trim())}`);  
          setSuggestions([]);  // Ẩn gợi ý sau khi tìm
        }
      };

      const handleSuggestionClick = (movieName) => {
        setSearchTerm(movieName);  // Điền vào ô input
        navigate(`/TimKiem?query=${encodeURIComponent(movieName)}`);  
        setSuggestions([]);  // Ẩn gợi ý
      };

      // Ẩn gợi ý khi click ra ngoài
        useEffect(() => {
            const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchTerm("")
                setSuggestions([]);  
            }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, []);

    return (
    <nav className={`${isOpen ? 'show_nav' : ''}`}>
        <div className="nav_inner">
            <ul className="list_nav">
                <DropMenu
                    title="Thể loại"
                    basePath="TheLoai"
                    items={[
                        { slug: "hanhdong", name: "Hành động" },
                        { slug: "phieuluu", name: "Phiêu Lưu" },
                        { slug: "kinhdi", name: "Kinh Dị" },
                        { slug: "tinhcam", name: "Tình Cảm" },
                        { slug: "hoathinh", name: "Hoạt Hình" },
                        { slug: "giatgan", name: "Giật gân" },
                        { slug: "sinhton", name: "Sinh tồn" },
                        { slug: "khoahocvientuong", name: "Khoa học viễn tưởng" },
                        { slug: "chinhkich", name: "Chính kịch" },
                        { slug: "langman", name: "Lãng mạn" },
                        { slug: "lichsu", name: "Lịch sử" },
                        { slug: "khac", name: "Khác" },
                    ]}
                />
                <DropMenu
                    title="Quốc Gia"
                    basePath="QuocGia"
                    items={[
                        { slug: "trungquoc", name: "Trung Quốc" },
                        { slug: "hanquoc", name: "Hàn Quốc" },
                        { slug: "aumy", name: "Âu Mỹ" },
                        { slug: "taybannha", name: "Tây Ban Nha" },
                        { slug: "anh", name: "Anh" },
                        { slug: "nhatban", name: "Nhật Bản" },
                        { slug: "", name: "Khác" },
                    ]}
                />
                <DropMenu
                    title="Phim Bộ"
                    basePath="PhimBo"
                    items={[
                        { slug: "new", name: "Cập Nhật" },
                        { slug: "trungquoc", name: "Trung Quốc" },
                        { slug: "hanquoc", name: "Hàn Quốc" },
                        { slug: "aumy", name: "Âu Mỹ" },
                        { slug: "taybannha", name: "Tây Ban Nha" },
                        { slug: "anh", name: "Anh" },
                        { slug: "nhatban", name: "Nhật Bản" },
                    ]}
                />
                <DropMenu
                    title="Phim Lẻ"
                    basePath="PhimLe"
                    items={[
                        { slug: "new", name: "Cập Nhật" },
                        { slug: "trungquoc", name: "Trung Quốc" },
                        { slug: "hanquoc", name: "Hàn Quốc" },
                        { slug: "aumy", name: "Âu Mỹ" },
                        { slug: "taybannha", name: "Tây Ban Nha" },
                        { slug: "anh", name: "Anh" },
                        { slug: "nhatban", name: "Nhật Bản" },
                    ]}
                />
            </ul>
            <div className="h_search">
                <form onSubmit={handleSearch} style={{ position: "relative" }} ref={searchRef}>
                    <input 
                        type="text"
                        placeholder="Tìm phim..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className='btn_search' type="submit"><FontAwesomeIcon icon="fa-solid fa-magnifying-glass" className='icon'/></button>
                    {suggestions.length > 0 && (
                        <ul className="suggestions">
                            {suggestions.map((p) => (
                            <li key={p._id} onClick={() => handleSuggestionClick(p.title)}>
                                {p.title}
                            </li>
                            ))}
                        </ul>
                    )}
                </form>
            </div>
            <span className="ic_close close_nav sp" onClick={onClose}><FontAwesomeIcon icon="fa-solid fa-xmark" /></span>
        </div>
    </nav>
  )
}
