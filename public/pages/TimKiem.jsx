import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { usePhim, getTotalViews, formatViews  } from "../component/PhimContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default function TimKiem() {
 const { phim } = usePhim();  
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);

    // Lấy từ khóa từ URL
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get("query") || "";

    useEffect(() => {
        if (searchTerm) {
          const results = phim.filter((p) => 
            p.title.includes(searchTerm)
          );
          setSearchResults(results);
        }
      }, [searchTerm, phim]);

  return (
    <section className="sec_filter">
        <div className="inner">
            <div className="box_ttl">
                <h3 className="ttl">
                <FontAwesomeIcon icon="fa-solid fa-film"/> Kết quả tìm kiếm cho: "{searchTerm}"
                </h3>
            </div>
            {searchResults.length > 0 ? (
                <div className="list_content">
                    {searchResults.map((p) => (
                        <div className="item pic_hv" key={p.id}>
                            <Link to={`/XemPhim/${p.slug}.tap-1`} className="link_wrap">{ p.total_episodes == 0 ? <span className="bagde_seen">Đang cập nhật</span> : ''}</Link>
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
                    ))}
                </div>
            ) : (
                <p>Không tìm thấy phim nào.</p>
            )}
        </div>
    </section>
  )
}
