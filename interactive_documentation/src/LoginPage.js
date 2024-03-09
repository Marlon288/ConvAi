import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './css/LoginPage.css'; 

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

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
        localStorage.setItem('token', data.token); // Save token to localStorage
        navigate('/admin'); // Navigate to protected page
      } else {
        alert('Login failed!');
      }
  };

  return (
    
    <div className='login-container'>
    <div className="login-form-container">
      <form onSubmit={handleLogin} className="login-form ">
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password ">Password</label>
            <input
            type="password"
            id="password"
            value={password}
             onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
    </div>
  );
}

export default LoginPage;
