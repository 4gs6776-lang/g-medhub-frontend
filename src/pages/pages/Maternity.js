import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Maternity = () => {
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;
  
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  const [history, setHistory] = useState([]);
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    visit_date: today, gestational_age: '', blood_pressure: '', fetal_heart_rate: '', weight: '', findings: '', next_appointment: ''
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`${API_URL}/api/patients/search?query=${search}&hospital_id=${user.hospital_id}`);
      setResults(res.data);
    } catch (err) { alert('Search failed'); }
  };

  const selectPatient = async (patient) => {
    setSelectedPatient(patient);
    setResults([]); setSearch('');
    try {
      const res = await axios.get(`${API_URL}/api/anc/${patient.id}`);
      setHistory(res.data);
    } catch (err) { console.error('Failed to load ANC history'); }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveVisit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/anc`, {
        ...formData, hospital_id: user.hospital_id, patient_id: selectedPatient.id
      });
      alert('ANC Visit recorded successfully!');
      setFormData({ visit_date: today, gestational_age: '', blood_pressure: '', fetal_heart_rate: '', weight: '', findings: '', next_appointment: '' });
      
      const res = await axios.get(`${API_URL}/api/anc/${selectedPatient.id}`);
      setHistory(res.data);
    } catch (err) { alert('Failed to save ANC visit'); }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🤰 ANC & Maternity Desk</h2>

      {!selectedPatient ? (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Find Patient</h3>
          <div style={styles.separator}></div>
          <form onSubmit={handleSearch} style={styles.form}>
            <input type="text" placeholder="Search Name, Phone, or ID" value={search} onChange={(e) => setSearch(e.target.value)} style={styles.input} required />
            <button type="submit" style={styles.button}>Search</button>
          </form>
          
          <div style={{ marginTop: '15px' }}>
            {results.map((p) => (
              <div key={p.id} style={styles.resultItem} onClick={() => selectPatient(p)}>
                <strong>GMH-{p.id}</strong> - {p.full_name} <br/>
                <span style={{fontSize:'14px', color: '#8892b0'}}>{p.phone} | {p.gender} | {p.age}y</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div style={styles.patientHeader}>
            <div>
              <h3 style={{margin:0, color: '#00FFFF'}}>{selectedPatient.full_name} <span style={{fontSize:'14px', color:'#8892b0'}}>(GMH-{selectedPatient.id})</span></h3>
              <p style={{margin:'5px 0 0 0', fontSize:'14px', color: '#8892b0'}}>Antenatal Care Record</p>
            </div>
            <div style={{display: 'flex', gap: '10px'}}>
              <button onClick={() => window.print()} style={styles.printBtn}>🖨️ Print</button>
              <button onClick={() => setSelectedPatient(null)} style={styles.backBtn}>Close Record</button>
            </div>
          </div>

          {/* Add Visit Form */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>➕ Record New ANC Visit</h3>
            <div style={styles.separator}></div>
            <form onSubmit={handleSaveVisit} style={styles.form}>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}><label style={styles.label}>Visit Date</label><input type="date" name="visit_date" value={formData.visit_date} onChange={handleInputChange} style={styles.input} required /></div>
                <div style={styles.inputGroup}><label style={styles.label}>Gestational Age (weeks)</label><input type="text" name="gestational_age" placeholder="e.g. 24 weeks" value={formData.gestational_age} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label style={styles.label}>Maternal BP (mmHg)</label><input type="text" name="blood_pressure" placeholder="e.g. 120/80" value={formData.blood_pressure} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label style={styles.label}>Fetal Heart Rate (bpm)</label><input type="text" name="fetal_heart_rate" placeholder="e.g. 140" value={formData.fetal_heart_rate} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label style={styles.label}>Weight (kg)</label><input type="text" name="weight" placeholder="e.g. 68" value={formData.weight} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label style={styles.label}>Next Appointment</label><input type="date" name="next_appointment" value={formData.next_appointment} onChange={handleInputChange} style={styles.input} /></div>
              </div>
              <div style={styles.inputGroup}><label style={styles.label}>Findings & Notes</label><textarea name="findings" placeholder="e.g., Fetal movements normal, no swelling..." value={formData.findings} onChange={handleInputChange} style={{...styles.input, minHeight: '60px'}} /></div>
              <button type="submit" style={styles.saveBtn}>Save ANC Visit</button>
            </form>
          </div>

          {/* ANC History */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📋 ANC Visit History ({history.length})</h3>
            <div style={styles.separator}></div>
            
            {history.length === 0 ? (
              <p style={{color: '#8892b0', textAlign: 'center'}}>No ANC visits recorded yet.</p>
            ) : (
              history.map((visit) => (
                <div key={visit.id} style={styles.historyItem}>
                  <div style={styles.historyHeader}>
                    <span style={styles.dateText}>📅 {new Date(visit.visit_date).toLocaleDateString()}</span>
                    {visit.next_appointment && <span style={styles.nextAppt}>Next Visit: {new Date(visit.next_appointment).toLocaleDateString()}</span>}
                  </div>
                  <div style={styles.historyGrid}>
                    <p style={styles.historyText}><strong>gestational Age:</strong> {visit.gestational_age || 'N/A'}</p>
                    <p style={styles.historyText}><strong>Maternal BP:</strong> {visit.blood_pressure || 'N/A'}</p>
                    <p style={styles.historyText}><strong>Fetal HR:</strong> {visit.fetal_heart_rate || 'N/A'} bpm</p>
                    <p style={styles.historyText}><strong>Weight:</strong> {visit.weight || 'N/A'} kg</p>
                  </div>
                  {visit.findings && <p style={styles.historyText}><strong>Findings:</strong> {visit.findings}</p>}
                </div>
              ))
            )}
          </div>
        </>
      )}
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
  button: { padding: '15px 30px', background: 'linear-gradient(90deg, #00FFFF, #00C6C6)', color: '#020c1b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(0, 255, 255, 0.3)' },
  saveBtn: { marginTop: '10px', padding: '15px', background: 'linear-gradient(90deg, #00FFFF, #00C6C6)', color: '#020c1b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  resultItem: { backgroundColor: 'rgba(2, 12, 27, 0.5)', padding: '15px', borderRadius: '8px', marginBottom: '10px', border: '1px solid rgba(0, 255, 255, 0.1)', cursor: 'pointer' },
  
  patientHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(17, 34, 64, 0.6)', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(0, 255, 255, 0.1)', flexWrap: 'wrap', gap: '10px' },
  backBtn: { padding: '10px 20px', backgroundColor: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: '1px solid rgba(231, 76, 60, 0.3)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  printBtn: { padding: '10px 20px', backgroundColor: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  
  historyItem: { backgroundColor: 'rgba(2, 12, 27, 0.5)', padding: '20px', borderRadius: '12px', marginBottom: '15px', border: '1px solid rgba(0, 255, 255, 0.1)', borderBottom: '1px solid rgba(0, 255, 255, 0.2)' },
  historyHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid rgba(0, 255, 255, 0.1)', paddingBottom: '10px' },
  dateText: { fontSize: '16px', color: '#00FFFF', fontWeight: 'bold' },
  nextAppt: { fontSize: '12px', color: '#D4AF37', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '5px 10px', borderRadius: '6px', border: '1px solid rgba(212, 175, 55, 0.2)' },
  historyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px', marginBottom: '10px' },
  historyText: { margin: 0, fontSize: '14px', color: '#e6f1ff' }
};

export default Maternity;
