import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Doctor = () => {
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;
  
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [history, setHistory] = useState([]);

  // Search Patient
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`${API_URL}/api/patients/search?query=${search}&hospital_id=${user.hospital_id}`);
      setResults(res.data);
    } catch (err) {
      alert('Search failed');
    }
  };

  // Select Patient & Get History
  const selectPatient = async (patient) => {
    setSelectedPatient(patient);
    setResults([]);
    setSearch('');
    try {
      const res = await axios.get(`${API_URL}/api/consultations/${patient.id}`);
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to load history');
    }
  };

  // Save Consultation
  const handleSaveConsult = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/consultations`, {
        hospital_id: user.hospital_id,
        patient_id: selectedPatient.id,
        doctor_id: user.id,
        symptoms,
        diagnosis,
        treatment_plan: treatment
      });
      alert('Consultation saved successfully!');
      setSymptoms(''); setDiagnosis(''); setTreatment('');
      
      // Refresh history
      const res = await axios.get(`${API_URL}/api/consultations/${selectedPatient.id}`);
      setHistory(res.data);
    } catch (err) {
      alert('Failed to save consultation');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Doctor's Consultation Desk</h2>

      {/* Step 1: Search Box */}
      {!selectedPatient && (
        <div style={styles.card}>
          <h3>Find Patient</h3>
          <form onSubmit={handleSearch} style={styles.form}>
            <input type="text" placeholder="Search Name, Phone, or ID" value={search} onChange={(e) => setSearch(e.target.value)} style={styles.input} required />
            <button type="submit" style={styles.button}>Search</button>
          </form>
          
          <div style={{ marginTop: '15px' }}>
            {results.map((p) => (
              <div key={p.id} style={styles.resultItem} onClick={() => selectPatient(p)}>
                <strong>GMH-{p.id}</strong> - {p.full_name} <br/>
                <span style={{fontSize:'14px'}}>{p.phone} | {p.gender} | {p.age}y</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Consultation Box */}
      {selectedPatient && (
        <>
          <div style={styles.patientHeader}>
            <div>
              <h3 style={{margin:0, color:'#00FFFF'}}>{selectedPatient.full_name}</h3>
              <p style={{margin:'5px 0 0 0', fontSize:'14px'}}>ID: GMH-{selectedPatient.id} | {selectedPatient.gender} | {selectedPatient.age}y</p>
            </div>
            <button onClick={() => setSelectedPatient(null)} style={styles.backBtn}>Change Patient</button>
          </div>

          <div style={styles.card}>
            <h3>New Consultation</h3>
            <form onSubmit={handleSaveConsult} style={styles.form}>
              <textarea placeholder="Symptoms & Complaints" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} style={styles.textarea} required />
              <input type="text" placeholder="Diagnosis (ICD-10)" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} style={styles.input} required />
              <textarea placeholder="Treatment Plan & Prescription" value={treatment} onChange={(e) => setTreatment(e.target.value)} style={styles.textarea} required />
              <button type="submit" style={styles.button}>Save Consultation</button>
            </form>
          </div>

          <div style={styles.card}>
            <h3>Patient History ({history.length})</h3>
            {history.length === 0 ? (
              <p style={{fontSize:'14px'}}>No previous consultations.</p>
            ) : (
              history.map((h) => (
                <div key={h.id} style={styles.historyItem}>
                  <p style={{margin:'0 0 5px 0', fontSize:'14px', color:'#8892b0'}}>{new Date(h.created_at).toLocaleString()}</p>
                  <p style={{margin:'0 0 5px 0'}}><strong>Symptoms:</strong> {h.symptoms}</p>
                  <p style={{margin:'0 0 5px 0'}}><strong>Diagnosis:</strong> {h.diagnosis}</p>
                  <p style={{margin:0}}><strong>Plan:</strong> {h.treatment_plan}</p>
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
  container: { maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#0a192f', minHeight: '100vh', color: '#00FFFF' },
  title: { color: '#00FFFF', borderBottom: '2px solid #00FFFF', paddingBottom: '10px' },
  card: { backgroundColor: '#112240', padding: '20px', borderRadius: '8px', marginTop: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', border: '1px solid #233554' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' },
  input: { padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #00FFFF', backgroundColor: '#0a192f', color: '#00FFFF' },
  textarea: { padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #00FFFF', backgroundColor: '#0a192f', color: '#00FFFF', minHeight: '80px' },
  button: { padding: '10px', backgroundColor: '#00FFFF', color: '#0a192f', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  resultItem: { backgroundColor: '#0a192f', padding: '10px', borderRadius: '5px', marginBottom: '5px', border: '1px solid #233554', cursor: 'pointer' },
  patientHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#112240', padding: '15px', borderRadius: '8px', marginTop: '20px', border: '1px solid #233554' },
  backBtn: { padding: '8px 16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  historyItem: { backgroundColor: '#0a192f', padding: '15px', borderRadius: '5px', marginBottom: '10px', border: '1px solid #233554' }
};

export default Doctor;
