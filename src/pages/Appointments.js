import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Appointments = () => {
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;
  
  const [appts, setAppts] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');

  const fetchAppts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/appointments?hospital_id=${user.hospital_id}`);
      setAppts(res.data);
    } catch (err) {
      console.error('Failed to fetch appointments');
    }
  };

  useEffect(() => {
    fetchAppts();
  }, []);

  const handleSchedule = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/appointments`, {
        hospital_id: user.hospital_id,
        patient_id: patientId,
        doctor_id: doctorId,
        appointment_date: date,
        reason: reason
      });
      alert('Appointment scheduled successfully!');
      setPatientId(''); setDoctorId(''); setDate(''); setReason('');
      fetchAppts();
    } catch (err) {
      alert('Failed to schedule appointment. Check Patient/Doctor IDs.');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`${API_URL}/api/appointments/${id}`, { status });
      fetchAppts();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>✨ Schedule New Appointment</h3>
        {/* Glowing Separator Line */}
        <div style={styles.separator}></div>
        
        <form onSubmit={handleSchedule} style={styles.form}>
          <div style={styles.formRow}>
            <input type="number" placeholder="Patient ID" value={patientId} onChange={(e) => setPatientId(e.target.value)} style={styles.input} required />
            <input type="number" placeholder="Doctor ID" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} style={styles.input} required />
          </div>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={styles.input} required />
          <input type="text" placeholder="Reason (e.g., Fever, Checkup)" value={reason} onChange={(e) => setReason(e.target.value)} style={styles.input} required />
          <button type="submit" style={styles.button}>Schedule Appointment</button>
        </form>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>📅 Appointment List ({appts.length})</h3>
        <div style={styles.separator}></div>

        {appts.length === 0 ? (
            <p style={styles.emptyText}>No appointments scheduled.</p>
        ) : (
          appts.map((a) => (
            <div key={a.id} style={styles.listItem}>
              <div style={styles.itemDetails}>
                <span style={styles.dateBadge}>{new Date(a.appointment_date).toLocaleDateString()}</span>
                <h4 style={styles.patientName}>{a.patient_name}</h4>
                <p style={styles.itemSubText}>Doctor: {a.doctor_name}</p>
                <p style={styles.itemSubText}>Reason: {a.reason}</p>
              </div>
              <div style={styles.statusArea}>
                {a.status === 'Scheduled' ? (
                  <>
                    <button onClick={() => handleStatusChange(a.id, 'Completed')} style={styles.completeBtn}>Complete</button>
                    <button onClick={() => handleStatusChange(a.id, 'Cancelled')} style={styles.cancelBtn}>Cancel</button>
                  </>
                ) : (
                  <span style={a.status === 'Completed' ? styles.badgeGreen : styles.badgeRed}>{a.status}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { 
    maxWidth: '900px', 
    margin: '0 auto', 
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    color: '#e6f1ff',
    animation: 'fadeIn 0.5s ease-in',
  },
  card: { 
    backgroundColor: 'rgba(17, 34, 64, 0.6)', 
    backdropFilter: 'blur(12px)',
    padding: '30px', 
    borderRadius: '16px', 
    marginBottom: '30px', 
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)', 
    border: '1px solid rgba(0, 255, 255, 0.1)',
  },
  cardTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#e6f1ff',
  },
  // Premium Glowing Separator Line
  separator: {
    height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.5), transparent)',
    margin: '20px 0',
    boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  formRow: { display: 'flex', gap: '15px', flexWrap: 'wrap' },
  input: { 
    flex: 1, 
    padding: '15px', 
    fontSize: '16px', 
    borderRadius: '8px', 
    border: '1px solid rgba(0, 255, 255, 0.2)', 
    backgroundColor: 'rgba(2, 12, 27, 0.8)', 
    color: '#e6f1ff',
    outline: 'none',
    transition: 'border 0.3s ease',
  },
  button: { 
    padding: '15px', 
    background: 'linear-gradient(90deg, #00FFFF, #00C6C6)', 
    color: '#020c1b', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontSize: '16px', 
    fontWeight: 'bold',
    boxShadow: '0 4px 15px rgba(0, 255, 255, 0.3)',
  },
  
  // List Items
  emptyText: { color: '#8892b0', fontSize: '15px', textAlign: 'center' },
  listItem: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: 'rgba(2, 12, 27, 0.5)', 
    padding: '20px', 
    borderRadius: '12px', 
    marginBottom: '15px', 
    border: '1px solid rgba(0, 255, 255, 0.05)',
    borderBottom: '1px solid rgba(0, 255, 255, 0.2)', // Glowing bottom separator
  },
  itemDetails: { flex: 1 },
  dateBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    color: '#D4AF37',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '8px',
    border: '1px solid rgba(212, 175, 55, 0.2)',
  },
  patientName: {
    margin: '0 0 5px 0',
    fontSize: '18px',
    color: '#00FFFF',
    fontWeight: 'bold',
  },
  itemSubText: { margin: '3px 0 0 0', fontSize: '14px', color: '#8892b0' },
  
  statusArea: { display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' },
  completeBtn: { padding: '8px 16px', backgroundColor: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', border: '1px solid rgba(46, 204, 113, 0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
  cancelBtn: { padding: '8px 16px', backgroundColor: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: '1px solid rgba(231, 76, 60, 0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
  badgeGreen: { backgroundColor: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', border: '1px solid rgba(46, 204, 113, 0.3)' },
  badgeRed: { backgroundColor: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', border: '1px solid rgba(231, 76, 60, 0.3)' }
};

export default Appointments;