import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Lab = () => {
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;
  
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [result, setResult] = useState('');

  const fetchTests = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/labs?hospital_id=${user.hospital_id}`);
      setTests(res.data);
    } catch (err) {
      console.error('Failed to load lab tests');
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const openTest = (test) => {
    setSelectedTest(test);
    setResult(test.result || '');
  };

  const handleSaveResult = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/labs/${selectedTest.id}`, {
        result,
        status: 'Completed'
      });
      alert('Result saved successfully!');
      setSelectedTest(null);
      fetchTests(); // Refresh list
    } catch (err) {
      alert('Failed to save result');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Laboratory Desk</h2>

      {!selectedTest ? (
        <div style={styles.card}>
          <h3>Pending & Completed Tests</h3>
          {tests.length === 0 ? (
            <p style={{fontSize:'14px'}}>No lab tests requested yet.</p>
          ) : (
            tests.map((t) => (
              <div key={t.id} style={styles.testItem} onClick={() => openTest(t)}>
                <div>
                  <strong style={{color: '#00FFFF'}}>{t.test_name}</strong>
                  <p style={{margin: '5px 0 0 0', fontSize: '14px'}}>Patient: {t.patient_name} (GMH-{t.patient_id})</p>
                </div>
                <span style={t.status === 'Completed' ? styles.badgeGreen : styles.badgeOrange}>
                  {t.status}
                </span>
              </div>
            ))
          )}
        </div>
      ) : (
        <div style={styles.card}>
          <h3>Enter Result for: {selectedTest.test_name}</h3>
          <p style={{fontSize:'14px', color:'#8892b0'}}>Patient: {selectedTest.patient_name}</p>
          
          <form onSubmit={handleSaveResult} style={styles.form}>
            <textarea 
              placeholder="Type lab result here..." 
              value={result} 
              onChange={(e) => setResult(e.target.value)} 
              style={styles.textarea} 
              required 
            />
            <button type="submit" style={styles.button}>Save & Complete Test</button>
            <button type="button" onClick={() => setSelectedTest(null)} style={styles.backBtn}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#0a192f', minHeight: '100vh', color: '#00FFFF' },
  title: { color: '#00FFFF', borderBottom: '2px solid #00FFFF', paddingBottom: '10px' },
  card: { backgroundColor: '#112240', padding: '20px', borderRadius: '8px', marginTop: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', border: '1px solid #233554' },
  testItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0a192f', padding: '15px', borderRadius: '5px', marginBottom: '10px', border: '1px solid #233554', cursor: 'pointer' },
  badgeGreen: { backgroundColor: '#2ecc71', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' },
  badgeOrange: { backgroundColor: '#f39c12', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' },
  textarea: { padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #00FFFF', backgroundColor: '#0a192f', color: '#00FFFF', minHeight: '100px' },
  button: { padding: '10px', backgroundColor: '#00FFFF', color: '#0a192f', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  backBtn: { padding: '10px', backgroundColor: '#7f8c8d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }
};

export default Lab;
