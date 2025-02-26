import "./admin.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLoginModal from './AdminLoginModal';

const Admin = () => {
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [minRegistrations, setMinRegistrations] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchTotalRegistrations = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:5000/api/admin/total-registrations', { headers: { Authorization: `Bearer ${token}` } });
          setTotalRegistrations(response.data.totalRegistrations);
        } catch (error) {
          console.error(error);
          alert('Error fetching total registrations');
        }
      };

      fetchTotalRegistrations();
    }
  }, [isAuthenticated]);

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/admin/search?minRegistrations=${minRegistrations}`, { headers: { Authorization: `Bearer ${token}` } });
      setSearchResults(response.data);
    } catch (error) {
      console.error(error);
      alert('Error searching users');
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setShowLoginModal(true);
  };

  return (
    <>
      <div className="admin-container">
        {showLoginModal && <AdminLoginModal onClose={() => setShowLoginModal(false)} onLoginSuccess={handleLoginSuccess} />}
        {isAuthenticated && (
          <>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-total-registrations">Total registrations: {totalRegistrations}</p>
            <input
              type="number"
              value={minRegistrations}
              onChange={(e) => {
                const value = Math.max(0, e.target.value);
                setMinRegistrations(value);
              }}
              placeholder="Min Registrations"
              className="admin-input"
              min="0" 
            />

            <button onClick={handleSearch} className="admin-button">Search</button>
            <hr />
            <div className="admin-table-container">
              <table className="admin-table">
                <colgroup>
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '30%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '20%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Direct Referrals</th>
                    <th>Indirect Referrals</th>
                    <th>Total Registrations</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((result, index) => (
                    <tr key={index} className="admin-result-item">
                      <td>{result.username}</td>
                      <td>{result.email}</td>
                      <td>{result.directReferrals}</td>
                      <td>{result.indirectReferrals}</td>
                      <td>{result.totalRegistrations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      {isAuthenticated && <button onClick={handleLogout} className="admin-logout-button">Logout</button>}
    </>
  );
};

export default Admin;
