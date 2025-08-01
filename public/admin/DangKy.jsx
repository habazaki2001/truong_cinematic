import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {API_URL}  from "../component/PhimContext";

export default function DangKy() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", avatar: null });
  const [preview, setPreview] = useState(""); // Xem trước ảnh
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files[0];
      setFormData({ ...formData, avatar: file });

      // Hiển thị ảnh trước khi tải lên
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Đang xử lý...");

    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    if (formData.avatar) {
      formDataToSend.append("avatar", formData.avatar);
    }

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Đăng ký thành công! Chuyển hướng...");
        setTimeout(() => navigate("/DangNhap"), 1500); // Chuyển hướng sau 1.5 giây
      } else {
        setError(data.message || "Lỗi khi đăng ký");
      }
    } catch (error) {
      setError("Lỗi kết nối đến server");
      console.error("Lỗi:", error);
    }
  };

  return (
    <section className="sec_login">
      <div className="box_login">
        <p className="pic"><img src="/asset/images/logo.png" width="140" alt="" /></p>
        <h3>Trang Đăng Ký</h3>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
        <form onSubmit={handleSubmit}>
          <p className="item">
            <span>Tên đăng nhập:</span>
            <input type="text" name="username" placeholder="Nhập tên đăng nhập..." onChange={handleChange} required />
          </p>
          <p className="item">
            <span>Nhập email:</span>
            <input type="email" name="email" placeholder="Nhập email..." onChange={handleChange} required />
          </p>
          <p className="item">
            <span>Mật khẩu:</span>
            <input type="password" name="password" placeholder="Nhập mật khẩu 8-24 ký tự" onChange={handleChange} required />
          </p>
          <p className="item">
            <span>Avatar:</span>
            <input type="file" name="avatar" accept="image/*" onChange={handleChange} />
          </p>
          {preview && <p className="limit_img"><img src={preview} alt="Avatar Preview" className="avatar-preview" /></p>}
          <button className="btn_submit" type="submit">Đăng ký</button>
        </form>
      </div>
    </section>
  );
}
