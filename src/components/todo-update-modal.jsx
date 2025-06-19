import React, { useState } from 'react';
import "./todo-update-modal.css";

export default function TodoUpdateModal({ item, categories, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    title: item.title,
    description: item.description,
    category_fk: item.category_fk
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      ...item,
      ...formData
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update Todo Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
            className="form-input block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              className="form-input block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              rows="4"
              placeholder="Optional description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Category:</label>
            <select
              className="form-select block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={formData.category_fk || ''}
              onChange={(e) => setFormData({...formData, category_fk: e.target.value})}
            >
              <option value="">Uncategorized</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
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