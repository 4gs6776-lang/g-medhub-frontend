import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const UserManagement = () => {
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;
  
  const [staffList, setStaffList] = useState([]);
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '', role: 'Doctor' });

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users?hospital_id=${user.hospital_id}`);
      setStaffList(res.data);
    } catch (err) {
      console.error('Failed to fetch staff');
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [user, API_URL]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/users`, { ...formData, hospital_id: user.hospital_id });
      alert('Staff account created successfully!');
      setFormData({ full_name: '', email: '', password: '', role: 'Doctor' });
      fetchStaff();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create staff account.');
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'CMD': return { color: '#D4AF37', bg: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' };
      case 'Doctor': return { color: '#00FFFF', bg: 'rgba(0, 255, 255, 0.1)', border: '1px solid rgba(0, 255, 255, 0.3)' };
      case 'Nurse': return { color: '#2ecc71', bg: 'rgba(46, 204, 113, 0.1)', border: '1px solid rgba(46, 204, 113, 0.3)' };
      case 'Lab Scientist': return { color: '#9b59b6', bg: 'rgba(155, 89, 182, 0.1)', border: '1px solid rgba(155, 89, 182, 0.3)' };
      default: return { color: '#8892b0', bg: 'rgba(136, 146, 176, 0.1)', border: '1px solid rgba(136, 146, 176, 0.3)' };
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>👤 User Management & Access</h2>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>➕ Create New Staff Account</h3>
        <div style={styles.separator}></div>
        <form onSubmit={handleAddStaff} style={styles.form}>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}><label style={styles.label}>Full Name</label><input type="text" name="full_name" placeholder="e.g., Dr. John Doe" value={formData.full_name} onChange={handleInputChange} style={styles.input} required /></div>
            <div style={styles.inputGroup}><label style={styles.label}>Email Address</label><input type="email" name="email" placeholder="e.g., john@hallel.com" value={formData.email} onChange={handleInputChange} style={styles.input} required /></div>
            <div style={styles.inputGroup}><label style={styles.label}>Temporary Password</label><input type="text" name="password" placeholder="Min 6 characters" value={formData.password} onChange={handleInputChange} style={styles.input} required /></div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Role / Department</label>
              <select name="role" value={formData.role} onChange={handleInputChange} style={styles.input}>
                <option>Doctor</option>
                <option>Nurse</option>
                <option>Lab Scientist</option>
                <option>Pharmacist</option>
                <option>Cashier</option>
                <option>Receptionist</option>
                <option>HMO Officer</option>
              </select>
            </div>
          </div>
          <button type="submit" style={styles.button}>Create Account</button>
        </form>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>📋 Hospital Staff ({staffList.length})</h3>
        <div style={styles.separator}></div>
        
        {staffList.length === 0 ? (
          <p style={{color: '#8892b0', textAlign: 'center'}}>No staff accounts found.</p>
        ) : (
          staffList.map((s) => {
            const rc = getRoleColor(s.role);
            return (
              <div key={s.id} style={styles.staffItem}>
                <div style={styles.avatar}>{s.full_name.charAt(0)}</div>
                <div style={styles.staffDetails}>
                  <h4 style={styles.staffName}>{s.full_name} {s.id === user.id && <span style={{fontSize: '12px', color: '#D4AF37'}}>(You)</span>}</h4>
                  <p style={styles.staffEmail}>✉️ {s.email}</p>
                </div>
                <span style={{...styles.badge, color: rc.color, backgroundColor: rc.bg, border: rc.border}}>{s.role}</span>
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
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '14px', color: '#8892b0' },
  input: { width: '100%', padding: '12px', fontSize: '14px', borderRadius: '8px', border: '1px solid rgba(0, 255, 255, 0.2)', backgroundColor: 'rgba(2, 12, 27, 0.8)', color: '#e6f1ff', outline: 'none', boxSizing: 'border-box' },
  button: { marginTop: '10px', padding: '15px', background: 'linear-gradient(90deg, #00FFFF, #00C6C6)', color: '#020c1b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  
  staffItem: { display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: 'rgba(2, 12, 27, 0.5)', padding: '15px', borderRadius: '10px', marginBottom: '10px', border: '1px solid rgba(0, 255, 255, 0.1)', borderBottom: '1px solid rgba(0, 255, 255, 0.2)' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0, 255, 255, 0.1)', color: '#00FFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', border: '1px solid rgba(0, 255, 255, 0.2)' },
  staffDetails: { flex: 1 },
  staffName: { margin: 0, fontSize: '16px', color: '#e6f1ff' },
  staffEmail: { margin: '5px 0 0 0', fontSize: '14px', color: '#8892b0' },
  badge: { padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }
};

export default UserManagement;
