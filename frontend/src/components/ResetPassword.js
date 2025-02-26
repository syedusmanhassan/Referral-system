import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const { resetToken } = useParams();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/user/reset-password/${resetToken}`, { password });
      alert('Password has been reset');
      history.push('/login');
    } catch (error) {
      console.error(error);
      alert('Error resetting password');
    }
  };

  return (
    <div className="reset-password-container">
      <h1 style={{margin:'0', marginLeft:'4rem', textAlign:'center', marginBottom:'1rem', color:'white'}}>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password" required />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
