import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Reception from './Reception';
import Doctor from './Doctor';
import Lab from './Lab';
import Pharmacy from './Pharmacy';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [view, setView] = useState('dashboard');
  
  // Super Admin state
  const [hospitals, setHospitals] = useState([]);
  const [name, setName] = useState('');
  const [tier, setTier] = useState('Basic');
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchHospitals = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/hospitals`);
      setHospitals(res.data);
    } catch (err) {
      console.error('Failed to fetch hospitals');
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleAddHospital = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/hospitals`, { name, subscription_tier: tier });
      setName('');
      fetchHospitals();
      alert('Hospital added successfully!');
    } catch (err) {
      alert('Failed to add hospital');
    }
  };

  // ============================================
  // NEW: This list says WHO is allowed to see WHICH button.
  // "key" = internal name, "label" = what shows on screen,
  // "roles" = the list of job titles allowed to see this button.
  // To add a new role to a button later, just add it to that button's "roles" array.
  // ============================================
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', roles: ['super_admin'] },
    { key: 'reception', label: 'Reception', roles: ['super_admin', 'receptionist'] },
    { key: 'doctor', label: 'Doctor', roles: ['super_admin', 'doctor'] },
    { key: 'lab', label: 'Laboratory', roles: ['super_admin', 'lab_scientist'] },
    { key: 'pharmacy', label: 'Pharmacy', roles: ['super_admin', 'pharmacist'] },
  ];

  // NEW: Only keep the buttons this logged-in person's role is allowed to see.
  // .toLowerCase() on both sides means it doesn't matter if the database
  // has "Doctor", "doctor", or "DOCTOR" — they'll all match correctly.
  const userRole = (user?.role || '').toLowerCase();
  const visibleNavItems = navItems.filter((item) =>
    item.roles.some((role) => role.toLowerCase() === userRole)
  );

  // NEW: As soon as we know the user's role, jump straight to THEIR section
  // instead of showing the Super Admin "Platform Overview" screen by default.
  useEffect(() => {
    if (visibleNavItems.length > 0 && !visibleNavItems.some((item) => item.key === view)) {
      setView(visibleNavItems[0].key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  // This decides what content to show in the main area
  const renderContent = () => {
    if (view === 'reception') return <Reception />;
    if (view === 'doctor') return <Doctor />;
    if (view === 'lab') return <Lab />;
    if (view === 'pharmacy') return <Pharmacy />;
    
    // Default Super Admin Dashboard View
    return (
      <div>
        <h2>Platform Overview</h2>
        <p style={{ color: '#8892b0' }}>Welcome back, {user?.full_name}!</p>

        <div style={styles.card}>
          <h3>Register New Hospital</h3>
          <form onSubmit={handleAddHospital} style={styles.form}>
            <input
              type="text"
              placeholder="Hospital Name (e.g., Hallel Hospital)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />
            <select value={tier} onChange={(e) => setTier(e.target.value)} style={styles.input}>
              <option value="Basic">Basic (Tier 1)</option>
              <option value="Standard">Standard (Tier 2)</option>
              <option value="Premium">Premium (Tier 3)</option>
            </select>
            <button type="submit" style={styles.addButton}>Add Hospital</button>
          </form>
        </div>

        <div style={styles.card}>
          <h3>Active Hospitals ({hospitals.length})</h3>
          {hospitals.length === 0 ? (
            <p style={{ color: '#00FFFF' }}>No hospitals registered yet.</p>
          ) : (
            <div style={styles.list}>
              {hospitals.map((hosp) => (
                <div key={hosp.id} style={styles.hospItem}>
                  <div>
                    <strong style={styles.hospName}>{hosp.name}</strong>
                    <p style={styles.hospTier}>Tier: {hosp.subscription_tier}</p>
                  </div>
                  <span style={styles.statusBadge}>{hosp.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>G-MedHub</h2>
        <p style={styles.sidebarSub}>{user?.role}</p>
        
        <nav style={styles.nav}>
          {/* CHANGED: loop over visibleNavItems instead of writing every button by hand */}
          {visibleNavItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              style={view === item.key ? styles.navActive : styles.navItem}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div style={styles.mainArea}>
        {/* Top Header */}
        <div style={styles.header}>
          <span style={{color: '#00FFFF', fontWeight: 'bold'}}>{view.charAt(0).toUpperCase() + view.slice(1)}</span>
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>

        {/* Page Content */}
        <div style={styles.content}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const styles = {
  layout: { display: 'flex', minHeight: '100vh', backgroundColor: '#0a192f', color: '#00FFFF', fontFamily: 'Arial' },
  
  // Sidebar Styles
  sidebar: { width: '220px', backgroundColor: '#112240', padding: '20px', boxSizing: 'border-box', borderRight: '1px solid #233554', flexShrink: 0 },
  sidebarTitle: { margin: 0, color: '#00FFFF', fontSize: '20px' },
  sidebarSub: { margin: '5px 0 20px 0', color: '#8892b0', fontSize: '12px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '5px' },
  navItem: { textAlign: 'left', padding: '12px', backgroundColor: 'transparent', color: '#8892b0', border: 'none', borderBottom: '1px solid #233554', cursor: 'pointer', fontSize: '15px' },
  navActive: { textAlign: 'left', padding: '12px', backgroundColor: '#00FFFF', color: '#0a192f', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' },

  // Main Area Styles
  mainArea: { flex: 1, display: 'flex', flexDirection: 'column' },
  header: { height: '60px', backgroundColor: '#112240', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid #233554' },
  logoutBtn: { padding: '8px 16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  content: { padding: '20px', flex: 1 },
  
  // Super Admin Specific Styles
  card: { backgroundColor: '#112240', padding: '20px', borderRadius: '8px', marginTop: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', border: '1px solid #233554' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' },
  input: { padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #00FFFF', backgroundColor: '#0a192f', color: '#00FFFF' },
  addButton: { padding: '10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' },
  hospItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0a192f', padding: '15px', borderRadius: '5px', border: '1px solid #233554' },
  hospName: { fontSize: '16px', color: '#00FFFF' }, 
  hospTier: { fontSize: '12px', color: '#00FFFF', margin: '5px 0 0 0' }, 
  statusBadge: { backgroundColor: '#2ecc71', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }
};

export default Dashboard;
