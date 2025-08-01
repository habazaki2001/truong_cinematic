import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select"; 
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { API_URL} from "../component/PhimContext";

const Admin = () => {
  const [phimList, setPhimList] = useState([]);
  const [formData, setFormData] = useState({
    movie_url: "",
    comment: [
      {
        id: 0,
        avt: "",
        tenTk: "",
        cmt: ""
      }
    ],
    createdAt: new Date(),
    daodien : "",
    dienvien: "",
    episodes: [
      {
        episode: 0,
        iframe_url: "",
        m3u8_url: "",
        server: 0
      }
    ],
    id: 0,
    image: "",
    like: [],
    namsanxuat: "",
    ngonngu: "",
    quocgia: [],
    slug: "",
    theloai: [],
    thoiluong: "",
    tinhtrang: "",
    title: "",
    total_episodes: 0,
    trangthai: "",
    updatedAt: new Date(),
    view: 0
  });
  const [editingId, setEditingId] = useState(null);
// Pagination state
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 6;

  useEffect(() => {
    axios.get(`${API_URL}/phim`).then((res) => setPhimList(res.data));
  }, []);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    if (e.target.name === "theloai" || e.target.name === "quocgia" ) {
      const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
      setFormData({ ...formData, [e.target.name]: selectedOptions });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };
  
  const ListTheLoai = [
    { value: "Hành Động", label: "Hành Động" },
    { value: "Phiêu Lưu", label: "Phiêu Lưu" },
    { value: "Kinh Dị", label: "Kinh Dị" },
    { value: "Tình Cảm", label: "Tình Cảm" },
    { value: "Hoạt Hình", label: "Hoạt Hình" },
    { value: "Giật Gân", label: "Giật Gân" },
    { value: "Sinh tồn", label: "Sinh tồn" },
    { value: "Khoa học viễn tưởng", label: "Khoa học viễn tưởng" },
    { value: "Chính kịch", label: "Chính kịch" },
    { value: "Lãng mạn", label: "Lãng mạn" },
    { value: "Lịch sử", label: "Lịch sử" }
  ];

  const ListQG = [
    { value: "Trung Quốc", label: "Trung Quốc" },
    { value: "Hàn Quốc", label: "Hàn Quốc" },
    { value: "Nhật Bản", label: "Nhật Bản" },
    { value: "Thái Lan", label: "Thái Lan" },
    { value: "Việt Nam", label: "Việt Nam" },
    { value: "Ấn Độ", label: "Ấn Độ" },
    { value: "Anh", label: "Anh" },
    { value: "Pháp", label: "Pháp" },
    { value: "Tây Ban Nha", label: "Tây Ban Nha" },
    { value: "Ý", label: "Ý" },
    { value: "Mỹ", label: "Mỹ" },
    { value: "Đức", label: "Đức" },
    { value: "Canada", label: "Canada" },
    { value: "Úc", label: "Úc" },
    { value: "Nga", label: "Nga" },
    { value: "Mexico", label: "Mexico" },
    { value: "Brazil", label: "Brazil" },
    { value: "Đài Loan", label: "Đài Loan" },
    { value: "Hồng Kông", label: "Hồng Kông" },
    { value: "Âu Mỹ", label: "Âu Mỹ" },
    { value: "Châu Á", label: "Châu Á" },
    { value: "Quốc Gia Khác", label: "Quốc Gia Khác" }
  ];


  // Xử lý thay đổi trong danh sách tập phim
  const handleTapChange = (index, field, value) => {
    const newTaps = [...formData.episodes];
     newTaps[index] = {
      ...newTaps[index],
      [field]: (field === "episode" || field === "server") ? Number(value) : value
    };
    setFormData({ ...formData, episodes: newTaps });
  };

  // Thêm tập mới
  const addTap = () => {
    setFormData((prevData) => ({
      ...prevData,
      episodes: [...prevData.episodes, { episode: 0, iframe_url: "", m3u8_url: "", server: 0}],
    }));
  };

  // Xóa tập
  const removeTap = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      episodes: prevData.episodes.filter((_, i) => i !== index),
    }));
  };


  // Thêm hoặc cập nhật phim
  const handleSubmit = async (e) => {
    e.preventDefault();
    const lastId = phimList.length > 0 ? Math.max(...phimList.map(p => p.id)) : 0;
    const newId = lastId + 1;
    const updatedFormData = editingId ? { ...formData} : { ...formData, id: newId};

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Không tìm thấy token!");
        return;
      }

      const config = { headers: { "Content-Type": "application/json",Authorization: `Bearer ${token}`} };

      if (editingId) {
        await axios.put(`${API_URL}/update/${editingId}`, updatedFormData, config);
        setEditingId(null);
      } else {
        await axios.post(`${API_URL}/addphim`, updatedFormData, config);
      }

      const res = await axios.get(`${API_URL}/phim`);
      setPhimList(res.data);
  
      setFormData({
        movie_url: "",
        comment: [
          {
            id: 0,
            avt: "",
            tenTk: "",
            cmt: ""
          }
        ],
        createdAt: new Date(),
        daodien : "",
        dienvien: "",
        episodes: [
          {
            episode: 0,
            iframe_url: "",
            m3u8_url: "",
            server: 0
          }
        ],
        id: 0,
        image: "",
        like: [],
        namsanxuat: "",
        ngonngu: "",
        quocgia: [],
        slug: "",
        theloai: [],
        thoiluong: "",
        tinhtrang: "",
        title: "",
        total_episodes: 0,
        trangthai: "",
        updatedAt: new Date(),
        view: 0
      });
    } catch (error) {
      console.error("Lỗi khi gửi request:", error.response?.data || error.message);
    }
  };

  // Xóa phim
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa phim này không?")) {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { "Content-Type": "application/json",Authorization: `Bearer ${token}`} };

        await axios.delete(`${API_URL}/delete/${id}`, config);
        alert("Phim đã được xóa thành công!");
  
        // Cập nhật danh sách phim sau khi xóa
        const res = await axios.get(`${API_URL}/phim`);
        setPhimList(res.data);
      } catch (error) {
        console.error("Lỗi khi xóa phim:", error.response?.data || error.message);
      }
    }
  };

  // Chỉnh sửa phim
  const handleEdit = (phim) => {
    setFormData(phim);
    setEditingId(phim.id);
  };

    // Pagination logic
    const totalPages = Math.ceil(phimList.length / itemsPerPage);
    const reversedPhimList = [...phimList].reverse();
    const currentPageData = reversedPhimList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Chuyển trang
    const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    };

    const customStyles = {
        control: (provided) => ({
          ...provided,
          backgroundColor: "#444", // Màu nền cho control (khung chọn)
          color: "#ccc", // Màu chữ của control
          fontSize: "15px", // Kích thước chữ trong control
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isFocused ? "#555" : "#444", // Màu nền của option
          color: state.isFocused ? "#fff" : "#ccc", // Màu chữ của option
          fontSize: "15px", // Kích thước chữ của option
          padding: "10px", // Padding cho option
        }),
        menu: (provided) => ({
          ...provided,
          backgroundColor: "#444", // Màu nền khi hover vào option
        }),
        menuList: (provided) => ({
          ...provided,
          backgroundColor: "#444", // Màu nền khi option được chọn
        }),
      };

  return (
    <section className="sec_login">
      <div className="box_login admin_container">
      <p className="btn_back"><Link to="/"><FontAwesomeIcon icon="fa-solid fa-left-long"/> Back Home</Link></p>
        <p className="pic">
          <img src="/asset/images/logo.png" width="140" alt="" />
        </p>
        <h3>Quản Lý Phim</h3>
        <form onSubmit={handleSubmit} className="admin-form">
          <p className="item">
            <span>Tên Phim:</span>
            <input type="text" name="title" value={formData.title} onChange={handleChange} />
          </p>
          <div className="item">
            <span>Quốc Gia:</span>
            <Select
              className="custom_select"
              classNamePrefix="custom_sl_P"
              styles={customStyles}
              name="quocgia"
              isMulti
              options={ListQG}
              value={formData.quocgia.map((item) => ({ value: item, label: item }))}
              onChange={(selectedOptions) => {
                setFormData({ ...formData, quocgia: selectedOptions.map((option) => option.value) });
              }}
            />
          </div>
          <div className="item">
            <span>Thể loại:</span>
            <Select
              className="custom_select"
            classNamePrefix="custom_sl_P"
            styles={customStyles}
              name="theloai"
              isMulti
              options={ListTheLoai}
              value={formData.theloai.map((item) => ({ value: item, label: item }))}
              onChange={(selectedOptions) => {
                setFormData({ ...formData, theloai: selectedOptions.map((option) => option.value) });
              }}
            />
          </div>
          <p className="item">
            <span>Lượt thích:</span>
            <input type="number" min="0" name="like" value={formData.like} onChange={handleChange} />
          </p>
          <p className="item">
            <span>Lượt Xem:</span>
            <input type="number" min="0" name="view" value={formData.view} onChange={handleChange} />
          </p>
          <p className="item">
            <span>Năm phát hành:</span>
            <input type="text" name="namsanxuat" value={formData.namsanxuat} onChange={handleChange} />
          </p>
          <p className="item">
            <span>Đạo diễn:</span>
            <input type="text" name="daodien" value={formData.daodien} onChange={handleChange} />
          </p>
          <p className="item">
            <span>Diễn viên:</span>
            <input type="text" name="dienvien" value={formData.dienvien} onChange={handleChange} placeholder="Văn B, Văn A..." />
          </p>
          {/* <p className="item">
            <span>Mô Tả:</span>
            <textarea name="moTa" value={formData.moTa} onChange={handleChange}></textarea>
          </p> */}
          {/* <p className="item col_2">
            <label className="box">
                <span>Phim Bộ:</span>
                <input type="checkbox" name="phimBo" checked={formData.phimBo} onChange={(e) => setFormData({ ...formData, phimBo: e.target.checked })} />
            </label>
            <label className="box">
                <span>Phim Lẻ:</span>
                <input type="checkbox" name="phimLe" checked={formData.phimLe} onChange={(e) => setFormData({ ...formData, phimLe: e.target.checked })} />
            </label>
          </p> */}
          <p className="item">
            <span>Ngôn Ngữ:</span>
            <input type="text" name="ngonngu" value={formData.ngonngu} onChange={handleChange} placeholder="Vietsub - Thuyết Minh"/>
          </p>
          <p className="item">
            <span>Slug:</span>
            <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="slug-phim" />
          </p>
          <p className="item">
            <span>Thời Lượng phim:</span>
            <input type="text" name="thoiluong" value={formData.thoiluong} onChange={handleChange} placeholder="Thời lượng phim" />
          </p>
          <p className="item">
            <span>Tình Trạng:</span>
            <input type="text" name="tinhtrang" value={formData.tinhtrang} onChange={handleChange} placeholder="Tình trạng phim" />
          </p>
          <p className="item">
            <span>Trạng thái phim:</span>
            <input type="text" name="trangthai" value={formData.trangthai} onChange={handleChange} placeholder="tập 15, tập 12...."/>
          </p>
          <p className="item">
            <span>Thumbnail:</span>
            <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="Đường dẫn ảnh"/>
          </p>
          <p className="item">
            <span>Tổng số tập Phim:</span>
            <input type="number" min="0" name="total_episodes" value={formData.total_episodes} onChange={handleChange} />
          </p>
          {formData.episodes.map((tap, index) => (
            <div key={index} className="tap_phim">
              <h4>Tập số: {tap.episode}</h4>
              <p className="item">
                <span>Số tập:</span>
                <input type="number" min="0" value={tap.episode} onChange={(e) => handleTapChange(index, "episode", e.target.value)} />
              </p>
              <p className="item">
                <span>Đường dẫn phụ:</span>
                <input type="text" value={tap.iframe_url} onChange={(e) => handleTapChange(index, "iframe_url", e.target.value)} />
              </p>
              <p className="item">
                <span>Link phim (đuôi .m3u8):</span>
                <input type="text" value={tap.m3u8_url} onChange={(e) => handleTapChange(index, "m3u8_url", e.target.value)} />
              </p>
              <p className="item">
                <span>Sever phim:</span>
                <input type="number" min="0" value={tap.server} onChange={(e) => handleTapChange(index, "server", e.target.value)} />
              </p>
              <button className="btn_submit none_mg" type="button" onClick={() => removeTap(index)}>Xóa</button>
            </div>
          ))}
          <p className="item">
            <span>Thêm tập mới:</span>
            <button className="btn_submit none_mg" type="button" onClick={addTap}>+ Thêm Tập</button>
          </p>
          <button className="btn_submit w100" type="submit">{editingId ? "Cập Nhật" : "Thêm Phim"}</button>
        </form>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên Phim</th>
              <th>Số Tập</th>
              <th>Quốc Gia</th>
              <th>Thể Loại</th>
              <th>Chỉnh sửa</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((phim, index)  => (
              <tr key={phim._id || index}>
                <td>
                  {phim.image ? <img src={phim.image} alt={phim.title} width="50" /> : <img src="https://placehold.co/50x50/444/FFF?text=Dummy" alt="dummy" width="50" />}
                </td>
                <td>{phim.title}</td>
                <td>{phim.total_episodes}</td>
                <td>{phim.quocgia}</td>
                <td>{phim.theloai ? phim.theloai.join(", ") : "Không có thể loại"}</td>
                <td>
                  <div className="wrap_btn">
                    <button className="btn_edit" onClick={() => handleEdit(phim)}>Sửa</button>
                    <button onClick={() => handleDelete(phim.id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="pagination">
            <button className="pag_txt" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Trang trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => handlePageChange(p)} className={`pag_num ${currentPage === p ? "active" : "" }`}>
                {p}
              </button>
            ))}
            <button className="pag_txt" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Trang sau
            </button>
          </div>
        )}
        
      </div>
    </section>
  );
};

export default Admin;
