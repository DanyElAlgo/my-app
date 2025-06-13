import React, {useState} from "react";
import TodoUpdateModal from "./todo-update-modal";

export default function TodoItem({item, updateItem, deleteItem, categories}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div key={item.id} className="item">
      <h2>{item.title}</h2>
      <p>{item.description}</p>
      <p>Category: {item.category}</p>
      <p>Creation Date: {new Date(item.creation_date).toLocaleDateString()}</p>
      <button className="button block" onClick={() => setShowModal(true)}>
        Update Item
      </button>
      <button className="button block" onClick={() => deleteItem(item.id)}>
        Delete Item
      </button>

      {showModal && (
        <TodoUpdateModal
          item={item}
          categories={categories}
          onClose={() => setShowModal(false)}
          onUpdate={updateItem}
        />
      )}
    </div>
  );
}