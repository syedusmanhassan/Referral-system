import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';

const AdminResetPassword = () => {
  const [password, setPassword] = useState('');
  const { resetToken } = useParams();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/admin/reset-password/${resetToken}`, { password });
      alert('Password has been reset');
      history.push('/admin');
    } catch (error) {
      console.error(error);
      alert('Error resetting password');
    }
  };

  return (
    <div className="reset-password-container">
      <h1 style={{margin:'0', marginLeft:'3.5rem', textAlign:'center', marginBottom:'1rem', color:'white'}}>Admin Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password" required />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default AdminResetPassword;
