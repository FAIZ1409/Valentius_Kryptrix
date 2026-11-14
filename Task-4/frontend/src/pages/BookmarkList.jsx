import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client';
import Spinner from '../components/Spinner';

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const data = await apiRequest('/bookmarks');
        setBookmarks(data.bookmarks);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this bookmark?')) return;
    try {
      await apiRequest(`/bookmarks/${id}`, { method: 'DELETE' });
      setBookmarks(bookmarks.filter(b => b.id !== id));
    } catch (err) { alert(err.message); }
  };

  if (isLoading) return <Spinner />;
  if (error) return <div className="alert alert-error">Error: {error}</div>;

  return (
    <div>
      <div className="page-header">
        <h2>My Bookmarks</h2>
        <Link to="/bookmarks/new" className="btn btn-primary">+ Add Bookmark</Link>
      </div>

      {bookmarks.length === 0 ? (
        <div className="empty-state"><p>No bookmarks yet. Add your first link!</p></div>
      ) : (
        <div className="task-grid">
          {bookmarks.map(bookmark => (
            <div key={bookmark.id} className="task-card">
              <div className="task-header">
                <h3>{bookmark.title}</h3>
                <span className="badge badge-todo">{bookmark.Category?.name || 'Uncategorized'}</span>
              </div>
              <p className="task-desc">{bookmark.description}</p>
              <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline" style={{marginBottom: '10px'}}>
                Visit Link ↗
              </a>
              <div className="task-actions">
                <button onClick={() => handleDelete(bookmark.id)} className="btn btn-sm btn-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
