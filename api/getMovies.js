// api/getMovies.js
export default async function handler(req, res) {
  const response = await fetch("https://cinema-yujd.onrender.com/api/movies");
  const data = await response.json();
  res.status(200).json(data);
}
