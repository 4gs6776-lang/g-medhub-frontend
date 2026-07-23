import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Reception = () => {
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;
  
  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState('');
  
  // Search state
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  // Register a new patient
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/patients/register`, {
        hospital_id: user.hospital_id, // Attaches patient to YOUR hospital
        full_name: name, 
        phone, 
        gender, 
        age
      });
      alert(`Patient registered! Unique Hospital Number: GMH-${res.data.id}`);
      setName(''); setPhone(''); setAge('');
    } catch (err) {
      alert('Failed to register patient');
    }
  };

  // Search for a patient
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`${API_URL}/api/patients/search?query=${search}&hospital_id=${user.hospital_id}`);
      setResults(res.data);
    } catch (err) {
      alert('Search failed');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Reception Desk</h2>
      
      {/* Registration Form */}
      <div style={styles.card}>
        <h3>Register New Patient</h3>
        <form onSubmit={handleRegister} style={styles.form}>
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} style={styles.input} required />
          <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} style={styles.input} required />
          <select value={gender} onChange={(e) => setGender(e.target.value)} style={styles.input}>
            <option>Male</option>
            <option>Female</option>
          </select>
          <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} style={styles.input} required />
          <button type="submit" style={styles.button}>Register Patient</button>
        </form>
      </div>

      {/* Search Bar */}
      <div style={styles.card}>
        <h3>Patient Search</h3>
        <form onSubmit={handleSearch} style={styles.form}>
          <input type="text" placeholder="Search by Name, Phone, or ID" value={search} onChange={(e) => setSearch(e.target.value)} style={styles.input} required />
          <button type="submit" style={styles.searchBtn}>Search</button>
        </form>
        
        {/* Search Results */}
        <div style={{ marginTop: '15px' }}>
          {results.map((p) => (
            <div key={p.id} style={styles.resultItem}>
              <strong>GMH-{p.id}</strong> - {p.full_name} <br/>
              <span style={{color:'#7f8c8d', fontSize:'14px'}}>{p.phone} | {p.gender} | {p.age}y</span>
            </div>
          ))}
          {results.length === 0 && <p style={{color:'#95a5a6', fontSize:'14px'}}>No results yet.</p>}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' },
  title: { color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px' },
  card: { backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginTop: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' },
  input: { padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' },
  button: { padding: '10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
  searchBtn: { padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
  resultItem: { backgroundColor: 'white', padding: '10px', borderRadius: '5px', marginBottom: '5px', border: '1px solid #eee' }
};

export default Reception;
