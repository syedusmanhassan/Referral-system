import "./dashboard.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [directReferrals, setDirectReferrals] = useState(0);
  const [indirectReferrals, setIndirectReferrals] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please Log in to access the dashboard');
      history.push('/login');
    } else {
      fetchUserData(token);
      setIsLoggedIn(true);
    }
  }, [history]);

  const fetchUserData = async (token) => {
    try {
      const registrationsResponse = await axios.get('http://localhost:5000/api/user/registrations', { headers: { Authorization: `Bearer ${token}` } });
      setTotalRegistrations(registrationsResponse.data.totalRegistrations);

      const profileResponse = await axios.get('http://localhost:5000/api/user/profile', { headers: { Authorization: `Bearer ${token}` } });
      setReferralLink(`https://yourwebsite.com/register?ref=${profileResponse.data.referralCode}`);
      setUsername(profileResponse.data.username);

      const referralsResponse = await axios.get('http://localhost:5000/api/user/referrals', { headers: { Authorization: `Bearer ${token}` } });
      setDirectReferrals(referralsResponse.data.directReferrals);
      setIndirectReferrals(referralsResponse.data.indirectReferrals);
    } catch (error) {
      console.error(error);
      alert('Error fetching user data');
    }
  };

  const handleChangePassword = async () => {
    const newPassword = prompt('Enter new password');
    if (newPassword) {
      const token = localStorage.getItem('token');
      try {
        await axios.post('http://localhost:5000/api/user/change-password', { password: newPassword }, { headers: { Authorization: `Bearer ${token}` } });
        alert('Password changed');
      } catch (error) {
        console.error(error);
        alert('Error changing password');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    history.push('/login');
  };

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        alert('Referral link copied to clipboard');
      })
      .catch((error) => {
        console.error('Failed to copy referral link:', error);
      });
  };

  if (!isLoggedIn) {
    return null; // Render nothing until logged in
  }

  return (
    <>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Dashboard</h1>
        <h3 className="dashboard-username">Welcome {username}</h3>
        <p className="dashboard-referral-link" onClick={handleCopyReferralLink} style={{ cursor: 'pointer', color: 'black' }}>
          Your referral link: <span style={{fontWeight: 'bold'}}> {referralLink} </span>
        </p>
        <p className="dashboard-total-registrations">Total registrations: {totalRegistrations}</p>
        <div className="dashboard-referrals">
          <h3>Direct Referrals: {directReferrals}</h3>
          <h3>Indirect Referrals: {indirectReferrals}</h3>
        </div>
        <button className="dashboard-button" onClick={handleChangePassword}>Change Password</button>
      </div>
      <button className="dashboard-logout-button" onClick={handleLogout}>Logout</button>
    </>
  );
};

export default Dashboard;
