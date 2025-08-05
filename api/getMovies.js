export default async function handler(req, res) {
  if (req.method === 'GET') {
    if (req.url?.startsWith('/api/getMovies')) {
      try {
        const response = await fetch('https://cinema-yujd.onrender.com/phim');
        const data = await response.json();
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy dữ liệu phim' });
      }
    } else {
      res.status(404).json({ error: 'Không tìm thấy route' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
