import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Auth.css';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await authAPI.verifyEmail(token);
        
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        setStatus('success');
        setMessage('Email verified successfully!');
        
        // Redirect after 2 seconds
        setTimeout(() => {
          if (response.data.user.role) {
            navigate('/dashboard');
          } else {
            navigate('/role-selection');
          }
        }, 2000);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Verification failed. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        {status === 'verifying' && (
          <>
            <div className="icon-large">⏳</div>
            <h1>Verifying Email...</h1>
            <p>{message}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="icon-large success">✓</div>
            <h1 className="success">Email Verified!</h1>
            <p>{message}</p>
            <p>Redirecting you...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="icon-large error">✗</div>
            <h1 className="error">Verification Failed</h1>
            <p>{message}</p>
            <button 
              className="auth-button" 
              onClick={() => navigate('/login')}
              style={{ marginTop: '20px' }}
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

