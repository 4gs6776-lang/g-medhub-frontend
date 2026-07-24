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
import DrugChart from './DrugChart';
import Patients from './Patients';
import Maternity from './Maternity';
import Roster from './Roster';
import Ward from './Ward';

const CMDDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [view, setView] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    total_patients: 0,
    todays_appointments: 0,
    pending_labs: 0,
    unpaid_bills: 0
  });
  const [recentAppts, setRecentAppts] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (view === 'dashboard') {
        try {
          const statsRes = await axios.get(`${API_URL}/api/stats?hospital_id=${user.hospital_id}`);
          setStats(statsRes.data);
          
          const apptsRes = await axios.get(`${API_URL}/api/appointments?hospital_id=${user.hospital_id}`);
          setRecentAppts(apptsRes.data.slice(0, 5));
        } catch (err) {
          console.error('Failed to fetch dashboard data');
        }
      }
    };
    
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 2000);
    return () => clearInterval(interval);
  }, [user, view, API_URL]);

  const changeView = (newView) => {
    setView(newView);
    setMenuOpen(false);
  };

  const renderContent = () => {
    if (view === 'reception') return <Reception />;
    if (view === 'doctor') return <Doctor />;
    if (view === 'lab') return <Lab />;
    if (view === 'pharmacy') return <Pharmacy />;
    if (view === 'nurse') return <Nurse />;
    if (view === 'billing') return <Billing />;
    if (view === 'appointments') return <Appointments />;
    if (view === 'drugchart') return <DrugChart />;
    if (view === 'patients') return <Patients />;
    if (view === 'maternity') return <Maternity />;
    if (view === 'roster') return <Roster />;
    if (view === 'ward') return <Ward />;
    
    return (
      <div style={styles.dashboardContainer}>
        <div style={styles.welcomeBanner}>
          <div>
            <h1 style={styles.bannerTitle}>Hello, {user?.full_name}! 👋</h1>
            <p style={styles.bannerSub}>Welcome back to Hallel Hospital. Here is what's happening today.</p>
          </div>
          <div style={styles.bannerIcon}>🏥</div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: 'rgba(0, 255, 255, 0.1)', color: '#00FFFF'}}>👥</div>
            <div>
              <h3 style={styles.statNumber}>{stats.total_patients}</h3>
              <p style={styles.statLabel}>Total Patients</p>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71'}}>📅</div>
            <div>
              <h3 style={styles.statNumber}>{stats.todays_appointments}</h3>
              <p style={styles.statLabel}>Appointments Today</p>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: 'rgba(243, 156, 18, 0.1)', color: '#f39c12'}}>🧪</div>
            <div>
              <h3 style={styles.statNumber}>{stats.pending_labs}</h3>
              <p style={styles.statLabel}>Pending Labs</p>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c'}}>💳</div>
            <div>
              <h3 style={styles.statNumber}>${stats.unpaid_bills}</h3>
              <p style={styles.statLabel}>Unpaid Bills</p>
            </div>
          </div>
        </div>

        <div style={styles.rowLayout}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Departmental Statistics</h3>
            <div style={styles.separator}></div>
            <div style={styles.progressItem}>
              <div style={styles.progressHeader}><span>Reception</span><span>85%</span></div>
              <div style={styles.progressTrack}><div style={{...styles.progressBar, width: '85%', background: '#00FFFF'}}></div></div>
            </div>
            <div style={styles.progressItem}>
              <div style={styles.progressHeader}><span>Laboratory</span><span>70%</span></div>
              <div style={styles.progressTrack}><div style={{...styles.progressBar, width: '70%', background: '#2ecc71'}}></div></div>
            </div>
            <div style={styles.progressItem}>
              <div style={styles.progressHeader}><span>Pharmacy</span><span>92%</span></div>
              <div style={styles.progressTrack}><div style={{...styles.progressBar, width: '92%', background: '#D4AF37'}}></div></div>
            </div>
            <div style={styles.progressItem}>
              <div style={styles.progressHeader}><span>Maternity (ANC)</span><span>65%</span></div>
              <div style={styles.progressTrack}><div style={{...styles.progressBar, width: '65%', background: '#e74c3c'}}></div></div>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Recent Appointments</h3>
            <div style={styles.separator}></div>
            {recentAppts.length === 0 ? (
              <p style={{color: '#8892b0', textAlign: 'center', padding: '20px'}}>No recent appointments.</p>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Patient</th>
                      <th style={styles.th}>Doctor</th>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAppts.map((a) => (
                      <tr key={a.id}>
                        <td style={styles.td}>{a.patient_name}</td>
                        <td style={styles.td}>{a.doctor_name}</td>
                        <td style={styles.td}>{new Date(a.appointment_date).toLocaleDateString()}</td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.badge,
                            backgroundColor: a.status === 'Completed' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(243, 156, 18, 0.1)',
                            color: a.status === 'Completed' ? '#2ecc71' : '#f39c12'
                          }}>{a.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.layout}>
      <div style={styles.mobileHeader}>
        <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <h2 style={styles.mobileTitle}>G-MedHub</h2>
        <div style={{width: '30px'}}></div>
      </div>

      {menuOpen && <div style={styles.overlay} onClick={() => setMenuOpen(false)}></div>}

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
          <button onClick={() => changeView('patients')} style={view === 'patients' ? styles.navActive : styles.navItem}>👥 Patient List</button>
          <button onClick={() => changeView('appointments')} style={view === 'appointments' ? styles.navActive : styles.navItem}>📅 Appointments</button>
          <button onClick={() => changeView('reception')} style={view === 'reception' ? styles.navActive : styles.navItem}>🏥 Reception</button>
          <button onClick={() => changeView('doctor')} style={view === 'doctor' ? styles.navActive : styles.navItem}>🩺 Doctor</button>
          <button onClick={() => changeView('nurse')} style={view === 'nurse' ? styles.navActive : styles.navItem}>💉 Nurse</button>
          <button onClick={() => changeView('drugchart')} style={view === 'drugchart' ? styles.navActive : styles.navItem}>📋 Drug Chart</button>
          <button onClick={() => changeView('maternity')} style={view === 'maternity' ? styles.navActive : styles.navItem}>🤰 Maternity (ANC)</button>
          <button onClick={() => changeView('lab')} style={view === 'lab' ? styles.navActive : styles.navItem}>🧪 Laboratory</button>
          <button onClick={() => changeView('pharmacy')} style={view === 'pharmacy' ? styles.navActive : styles.navItem}>💊 Pharmacy</button>
          <button onClick={() => changeView('billing')} style={view === 'billing' ? styles.navActive : styles.navItem}>💳 Billing</button>
          <button onClick={() => changeView('ward')} style={view === 'ward' ? styles.navActive : styles.navItem}>🛏️ Ward & Beds</button>
          <button onClick={() => changeView('roster')} style={view === 'roster' ? styles.navActive : styles.navItem}>🗓️ Daily Roster</button>
        </nav>

        <button onClick={logout} style={styles.logoutBtn}>🚪 Logout</button>
      </div>

      <div style={styles.mainArea}>
        <div style={styles.desktopHeader}>
          <span style={styles.pageTitle}>{view === 'dashboard' ? 'Dashboard Overview' : view.charAt(0).toUpperCase() + view.slice(1)}</span>
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
    backgroundColor: '#020c1b',
    backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(0, 255, 255, 0.05) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(212, 175, 55, 0.05) 0%, transparent 20%)',
    color: '#e6f1ff',
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  mobileHeader: {
    display: window.innerWidth <= 768 ? 'flex' : 'none',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    backgroundColor: 'rgba(17, 34, 64, 0.8)',
    backdropFilter: 'blur(10px)',
    position: 'fixed',
    top: 0, left: 0, right: 0,
    zIndex: 1000,
    borderBottom: '1px solid rgba(0, 255, 255, 0.1)',
  },
  hamburger: { background: 'none', border: 'none', color: '#00FFFF', fontSize: '24px', cursor: 'pointer' },
  mobileTitle: { margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#00FFFF' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 999 },
  sidebar: {
    width: '260px',
    backgroundColor: 'rgba(17, 34, 64, 0.9)',
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
  sidebarHeader: { marginBottom: '30px', textAlign: 'center' },
  sidebarTitle: { margin: 0, fontSize: '28px', fontWeight: '800', background: 'linear-gradient(90deg, #00FFFF, #D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  sidebarSub: { margin: '5px 0 0 0', color: '#8892b0', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' },
  nav: { display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto', paddingBottom: '20px' },
  navItem: { textAlign: 'left', padding: '15px', backgroundColor: 'transparent', color: '#8892b0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '500', transition: 'all 0.3s ease' },
  navActive: { textAlign: 'left', padding: '15px', background: 'linear-gradient(90deg, rgba(0, 255, 255, 0.1), rgba(0, 255, 255, 0.05))', color: '#00FFFF', border: '1px solid rgba(0, 255, 255, 0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' },
  logoutBtn: { marginTop: '10px', padding: '15px', backgroundColor: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: '1px solid rgba(231, 76, 60, 0.3)', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' },
  mainArea: { flex: 1, marginLeft: window.innerWidth <= 768 ? '0' : '260px', display: 'flex', flexDirection: 'column', minHeight: '100vh' },
  desktopHeader: { display: window.innerWidth <= 768 ? 'none' : 'flex', height: '80px', alignItems: 'center', padding: '0 40px', backgroundColor: 'rgba(17, 34, 64, 0.5)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0, 255, 255, 0.1)' },
  pageTitle: { fontSize: '24px', fontWeight: 'bold', color: '#e6f1ff', textTransform: 'capitalize' },
  content: { padding: window.innerWidth <= 768 ? '80px 15px 20px' : '40px', flex: 1 },
  
  dashboardContainer: { animation: 'fadeIn 0.5s ease-in' },
  welcomeBanner: { 
    background: 'linear-gradient(90deg, rgba(0, 255, 255, 0.1), rgba(17, 34, 64, 0.6))', 
    padding: '30px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    marginBottom: '30px', border: '1px solid rgba(0, 255, 255, 0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' 
  },
  bannerTitle: { margin: 0, fontSize: '28px', color: '#00FFFF' },
  bannerSub: { margin: '10px 0 0 0', color: '#8892b0' },
  bannerIcon: { fontSize: '48px' },
  
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' },
  statCard: { backgroundColor: 'rgba(17, 34, 64, 0.6)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(0, 255, 255, 0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '15px' },
  statIcon: { fontSize: '24px', padding: '15px', borderRadius: '12px' },
  statNumber: { margin: 0, fontSize: '28px', fontWeight: '800', color: '#e6f1ff' },
  statLabel: { margin: '5px 0 0 0', fontSize: '14px', color: '#8892b0' },
  
  rowLayout: { display: 'grid', gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 1.5fr', gap: '30px' },
  card: { backgroundColor: 'rgba(17, 34, 64, 0.6)', backdropFilter: 'blur(12px)', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid rgba(0, 255, 255, 0.1)' },
  cardTitle: { margin: 0, fontSize: '18px', color: '#e6f1ff' },
  separator: { height: '2px', background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.5), transparent)', margin: '15px 0', boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)' },
  
  progressItem: { marginBottom: '15px' },
  progressHeader: { display: 'flex', justifyContent: 'space-between', color: '#8892b0', fontSize: '14px', marginBottom: '5px' },
  progressTrack: { height: '8px', backgroundColor: 'rgba(2, 12, 27, 0.8)', borderRadius: '10px', overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: '10px' },
  
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 10px', textAlign: 'left', color: '#D4AF37', borderBottom: '2px solid rgba(212, 175, 55, 0.3)', fontSize: '14px' },
  td: { padding: '12px 10px', color: '#e6f1ff', fontSize: '14px', borderBottom: '1px solid rgba(0, 255, 255, 0.1)' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }
};

export default CMDDashboard;
