import React, { useState } from 'react';
import axios from 'axios';

const AdminForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/forgot-password', { email });
      alert('Recovery email sent');
    } catch (error) {
      console.error(error);
      alert('Error sending recovery email');
    }
  };

  return (
    <div className="forgot-password-container">
      <h1 style={{margin:'0', marginLeft:'3.5rem', textAlign:'center', marginBottom:'1rem', color:'white'}}>Admin Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
        <button type="submit">Send Recovery Email</button>
      </form>
    </div>
  );
};

export default AdminForgotPassword;
