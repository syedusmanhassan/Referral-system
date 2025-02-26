import "./login.css";
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:5000/api/user/login', { email, password });
          console.log(response.data);
          localStorage.setItem('token', response.data.token);
          alert('Login successful');
          history.push('/dashboard'); 
        } catch (error) {
          console.error(error);
          alert('Login failed');
        }
      };

    const handleForgotPassword = () => {
        history.push('/forget-password');
    };

    return (
        <>
        <div className="info-container">
          <h2 style={{marginLeft: '8rem'}}>Welcome Back!</h2>
          <p style={{color: 'white', textAlign:'center', marginLeft: '8rem'}}>To keep connected with us please login with your personal info</p>
        </div>
        <div className="card">
            <div className="card-column">
                <h1>Login</h1>
                <h4>Login to your account.</h4>
            </div>
            <div className="card-column">
                <form onSubmit={handleSubmit}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                    <button type="submit">Login</button>
                </form>
                <button onClick={handleForgotPassword} style={{marginTop: '1rem', color: 'black', fontWeight: 'bold', backgroundColor: 'transparent', marginLeft:'5rem' }}>Forgot Password?</button>
            </div>
        </div>
        <p style={{textAlign: 'center', color: 'white', marginLeft: '7rem'}}>Don't have an account?</p>
        <p style={{textAlign: 'center', color: 'white', marginLeft: '7rem'}}>Register <a href="/register" style={{color: 'skyblue', fontWeight: 'bold'}}>Here</a></p>
        </>
    );
};

export default Login;
