import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Reception from './Reception';
import Doctor from './Doctor';
import Lab from './Lab';
import Pharmacy from './Pharmacy';

const CMDDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [view, setView] = useState('dashboard');

  if (view === 'reception') {
    return (
      <div>
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <button onClick={() => setView('dashboard')} style={{padding: '10px 20px', backgroundColor: '#7f8c8d', color: 'white', border: 'none', borderRadius: '5px'}}>
            ⬅ Back to CMD Dashboard
          </button>
        </div>
        <Reception />
      </div>
    );
  }

  if (view === 'doctor') {
    return (
      <div>
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <button onClick={() => setView('dashboard')} style={{padding: '10px 20px', backgroundColor: '#7f8c8d', color: 'white', border: 'none', borderRadius: '5px'}}>
            ⬅ Back to CMD Dashboard
          </button>
        </div>
        <Doctor />
      </div>
    );
  }

  if (view === 'lab') {
    return (
      <div>
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <button onClick={() => setView('dashboard')} style={{padding: '10px 20px', backgroundColor: '#7f8c8d', color: 'white', border: 'none', borderRadius: '5px'}}>
            ⬅ Back to CMD Dashboard
          </button>
        </div>
        <Lab />
      </div>
    );
  }

  if (view === 'pharmacy') {
    return (
      <div>
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <button onClick={() => setView('dashboard')} style={{padding: '10px 20px', backgroundColor: '#7f8c8d', color: 'white', border: 'none', borderRadius: '5px'}}>
            ⬅ Back to CMD Dashboard
          </button>
        </div>
        <Pharmacy />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Hallel Hospital & Maternity</h2>
        <button onClick={logout} style={styles.logoutBtn}>Logout</button>
      </div>

      <p style={{ color: '#00FFFF' }}>Welcome, {user?.full_name}! (Chief Medical Director)</p>

      <div style={styles.card}>
        <h3>Hospital Departments</h3>
        <button onClick={() => setView('reception')} style={styles.navBtn}>Go to Reception Desk</button>
        <button onClick={() => setView('doctor')} style={styles.navBtn}>Go to Doctor's Desk</button>
        <button onClick={() => setView('lab')} style={styles.navBtn}>Go to Laboratory Desk</button>
        <button onClick={() => setView('pharmacy')} style={styles.navBtn}>Go to Pharmacy Desk</button>
      </div>

      <p style={{ color: '#2ecc71', marginTop: '20px', fontSize: '14px' }}>
        5-Minute Auto-Logout is ACTIVE.
      </p>
    </div>
  );
};

const styles = {
  container: { 
    maxWidth: '600px', 
    margin: '0 auto', 
    padding: '20px', 
    fontFamily: 'Arial, sans-serif', 
    backgroundColor: '#0a192f', 
    minHeight: '100vh', 
    color: '#00FFFF' 
  },
  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderBottom: '2px solid #00FFFF', 
    paddingBottom: '10px' 
  },
  logoutBtn: { 
    padding: '8px 16px', 
    backgroundColor: '#e74c3c', 
    color: 'white', 
    border: 'none', 
    borderRadius: '5px', 
    cursor: 'pointer' 
  },
  card: { 
    backgroundColor: '#112240', 
    padding: '20px', 
    borderRadius: '8px', 
    marginTop: '20px', 
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)', 
    border: '1px solid #233554'
  },
  navBtn: { 
    width: '100%', 
    padding: '15px', 
    backgroundColor: '#00FFFF', 
    color: '#0a192f', 
    border: 'none', 
    borderRadius: '8px', 
    fontSize: '16px', 
    cursor: 'pointer', 
    marginBottom: '10px',
    fontWeight: 'bold'
  }
};

export default CMDDashboard;
