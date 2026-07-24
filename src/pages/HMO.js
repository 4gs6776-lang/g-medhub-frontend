import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const HMO = () => {
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;
  
  const [claims, setClaims] = useState([]);
  const [formData, setFormData] = useState({
    patient_id: '', hmo_name: '', service_code: '', diagnosis_code: '', claim_amount: ''
  });

  const fetchClaims = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/hmo?hospital_id=${user.hospital_id}`);
      setClaims(res.data);
    } catch (err) {
      console.error('Failed to fetch claims');
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [user, API_URL]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/hmo`, { ...formData, hospital_id: user.hospital_id });
      alert('HMO Claim submitted successfully!');
      setFormData({ patient_id: '', hmo_name: '', service_code: '', diagnosis_code: '', claim_amount: '' });
      fetchClaims();
    } catch (err) {
      alert('Failed to submit claim. Check Patient ID.');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`${API_URL}/api/hmo/${id}`, { status });
      alert(`Claim ${status}!`);
      fetchClaims();
    } catch (err) {
      alert('Failed to update claim status');
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Approved': return { color: '#2ecc71', bg: 'rgba(46, 204, 113, 0.1)', border: '1px solid rgba(46, 204, 113, 0.3)' };
      case 'Rejected': return { color: '#e74c3c', bg: 'rgba(231, 76, 60, 0.1)', border: '1px solid rgba(231, 76, 60, 0.3)' };
      default: return { color: '#f39c12', bg: 'rgba(243, 156, 18, 0.1)', border: '1px solid rgba(243, 156, 18, 0.3)' }; // Pending
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📑 HMO Claims & Insurance</h2>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>➕ Submit New Claim</h3>
        <div style={styles.separator}></div>
        <form onSubmit={handleSubmitClaim} style={styles.form}>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}><label style={styles.label}>Patient ID</label><input type="number" name="patient_id" placeholder="e.g., 1" value={formData.patient_id} onChange={handleInputChange} style={styles.input} required /></div>
            <div style={styles.inputGroup}><label style={styles.label}>HMO Name</label><input type="text" name="hmo_name" placeholder="e.g., NHIS, AXA" value={formData.hmo_name} onChange={handleInputChange} style={styles.input} required /></div>
            <div style={styles.inputGroup}><label style={styles.label}>Service Code</label><input type="text" name="service_code" placeholder="e.g., CONS-001" value={formData.service_code} onChange={handleInputChange} style={styles.input} /></div>
            <div style={styles.inputGroup}><label style={styles.label}>Diagnosis Code</label><input type="text" name="diagnosis_code" placeholder="e.g., Malaria (ICD-10)" value={formData.diagnosis_code} onChange={handleInputChange} style={styles.input} /></div>
            <div style={styles.inputGroup}><label style={styles.label}>Claim Amount ($)</label><input type="number" name="claim_amount" placeholder="e.g., 150" value={formData.claim_amount} onChange={handleInputChange} style={styles.input} required /></div>
          </div>
          <button type="submit" style={styles.button}>Submit Claim</button>
        </form>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>📋 Claims History ({claims.length})</h3>
        <div style={styles.separator}></div>
        
        {claims.length === 0 ? (
          <p style={{color: '#8892b0', textAlign: 'center'}}>No claims submitted yet.</p>
        ) : (
          claims.map((c) => {
            const st = getStatusStyle(c.status);
            return (
              <div key={c.id} style={styles.claimItem}>
                <div style={styles.claimDetails}>
                  <h4 style={styles.patientName}>{c.patient_name || 'Unknown'} <span style={{fontSize: '14px', color: '#8892b0', fontWeight: 'normal'}}>(ID: {c.patient_id})</span></h4>
                  <p style={styles.claimText}>🏢 <strong>HMO:</strong> {c.hmo_name} | 💰 <strong>Amount:</strong> ${c.claim_amount}</p>
                  <p style={styles.claimText}>🏥 <strong>Service:</strong> {c.service_code || 'N/A'} | 🩺 <strong>Diagnosis:</strong> {c.diagnosis_code || 'N/A'}</p>
                </div>
                <div style={styles.statusArea}>
                  <span style={{...styles.badge, color: st.color, backgroundColor: st.bg, border: st.border}}>{c.status}</span>
                  {c.status === 'Pending' && (
                    <div style={styles.actionBtns}>
                      <button onClick={() => handleStatusChange(c.id, 'Approved')} style={styles.approveBtn}>Approve</button>
                      <button onClick={() => handleStatusChange(c.id, 'Rejected')} style={styles.rejectBtn}>Reject</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", color: '#e6f1ff', animation: 'fadeIn 0.5s ease-in' },
  title: { fontSize: '24px', margin: '0 0 20px 0', color: '#e6f1ff' },
  card: { backgroundColor: 'rgba(17, 34, 64, 0.6)', backdropFilter: 'blur(12px)', padding: '30px', borderRadius: '16px', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid rgba(0, 255, 255, 0.1)' },
  cardTitle: { margin: 0, fontSize: '20px', color: '#e6f1ff' },
  separator: { height: '2px', background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.5), transparent)', margin: '20px 0', boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '14px', color: '#8892b0' },
  input: { width: '100%', padding: '12px', fontSize: '14px', borderRadius: '8px', border: '1px solid rgba(0, 255, 255, 0.2)', backgroundColor: 'rgba(2, 12, 27, 0.8)', color: '#e6f1ff', outline: 'none', boxSizing: 'border-box' },
  button: { marginTop: '10px', padding: '15px', background: 'linear-gradient(90deg, #00FFFF, #00C6C6)', color: '#020c1b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  
  claimItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(2, 12, 27, 0.5)', padding: '20px', borderRadius: '12px', marginBottom: '15px', border: '1px solid rgba(0, 255, 255, 0.1)', borderBottom: '1px solid rgba(0, 255, 255, 0.2)', flexWrap: 'wrap', gap: '15px' },
  claimDetails: { flex: 1 },
  patientName: { margin: '0 0 10px 0', fontSize: '18px', color: '#00FFFF', fontWeight: 'bold' },
  claimText: { margin: '5px 0', fontSize: '14px', color: '#e6f1ff' },
  statusArea: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' },
  badge: { padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  actionBtns: { display: 'flex', gap: '8px' },
  approveBtn: { padding: '8px 16px', backgroundColor: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', border: '1px solid rgba(46, 204, 113, 0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
  rejectBtn: { padding: '8px 16px', backgroundColor: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: '1px solid rgba(231, 76, 60, 0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }
};

export default HMO;
