import React from 'react';
import './Auth.css';

const VerifyEmailPending = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="icon-large">📧</div>
        <h1>Check Your Email</h1>
        <p>We've sent a verification email to your registered email address.</p>
        <div className="info-box">
          <p><strong>Please check your inbox and click on the verification link to activate your account.</strong></p>
        </div>
        <p>If you don't see the email, please check your spam folder.</p>
        <p>Once verified, you can proceed to select your role.</p>
      </div>
    </div>
  );
};

export default VerifyEmailPending;

