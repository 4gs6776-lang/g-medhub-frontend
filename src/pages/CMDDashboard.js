import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Reception from './Reception';
import Doctor from './Doctor';
import Lab from './Lab';
import Pharmacy from './Pharmacy';
import Nurse from './Nurse';
import Billing from './Billing';
import Appointments from './Appointments';

const CMDDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [view, setView] = useState('dashboard');

  const renderContent = () => {
    if (view === 'reception') return <Reception />;
    if (view === 'doctor') return <Doctor />;
    if (view === 'lab') return <Lab />;
    if (view === 'pharmacy') return <Pharmacy />;
    if (view === 'nurse') return <Nurse />;
    if (view === 'billing') return <Billing />;
    if (view === 'appointments') return <Appointments />;
    
    return (
      <div>
        <h2>Hospital Overview</h2>
        <p style={{ color: '#8892b0' }}>Welcome back, {user?.full_name}!</p>
        
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3 style={{color: '#00FFFF', margin: 0}}>0</h3>
            <p style={{color: '#8892b0', margin: '5px 0 0 0'}}>Total Patients</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={{color: '#00FFFF', margin: 0}}>0</h3>
            <p style={{color: '#8892b0', margin: '5px 0 0 0'}}>Lab Tests Today</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.layout}>
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>G-MedHub</h2>
        <p style={styles.sidebarSub}>Hallel Hospital</p>
        
        <nav style={styles.nav}>
          <button onClick={() => setView('dashboard')} style={view === 'dashboard' ? styles.navActive : styles.navItem}>Dashboard</button>
          <button onClick={() => setView('appointments')} style={view === 'appointments' ? styles.navActive : styles.navItem}>Appointments</button>
          <button onClick={() => setView('reception')} style={view === 'reception' ? styles.navActive : styles.navItem}>Reception</button>
          <button onClick={() => setView('doctor')} style={view === 'doctor' ? styles.navActive : styles.navItem}>Doctor</button>
          <button onClick={() => setView('nurse')} style={view === 'nurse' ? styles.navActive : styles.navItem}>Nurse</button>
          <button onClick={() => setView('lab')} style={view === 'lab' ? styles.navActive : styles.navItem}>Laboratory</button>
          <button onClick={() => setView('pharmacy')} style={view === 'pharmacy' ? styles.navActive : styles.navItem}>Pharmacy</button>
          <button onClick={() => setView('billing')} style={view === 'billing' ? styles.navActive : styles.navItem}>Billing/Cashier</button>
        </nav>
      </div>

      <div style={styles.mainArea}>
        <div style={styles.header}>
          <span style={{color: '#00FFFF', fontWeight: 'bold'}}>{view.charAt(0).toUpperCase() + view.slice(1)}</span>
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>

        <div style={styles.content}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const styles = {
  layout: { display: 'flex', minHeight: '100vh', backgroundColor: '#0a192f', color: '#00FFFF', fontFamily: 'Arial' },
  sidebar: { width: '220px', backgroundColor: '#112240', padding: '20px', boxSizing: 'border-box', borderRight: '1px solid #233554', flexShrink: 0 },
  sidebarTitle: { margin: 0, color: '#00FFFF', fontSize: '20px' },
  sidebarSub: { margin: '5px 0 20px 0', color: '#8892b0', fontSize: '12px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '5px' },
  navItem: { textAlign: 'left', padding: '12px', backgroundColor: 'transparent', color: '#8892b0', border: 'none', borderBottom: '1px solid #233554', cursor: 'pointer', fontSize: '15px' },
  navActive: { textAlign: 'left', padding: '12px', backgroundColor: '#00FFFF', color: '#0a192f', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' },
  mainArea: { flex: 1, display: 'flex', flexDirection: 'column' },
  header: { height: '60px', backgroundColor: '#112240', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid #233554' },
  logoutBtn: { padding: '8px 16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  content: { padding: '20px', flex: 1 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' },
  statCard: { backgroundColor: '#112240', padding: '20px', borderRadius: '8px', border: '1px solid #233554' }
};

export default CMDDashboard;