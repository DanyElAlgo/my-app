import React, {useState} from "react";

export default function CategoryItem({item, deleteItem }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div key={item.id} className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm m-4 dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-center text-xl font-bold">{item.name}</h2>
      {/* <button className="button block" onClick={() => setShowModal(true)}>
        Update Item
      </button> */}
      <button className="button block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => deleteItem(item.id)}>
        Delete Item
      </button>
    </div>
  );
}