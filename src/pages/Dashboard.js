import Reception from './Reception';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [hospitals, setHospitals] = useState([]);
  const [name, setName] = useState('');
  const [tier, setTier] = useState('Basic');
  const [view, setView] = useState('admin');
  const API_URL = process.env.REACT_APP_API_URL;

  // Fetch all hospitals when the page loads
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

  // Add a new hospital
  const handleAddHospital = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/hospitals`, { name, subscription_tier: tier });
      setName('');
      fetchHospitals(); // Refresh the list
      alert('Hospital added successfully!');
    } catch (err) {
      alert('Failed to add hospital');
    }
  };

    if (view === 'reception') {
    return (
      <div>
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <button onClick={() => setView('admin')} style={{padding: '10px 20px', backgroundColor: '#7f8c8d', color: 'white', border: 'none', borderRadius: '5px'}}>
            ⬅ Back to Admin Dashboard
          </button>
        </div>
        <Reception />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>G-MedHub Super Admin</h2>
        <button onClick={logout} style={styles.logoutBtn}>Logout</button>
      </div>

      <p style={{ color: '#7f8c8d' }}>Welcome, {user?.full_name}!</p>

      {/* Navigation Button to Reception */}
      <button onClick={() => setView('reception')} style={styles.receptionBtn}>
        Go to Reception Desk
      </button>

      {/* Add Hospital Form */}
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

      {/* List of Hospitals */}
      <div style={styles.card}>
        <h3>Active Hospitals ({hospitals.length})</h3>
        {hospitals.length === 0 ? (
          <p style={{ color: '#95a5a6' }}>No hospitals registered yet.</p>
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

      <p style={{ color: '#27ae60', marginTop: '20px', fontSize: '14px' }}>
        5-Minute Auto-Logout is ACTIVE.
      </p>
    </div>
  );

      {/* List of Hospitals */}
      <div style={styles.card}>
        <h3>Active Hospitals ({hospitals.length})</h3>
        {hospitals.length === 0 ? (
          <p style={{ color: '#95a5a6' }}>No hospitals registered yet.</p>
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

      <p style={{ color: '#27ae60', marginTop: '20px', fontSize: '14px' }}>
        5-Minute Auto-Logout is ACTIVE.
      </p>
    </div>
  );
};

const styles = {
  container: { maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #3498db', paddingBottom: '10px' },
  logoutBtn: { padding: '8px 16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  card: { backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginTop: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' },
  input: { padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' },
  addButton: { padding: '10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' },
  hospItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '15px', borderRadius: '5px', border: '1px solid #eee' },
  hospName: { fontSize: '16px', color: '#2c3e50' },
  hospTier: { fontSize: '12px', color: '#7f8c8d', margin: '5px 0 0 0' },
  statusBadge: { backgroundColor: '#2ecc71', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }
};

export default Dashboard;
