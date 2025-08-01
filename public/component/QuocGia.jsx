// import React, { useState } from "react";
// import { useParams } from "react-router-dom";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { usePhim, getTotalViews, formatViews, usePagination, normalizeString } from "./PhimContext";
// import { Link } from 'react-router-dom';

// export default function QuocGia() {
//   const { filter } = useParams();
//   const { phim } = usePhim();
//   // Lọc phim theo bộ lọc
//   let phimHienThi = [...phim];
//   if (filter) {
//     phimHienThi = phimHienThi.filter((p) => normalizeString(p.quocgia).join("") === filter);
//   } else {
//     phimHienThi 
//   }

//   const { currentPage, totalPages, dataPaginated: phimTrangHienTai, goToPage } = usePagination(phimHienThi, 12);
//   return (
//     <section className="sec_filter">
//       <div className="inner">
//         <div className="box_ttl">
//           <h3 className="ttl">
//             <FontAwesomeIcon icon="fa-solid fa-film" /> Quốc Gia
//           </h3>
//         </div>

//         <div className="list_content">
//           {phimTrangHienTai.length > 0 ? (
//             phimTrangHienTai.map((p) => (
//               <div className="item pic_hv" key={p.id}>
//                 <Link to={`/XemPhim/${p.episodes[0].iframe_url.replace("https://subnhanhd.com/xem-phim/", "")}`} className="link_wrap">{ p.total_episodes == 0 ? <span className="bagde_seen">Đang cập nhật</span> : ''}</Link>
//                 <p className="pic">
//                   <img src={p.image || "https://placehold.co/600x400/444/FFF?text=Dummy"} alt={p.title} />
//                 </p>
//                 <div className="content">
//                   <p className="txt">{p.title}</p>
//                   <p className="txt_info">
//                     <span className="txt_seen">{p.view} xem</span>
//                     <span className="txt_ep">{p.total_episodes} tập</span>
//                   </p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="no_data">Không tìm thấy phim nào phù hợp.</p>
//           )}
//         </div>

//         {/* Phân trang */}
//         {totalPages > 1 && (
//           <div className="pagination">
//             <button className="pag_txt" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
//               Trang trước
//             </button>
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//               <button key={p} onClick={() => goToPage(p)} className={`pag_num ${currentPage === p ? "active" : ""}`}>
//                 {p}
//               </button>
//             ))}
//             <button className="pag_txt" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
//               Trang sau
//             </button>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

import ListPhimFiler from "./ListPhimFiler";
export default function QuocGia() {
  return (
    <ListPhimFiler filterFilm="Quốc Gia" />
  );
}

