import React, { useState } from 'react';
import "./todo-update-modal.css";

export default function CategoryUpdateModal({ item, onClose, onUpdate }) {
  const [name, setName] = useState(item.name || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(item.id, name);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
            className="form-input block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button type="submit" 
            className="button block bg-blue-900 hover:bg-blue-700 text-white py-2 px-4 rounded dark:bg-blue-600 dark:hover:bg-blue-600"
            >Save</button>
            <button type="button" 
            className="button block bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded dark:bg-gray-600 dark:hover:bg-gray-600"
            onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}