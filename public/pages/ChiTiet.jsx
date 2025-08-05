import React, { useEffect, useState } from "react";
import { useParams, Navigate, useLocation, useNavigate   } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link  } from 'react-router-dom';
import {usePhim} from '../component/PhimContext'
import { normalizeString ,isAuthenticated , API_URL, VideoPlayer, useLike , useComment } from "../component/PhimContext";



export default function ChiTiet() {
  if (!isAuthenticated()) return <Navigate to="/DangNhap" />;
  const location = useLocation(); 
  const match = location.pathname.match(/tap-(\d+)/);
  const episodeNumber = match ? parseInt(match[1], 10) : null;
  const slug = useParams().slug;
  const { phim } = usePhim();
  const currentFilm = phim.find(item => item.slug === slug);
  const currentEp = currentFilm?.episodes.find(ep => ep.episode === episodeNumber);
  const videoId = currentEp?.m3u8_url;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tab01");
  const userId = JSON.parse(localStorage.getItem("user")).id || null;
  // function to change Episode  
  const handleEpChange = (ep) => {
    const newPath = location.pathname.replace(/tap-\d+(-sv-\d+)?/, `tap-${ep}$1`);
    navigate(newPath);
  }
  
  const handleTabs = (tab) => {
    setActiveTab(tab);
  }

  // Hook and function to handle Like  
  const { likeArray, handleLike } = useLike(currentFilm, userId);

  // Hook and function to handle comments
  const user = JSON.parse(localStorage.getItem(`user`));
  const userName = user.username
  const userAvt = user.avatar
  const id_param = currentFilm.id;
  const {comments, loadingComment, handleAddComment, newComment ,setNewComment } = useComment(currentFilm, user, id_param);
    
  useEffect(() => {
    fetch(`${API_URL}/phim/${slug}/updateView`, {
      method: "POST",
    });
  }, [slug]);

  if (!phim) {
    return <p>Loading...</p>; 
  }
  return (
    <section className="sec03">
         <div className="inner">
              <div className="list_block">
                {
                  currentFilm && (
                    <div className="block01">
                        <div className="box_vid">
                          {
                            videoId ?(
                              <VideoPlayer src={videoId} />
                            ) : (
                              <p>Video đang tải...</p> 
                            )
                          }
                        </div>
                        <div className="list_action">
                            <div className="item">
                                <p className="txt"><span className="txt_handle" onClick={handleLike}><span className="wrap"><FontAwesomeIcon icon="fa-solid fa-heart"/>{likeArray.includes(userId) ? "Bỏ Thích" : "Thích"}</span><span className="count">{likeArray.length}</span></span></p> 
                            </div>
                            <div className="item">
                                <p className="txt">
                                  {
                                    episodeNumber + 1 <= currentFilm?.episodes.length && (
                                      <span className="txt_handle" onClick={() => { handleEpChange(episodeNumber + 1); setActiveTab("tab01"); }}>
                                        Tập tiếp theo<FontAwesomeIcon icon="fa-solid fa-forward-step"/>
                                      </span>
                                    )
                                  }
                                </p>
                            </div>
                        </div>
                        <div className="content">
                            <p className="txt_01">  {currentFilm?.title} -  {currentEp ? `Tập: ${currentEp.episode} / ${currentFilm?.total_episodes ?? "?"}` : "Đang cập nhật"}</p>
                            <p className="txt_02">Lượt xem: {currentFilm?.view || 0}</p>
                            <div className="block_tab">
                                <div className="list_tab">
                                    <p className={activeTab === "tab01" ? 'tab active' : 'tab'} onClick={() => handleTabs('tab01')}>Thông tin</p>
                                    <p className={activeTab === "tab02" ? 'tab active' : 'tab'} onClick={() => handleTabs('tab02')}>Danh sách tập</p>
                                    <p className={activeTab === "tab03" ? 'tab active' : 'tab'} onClick={() => handleTabs('tab03')}>Bình luận</p>
                                </div>
                                <div className="list_tab_content">
                                  {/* tab01 */}
                                    <div className="tab_content" id="tab01" style={{ display: activeTab === "tab01" ? "block" : "none" }}>
                                    <div className="box_info">
                                            <p className="txt_info">Quốc gia: <Link to={`../QuocGia/${normalizeString(currentFilm.quocgia[0])}`} className="link">{currentFilm.quocgia ? currentFilm.quocgia[0] : "Đang cập nhật"}</Link></p>
                                            <p className="txt_info">Năm phát hành: {currentFilm.quocgia}</p>
                                            <p className="txt_info">Chất lượng: HD</p>
                                            <p className="txt_info">Âm thanh: Vietsub</p>
                                            <p className="txt_info">Cập nhật: {currentFilm.trangthai}</p>
                                            <p className="txt_info">Thể loại: {currentFilm.theloai ? currentFilm.theloai.join(", ") : "Không có thể loại"}</p>
                                            <p className="txt_info">{currentFilm.title}</p>
                                    </div>
                                    </div>
                                  {/* tab02 */}
                                    <div className="tab_content" id="tab02" style={{ display: activeTab === "tab02" ? "block" : "none" }}>
                                        <div className="box_ep">
                                            <p className="count_ep"><span>{currentEp ? `${currentEp.episode} - ${currentFilm?.total_episodes ?? "?"}` : "Đang cập nhật"}</span></p>
                                            <ul className="list_link_ep">
                                            {currentFilm?.episodes?.length > 0 ? (
                                                <ul className="list_link_ep">
                                                  {currentFilm.episodes.map((tap, index) => (
                                                    <li key={tap.episode || index} className={`item ${currentEp?.episode === tap.episode ? "active" : ""}`}
                                                      onClick={() => handleEpChange(tap.episode)}> 
                                                      <span className="num_ep">Tập {tap.episode}</span>
                                                      <span className="num_rate">{currentFilm.view}</span>
                                                    </li>
                                                  ))}
                                                </ul>
                                              ) : (
                                                <p className="no_tap">Chưa có tập phim nào.</p>
                                              )}
                                            </ul>
                                        </div>
                                    </div>
                                  {/* tab03 */}
                                    <div className="tab_content" id="tab03" style={{ display: activeTab === "tab03" ? "block" : "none" }}>
                                        <div className="box_comment">
                                            <div className="user_cmt">
                                                <p className="avt" style={{padding: userAvt ? "0" : "10px"}}><img width="40" height='40' src={`${userAvt}` || <FontAwesomeIcon icon="fa-solid fa-user"/> } alt="Avatar"/></p>
                                                <div className="txt_cmt">
                                                    <textarea
                                                      placeholder="Nhập bình luận..."
                                                      value={newComment}
                                                      onChange={(e) => setNewComment(e.target.value)}
                                                    />
                                                </div> 
                                                <button className="btn_click" onClick={(e) => { e.stopPropagation(); handleAddComment(); }} disabled={loadingComment}>
                                                  {loadingComment ? "Đang gửi..." : "Gửi"}
                                                </button>
                                            </div>
                                            {/* <div className="user_cmt">
                                                <p className="txt_cmt"><input type="text" value="Phim hay coi ghiền ngay"/></p>
                                            </div> */}
                                            <ul className="list_cmt">
                                                {comments.map((cmt, index) => (
                                                  <li key={index} className="item">
                                                    <p className="avt" style={{padding: cmt.avt ? "0" : "10px"}}><img width="40" height='40' src={`${cmt.avt}` || <FontAwesomeIcon icon="fa-solid fa-user"/> } alt="Avatar"/></p>
                                                      <p className="des">{cmt.cmt}</p>
                                                  </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  )
                }
                  <div className="block02">
                      <div className="list_film">
                        {[...phim]
                        .sort((a) => a.view) 
                        .slice(0, 9) 
                        .map((p) => (
                            <div className="item" key={p.id}>
                              <p className="pic"><img src={p.image || "https://placehold.co/600x400/444/FFF?text=Dummy"} alt={p.title} /></p>
                              <div className="content">
                                  <p className="txt" onClick={() => setActiveTab("tab01")}><Link className="link_chiTiet" to={`/XemPhim/${p.slug}/tap-1`}>{p.title}</Link></p>
                                  <p className="txt_02">{p.total_episodes} tập</p>
                                  <p className="txt_02">{p.theloai.join(", ")}</p>
                              </div>
                            </div>
                        ))}
                      </div>
                  </div>
              </div>
          </div>
    </section>
  )
}


