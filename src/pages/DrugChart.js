import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const DrugChart = () => {
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;
  
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  const [chartData, setChartData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    entry_date: today, entry_time: '', medication: '', dosage: '', next_dose_time: '', route: 'Oral', frequency: 'Stat', sign: user?.full_name || 'Nurse'
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
      const res = await axios.get(`${API_URL}/api/drugchart/${patient.id}`);
      setChartData(res.data);
      const lastPage = Math.ceil((res.data.length + 1) / 10);
      setCurrentPage(lastPage === 0 ? 1 : lastPage);
    } catch (err) { console.error('Failed to load chart'); }
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/drugchart`, {
        ...formData, hospital_id: user.hospital_id, patient_id: selectedPatient.id, nurse_id: user.id
      });
      const newChartData = [...chartData, res.data];
      setChartData(newChartData);
      const newLastPage = Math.ceil((newChartData.length + 1) / 10);
      setCurrentPage(newLastPage);
      setFormData({ ...formData, entry_time: '', medication: '', dosage: '', next_dose_time: '' });
    } catch (err) { alert('Failed to add entry'); }
  };

  const startIndex = (currentPage - 1) * 10;
  const currentEntries = chartData.slice(startIndex, startIndex + 10);
  const totalPages = Math.ceil((chartData.length + 1) / 10);
  const emptyRowsNeeded = 10 - currentEntries.length;
  const emptyRows = Array.from({ length: emptyRowsNeeded });

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>💉 Drug Administration Chart</h2>

      {!selectedPatient ? (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Find Patient for Drug Chart</h3>
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
              <h3 style={{margin:0, color: '#00FFFF'}}>{selectedPatient.full_name}</h3>
              <p style={{margin:'5px 0 0 0', fontSize:'14px', color: '#8892b0'}}>ID: GMH-{selectedPatient.id}</p>
            </div>
            <div style={{display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap'}}>
              <div style={styles.pageNav}>
                <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} style={styles.navBtn}>← Prev</button>
                <span style={{color: '#D4AF37', fontWeight: 'bold'}}>Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} style={styles.navBtn}>Next →</button>
              </div>
              <button onClick={() => setSelectedPatient(null)} style={styles.backBtn}>Change Patient</button>
            </div>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th><th style={styles.th}>Time</th><th style={styles.th}>Medication</th>
                  <th style={styles.th}>Dosage</th><th style={styles.th}>Next Dose</th><th style={styles.th}>Route</th>
                  <th style={styles.th}>Frequency</th><th style={styles.th}>Sign</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((entry) => (
                  <tr key={entry.id} style={styles.row}>
                    <td style={styles.td}>{entry.entry_date}</td><td style={styles.td}>{entry.entry_time}</td>
                    <td style={styles.tdHighlight}>{entry.medication}</td><td style={styles.td}>{entry.dosage}</td>
                    <td style={styles.td}>{entry.next_dose_time}</td><td style={styles.td}>{entry.route}</td>
                    <td style={styles.td}>{entry.frequency}</td><td style={styles.tdSign}>{entry.sign}</td>
                  </tr>
                ))}
                
                {emptyRows.length > 0 && (
                  <tr style={{...styles.row, backgroundColor: 'rgba(0, 255, 255, 0.05)'}}>
                    <td style={styles.td}><input type="date" value={formData.entry_date} onChange={(e) => setFormData({...formData, entry_date: e.target.value})} style={styles.tableInput} /></td>
                    <td style={styles.td}><input type="time" value={formData.entry_time} onChange={(e) => setFormData({...formData, entry_time: e.target.value})} style={styles.tableInput} /></td>
                    <td style={styles.td}><input type="text" placeholder="Drug Name" value={formData.medication} onChange={(e) => setFormData({...formData, medication: e.target.value})} style={styles.tableInput} /></td>
                    <td style={styles.td}><input type="text" placeholder="e.g. 500mg" value={formData.dosage} onChange={(e) => setFormData({...formData, dosage: e.target.value})} style={styles.tableInput} /></td>
                    <td style={styles.td}><input type="time" value={formData.next_dose_time} onChange={(e) => setFormData({...formData, next_dose_time: e.target.value})} style={styles.tableInput} /></td>
                    <td style={styles.td}><select value={formData.route} onChange={(e) => setFormData({...formData, route: e.target.value})} style={styles.tableInput}><option>Oral</option><option>IV</option><option>IM</option><option>Subcut</option><option>Topical</option></select></td>
                    <td style={styles.td}><select value={formData.frequency} onChange={(e) => setFormData({...formData, frequency: e.target.value})} style={styles.tableInput}><option>Stat</option><option>OD</option><option>BD</option><option>TDS</option><option>QDS</option><option>PRN</option></select></td>
                    <td style={styles.td}><input type="text" value={formData.sign} onChange={(e) => setFormData({...formData, sign: e.target.value})} style={styles.tableInput} /></td>
                  </tr>
                )}
                
                {emptyRows.slice(1).map((_, index) => (
                  <tr key={`empty-${index}`} style={styles.row}>
                    <td style={styles.tdEmpty}></td><td style={styles.tdEmpty}></td><td style={styles.tdEmpty}></td>
                    <td style={styles.tdEmpty}></td><td style={styles.tdEmpty}></td><td style={styles.tdEmpty}></td>
                    <td style={styles.tdEmpty}></td><td style={styles.tdEmpty}></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {emptyRows.length > 0 ? (
            <button onClick={handleAddEntry} style={styles.saveBtn}>💾 Sign & Save Entry</button>
          ) : (
            <p style={{textAlign: 'center', color: '#D4AF37', marginTop: '15px'}}>Page is full! Click "Next →" to start Page {currentPage + 1}.</p>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", color: '#e6f1ff', animation: 'fadeIn 0.5s ease-in' },
  title: { fontSize: '24px', margin: '0 0 20px 0', color: '#e6f1ff' },
  card: { backgroundColor: 'rgba(17, 34, 64, 0.6)', backdropFilter: 'blur(12px)', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid rgba(0, 255, 255, 0.1)' },
  cardTitle: { margin: 0, fontSize: '20px', color: '#e6f1ff' },
  separator: { height: '2px', background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.5), transparent)', margin: '20px 0', boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)' },
  form: { display: 'flex', gap: '15px', flexWrap: 'wrap' },
  input: { flex: 1, minWidth: '200px', padding: '15px', fontSize: '16px', borderRadius: '8px', border: '1px solid rgba(0, 255, 255, 0.2)', backgroundColor: 'rgba(2, 12, 27, 0.8)', color: '#e6f1ff', outline: 'none' },
  button: { padding: '15px 30px', background: 'linear-gradient(90deg, #00FFFF, #00C6C6)', color: '#020c1b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(0, 255, 255, 0.3)' },
  resultItem: { backgroundColor: 'rgba(2, 12, 27, 0.5)', padding: '15px', borderRadius: '8px', marginBottom: '10px', border: '1px solid rgba(0, 255, 255, 0.1)', cursor: 'pointer' },
  patientHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(17, 34, 64, 0.6)', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(0, 255, 255, 0.1)', flexWrap: 'wrap', gap: '10px' },
  backBtn: { padding: '10px 20px', backgroundColor: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: '1px solid rgba(231, 76, 60, 0.3)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  pageNav: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' },
  navBtn: { padding: '5px 10px', backgroundColor: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', cursor: 'pointer' },
  tableWrapper: { overflowX: 'auto', backgroundColor: 'rgba(17, 34, 64, 0.6)', borderRadius: '12px', border: '1px solid rgba(0, 255, 255, 0.1)' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '900px' },
  th: { padding: '15px 10px', textAlign: 'left', color: '#D4AF37', borderBottom: '2px solid rgba(212, 175, 55, 0.3)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' },
  row: { borderBottom: '1px solid rgba(0, 255, 255, 0.1)' },
  td: { padding: '12px 10px', color: '#e6f1ff', fontSize: '14px' },
  tdHighlight: { padding: '12px 10px', color: '#00FFFF', fontSize: '14px', fontWeight: 'bold' },
  tdSign: { padding: '12px 10px', color: '#D4AF37', fontSize: '14px', fontStyle: 'italic' },
  tdEmpty: { padding: '18px 10px', borderBottom: '1px dashed rgba(0, 255, 255, 0.1)' },
  tableInput: { width: '100%', padding: '8px', backgroundColor: 'rgba(2, 12, 27, 0.8)', border: '1px solid rgba(0, 255, 255, 0.3)', borderRadius: '4px', color: '#e6f1ff', boxSizing: 'border-box', fontSize: '14px' },
  saveBtn: { marginTop: '20px', width: '100%', padding: '15px', background: 'linear-gradient(90deg, #D4AF37, #F4D03F)', color: '#020c1b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)' }
};

export default DrugChart;