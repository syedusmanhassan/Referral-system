import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import "./adminloginmodal.css";

const AdminLoginModal = ({ onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', { username, password });
      localStorage.setItem('token', response.data.token);
      onLoginSuccess();
    } catch (error) {
      console.error('Login error:', error.response.data);
      setError('Invalid credentials');
    }
  };

  const handleForgotPassword = () => {
    history.push('/admin-forgot-password');
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 style={{ color: 'black', marginLeft: '0rem', marginTop: '0px' }}>Admin Login</h2>
        <p style={{ color: 'black', marginLeft: '0rem', marginTop: '-25px', marginBottom: '25px' }}>Please enter Admin Credentials.</p>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <button onClick={onClose}>Close</button>
        <button style={{margin: '0', color: 'black', fontWeight: 'bold', backgroundColor: 'transparent', width:'100%' }} onClick={handleForgotPassword}>Forgot Password?</button>
      </div>
    </div>
  );
};

export default AdminLoginModal;
