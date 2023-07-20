import React, { useState } from 'react';
import axios from 'axios';
import "./login.css";

const LoginCheck = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Make the POST request to the login API endpoint
    axios.post('users/logincheck', { email, password })
      .then((response) => {
        // Handle successful login
        console.log('Login successful:', response.data.message);
      })
      .catch((error) => {
        // Handle login error
        setError('Invalid email or password');
        console.log('Error:', error.response.data.error);
      });
  };

  return (
    <div className="login-area">
      <h3>Login</h3>

      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className='submit-button'>Login</button>
        {error && <p>{error}</p>}

      </form>
    </div>
  );
};

export default LoginCheck;
