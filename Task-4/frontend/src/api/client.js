const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // If token is invalid/expired, log out automatically
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Throw the error message from the backend, or a generic one
    const errorMsg = data?.error?.message || 'Something went wrong';
    const errorDetails = data?.error?.details;
    throw { message: errorMsg, details: errorDetails, status: response.status };
  }

  return data;
}