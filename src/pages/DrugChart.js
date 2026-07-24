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
  const [editingId, setEditingId] = useState(null);
  
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    entry_date: today, entry_time: '', drug_name: '', dosage: '', route: 'Oral', 
    frequency: 'Stat', duration: '', prescribing_doctor: '', administering_nurse: user?.full_name || '', 
    status: 'Pending', remarks: ''
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
    fetchChart(patient.id);
  };

  const fetchChart = async (patientId) => {
    try {
      const res = await axios.get(`${API_URL}/api/drugchart/${patientId}`);
      setChartData(res.data);
    } catch (err) { console.error('Failed to load chart'); }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      entry_date: today, entry_time: '', drug_name: '', dosage: '', route: 'Oral', 
      frequency: 'Stat', duration: '', prescribing_doctor: '', administering_nurse: user?.full_name || '', 
      status: 'Pending', remarks: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing record
        await axios.put(`${API_URL}/api/drugchart/${editingId}`, formData);
        alert('Record updated successfully!');
      } else {
        // Add new record
        await axios.post(`${API_URL}/api/drugchart`, {
          ...formData, hospital_id: user.hospital_id, patient_id: selectedPatient.id
        });
        alert('Drug record added!');
      }
      resetForm();
      fetchChart(selectedPatient.id);
    } catch (err) { alert('Failed to save record'); }
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setFormData({
      entry_date: entry.entry_date || today, entry_time: entry.entry_time || '', drug_name: entry.drug_name || '', 
      dosage: entry.dosage || '', route: entry.route || 'Oral', frequency: entry.frequency || 'Stat', 
      duration: entry.duration || '', prescribing_doctor: entry.prescribing_doctor || '', 
      administering_nurse: entry.administering_nurse || '', status: entry.status || 'Pending', remarks: entry.remarks || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this drug record?')) {
      try {
        await axios.delete(`${API_URL}/api/drugchart/${id}`);
        alert('Record deleted.');
        fetchChart(selectedPatient.id);
      } catch (err) { alert('Failed to delete'); }
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Given': return { color: '#2ecc71', border: '1px solid rgba(46, 204, 113, 0.3)', bg: 'rgba(46, 204, 113, 0.1)' };
      case 'Missed': return { color: '#e74c3c', border: '1px solid rgba(231, 76, 60, 0.3)', bg: 'rgba(231, 76, 60, 0.1)' };
      case 'Discontinued': return { color: '#95a5a6', border: '1px solid rgba(149, 165, 166, 0.3)', bg: 'rgba(149, 165, 166, 0.1)' };
      default: return { color: '#f39c12', border: '1px solid rgba(243, 156, 18, 0.3)', bg: 'rgba(243, 156, 18, 0.1)' }; // Pending
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>💉 Drug Administration Chart (EMR)</h2>

      {!selectedPatient ? (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Find Patient Record</h3>
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
              <p style={{margin:'5px 0 0 0', fontSize:'14px', color: '#8892b0'}}>Permanent Drug Administration Record</p>
            </div>
            <div style={{display: 'flex', gap: '10px'}}>
              <button onClick={() => window.print()} style={styles.printBtn}>🖨️ Print</button>
              <button onClick={() => { setSelectedPatient(null); resetForm(); }} style={styles.backBtn}>Close Record</button>
            </div>
          </div>

          {/* Add/Edit Form */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>{editingId ? '✏️ Edit Drug Record' : '➕ Add New Medication'}</h3>
            <div style={styles.separator}></div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}><label style={styles.label}>Date</label><input type="date" name="entry_date" value={formData.entry_date} onChange={handleInputChange} style={styles.input} required /></div>
                <div style={styles.inputGroup}><label style={styles.label}>Time</label><input type="time" name="entry_time" value={formData.entry_time} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label style={styles.label}>Drug Name</label><input type="text" name="drug_name" value={formData.drug_name} onChange={handleInputChange} style={styles.input} required /></div>
                <div style={styles.inputGroup}><label style={styles.label}>Dosage/Strength</label><input type="text" name="dosage" value={formData.dosage} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label style={styles.label}>Route</label><select name="route" value={formData.route} onChange={handleInputChange} style={styles.input}><option>Oral</option><option>IV</option><option>IM</option><option>SC</option><option>Topical</option></select></div>
                <div style={styles.inputGroup}><label style={styles.label}>Frequency</label><select name="frequency" value={formData.frequency} onChange={handleInputChange} style={styles.input}><option>Stat</option><option>OD</option><option>BD</option><option>TDS</option><option>QDS</option><option>PRN</option></select></div>
                <div style={styles.inputGroup}><label style={styles.label}>Duration</label><input type="text" name="duration" placeholder="e.g. 5 days" value={formData.duration} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label style={styles.label}>Prescribing Doctor</label><input type="text" name="prescribing_doctor" value={formData.prescribing_doctor} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label style={styles.label}>Administering Nurse</label><input type="text" name="administering_nurse" value={formData.administering_nurse} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label style={styles.label}>Status</label><select name="status" value={formData.status} onChange={handleInputChange} style={styles.input}><option>Pending</option><option>Given</option><option>Missed</option><option>Discontinued</option></select></div>
              </div>
              <div style={styles.inputGroup}><label style={styles.label}>Remarks/Notes</label><textarea name="remarks" value={formData.remarks} onChange={handleInputChange} style={{...styles.input, minHeight: '60px'}} /></div>
              
              <div style={{display: 'flex', gap: '10px'}}>
                <button type="submit" style={styles.saveBtn}>{editingId ? 'Update Record' : 'Save to Chart'}</button>
                {editingId && <button type="button" onClick={resetForm} style={styles.cancelBtn}>Cancel Edit</button>}
              </div>
            </form>
          </div>

          {/* History List */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📋 Medication History ({chartData.length})</h3>
            <div style={styles.separator}></div>
            
            {chartData.length === 0 ? (
              <p style={{color: '#8892b0', textAlign: 'center'}}>No medication records yet.</p>
            ) : (
              chartData.map((entry) => {
                const st = getStatusStyle(entry.status);
                return (
                  <div key={entry.id} style={styles.historyItem}>
                    <div style={styles.historyHeader}>
                      <span style={styles.drugName}>{entry.drug_name} <span style={{color:'#8892b0', fontSize:'14px', fontWeight:'normal'}}>({entry.dosage})</span></span>
                      <span style={{...styles.badge, color: st.color, border: st.border, backgroundColor: st.bg}}>{entry.status}</span>
                    </div>
                    <div style={styles.historyGrid}>
                      <p style={styles.historyText}><strong>📅 Date/Time:</strong> {entry.entry_date} at {entry.entry_time || 'N/A'}</p>
                      <p style={styles.historyText}><strong>🔄 Route:</strong> {entry.route}</p>
                      <p style={styles.historyText}><strong>⏱️ Frequency:</strong> {entry.frequency}</p>
                      <p style={styles.historyText}><strong>⏳ Duration:</strong> {entry.duration || 'N/A'}</p>
                      <p style={styles.historyText}><strong>🩺 Doctor:</strong> {entry.prescribing_doctor || 'N/A'}</p>
                      <p style={styles.historyText}><strong>💉 Nurse:</strong> {entry.administering_nurse || 'N/A'}</p>
                    </div>
                    {entry.remarks && <p style={styles.historyText}><strong>📝 Remarks:</strong> {entry.remarks}</p>}
                    
                    <div style={styles.actionBtns}>
                      <button onClick={() => handleEdit(entry)} style={styles.editBtn}>✏️ Edit</button>
                      <button onClick={() => handleDelete(entry.id)} style={styles.deleteBtn}>🗑️ Delete</button>
                    </div>
                  </div>
                );
              })
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
  saveBtn: { marginTop: '10px', padding: '15px', flex: 1, background: 'linear-gradient(90deg, #00FFFF, #00C6C6)', color: '#020c1b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  cancelBtn: { marginTop: '10px', padding: '15px', flex: 1, background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: '1px solid rgba(231, 76, 60, 0.3)', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  resultItem: { backgroundColor: 'rgba(2, 12, 27, 0.5)', padding: '15px', borderRadius: '8px', marginBottom: '10px', border: '1px solid rgba(0, 255, 255, 0.1)', cursor: 'pointer' },
  
  patientHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(17, 34, 64, 0.6)', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(0, 255, 255, 0.1)', flexWrap: 'wrap', gap: '10px' },
  backBtn: { padding: '10px 20px', backgroundColor: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: '1px solid rgba(231, 76, 60, 0.3)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  printBtn: { padding: '10px 20px', backgroundColor: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  
  // History Styles
  historyItem: { backgroundColor: 'rgba(2, 12, 27, 0.5)', padding: '20px', borderRadius: '12px', marginBottom: '15px', border: '1px solid rgba(0, 255, 255, 0.1)', borderBottom: '1px solid rgba(0, 255, 255, 0.2)' },
  historyHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid rgba(0, 255, 255, 0.1)', paddingBottom: '10px' },
  drugName: { fontSize: '18px', color: '#00FFFF', fontWeight: 'bold' },
  badge: { padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  historyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px', marginBottom: '10px' },
  historyText: { margin: 0, fontSize: '14px', color: '#e6f1ff' },
  actionBtns: { display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'flex-end' },
  editBtn: { padding: '8px 16px', backgroundColor: 'rgba(0, 255, 255, 0.1)', color: '#00FFFF', border: '1px solid rgba(0, 255, 255, 0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
  deleteBtn: { padding: '8px 16px', backgroundColor: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: '1px solid rgba(231, 76, 60, 0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }
};

export default DrugChart;