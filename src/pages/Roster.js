import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Roster = () => {
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;
  
  const [roster, setRoster] = useState([]);
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    staff_name: '', role: 'Doctor', shift: 'Morning', shift_date: today, notes: ''
  });

  const fetchRoster = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/roster?hospital_id=${user.hospital_id}`);
      setRoster(res.data);
    } catch (err) {
      console.error('Failed to fetch roster');
    }
  };

  useEffect(() => {
    fetchRoster();
  }, [user, API_URL]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/roster`, { ...formData, hospital_id: user.hospital_id });
      alert('Staff added to roster successfully!');
      setFormData({ staff_name: '', role: 'Doctor', shift: 'Morning', shift_date: today, notes: '' });
      fetchRoster();
    } catch (err) {
      alert('Failed to add staff to roster');
    }
  };

  const getShiftColor = (shift) => {
    switch(shift) {
      case 'Morning': return { color: '#f39c12', bg: 'rgba(243, 156, 18, 0.1)', border: '1px solid rgba(243, 156, 18, 0.3)' };
      case 'Afternoon': return { color: '#00FFFF', bg: 'rgba(0, 255, 255, 0.1)', border: '1px solid rgba(0, 255, 255, 0.3)' };
      case 'Night': return { color: '#9b59b6', bg: 'rgba(155, 89, 182, 0.1)', border: '1px solid rgba(155, 89, 182, 0.3)' };
      default: return { color: '#8892b0', bg: 'rgba(136, 146, 176, 0.1)', border: '1px solid rgba(136, 146, 176, 0.3)' };
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🗓️ Daily Roster & Shifts</h2>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>➕ Assign Staff to Shift</h3>
        <div style={styles.separator}></div>
        <form onSubmit={handleAddStaff} style={styles.form}>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}><label style={styles.label}>Staff Name</label><input type="text" name="staff_name" placeholder="e.g., Dr. John Doe" value={formData.staff_name} onChange={handleInputChange} style={styles.input} required /></div>
            <div style={styles.inputGroup}><label style={styles.label}>Role</label><select name="role" value={formData.role} onChange={handleInputChange} style={styles.input}><option>Doctor</option><option>Nurse</option><option>Lab Scientist</option><option>Pharmacist</option><option>Cashier</option><option>Receptionist</option><option>Student</option><option>Other</option></select></div>
            <div style={styles.inputGroup}><label style={styles.label}>Shift</label><select name="shift" value={formData.shift} onChange={handleInputChange} style={styles.input}><option>Morning</option><option>Afternoon</option><option>Night</option></select></div>
            <div style={styles.inputGroup}><label style={styles.label}>Date</label><input type="date" name="shift_date" value={formData.shift_date} onChange={handleInputChange} style={styles.input} required /></div>
          </div>
          <div style={styles.inputGroup}><label style={styles.label}>Notes (Optional)</label><input type="text" name="notes" placeholder="e.g., Ward round duty" value={formData.notes} onChange={handleInputChange} style={styles.input} /></div>
          <button type="submit" style={styles.button}>Add to Roster</button>
        </form>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>📋 Active Roster ({roster.length})</h3>
        <div style={styles.separator}></div>
        
        {roster.length === 0 ? (
          <p style={{color: '#8892b0', textAlign: 'center'}}>No staff assigned to shifts yet.</p>
        ) : (
          roster.map((r) => {
            const st = getShiftColor(r.shift);
            return (
              <div key={r.id} style={styles.rosterItem}>
                <div style={styles.rosterDetails}>
                  <h4 style={styles.staffName}>{r.staff_name} <span style={{fontSize: '14px', color: '#8892b0', fontWeight: 'normal'}}>({r.role})</span></h4>
                  {r.notes && <p style={styles.notesText}>📝 {r.notes}</p>}
                </div>
                <div style={styles.metaData}>
                  <span style={{...styles.badge, color: st.color, backgroundColor: st.bg, border: st.border}}>{r.shift}</span>
                  <span style={styles.dateText}>📅 {new Date(r.shift_date).toLocaleDateString()}</span>
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
  
  rosterItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(2, 12, 27, 0.5)', padding: '20px', borderRadius: '12px', marginBottom: '15px', border: '1px solid rgba(0, 255, 255, 0.1)', borderBottom: '1px solid rgba(0, 255, 255, 0.2)', flexWrap: 'wrap', gap: '10px' },
  rosterDetails: { flex: 1 },
  staffName: { margin: 0, fontSize: '18px', color: '#00FFFF', fontWeight: 'bold' },
  notesText: { margin: '5px 0 0 0', fontSize: '14px', color: '#8892b0' },
  metaData: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' },
  badge: { padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  dateText: { fontSize: '13px', color: '#D4AF37' }
};

export default Roster;
