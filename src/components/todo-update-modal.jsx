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
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Category:</label>
            <select
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
            <button type="submit" className="button primary">Save</button>
            <button type="button" className="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}