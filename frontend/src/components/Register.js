import "./register.css";
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom'; // Import useHistory from react-router-dom

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const history = useHistory(); // Initialize useHistory hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/user/register', { username, email, password, referrer: referralCode });
      alert('User registered');
      history.push('/login'); // Redirect to '/login' after successful registration
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <>
      <div className="info-container">
        <h2 style={{ marginLeft: '8rem' }}>Join Us!</h2>
        <p style={{ color: 'white', textAlign: 'center', marginLeft: '8rem' }}>Create an account to start your journey with us</p>
      </div>
      <div className="card">
        <div className="card-column">
          <h1>Register</h1>
          <h4>Create your account.</h4>
        </div>
        <div className="card-column">
          <form onSubmit={handleSubmit}>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <input type="text" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} placeholder="Referral Code" />
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
      <p style={{ textAlign: 'center', color: 'white', marginLeft: '7rem' }}>Already have an account?</p>
      <p style={{ textAlign: 'center', color: 'white', marginLeft: '7rem' }}>Login <a href="/login" style={{ color: 'skyblue', fontWeight: 'bold' }}>Here</a></p>
    </>
  );
};

export default Register;
