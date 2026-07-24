import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Maternity = () => {
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;
  
  const [ancPatients, setAncPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  const [history, setHistory] = useState([]);
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    visit_date: today, gestational_age: '', temperature: '', blood_pressure: '', pulse: '', respiration: '', oxygen_saturation: '', weight: '', fetal_heart_rate: '', findings: '', next_appointment: ''
  });

  // Auto-fetch all ANC patients when the page loads
  useEffect(() => {
    const fetchAncPatients = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/patients/anc?hospital_id=${user.hospital_id}`);
        setAncPatients(res.data);
      } catch (err) { console.error('Failed to fetch ANC patients'); }
    };
    fetchAncPatients();
  }, [user, API_URL]);

  const selectPatient = async (patient) => {
    setSelectedPatient(patient);
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
      await axios.post(`${API_URL}/api/anc`, { ...formData, hospital_id: user.hospital_id, patient_id: selectedPatient.id });
      alert('ANC Visit & Vitals recorded successfully!');
      setFormData({ visit_date: today, gestational_age: '', temperature: '', blood_pressure: '', pulse: '', respiration: '', oxygen_saturation: '', weight: '', fetal_heart_rate: '', findings: '', next_appointment: '' });
      const res = await axios.get(`${API_URL}/api/anc/${selectedPatient.id}`);
      setHistory(res.data);
    } catch (err) { alert('Failed to save ANC visit'); }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🤰 ANC & Maternity Desk</h2>

      {!selectedPatient ? (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Registered ANC Patients ({ancPatients.length})</h3>
          <div style={styles.separator}></div>
          <p style={{color: '#8892b0', fontSize: '14px', marginBottom: '15px'}}>Patients registered at Reception under the "ANC folder" will appear here automatically.</p>
          
          <div style={styles.listContainer}>
            {ancPatients.length === 0 ? (
              <p style={styles.emptyText}>No ANC patients registered yet.</p>
            ) : (
              ancPatients.map((p) => (
                <div key={p.id} style={styles.patientItem} onClick={() => selectPatient(p)}>
                  <div style={styles.avatar}>{p.full_name.charAt(0)}</div>
                  <div style={styles.patientInfo}>
                    <h4 style={styles.patientName}>{p.full_name} <span style={styles.patientId}>(GMH-{p.id})</span></h4>
                    <p style={styles.patientDetails}>📞 {p.phone} | 🎂 {p.age}y | 🩸 {p.blood_group}</p>
                  </div>
                </div>
              ))
            )}
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
              <button onClick={() => setSelectedPatient(null)} style={styles.backBtn}>Back to List</button>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>➕ Record New ANC Visit</h3>
            <div style={styles.separator}></div>
            <form onSubmit={handleSaveVisit} style={styles.form}>
              <label style={styles.sectionLabel}>Standard Vitals</label>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}><label style={styles.label}>Temp (°C)</label><input type="text" name="temperature" placeholder="36.5" value={formData.temperature} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label style={styles.label}>BP (mmHg)</label><input type="text" name="blood_pressure" placeholder="120/80" value={formData.blood_pressure} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label style={styles.label}>Pulse (bpm)</label><input type="text" name="pulse" placeholder="72" value={formData.pulse} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label style={styles.label}>Resp (rpm)</label><input type="text" name="respiration" placeholder="16" value={formData.respiration} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label style={styles.label}>SpO2 (%)</label><input type="text" name="oxygen_saturation" placeholder="98" value={formData.oxygen_saturation} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label style={styles.label}>Weight (kg)</label><input type="text" name="weight" placeholder="68" value={formData.weight} onChange={handleInputChange} style={styles.input} /></div>
              </div>

              <label style={{...styles.sectionLabel, marginTop: '20px'}}>Maternity Specifics</label>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}><label style={styles.label}>Visit Date</label><input type="date" name="visit_date" value={formData.visit_date} onChange={handleInputChange} style={styles.input} required /></div>
                <div style={styles.inputGroup}><label style={styles.label}>Gestational Age (weeks)</label><input type="text" name="gestational_age" placeholder="e.g. 24 weeks" value={formData.gestational_age} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label style={styles.label}>Fetal Heart Rate (bpm)</label><input type="text" name="fetal_heart_rate" placeholder="e.g. 140" value={formData.fetal_heart_rate} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label style={styles.label}>Next Appointment</label><input type="date" name="next_appointment" value={formData.next_appointment} onChange={handleInputChange} style={styles.input} /></div>
              </div>
              
              <div style={styles.inputGroup}><label style={styles.label}>Findings & Notes</label><textarea name="findings" placeholder="e.g., Fetal movements normal, no swelling..." value={formData.findings} onChange={handleInputChange} style={{...styles.input, minHeight: '60px'}} /></div>
              <button type="submit" style={styles.saveBtn}>Save ANC Visit</button>
            </form>
          </div>

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
                  <div style={styles.subSection}>
                    <strong style={{color: '#00FFFF'}}>Vitals:</strong>
                    <p style={styles.historyText}>T: {visit.temperature || 'N/A'}°C | BP: {visit.blood_pressure || 'N/A'} | HR: {visit.pulse || 'N/A'}bpm | Resp: {visit.respiration || 'N/A'} | SpO2: {visit.oxygen_saturation || 'N/A'}% | Wt: {visit.weight || 'N/A'}kg</p>
                  </div>
                  <div style={styles.subSection}>
                    <strong style={{color: '#D4AF37'}}>Maternity:</strong>
                    <p style={styles.historyText}>Gestational Age: {visit.gestational_age || 'N/A'} | Fetal HR: {visit.fetal_heart_rate || 'N/A'} bpm</p>
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
  sectionLabel: { display: 'block', fontSize: '14px', color: '#D4AF37', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '10px' },
  patientItem: { display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: 'rgba(2, 12, 27, 0.5)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(0, 255, 255, 0.05)', borderBottom: '1px solid rgba(0, 255, 255, 0.2)', cursor: 'pointer', transition: 'background 0.3s' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0, 255, 255, 0.1)', color: '#00FFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', border: '1px solid rgba(0, 255, 255, 0.2)' },
  patientInfo: { flex: 1 },
  patientName: { margin: 0, fontSize: '16px', color: '#e6f1ff' },
  patientId: { fontSize: '14px', color: '#00FFFF', fontWeight: 'normal' },
  patientDetails: { margin: '5px 0 0 0', fontSize: '14px', color: '#8892b0' },
  emptyText: { color: '#8892b0', textAlign: 'center', padding: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '14px', color: '#8892b0' },
  input: { width: '100%', padding: '12px', fontSize: '14px', borderRadius: '8px', border: '1px solid rgba(0, 255, 255, 0.2)', backgroundColor: 'rgba(2, 12, 27, 0.8)', color: '#e6f1ff', outline: 'none', boxSizing: 'border-box' },
  saveBtn: { marginTop: '10px', padding: '15px', background: 'linear-gradient(90deg, #00FFFF, #00C6C6)', color: '#020c1b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  patientHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(17, 34, 64, 0.6)', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(0, 255, 255, 0.1)', flexWrap: 'wrap', gap: '10px' },
  backBtn: { padding: '10px 20px', backgroundColor: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: '1px solid rgba(231, 76, 60, 0.3)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  printBtn: { padding: '10px 20px', backgroundColor: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  historyItem: { backgroundColor: 'rgba(2, 12, 27, 0.5)', padding: '20px', borderRadius: '12px', marginBottom: '15px', border: '1px solid rgba(0, 255, 255, 0.1)', borderBottom: '1px solid rgba(0, 255, 255, 0.2)' },
  historyHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid rgba(0, 255, 255, 0.1)', paddingBottom: '10px' },
  dateText: { fontSize: '16px', color: '#00FFFF', fontWeight: 'bold' },
  nextAppt: { fontSize: '12px', color: '#D4AF37', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '5px 10px', borderRadius: '6px', border: '1px solid rgba(212, 175, 55, 0.2)' },
  subSection: { marginBottom: '10px' },
  historyText: { margin: '5px 0 0 0', fontSize: '14px', color: '#e6f1ff' }
};

export default Maternity;
