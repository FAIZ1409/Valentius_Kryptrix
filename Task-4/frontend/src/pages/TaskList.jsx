import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client';
import Spinner from '../components/Spinner';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await apiRequest('/tasks');
      setTasks(data.tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await apiRequest(`/tasks/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== id)); // Optimistic UI update
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading) return <Spinner />;
  if (error) return <div className="alert alert-error">Error: {error}</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Your Tasks</h2>
        <Link to="/tasks/new" className="btn btn-primary">+ New Task</Link>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks found. Create one to get started!</p>
        </div>
      ) : (
        <div className="task-grid">
          {tasks.map(task => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <h3>{task.title}</h3>
                <span className={`badge badge-${task.status}`}>{task.status.replace('_', ' ')}</span>
              </div>
              <p className="task-desc">{task.description || 'No description provided.'}</p>
              
              <div className="task-actions">
                <button onClick={() => navigate(`/tasks/${task.id}`)} className="btn btn-sm">View</button>
                <button onClick={() => navigate(`/tasks/${task.id}/edit`)} className="btn btn-sm">Edit</button>
                <button onClick={() => handleDelete(task.id)} className="btn btn-sm btn-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}