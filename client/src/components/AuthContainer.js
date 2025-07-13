import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import '../App.css';
import logo from '../assets/logo.png';

const AuthContainer = () => {
  const [mode, setMode] = useState('login'); // 'login', 'register', 'forgot'

  return (
    <div className="container glass-card">
      <img src={logo} alt="FixMyCity Logo" className="logo" />

      {mode === 'login' && (
        <>
          <LoginForm />
          <div className="link-group">
            <span className="link" onClick={() => setMode('register')}>Register</span>
            <span className="divider">|</span>
            <span className="link" onClick={() => setMode('forgot')}>Forgot Password?</span>
          </div>
        </>
      )}

      {mode === 'register' && (
        <>
          <RegisterForm />
          <div className="link-group">
            <span className="link" onClick={() => setMode('login')}>Back to Login</span>
          </div>
        </>
      )}

      {mode === 'forgot' && (
        <>
          <ForgotPasswordForm />
          <div className="link-group">
            <span className="link" onClick={() => setMode('login')}>Back to Login</span>
          </div>
        </>
      )}
    </div>
  );
};

export default AuthContainer;
