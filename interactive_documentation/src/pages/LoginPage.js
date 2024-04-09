/**
 * @file LoginPage.js
 * @description This component represents the login page where users can enter their credentials.
 * @author Marlon D'Ambrosio
 * @version 1.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './../css/LoginPage.css';

/**
 * LoginPage component
 * @returns {JSX.Element} The rendered login page component
 */
function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();

  /**
   * Handles the login form submission
   * @param {Event} e - The form submission event
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:9000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      navigate('/admin');
    } else {
      setLoginError(true);
    }
  };

  return (
    <div className="login-container">
      <div className={`login-form-container ${loginError ? 'shake' : ''}`}>
        <form onSubmit={handleLogin} className="login-form">
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-label="Username"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
            />
          </div>
          <div className={`login-error-container ${loginError ? '' : 'hidden'}`} role="alert">
            {loginError && "Username or password is wrong"}
          </div>
          <button type="submit">Login</button>
          <Link to="/" className="back-link">
            ← Back to Main Page
          </Link>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;