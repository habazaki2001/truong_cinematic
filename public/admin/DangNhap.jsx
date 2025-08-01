import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {API_URL}  from "../component/PhimContext";

export default function DangNhap() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Đang đăng nhập...");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Đăng nhập thành công! Đang chuyển hướng...");
        localStorage.setItem("token", data.token); // Lưu token vào localStorage
        localStorage.setItem("user", JSON.stringify(data.user)); // Lưu thông tin user
        setTimeout(() => navigate("/"), 1500); // Chuyển hướng sau 1.5 giây
      } else {
        setError(data.message || "Lỗi khi đăng nhập");
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
        <h3>Trang Đăng Nhập</h3>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
        <form onSubmit={handleSubmit}>
          <p className="item">
            <span>Tên đăng nhập:</span>
            <input type="text" name="username" placeholder="Nhập tên đăng nhập..." onChange={handleChange} required />
          </p>
          <p className="item">
            <span>Mật khẩu:</span>
            <input type="password" name="password" placeholder="Nhập mật khẩu..." onChange={handleChange} required />
          </p>
          <button className="btn_submit" type="submit">Đăng nhập</button>
        </form>
        <p className="txt">Chưa có tài khoản? <Link to="/DangKy" className="link">Đăng ký</Link></p>
      </div>
    </section>
  );
}
