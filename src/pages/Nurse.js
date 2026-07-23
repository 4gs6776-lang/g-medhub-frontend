import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Nurse = () => {
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;
  
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  const [vitals, setVitals] = useState({ temp: '', pulse: '', resp: '', bp: '', o2: '' });
  const [notes, setNotes] = useState('');
  const [history, setHistory] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`${API_URL}/api/patients/search?query=${search}&hospital_id=${user.hospital_id}`);
      setResults(res.data);
    } catch (err) {
      alert('Search failed');
    }
  };

  const selectPatient = async (patient) => {
    setSelectedPatient(patient);
    setResults([]);
    setSearch('');
    try {
      const res = await axios.get(`${API_URL}/api/nurse/vitals/${patient.id}`);
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to load nursing history');
    }
  };

  const handleSaveVitals = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/nurse/vitals`, {
        hospital_id: user.hospital_id,
        patient_id: selectedPatient.id,
        nurse_id: user.id,
        temperature: vitals.temp,
        pulse: vitals.pulse,
        respiration: vitals.resp,
        blood_pressure: vitals.bp,
        oxygen_saturation: vitals.o2,
        nursing_notes: notes
      });
      alert('Vitals and notes saved successfully!');
      setVitals({ temp: '', pulse: '', resp: '', bp: '', o2: '' });
      setNotes('');
      
      const res = await axios.get(`${API_URL}/api/nurse/vitals/${selectedPatient.id}`);
      setHistory(res.data);
    } catch (err) {
      alert('Failed to save vitals');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Nursing Station</h2>

      {!selectedPatient ? (
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
      ) : (
        <>
          <div style={styles.patientHeader}>
            <div>
              <h3 style={{margin:0, color:'#00FFFF'}}>{selectedPatient.full_name}</h3>
              <p style={{margin:'5px 0 0 0', fontSize:'14px'}}>ID: GMH-{selectedPatient.id} | {selectedPatient.gender} | {selectedPatient.age}y</p>
            </div>
            <button onClick={() => setSelectedPatient(null)} style={styles.backBtn}>Change Patient</button>
          </div>

          <div style={styles.card}>
            <h3>Record Vitals & Notes</h3>
            <form onSubmit={handleSaveVitals} style={styles.form}>
              <div style={styles.vitalsGrid}>
                <input type="text" placeholder="Temp (°C)" value={vitals.temp} onChange={(e) => setVitals({...vitals, temp: e.target.value})} style={styles.input} />
                <input type="text" placeholder="Pulse (bpm)" value={vitals.pulse} onChange={(e) => setVitals({...vitals, pulse: e.target.value})} style={styles.input} />
                <input type="text" placeholder="Resp (/min)" value={vitals.resp} onChange={(e) => setVitals({...vitals, resp: e.target.value})} style={styles.input} />
                <input type="text" placeholder="BP (mmHg)" value={vitals.bp} onChange={(e) => setVitals({...vitals, bp: e.target.value})} style={styles.input} />
                <input type="text" placeholder="O2 Sat (%)" value={vitals.o2} onChange={(e) => setVitals({...vitals, o2: e.target.value})} style={styles.input} />
              </div>
              <textarea placeholder="Nursing Notes (e.g., Patient complains of headache...)" value={notes} onChange={(e) => setNotes(e.target.value)} style={styles.textarea} required />
              <button type="submit" style={styles.button}>Save Record</button>
            </form>
          </div>

          <div style={styles.card}>
            <h3>Nursing History ({history.length})</h3>
            {history.length === 0 ? (
              <p style={{fontSize:'14px'}}>No previous nursing records.</p>
            ) : (
              history.map((h) => (
                <div key={h.id} style={styles.historyItem}>
                  <p style={{margin:'0 0 5px 0', fontSize:'14px', color:'#8892b0'}}>{new Date(h.created_at).toLocaleString()}</p>
                  <p style={{margin:'0 0 5px 0'}}>
                    <strong>Vitals:</strong> T: {h.temperature} | P: {h.pulse} | R: {h.respiration} | BP: {h.blood_pressure} | O2: {h.oxygen_saturation}
                  </p>
                  <p style={{margin:0}}><strong>Notes:</strong> {h.nursing_notes}</p>
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
  container: { maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#0a192f', minHeight: '100vh', color: '#00FFFF' },
  title: { color: '#00FFFF', borderBottom: '2px solid #00FFFF', paddingBottom: '10px' },
  card: { backgroundColor: '#112240', padding: '20px', borderRadius: '8px', marginTop: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', border: '1px solid #233554' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' },
  vitalsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' },
  input: { padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #00FFFF', backgroundColor: '#0a192f', color: '#00FFFF' },
  textarea: { padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #00FFFF', backgroundColor: '#0a192f', color: '#00FFFF', minHeight: '80px' },
  button: { padding: '10px', backgroundColor: '#00FFFF', color: '#0a192f', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  resultItem: { backgroundColor: '#0a192f', padding: '10px', borderRadius: '5px', marginBottom: '5px', border: '1px solid #233554', cursor: 'pointer' },
  patientHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#112240', padding: '15px', borderRadius: '8px', marginTop: '20px', border: '1px solid #233554' },
  backBtn: { padding: '8px 16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  historyItem: { backgroundColor: '#0a192f', padding: '15px', borderRadius: '5px', marginBottom: '10px', border: '1px solid #233554' }
};

export default Nurse;
