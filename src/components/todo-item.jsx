import React, { useEffect, useState } from "react";
import TodoUpdateModal from "./todo-update-modal";

export default function TodoItem({ item, updateItem, deleteItem, categories }) {
  const [showModal, setShowModal] = useState(false);
  const [toDelete, setToDelete] = useState(false);

  useEffect(() => {
    setToDelete(false);
  }, []);

  return (
    <div key={item.id} className="item">
      <h2>{item.title}</h2>
      <p>{item.description}</p>
      <p>Category: {item.category}</p>
      <p>Creation Date: {new Date(item.creation_date).toLocaleDateString()}</p>
      <button className="button block" onClick={() => setShowModal(true)}>
        Update Item
      </button>
      {!toDelete ? (
        <>
          <button
            className="button block"
            onClick={() => {
              setToDelete(true);
            }}
          >
            Delete Item
          </button>
        </>
      ) : (
        <>
          <label>Are you sure to delete "{item.title}"</label>
          <div className="flex">
            <button onClick={() => deleteItem(item.id)}>Delete</button>
            <button
              onClick={() => {
                setToDelete(false);
              }}
            >
              Cancel
            </button>
          </div>
        </>
      )}

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
