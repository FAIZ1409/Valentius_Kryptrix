import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client';

export default function BookmarkForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', url: '', description: '', categoryId: '' });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // Fetch categories for the dropdown
    apiRequest('/categories').then(data => setCategories(data.categories)).catch(() => {});
  }, []);

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required.';
    if (!formData.url.trim()) errors.url = 'URL is required.';
    // Basic URL validation
    if (formData.url && !formData.url.startsWith('http')) errors.url = 'URL must start with http:// or https://';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    try {
      await apiRequest('/bookmarks', { 
        method: 'POST', 
        body: JSON.stringify({
          ...formData,
          categoryId: formData.categoryId || null
        }) 
      });
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-card">
      <h2>Add Bookmark</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input type="text" name="title" value={formData.title} 
                 onChange={e => setFormData({...formData, title: e.target.value})} />
          {validationErrors.title && <span className="error-text">{validationErrors.title}</span>}
        </div>
        <div className="form-group">
          <label>URL *</label>
          <input type="text" name="url" placeholder="https://..." value={formData.url} 
                 onChange={e => setFormData({...formData, url: e.target.value})} />
          {validationErrors.url && <span className="error-text">{validationErrors.url}</span>}
        </div>
        <div className="form-group">
          <label>Category</label>
          <select name="categoryId" value={formData.categoryId} 
                  onChange={e => setFormData({...formData, categoryId: e.target.value})}>
            <option value="">-- No Category --</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')} className="btn btn-outline">Cancel</button>
          <button type="submit" className="btn btn-primary">Save Bookmark</button>
        </div>
      </form>
    </div>
  );
}
