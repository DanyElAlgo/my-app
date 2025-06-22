import React, {useState} from "react";
import CategoryUpdateModal from "./category-update-modal";

export default function CategoryItem({item, deleteItem, updateItem }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div key={item.id} className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm m-4 dark:bg-gray-800 dark:border-gray-700 min-w-50">
      <h2 className="text-center text-xl font-bold">{item.name}</h2>
      <button className="my-1 button block bg-blue-900 hover:bg-blue-700 text-white py-2 px-4 rounded dark:bg-blue-800 dark:hover:bg-blue-600" onClick={() => setShowModal(true)}>
        Update Item
      </button>
      <button className="my-1 button block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" 
      onClick={() => deleteItem(item.id)}>
        Delete Item
      </button>
            {showModal && (
              <CategoryUpdateModal
                item={item}
                onClose={() => setShowModal(false)}
                onUpdate={updateItem}
              />
            )}
    </div>
  );
}