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
      alert(`Appointment marked as ${status}!`);
      fetchAppts();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Appointments & Scheduling</h2>

      <div style={styles.card}>
        <h3>Schedule New Appointment</h3>
        <form onSubmit={handleSchedule} style={styles.form}>
          <div style={styles.formRow}>
            <input type="number" placeholder="Patient ID" value={patientId} onChange={(e) => setPatientId(e.target.value)} style={styles.input} required />
            <input type="number" placeholder="Doctor ID (User ID)" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} style={styles.input} required />
          </div>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={styles.input} required />
          <input type="text" placeholder="Reason (e.g., Fever, Checkup)" value={reason} onChange={(e) => setReason(e.target.value)} style={styles.input} required />
          <button type="submit" style={styles.button}>Schedule</button>
        </form>
      </div>

      <div style={styles.card}>
        <h3>Appointment List ({appts.length})</h3>
        {appts.length === 0 ? (
          <p style={{fontSize:'14px'}}>No appointments scheduled.</p>
        ) : (
          appts.map((a) => (
            <div key={a.id} style={styles.apptItem}>
              <div style={styles.apptDetails}>
                <strong style={{color: '#00FFFF'}}>{new Date(a.appointment_date).toLocaleDateString()}</strong> | {a.patient_name}
                <p style={{margin: '5px 0 0 0', fontSize: '14px'}}>Doctor: {a.doctor_name}</p>
                <p style={{margin: '5px 0 0 0', fontSize: '14px'}}>Reason: {a.reason}</p>
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
  container: { maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#0a192f', minHeight: '100vh', color: '#00FFFF' },
  title: { color: '#00FFFF', borderBottom: '2px solid #00FFFF', paddingBottom: '10px' },
  card: { backgroundColor: '#112240', padding: '20px', borderRadius: '8px', marginTop: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', border: '1px solid #233554' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' },
  formRow: { display: 'flex', gap: '10px' },
  input: { flex: 1, padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #00FFFF', backgroundColor: '#0a192f', color: '#00FFFF' },
  button: { padding: '10px', backgroundColor: '#00FFFF', color: '#0a192f', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  apptItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0a192f', padding: '15px', borderRadius: '5px', marginBottom: '10px', border: '1px solid #233554' },
  apptDetails: { flex: 1 },
  statusArea: { display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end' },
  completeBtn: { padding: '5px 10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
  cancelBtn: { padding: '5px 10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
  badgeGreen: { backgroundColor: '#2ecc71', color: 'white', padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
  badgeRed: { backgroundColor: '#e74c3c', color: 'white', padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }
};

export default Appointments;