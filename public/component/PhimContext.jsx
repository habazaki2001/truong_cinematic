import { createContext, useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { Navigate, Outlet } from "react-router-dom";
import MuxPlayer from "@mux/mux-player-react";
import "@mux/mux-player/themes/classic";

// Tạo Context
const PhimContext = createContext();

export const usePhim = () => useContext(PhimContext);

export const API_URL = 'https://truong-cinematic.vercel.app/api/phim';

  export const PhimProvider = ({ children }) => {
      const [phim, setPhim] = useState([]);
      const [loading, setLoading] = useState(true);
      useEffect(() => {
        setTimeout(() => {
          axios
              .get(`${API_URL}`)
              .then((response) => {setPhim(response.data);setLoading(false);})
              .catch((error) => {console.error("Lỗi khi lấy dữ liệu:", error, error.message); setLoading(false)});
        }, 500);
      }, []);

      return (
          <PhimContext.Provider value={{ phim ,loading}}>
              {children}
          </PhimContext.Provider>
      );
  };

  export const getTotalViews = (tapPhim) => {
      if (!tapPhim || tapPhim.length === 0) return 0;
      return tapPhim.reduce((total, tap) => total + (tap.luotXem || 0), 0);
    };

  // Hàm định dạng số lượt xem thành K, M
  export const formatViews = (num) => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(2) + "M"; // Ví dụ: 3.57M
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(2) + "K"; // Ví dụ: 1.20K
    } else {
      return num.toString();
    }
  };

  export const usePagination = (data, itemsPerPage = 12) => {
    const [currentPage, setCurrentPage] = useState(1);
    // Tính tổng số trang
    const totalPages = Math.ceil(data.length / itemsPerPage);
  
    // Đảm bảo currentPage không vượt quá totalPages
    useEffect(() => {
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1);
      }
    }, [data.length, totalPages]);
  
    // Lấy danh sách phần tử theo trang hiện tại
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const dataPaginated = data.slice(startIndex, endIndex);
  
    // Chuyển trang
    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    };
  
    return { currentPage, totalPages, dataPaginated, goToPage };
  };

  export const normalizeString = (input) => {
    if (Array.isArray(input)) {
      return input.map(str => normalizeString(str)); // Nếu là mảng, chuẩn hóa từng phần tử
    }
    return input
    .toLowerCase()
    .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
    .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
    .replace(/ì|í|ị|ỉ|ĩ/g, "i")
    .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
    .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
    .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
    .replace(/đ/g, "d")
    .replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "")
    .replace(/\u02C6|\u0306|\u031B/g, "")
    .replace(/\s+/g, ""); 
  };

  export const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };

  export const ProtectedRoute = ({ user }) => {
  return user?.role === "admin" ? <Outlet /> : <Navigate to="/not-found" />;

  };

  export const VideoPlayer = ({ src }) => {
    if (!src) {
      return <p>Video đang tải...</p>;
    }
    return (
      <MuxPlayer
        src={src}
        theme="classic"
      />
    );
  };

  // Hook để xử lý like
  export const useLike = (currentFilm, userId) => {
    const [likeArray, setLikeArray] = useState(currentFilm.like || []);
    const [isPendingUpdate, setIsPendingUpdate] = useState(false);
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    // Hàm xử lý like/hủy like
    const handleLike = () => {
      const alreadyLiked = likeArray.includes(userId);
      const updatedLikes = alreadyLiked
        ? likeArray.filter((id) => id !== userId)
        : [...likeArray, userId];

      setLikeArray(updatedLikes);
      setIsPendingUpdate(true);

      // Lưu tạm vào localStorage theo từng phim
      const stored = JSON.parse(localStorage.getItem("likedPending")) || {};
      stored[currentFilm.id] = {
        userId,
        like: updatedLikes,
        timestamp: Date.now(),
      };
      localStorage.setItem("likedPending", JSON.stringify(stored));
    };

    // Khi đổi phim thì reset likeArray
    useEffect(() => {
      const stored = JSON.parse(localStorage.getItem("likedPending")) || {};
      const localLike = stored[currentFilm.id]?.like;

      if (localLike) {
        setLikeArray(localLike); // Ưu tiên like local
      } else {
        setLikeArray(currentFilm.like || []); // Không có thì dùng DB
      }

      setIsPendingUpdate(Boolean(localLike));
    }, [currentFilm.id, currentFilm.like]);

    // Sau mỗi 1 phút, kiểm tra các phim trong likedPending, nếu đã đủ 1 ngày thì lưu
    useEffect(() => {
      if (!isPendingUpdate) return;

      const interval = setInterval(() => {
        const stored = JSON.parse(localStorage.getItem("likedPending")) || {};
        let updated = false;

        Object.entries(stored).forEach(([filmId, data]) => {
          const timePassed = Date.now() - data.timestamp;

          if (timePassed >= ONE_DAY_MS && navigator.onLine) {
            fetch(`${API_URL}/phim/${filmId}/updateLikes`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ like: data.like }),
            })
              .then((res) => res.json())
              .then(() => {
                delete stored[filmId];
                updated = true;
                if (parseInt(filmId) === currentFilm.id) {
                  setIsPendingUpdate(false);
                }
                localStorage.setItem("likedPending", JSON.stringify(stored));
              })
              .catch((err) => console.error("Lỗi gửi like:", err));
          }
        });

        // Nếu không còn phim nào đang chờ, tắt cập nhật
        if (Object.keys(stored).length === 0 && updated) {
          clearInterval(interval);
        }
      }, 5 * 60 * 1000); // kiểm tra mỗi 5 phút

      return () => clearInterval(interval);
    }, [isPendingUpdate, currentFilm.id]);

    return { likeArray, handleLike };
  };

  // Hook để xử lý Comment
  export const useComment = (currentFilm, dataUser , id_param) => {
        const [comments, setComments] = useState([]);
        const [newComment, setNewComment] = useState("");
        const [loadingComment, setLoadingComment] = useState(false);
        const userName = dataUser.username
        const userAvt = dataUser.avatar
    
        useEffect(() => {
          if (currentFilm) {
            setComments(currentFilm.comment || []);
          }
        }, [currentFilm]);
      
        const handleAddComment = async () => {
          if (!newComment.trim()) return;
        
          setLoadingComment(true);
        
          try {
            const response = await fetch(`${API_URL}/phim/${id_param}/comment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                tenTk: userName, // Sau này thay bằng user đăng nhập
                avt: userAvt ? userAvt : 'https://placehold.co/40x40', // Avatar mặc định hoặc từ user
                cmt: newComment,
              }),
            });
        
            if (response.ok) {
              const data = await response.json();
              setComments(prev => [...prev, data.newComment]); // Cập nhật danh sách bình luận
              setNewComment(""); // Xóa nội dung nhập
            } else {
              console.error("Lỗi khi gửi bình luận response:", data.message);
            }
          } catch (error) {
            console.error("Lỗi khi gửi bình luận:", error);
          }
        
          setLoadingComment(false);
        };

        return { comments, loadingComment, handleAddComment, newComment , setNewComment };

  }

  
  