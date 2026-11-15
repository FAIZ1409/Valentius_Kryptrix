import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiRequest } from '../api/client';
import Spinner from '../components/Spinner';

export default function BookmarkForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: '', url: '', description: '', categoryId: '' });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(isEditing);

  // State for inline category creation
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    apiRequest('/categories').then(data => setCategories(data.categories)).catch(() => {});
    if (isEditing) {
      apiRequest(`/bookmarks/${id}`)
        .then(data => {
          setFormData({
            title: data.bookmark.title,
            url: data.bookmark.url,
            description: data.bookmark.description || '',
            categoryId: data.bookmark.categoryId || ''
          });
        })
        .catch(err => setError(err.message))
        .finally(() => setIsLoading(false));
    }
  }, [id, isEditing]);

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required.';
    if (!formData.url.trim()) errors.url = 'URL is required.';
    if (formData.url && !formData.url.startsWith('http')) errors.url = 'URL must start with http:// or https://';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Function to create a new category on the fly
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const data = await apiRequest('/categories', {
        method: 'POST',
        body: JSON.stringify({ name: newCategoryName })
      });
      setCategories([...categories, data.category]); // Add to list
      setFormData({ ...formData, categoryId: data.category.id }); // Auto-select it
      setIsAddingCategory(false);
      setNewCategoryName('');
    } catch (err) {
      alert("Failed to create category: " + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    const payload = { ...formData, categoryId: formData.categoryId || null };

    try {
      if (isEditing) {
        await apiRequest(`/bookmarks/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
      } else {
        await apiRequest('/bookmarks', { method: 'POST', body: JSON.stringify(payload) });
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="form-card">
      <h2>{isEditing ? 'Edit Bookmark' : 'Add Bookmark'}</h2>
      {error && <div className="alert alert-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          {validationErrors.title && <span className="error-text">{validationErrors.title}</span>}
        </div>
        
        <div className="form-group">
          <label>URL *</label>
          <input type="text" placeholder="https://..." value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} />
          {validationErrors.url && <span className="error-text">{validationErrors.url}</span>}
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', justifyContent: 'space-between' }}>
            Category 
            <button type="button" onClick={() => setIsAddingCategory(!isAddingCategory)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem' }}>
              {isAddingCategory ? 'Cancel' : '+ Add New'}
            </button>
          </label>
          
          {isAddingCategory ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="text" placeholder="e.g. Fiction, Tech..." value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} />
              <button type="button" onClick={handleCreateCategory} className="btn btn-primary btn-sm">Save</button>
            </div>
          ) : (
            <select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
              <option value="">-- No Category --</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')} className="btn btn-outline">Cancel</button>
          <button type="submit" className="btn btn-primary">{isEditing ? 'Save Changes' : 'Save Bookmark'}</button>
        </div>
      </form>
    </div>
  );
}
