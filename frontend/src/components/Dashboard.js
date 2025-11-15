import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    // If user doesn't have a role, redirect to role selection
    if (!userData.role) {
      navigate('/role-selection');
      return;
    }

    setUser(userData);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1>Welcome to Dashboard</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
        <div className="info-card">
          <div className="info-item">
            <div className="info-label">Name</div>
            <div className="info-value">{user.name}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Email</div>
            <div className="info-value">{user.email}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Role</div>
            <div className="info-value">
              <span className="role-badge">{user.role}</span>
            </div>
          </div>
        </div>
        <p className="info-text">
          Backend functionality for role selection will be implemented later.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;

