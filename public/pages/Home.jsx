import React, { useEffect, useState } from "react";
import { usePhim, formatViews, getTotalViews } from "../component/PhimContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";


// 🟢 Component chung để hiển thị danh sách phim
const PhimList = ({ title, link, phimData, isGrid = true, isSmall = true }) => (
  <section className="sec_content">
    <div className="inner">
      <div className="box_ttl">
        <h3 className="ttl"><FontAwesomeIcon icon="fa-solid fa-film" /> {title}</h3>
        <p className="txt_seen">
          <Link to={link}>Xem tất cả <FontAwesomeIcon icon="fa-solid fa-border-all" /></Link>
        </p>
      </div>
      <div className={`list_content ${isGrid ? "" : "ver"} ${isSmall ? "" : "l_small"}`}>
        {phimData.length > 0 ? (
          phimData.map((p) => (
            <div className="item pic_hv" key={p.id}>
              <Link to={`/XemPhim/${p.slug}/tap-1`} className="link_wrap"></Link>
              <p className="pic"><img src={p.image || "https://placehold.co/600x400/444/FFF?text=Dummy"} alt={p.title} /></p>
              <div className="content">
                <p className="txt">{p.title}</p>
                <p className="txt_info">
                  <span className="txt_seen">{p.view} xem</span>
                  {
                    p.total_episodes > 1 ? (
                      p.total_episodes && <span className="txt_ep">{parseInt(p.trangthai.match(/\d+/)) || 0}/{p.total_episodes} tập</span>
                    ) : (
                      <span className="txt_ep">{p.trangthai}</span>
                    )
                  }
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="no_data">Không tìm thấy phim nào.</p>
        )}
      </div>
    </div>
  </section>
);

export default function Home() {
  const { phim } = usePhim();
  const phimDaXuLy = phim.map(p => ({
    ...p,
    totalViews: getTotalViews(p.tapPhim)
  }));

  return (
    <>
      {/* Phim Đề Cử - Lượt xem cao nhất */}
      <PhimList
        title="Phim đề cử"
        link="/PhimDeCu"
        phimData={[...phimDaXuLy].sort((a, b) => b.totalViews - a.totalViews).slice(0, 9)}
      />

      {/*  Phim Mới Cập Nhật */}
      <PhimList
        title="Phim mới cập nhật"
        link="/PhimMoi"
        phimData={[...phimDaXuLy].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 12)}
        isSmall={false}
      />

      {/* Bảng Xếp Hạng */}
      <section className="sec02">
        <div className="inner">
          <h3 className="ttl"><FontAwesomeIcon icon="fa-solid fa-film" /> Bảng Xếp Hạng</h3>
          <ul className="list_rating">
            {[...phimDaXuLy].sort((a) => a.view).slice(0, 6).map((p) => (
              <li className="item pic_hv" key={p.id}>
                <Link to={`/ChiTiet/${p.id}`} className="pic"><img src={p.image} alt={p.title} /></Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Phim Bộ Mới */}
      <PhimList
        title="Phim Bộ mới"
        link="/PhimBo"
        phimData={[...phimDaXuLy].filter((p) => p.total_episodes > 1).reverse().slice(0, 5)}
        isGrid={false}
      />

      {/* Phim Lẻ Mới */}
      <PhimList
        title="Phim Lẻ mới"
        link="/PhimLe"
        phimData={[...phimDaXuLy].filter((p) => p.total_episodes <= 1).reverse().slice(0, 5)}
        isGrid={false}
      />
    </>
  );
}
