import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../api/client';
import Spinner from '../components/Spinner';

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await apiRequest(`/tasks/${id}`);
        setTask(data.task);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  if (isLoading) return <Spinner />;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!task) return <div>Task not found.</div>;

  return (
    <div className="detail-card">
      <Link to="/" className="back-link">&larr; Back to tasks</Link>
      <div className="task-header">
        <h2>{task.title}</h2>
        <span className={`badge badge-${task.status}`}>{task.status.replace('_', ' ')}</span>
      </div>
      
      <div className="detail-meta">
        <p><strong>Due Date:</strong> {task.dueDate || 'None'}</p>
        <p><strong>Created:</strong> {new Date(task.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="detail-body">
        <h4>Description</h4>
        <p>{task.description || 'No description provided.'}</p>
      </div>

      <div className="task-actions mt-4">
        <button onClick={() => navigate(`/tasks/${task.id}/edit`)} className="btn btn-primary">Edit Task</button>
      </div>
    </div>
  );
}