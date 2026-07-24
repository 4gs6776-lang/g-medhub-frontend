import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
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
  const [menuOpen, setMenuOpen] = useState(false); // For mobile menu
  const [stats, setStats] = useState({
    total_patients: 0,
    todays_appointments: 0,
    pending_labs: 0,
    unpaid_bills: 0
  });
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/stats?hospital_id=${user.hospital_id}`);
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats');
      }
    };
    if (view === 'dashboard') fetchStats();
  }, [user, view]);

  const changeView = (newView) => {
    setView(newView);
    setMenuOpen(false); // Close menu when selecting on mobile
  };

  const renderContent = () => {
    if (view === 'reception') return <Reception />;
    if (view === 'doctor') return <Doctor />;
    if (view === 'lab') return <Lab />;
    if (view === 'pharmacy') return <Pharmacy />;
    if (view === 'nurse') return <Nurse />;
    if (view === 'billing') return <Billing />;
    if (view === 'appointments') return <Appointments />;
    
    return (
      <div style={styles.welcomeContainer}>
        <h1 style={styles.welcomeTitle}>Welcome back, {user?.full_name}</h1>
        <p style={styles.welcomeSub}>Here is the premium overview of Hallel Hospital today.</p>
        
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>👥</div>
            <div>
              <h3 style={styles.statNumber}>{stats.total_patients}</h3>
              <p style={styles.statLabel}>Total Patients</p>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📅</div>
            <div>
              <h3 style={styles.statNumber}>{stats.todays_appointments}</h3>
              <p style={styles.statLabel}>Appointments Today</p>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🧪</div>
            <div>
              <h3 style={styles.statNumber}>{stats.pending_labs}</h3>
              <p style={styles.statLabel}>Pending Labs</p>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statIcon}>💳</div>
            <div>
              <h3 style={styles.statNumber}>${stats.unpaid_bills}</h3>
              <p style={styles.statLabel}>Unpaid Bills</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.layout}>
      {/* Mobile Top Bar */}
      <div style={styles.mobileHeader}>
        <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <h2 style={styles.mobileTitle}>G-MedHub</h2>
        <div style={{width: '30px'}}></div>
      </div>

      {/* Overlay for mobile when menu is open */}
      {menuOpen && <div style={styles.overlay} onClick={() => setMenuOpen(false)}></div>}

      {/* Sidebar */}
      <div style={{
        ...styles.sidebar, 
        transform: menuOpen ? 'translateX(0)' : (window.innerWidth <= 768 ? 'translateX(-100%)' : 'translateX(0)')
      }}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarTitle}>G-MedHub</h2>
          <p style={styles.sidebarSub}>Hallel Hospital</p>
        </div>
        
        <nav style={styles.nav}>
          <button onClick={() => changeView('dashboard')} style={view === 'dashboard' ? styles.navActive : styles.navItem}>✨ Dashboard</button>
          <button onClick={() => changeView('appointments')} style={view === 'appointments' ? styles.navActive : styles.navItem}>📅 Appointments</button>
          <button onClick={() => changeView('reception')} style={view === 'reception' ? styles.navActive : styles.navItem}>🏥 Reception</button>
          <button onClick={() => changeView('doctor')} style={view === 'doctor' ? styles.navActive : styles.navItem}>🩺 Doctor</button>
          <button onClick={() => changeView('nurse')} style={view === 'nurse' ? styles.navActive : styles.navItem}>💉 Nurse</button>
          <button onClick={() => changeView('lab')} style={view === 'lab' ? styles.navActive : styles.navItem}>🧪 Laboratory</button>
          <button onClick={() => changeView('pharmacy')} style={view === 'pharmacy' ? styles.navActive : styles.navItem}>💊 Pharmacy</button>
          <button onClick={() => changeView('billing')} style={view === 'billing' ? styles.navActive : styles.navItem}>💳 Billing</button>
        </nav>

        <button onClick={logout} style={styles.logoutBtn}>🚪 Logout</button>
      </div>

      {/* Main Content Area */}
      <div style={styles.mainArea}>
        <div style={styles.desktopHeader}>
          <span style={styles.pageTitle}>{view.charAt(0).toUpperCase() + view.slice(1)}</span>
        </div>

        <div style={styles.content}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#020c1b', // Deeper premium navy
    backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(0, 255, 255, 0.05) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(212, 175, 55, 0.05) 0%, transparent 20%)',
    color: '#e6f1ff',
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },

  // Mobile Header
  mobileHeader: {
    display: window.innerWidth <= 768 ? 'flex' : 'none',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    backgroundColor: 'rgba(17, 34, 64, 0.8)',
    backdropFilter: 'blur(10px)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottom: '1px solid rgba(0, 255, 255, 0.1)',
  },
  hamburger: {
    background: 'none',
    border: 'none',
    color: '#00FFFF',
    fontSize: '24px',
    cursor: 'pointer',
  },
  mobileTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#00FFFF',
  },
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 999,
  },

  // Sidebar
  sidebar: {
    width: '260px',
    backgroundColor: 'rgba(17, 34, 64, 0.9)', // Glassmorphism
    backdropFilter: 'blur(12px)',
    padding: '30px 20px',
    boxSizing: 'border-box',
    borderRight: '1px solid rgba(0, 255, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100vh',
    transition: 'transform 0.3s ease-in-out',
    zIndex: 1001,
  },
  sidebarHeader: {
    marginBottom: '40px',
    textAlign: 'center',
  },
  sidebarTitle: {
    margin: 0,
    fontSize: '28px',
    fontWeight: '800',
    background: 'linear-gradient(90deg, #00FFFF, #D4AF37)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  sidebarSub: {
    margin: '5px 0 0 0',
    color: '#8892b0',
    fontSize: '12px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: 1,
  },
  navItem: {
    textAlign: 'left',
    padding: '15px',
    backgroundColor: 'transparent',
    color: '#8892b0',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  navActive: {
    textAlign: 'left',
    padding: '15px',
    background: 'linear-gradient(90deg, rgba(0, 255, 255, 0.1), rgba(0, 255, 255, 0.05))',
    color: '#00FFFF',
    border: '1px solid rgba(0, 255, 255, 0.2)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
  },
  logoutBtn: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    color: '#e74c3c',
    border: '1px solid rgba(231, 76, 60, 0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 'bold',
  },

  // Main Area
  mainArea: {
    flex: 1,
    marginLeft: window.innerWidth <= 768 ? '0' : '260px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  desktopHeader: {
    display: window.innerWidth <= 768 ? 'none' : 'flex',
    height: '80px',
    alignItems: 'center',
    padding: '0 40px',
    backgroundColor: 'rgba(17, 34, 64, 0.5)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(0, 255, 255, 0.1)',
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#e6f1ff',
    textTransform: 'capitalize',
  },
  content: {
    padding: window.innerWidth <= 768 ? '80px 15px 20px' : '40px',
    flex: 1,
  },

  // Welcome & Stats
  welcomeContainer: {
    animation: 'fadeIn 0.5s ease-in',
  },
  welcomeTitle: {
    fontSize: '32px',
    margin: 0,
    color: '#e6f1ff',
  },
  welcomeSub: {
    fontSize: '16px',
    color: '#8892b0',
    marginTop: '10px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '20px',
    marginTop: '30px',
  },
  statCard: {
    backgroundColor: 'rgba(17, 34, 64, 0.6)',
    padding: '25px',
    borderRadius: '16px',
    border: '1px solid rgba(0, 255, 255, 0.1)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    transition: 'transform 0.3s ease, border 0.3s ease',
  },
  statIcon: {
    fontSize: '32px',
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
    padding: '15px',
    borderRadius: '12px',
    border: '1px solid rgba(0, 255, 255, 0.1)',
  },
  statNumber: {
    margin: 0,
    fontSize: '32px',
    fontWeight: '800',
    color: '#00FFFF',
  },
  statLabel: {
    margin: '5px 0 0 0',
    fontSize: '14px',
    color: '#8892b0',
  },
};

export default CMDDashboard;