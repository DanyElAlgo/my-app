import React, {useState} from "react";

export default function CategoryItem({item, deleteItem }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div key={item.id} className="item">
      <h2>{item.name}</h2>
      {/* <button className="button block" onClick={() => setShowModal(true)}>
        Update Item
      </button> */}
      <button className="button block" onClick={() => deleteItem(item.id)}>
        Delete Item
      </button>
    </div>
  );
}