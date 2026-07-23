import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <h2>Welcome, {user?.full_name}!</h2>
      <p>Your Role: {user?.role}</p>
      <p>Hospital ID: {user?.hospital_id}</p>
      
      <p style={{ color: 'green', marginTop: '30px' }}>
        5-Minute Auto-Logout is ACTIVE. Stop clicking for 5 minutes to test it.
      </p>

      <button 
        onClick={logout} 
        style={{ marginTop: '30px', padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Manual Logout
      </button>
    </div>
  );
};

export default Dashboard;