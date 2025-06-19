import React, { useEffect, useState } from "react";
import TodoUpdateModal from "./todo-update-modal";
import "../index.css";

export default function TodoItem({ item, updateItem, deleteItem, categories }) {
  const [showModal, setShowModal] = useState(false);
  const [toDelete, setToDelete] = useState(false);

  useEffect(() => {
    setToDelete(false);
  }, []);

  return (
    <div key={item.id} className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm m-4 dark:bg-gray-800 dark:border-gray-700">
      <h2>{item.title}</h2>
      <p>{item.description}</p>
      <p>Category: {item.category}</p>
      <p>Creation Date: {new Date(item.creation_date).toLocaleDateString()}</p>
      <button className="m-1 button block bg-blue-900 hover:bg-blue-700 text-white py-2 px-4 rounded dark:bg-blue-800 dark:hover:bg-blue-600" onClick={() => setShowModal(true)}>
        Update Item
      </button>
      {!toDelete ? (
        <>
          <button
            className="m-1 button block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded dark:bg-red-800 dark:hover:bg-red-600"
            onClick={() => {
              setToDelete(true);
            }}
          >
            Delete Item
          </button>
        </>
      ) : (
        <>
          <label>Are you sure to delete this task?</label>
          <div className="flex">
            <button onClick={() => deleteItem(item.id)} className="button block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
            <button
              className="button block bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                setToDelete(false);
              }}
            >
              Cancel
            </button>
          </div>
        </>
      )}
      {item.is_completed? (
      <button className="m-1 button block bg-green-900 hover:bg-green-700 text-white py-2 px-4 rounded dark:bg-green-800 dark:hover:bg-green-600" onClick={() => setShowModal(true)}>
        DONE
      </button>
      ) : (
      <button className="m-1 button block bg-gray-900 hover:bg-gray-700 text-white py-2 px-4 rounded dark:bg-gray-700 dark:hover:bg-gray-600" onClick={() => setShowModal(true)}>
        NOT DONE
      </button>
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
