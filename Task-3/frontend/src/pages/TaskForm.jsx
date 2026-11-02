import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client';
import Spinner from '../components/Spinner';

export default function TaskForm() {
  const { id } = useParams(); // If present, we are editing
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    dueDate: ''
  });
  const [isLoading, setIsLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (!isEditing) return;
    const fetchTask = async () => {
      try {
        const data = await apiRequest(`/tasks/${id}`);
        setFormData({
          title: data.task.title,
          description: data.task.description || '',
          status: data.task.status,
          dueDate: data.task.dueDate || ''
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTask();
  }, [id, isEditing]);

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required.';
    if (formData.title.length > 120) errors.title = 'Title must be 120 chars or less.';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    // Clean empty strings to null for the API
    const payload = {
      ...formData,
      description: formData.description || null,
      dueDate: formData.dueDate || null,
    };

    try {
      if (isEditing) {
        await apiRequest(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
      } else {
        await apiRequest('/tasks', { method: 'POST', body: JSON.stringify(payload) });
      }
      navigate('/');
    } catch (err) {
      if (err.details) {
        const apiErrors = {};
        err.details.forEach(d => { apiErrors[d.field] = d.message; });
        setValidationErrors(apiErrors);
      } else {
        setError(err.message);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear validation error when typing
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: null });
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="form-card">
      <h2>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange}
            className={validationErrors.title ? 'input-error' : ''}
          />
          {validationErrors.title && <span className="error-text">{validationErrors.title}</span>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea 
            name="description" 
            rows="3"
            value={formData.description} 
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input 
              type="date" 
              name="dueDate" 
              value={formData.dueDate} 
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')} className="btn btn-outline">Cancel</button>
          <button type="submit" className="btn btn-primary">{isEditing ? 'Save Changes' : 'Create Task'}</button>
        </div>
      </form>
    </div>
  );
}