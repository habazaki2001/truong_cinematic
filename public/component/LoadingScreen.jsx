import React, { useEffect, useState } from "react";

export default function LoadingScreen({ isLoading }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => setIsVisible(false), 500); // Ẩn sau 0.5s
    }
  }, [isLoading]);

  return isVisible ? (
    <div className={`loading_container ${isLoading ? "visible" : "hidden"}`}>
      <p className="loading_text">
        {"Loading...".split("").map((char, index) => (
          <span key={index} className="loading_char" style={{ animationDelay: `${index * 0.1}s` }}>
            {char}
          </span>
        ))}
      </p>
    </div>
  ) : null; // ✅ Xóa hẳn khỏi DOM sau khi ẩn
}
