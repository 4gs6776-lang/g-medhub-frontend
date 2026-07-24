import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Patients = () => {
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;
  
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/patients?hospital_id=${user.hospital_id}`);
        setPatients(res.data);
      } catch (err) {
        console.error('Failed to fetch patients');
      }
    };
    fetchPatients();
  }, [user, API_URL]);

  // Live filter logic
  const filteredPatients = patients.filter(p => 
    p.full_name.toLowerCase().includes(search.toLowerCase()) || 
    p.phone.includes(search) || 
    String(p.id).includes(search)
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>👥 Patient Directory</h2>

      <div style={styles.card}>
        <div style={styles.headerRow}>
          <h3 style={styles.cardTitle}>All Registered Patients ({patients.length})</h3>
        </div>
        <div style={styles.separator}></div>

        {/* Live Search Bar */}
        <input 
          type="text" 
          placeholder="🔍 Filter by Name, Phone, or ID..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={styles.searchInput} 
        />

        {/* Patient List */}
        <div style={styles.listContainer}>
          {filteredPatients.length === 0 ? (
            <p style={styles.emptyText}>No patients found.</p>
          ) : (
            filteredPatients.map((p) => (
              <div key={p.id} style={styles.patientItem}>
                <div style={styles.avatar}>
                  {p.full_name.charAt(0).toUpperCase()}
                </div>
                <div style={styles.patientInfo}>
                  <h4 style={styles.patientName}>{p.full_name} <span style={styles.patientId}>(GMH-{p.id})</span></h4>
                  <p style={styles.patientDetails}>
                    📞 {p.phone} | ⚧ {p.gender} | 🎂 {p.age}y
                  </p>
                </div>
                <div style={styles.dateBadge}>
                  {new Date(p.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", color: '#e6f1ff', animation: 'fadeIn 0.5s ease-in' },
  title: { fontSize: '24px', margin: '0 0 20px 0', color: '#e6f1ff' },
  card: { backgroundColor: 'rgba(17, 34, 64, 0.6)', backdropFilter: 'blur(12px)', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid rgba(0, 255, 255, 0.1)' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { margin: 0, fontSize: '20px', color: '#e6f1ff' },
  separator: { height: '2px', background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.5), transparent)', margin: '20px 0', boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)' },
  searchInput: { width: '100%', padding: '15px', fontSize: '16px', borderRadius: '8px', border: '1px solid rgba(0, 255, 255, 0.2)', backgroundColor: 'rgba(2, 12, 27, 0.8)', color: '#e6f1ff', outline: 'none', boxSizing: 'border-box', marginBottom: '20px' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '10px' },
  patientItem: { display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: 'rgba(2, 12, 27, 0.5)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(0, 255, 255, 0.05)', borderBottom: '1px solid rgba(0, 255, 255, 0.2)', transition: 'background 0.3s' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0, 255, 255, 0.1)', color: '#00FFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', border: '1px solid rgba(0, 255, 255, 0.2)' },
  patientInfo: { flex: 1 },
  patientName: { margin: 0, fontSize: '16px', color: '#e6f1ff' },
  patientId: { fontSize: '14px', color: '#00FFFF', fontWeight: 'normal' },
  patientDetails: { margin: '5px 0 0 0', fontSize: '14px', color: '#8892b0' },
  dateBadge: { fontSize: '12px', color: '#D4AF37', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '5px 10px', borderRadius: '6px', border: '1px solid rgba(212, 175, 55, 0.2)' },
  emptyText: { color: '#8892b0', textAlign: 'center', padding: '20px' }
};

export default Patients;
