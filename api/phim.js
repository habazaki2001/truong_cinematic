export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // ✅ Cho phép tất cả nguồn
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // CORS preflight
  }

  if (req.method === 'GET') {
    try {
      const response = await fetch("https://cinema-yujd.onrender.com/phim");
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Lỗi server" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
