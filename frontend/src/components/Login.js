import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mail: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("entered login");
    // Check if user is already logged in
    // const token = localStorage.getItem('token');
    // const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    // if (token && user) {
    //   if (user.role) {
    //     navigate('/dashboard');
    //   } else {
    //     navigate('/role-selection');
    //   }
    // }
    // navigate('/role-selection');
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect based on role
      // if (response.data.user.role) {
      //   navigate('/dashboard');
      // } else {
      //   navigate('/role-selection');
      // }
      navigate('/role-selection');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Sign In</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="mail">Email *</label>
            <input
              type="email"
              id="mail"
              name="mail"
              value={formData.mail}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-link">
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;

