import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './RoleSelection.css';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (!token || !user) {
      navigate('/login');
      return;
    }

    // If user already has a role, redirect to dashboard
    // if (user.role) {
    //   navigate('/dashboard');
    // }
  }, [navigate]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await authAPI.selectRole(selectedRole);
      
      // Update user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="role-selection-container">
      <div className="role-selection-card">
        <h1>Select Your Role</h1>
        <p className="subtitle">Choose the role that best describes you</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="role-options">
            <label 
              className={`role-option ${selectedRole === 'captain' ? 'selected' : ''}`}
              onClick={() => handleRoleSelect('captain')}
            >
              <input
                type="radio"
                name="role"
                value="captain"
                checked={selectedRole === 'captain'}
                onChange={() => handleRoleSelect('captain')}
                required
              />
              <div className="role-content">
                <div className="role-icon">👨‍✈️</div>
                <div className="role-title">Captain</div>
                <div className="role-description">I want to manage and lead</div>
              </div>
            </label>
            <label 
              className={`role-option ${selectedRole === 'customer' ? 'selected' : ''}`}
              onClick={() => handleRoleSelect('customer')}
            >
              <input
                type="radio"
                name="role"
                value="customer"
                checked={selectedRole === 'customer'}
                onChange={() => handleRoleSelect('customer')}
                required
              />
              <div className="role-content">
                <div className="role-icon">👤</div>
                <div className="role-title">Customer</div>
                <div className="role-description">I want to use the service</div>
              </div>
            </label>
          </div>
          <button type="submit" className="auth-button" disabled={loading || !selectedRole}>
            {loading ? 'Processing...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoleSelection;

