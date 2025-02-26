import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/user/forgot-password', { email });
      alert('Recovery email sent');
    } catch (error) {
      console.error(error);
      alert('Error sending recovery email');
    }
  };

  return (
    <div className="forgot-password-container">
      <h1 style={{margin:'0', marginLeft:'4rem', textAlign:'center', marginBottom:'1rem', color:'white'}}>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
        <button type="submit">Send Recovery Email</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
