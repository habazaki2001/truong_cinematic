import { useEffect, useState } from "react";
import axios from "axios";

function Add() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/items").then((res) => setItems(res.data));
  }, []);

  const addItem = () => {
    axios.post("http://localhost:5000/items", { name: newItem }).then((res) => {
      setItems([...items, res.data]);
      setNewItem("");
    });
  };

  return (
    <div>
      <h1>Danh sách Items</h1>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
      <input value={newItem} onChange={(e) => setNewItem(e.target.value)} />
      <button onClick={addItem}>Thêm</button>
    </div>
  );
}

export default Add;
