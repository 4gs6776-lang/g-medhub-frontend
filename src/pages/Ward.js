import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Ward = () => {
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;
  
  const [beds, setBeds] = useState([]);
  const [formData, setFormData] = useState({ bed_number: '', ward_name: 'General Ward' });
  const [admitId, setAdmitId] = useState({}); // To hold patient IDs for admission

  const fetchBeds = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/wards?hospital_id=${user.hospital_id}`);
      setBeds(res.data);
    } catch (err) {
      console.error('Failed to fetch beds');
    }
  };

  useEffect(() => {
    fetchBeds();
  }, [user, API_URL]);

  const handleAddBed = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/wards`, { ...formData, hospital_id: user.hospital_id });
      alert('Bed added successfully!');
      setFormData({ bed_number: '', ward_name: 'General Ward' });
      fetchBeds();
    } catch (err) {
      alert('Failed to add bed');
    }
  };

  const handleAdmit = async (bedId) => {
    const patientId = admitId[bedId];
    if (!patientId) { alert('Please enter Patient ID first.'); return; }
    
    try {
      await axios.put(`${API_URL}/api/wards/${bedId}/admit`, { patient_id: patientId });
      alert('Patient admitted successfully!');
      setAdmitId({ ...admitId, [bedId]: '' });
      fetchBeds();
    } catch (err) {
      alert('Failed to admit patient. Check Patient ID.');
    }
  };

  const handleDischarge = async (bedId) => {
    if (window.confirm('Are you sure you want to discharge this patient and free the bed?')) {
      try {
        await axios.put(`${API_URL}/api/wards/${bedId}/discharge`);
        alert('Patient discharged. Bed is now available.');
        fetchBeds();
      } catch (err) {
        alert('Failed to discharge patient');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🛏️ Ward & Bed Allocation</h2>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>➕ Register New Bed</h3>
        <div style={styles.separator}></div>
        <form onSubmit={handleAddBed} style={styles.form}>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}><label style={styles.label}>Bed Number</label><input type="text" name="bed_number" placeholder="e.g., BED-01" value={formData.bed_number} onChange={(e) => setFormData({...formData, bed_number: e.target.value})} style={styles.input} required /></div>
            <div style={styles.inputGroup}><label style={styles.label}>Ward Name</label><select name="ward_name" value={formData.ward_name} onChange={(e) => setFormData({...formData, ward_name: e.target.value})} style={styles.input}><option>General Ward</option><option>Private Ward</option><option>ICU</option><option>Maternity Ward</option><option>Emergency</option></select></div>
          </div>
          <button type="submit" style={styles.button}>Add Bed</button>
        </form>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>📋 Bed Status ({beds.length})</h3>
        <div style={styles.separator}></div>
        
        {beds.length === 0 ? (
          <p style={{color: '#8892b0', textAlign: 'center'}}>No beds registered yet.</p>
        ) : (
          <div style={styles.bedGrid}>
            {beds.map((bed) => (
              <div key={bed.id} style={{
                ...styles.bedCard, 
                borderColor: bed.status === 'Available' ? 'rgba(46, 204, 113, 0.3)' : 'rgba(231, 76, 60, 0.3)'
              }}>
                <div style={styles.bedHeader}>
                  <h4 style={styles.bedNumber}>{bed.bed_number}</h4>
                  <span style={{
                    ...styles.statusBadge, 
                    color: bed.status === 'Available' ? '#2ecc71' : '#e74c3c',
                    backgroundColor: bed.status === 'Available' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)'
                  }}>{bed.status}</span>
                </div>
                <p style={styles.wardName}>📍 {bed.ward_name}</p>
                
                {bed.status === 'Available' ? (
                  <div style={styles.admitSection}>
                    <input 
                      type="number" 
                      placeholder="Patient ID" 
                      value={admitId[bed.id] || ''} 
                      onChange={(e) => setAdmitId({...admitId, [bed.id]: e.target.value})} 
                      style={styles.admitInput} 
                    />
                    <button onClick={() => handleAdmit(bed.id)} style={styles.admitBtn}>Admit</button>
                  </div>
                ) : (
                  <div style={styles.occupiedSection}>
                    <p style={styles.patientName}>🧍 {bed.patient_name || 'Unknown'} (ID: {bed.patient_id})</p>
                    <button onClick={() => handleDischarge(bed.id)} style={styles.dischargeBtn}>Discharge</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", color: '#e6f1ff', animation: 'fadeIn 0.5s ease-in' },
  title: { fontSize: '24px', margin: '0 0 20px 0', color: '#e6f1ff' },
  card: { backgroundColor: 'rgba(17, 34, 64, 0.6)', backdropFilter: 'blur(12px)', padding: '30px', borderRadius: '16px', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid rgba(0, 255, 255, 0.1)' },
  cardTitle: { margin: 0, fontSize: '20px', color: '#e6f1ff' },
  separator: { height: '2px', background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.5), transparent)', margin: '20px 0', boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '14px', color: '#8892b0' },
  input: { width: '100%', padding: '12px', fontSize: '14px', borderRadius: '8px', border: '1px solid rgba(0, 255, 255, 0.2)', backgroundColor: 'rgba(2, 12, 27, 0.8)', color: '#e6f1ff', outline: 'none', boxSizing: 'border-box' },
  button: { marginTop: '10px', padding: '15px', background: 'linear-gradient(90deg, #00FFFF, #00C6C6)', color: '#020c1b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  
  // Bed Grid
  bedGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
  bedCard: { backgroundColor: 'rgba(2, 12, 27, 0.5)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(0, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '10px' },
  bedHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  bedNumber: { margin: 0, fontSize: '18px', color: '#00FFFF', fontWeight: 'bold' },
  statusBadge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  wardName: { margin: 0, fontSize: '14px', color: '#8892b0' },
  
  admitSection: { display: 'flex', gap: '10px', marginTop: '10px' },
  admitInput: { flex: 1, padding: '10px', fontSize: '14px', borderRadius: '6px', border: '1px solid rgba(0, 255, 255, 0.2)', backgroundColor: 'rgba(2, 12, 27, 0.8)', color: '#e6f1ff', outline: 'none' },
  admitBtn: { padding: '10px 15px', backgroundColor: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', border: '1px solid rgba(46, 204, 113, 0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  
  occupiedSection: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' },
  patientName: { margin: 0, fontSize: '14px', color: '#e6f1ff', backgroundColor: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '6px' },
  dischargeBtn: { width: '100%', padding: '10px', backgroundColor: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: '1px solid rgba(231, 76, 60, 0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }
};

export default Ward;
