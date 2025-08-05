// api/getMovies.js
export default async function handler(req, res) {
  const response = await fetch("https://truong-cinematic.vercel.app/api/getMovies");
  const data = await response.json();
  res.status(200).json(data);
}
