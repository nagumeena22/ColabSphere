import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [joinRequestsCount, setJoinRequestsCount] = useState(0);

  useEffect(() => {
    fetchUserProfile();
    fetchJoinRequestsCount();
  }, []);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      navigate('/login');
    }
  };

  const fetchJoinRequestsCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/admin/join-requests', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const requests = await response.json();
        const pendingCount = requests.filter(req => req.status === 'pending').length;
        setJoinRequestsCount(pendingCount);
      }
    } catch (error) {
      console.error('Error fetching join requests count:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>👑 Admin Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => navigate('/admin/projects')}>
          <div className="card-icon">📋</div>
          <h3>Projects</h3>
          <p>Manage and view all projects</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/admin/join-requests')}>
          <div className="card-icon">📨</div>
          <h3>Join Requests</h3>
          <p>Review project join requests</p>
          {joinRequestsCount > 0 && (
            <div className="notification-badge">{joinRequestsCount}</div>
          )}
        </div>

        <div className="dashboard-card" onClick={() => navigate('/admin/collaborations')}>
          <div className="card-icon">🤝</div>
          <h3>Collaborations</h3>
          <p>Manage team collaborations</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/admin/tasks')}>
          <div className="card-icon">✅</div>
          <h3>Tasks</h3>
          <p>Monitor project tasks</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/admin/insights')}>
          <div className="card-icon">📊</div>
          <h3>Insights</h3>
          <p>View analytics and reports</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/admin/settings')}>
          <div className="card-icon">⚙️</div>
          <h3>Settings</h3>
          <p>Configure system settings</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button onClick={() => navigate('/projects')} className="action-btn">
            📋 View All Projects
          </button>
          <button onClick={() => navigate('/ProjectForm')} className="action-btn">
            ➕ Create New Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;