import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { usePhim, getTotalViews, formatViews,usePagination,normalizeString } from "./PhimContext";
import { Link  } from 'react-router-dom';

export default function ListPhimFiler({filterFilm}) {
    const { filter } = useParams();
    const { phim } = usePhim();

    let phimHienThi = [...phim];

    // Tạo các điều kiện lọc cơ bản
    const isPhimBo = filterFilm === "Phim Bộ";
    const isPhimLe = filterFilm === "Phim Lẻ";
    const isQuocGia = filterFilm === "Quốc Gia";
    const isTheLoai = filterFilm === "Thể Loại";
    const isDeCu = filterFilm === "Phim Đề Cử";
    const isPhimMoi = filterFilm === "Phim Mới Ra Mắt";

    const dsQuocGiaGoc = ["Hàn Quốc", "Nhật Bản", "Trung Quốc", "Tây Ban Nha", "Âu Mỹ", "Anh"];
    const decodeQuocGia = (filter, danhSach) => {
        const normFilter = normalizeString(filter);
        return danhSach.find(qg => normalizeString(qg) === normFilter);
    };
    const nameQuocGia = filter ? `Phim ${decodeQuocGia(filter, dsQuocGiaGoc)}` : 'Quốc Gia Khác';

    // Bắt đầu lọc
    phimHienThi = [...phim];

    // Lọc theo số tập nếu là Phim Bộ / Phim Lẻ
    if (isPhimBo || isPhimLe) {
        phimHienThi = phimHienThi.filter(p => isPhimBo ? p.total_episodes > 1 : p.total_episodes === 1);
    }

    // Lọc theo filter nếu có
    if (filter) {
        if (filter === "new" && (isPhimBo || isPhimLe)) {
            phimHienThi.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        } else if (isTheLoai) {
            if (filter !== "khac") {
                phimHienThi = phimHienThi.filter(p =>
                    normalizeString(p.theloai).includes(normalizeString(filter))
                );
            }
            // nếu "khac" thì giữ nguyên phimHienThi
        } else if (isPhimBo || isPhimLe || isQuocGia) {
            // lọc theo quốc gia
            phimHienThi = phimHienThi.filter(p =>
                normalizeString(p.quocgia).join("") === filter
            );
        } else if (isDeCu) {
            phimHienThi = phimHienThi
              .filter(p => p.view) 
              .sort((a, b) => (b.view || 0) - (a.view || 0)); // view cao nhất trước
        } else if (isPhimMoi) {
            phimHienThi.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        } 
    }


  const { currentPage, totalPages, dataPaginated: phimTrangHienTai, goToPage } = usePagination(phimHienThi, 12);

  return (
    <section className="sec_filter">
      <div className="inner">
        <div className="box_ttl">
          <h3 className="ttl">
            <FontAwesomeIcon icon="fa-solid fa-film"/> { isQuocGia ? nameQuocGia : filterFilm }
          </h3>
        </div>

        <div className="list_content">
          {phimTrangHienTai.length > 0 ? (
            phimTrangHienTai.map((p) => (
              <div className="item pic_hv" key={p.id}>
                <Link to={`/XemPhim/${p.slug}/tap-1`} className="link_wrap">{ p.total_episodes == 0 ? <span className="bagde_seen">Đang cập nhật</span> : ''}</Link>
                <p className="pic">
                  <img src={p.image || "https://placehold.co/600x400/444/FFF?text=Dummy"} alt={p.title} />
                </p>
                <div className="content">
                  <p className="txt">{p.title}</p>
                  <p className="txt_info">
                    <span className="txt_seen">{p.view} xem</span>
                    <span className="txt_ep">{p.total_episodes} tập</span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="no_data">Không tìm thấy phim nào phù hợp.</p>
          )}
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="pagination">
            <button className="pag_txt" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              Trang trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => goToPage(p)} className={`pag_num ${currentPage === p ? "active" : "" }`}>
                {p}
              </button>
            ))}
            <button className="pag_txt" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
              Trang sau
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
