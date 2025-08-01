require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());

const isAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).json({ message: "Không có token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }

    req.user = decoded; // Gán user vào request để sử dụng sau này
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token không hợp lệ" });
  }
};

const MONGO_URI = process.env.MONGO_URI;

console.log("🔍 MONGO_URI:", MONGO_URI);
if (!MONGO_URI) {
  console.error("❌ LỖI: Biến môi trường MONGO_URI chưa được định nghĩa!");
  process.exit(1);
}
// Kết nối MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Định nghĩa Schema và Model
// const phimSchema = new mongoose.Schema(
//   {
//     id: Number,
//     tenPhim: String,
//     soTap: Number,
//     quocGia: [String],
//     theLoai: [String],
//     phimBo: Boolean,
//     phimLe: Boolean,
//     anh: String,
//     tapPhim: [
//         {
//             tap: Number,
//             link: String,
//             luotXem: Number,
//         }
//     ],
//     like: Number,
//     comment: [
//       {
//         id: Number,
//         avt: String,
//         tenTk: String,
//         cmt: String
//       }
//     ],
//     nam: Number,
//     moTa: String
//   },
//   { collection: "list_phims" } // Đảm bảo dùng đúng collection trong MongoDB
// );


const phimSchema = new mongoose.Schema(
  {
    movie_url: String,
    comment: [
      {
        id: Number,
        avt: String,
        tenTk: String,
        cmt: String
      }
    ],
    createdAt: Date,
    daodien : String,
    dienvien: String,
    episodes: [
      {
        episode: Number,
        iframe_url: String,
        m3u8_url: String,
        server: Number 
      }
    ],
    id: Number,
    image: String,
    like: [],
    namsanxuat: String,
    ngonngu: String,
    quocgia: [],
    slug: String,
    theloai: [],
    thoiluong: String,
    tinhtrang: String,
    title: String,
    total_episodes: Number,
    trangthai: String,
    updatedAt: Date,
    view: Number
  },
  { collection: "khophim" } // Đảm bảo dùng đúng collection trong MongoDB
);


const Phim = mongoose.model("Phim", phimSchema);

// API lấy danh sách phim
app.get("/phim", async (req, res) => {
  try {
    const data = await Phim.find();
    res.json(data);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phim:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// API lấy phim theo ID 
app.get("/phim/:id", async (req, res) => {
  try {
    const phim = await Phim.findOne({ id: Number(req.params.id) }); // Convert id thành số
    if (!phim) {
      return res.status(404).json({ message: "Phim không tồn tại" });
    }
    res.json(phim);
  } catch (error) {
    console.error(`Lỗi khi lấy phim có ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// API thêm phim mới
app.post("/addphim", isAdmin, async (req, res) => {
  try {
    const {movie_url, comment, createdAt, daodien, dienvien, episodes, id, image, like, namsanxuat, ngonngu, quocgia, slug, theloai, thoiluong, tinhtrang, title, total_episodes, trangthai, updatedAt, view } = req.body;
    const lastPhim = await Phim.findOne().sort({ id: -1 });
    const newId = lastPhim ? lastPhim.id + 1 : 1;
    // Tạo mới phim từ dữ liệu gửi lên
    const newPhim = new Phim({
      movie_url,
      comment,
      createdAt,
      daodien ,
      dienvien,
      episodes,
      id: newId,
      image,
      like,
      namsanxuat,
      ngonngu,
      quocgia,
      slug,
      theloai,
      thoiluong,
      tinhtrang,
      title,
      total_episodes,
      trangthai,
      updatedAt,
      view
    });

    // Lưu phim vào MongoDB
    await newPhim.save();

    res.status(201).json({ message: "Phim đã được thêm thành công!", phim: newPhim });
  } catch (error) {
    console.error("Lỗi khi thêm phim:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// API cập nhật phim theo ID
app.put("/update/:id",isAdmin, async (req, res) => {
  try {
    const phimId = Number(req.params.id);
    const updatedData = req.body;

    const phim = await Phim.findOneAndUpdate({ id: phimId }, updatedData, { new: true });

    if (!phim) {
      return res.status(404).json({ message: "Phim không tồn tại" });
    }

    res.json({ message: "Phim đã được cập nhật thành công!", phim });
  } catch (error) {
    console.error(`Lỗi khi cập nhật phim có ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// API xóa phim theo ID
app.delete("/delete/:id",isAdmin, async (req, res) => {
  try {
    const phimId = Number(req.params.id);
    
    const deletedPhim = await Phim.findOneAndDelete({ id: phimId });

    if (!deletedPhim) {
      return res.status(404).json({ message: "Phim không tồn tại" });
    }

    res.json({ message: "Phim đã được xóa thành công!" });
  } catch (error) {
    console.error(`Lỗi khi xóa phim có ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// API Like phim
app.patch("/phim/:id/updateLikes", async (req, res) => {
  const filmId = req.params.id;
  const newLikeArray = req.body.like;
  try {
    const result = await Phim.findOneAndUpdate(
      { id: filmId },
      { like: newLikeArray },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: "Phim không tìm thấy" });
    }

    res.json({ success: true, film: result });
  } catch (error) {
    console.error("Error updating likes:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

// API thêm bình luận vào phim
app.post("/phim/:id/comment", async (req, res) => {
  const { id } = req.params;
  const { tenTk, avt, cmt } = req.body;

  if (!tenTk || !cmt) {
    return res.status(400).json({ message: "Thiếu thông tin bình luận." });
  }

  try {
    const phim = await Phim.findOne({ id: Number(id) });
    if (!phim) {
      return res.status(404).json({ message: "Phim không tồn tại." });
    }

    const newComment = {
      id: phim.comment.length + 1,
      avt: avt || "", // Avatar có thể rỗng
      tenTk,
      cmt,
    };

    phim.comment.push(newComment);
    phim.markModified('comment'); // thêm dòng này!
    await phim.save();

    res.status(200).json({ message: "Bình luận đã được thêm!", newComment });
  } catch (error) {
    console.error("Lỗi khi thêm bình luận:", error);
    res.status(500).json({ message: "Lỗi server." });
  }
});

// API tăng view phim
app.post("/phim/:slug/updateView", async (req, res) => {
  try {
    const phim = await Phim.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { view: 1 } }, // tăng view lên 1
      { new: true }
    );
    res.json({ success: true, view: phim.view });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});



// USER
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" } 
}, { collection: "users" });


const User = mongoose.model("User", userSchema);

// 🔹 Cấu hình lưu ảnh avatar vào thư mục uploads/
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Tạo tên file theo thời gian
  },
});
const upload = multer({ storage });

// ==================== ĐĂNG KÝ =====================
app.post("/auth/register", upload.single("avatar"), async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : "/uploads/default.jpg"; // Nếu không có ảnh, dùng mặc định

    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) return res.status(400).json({ message: "Email đã được sử dụng" });

    const existingUsernam = await User.findOne({ username });
    if (existingUsernam) return res.status(400).json({ message: "username đã được sử dụng" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, avatar });
    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công!", avatar });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

app.use("/uploads", express.static("uploads"));

// ==================== ĐĂNG NHẬP =====================
app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Tài khoản không tồn tại" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không chính xác" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ 
      token, 
      user: { id: user._id, username: user.username, role: user.role, avatar: user.avatar } 
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});



app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Khởi động server
const PORT = process.env.PORT || 4400;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});


