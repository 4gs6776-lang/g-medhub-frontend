import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Reception = () => {
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState('');
  
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/patients/register`, {
        hospital_id: user.hospital_id, 
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

      <div style={styles.card}>
        <h3>Patient Search</h3>
        <form onSubmit={handleSearch} style={styles.form}>
          <input type="text" placeholder="Search by Name, Phone, or ID" value={search} onChange={(e) => setSearch(e.target.value)} style={styles.input} required />
          <button type="submit" style={styles.searchBtn}>Search</button>
        </form>
        
        <div style={{ marginTop: '15px' }}>
          {results.map((p) => (
            <div key={p.id} style={styles.resultItem}>
              <strong>GMH-{p.id}</strong> - {p.full_name} <br/>
              <span style={{color:'#00FFFF', fontSize:'14px'}}>{p.phone} | {p.gender} | {p.age}y</span>
            </div>
          ))}
          {results.length === 0 && <p style={{color:'#00FFFF', fontSize:'14px'}}>No results yet.</p>}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#0a192f', minHeight: '100vh', color: '#00FFFF' },
  title: { color: '#00FFFF', borderBottom: '2px solid #00FFFF', paddingBottom: '10px' },
  card: { backgroundColor: '#112240', padding: '20px', borderRadius: '8px', marginTop: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', border: '1px solid #233554' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' },
  input: { padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #00FFFF', backgroundColor: '#0a192f', color: '#00FFFF' },
  button: { padding: '10px', backgroundColor: '#00FFFF', color: '#0a192f', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  searchBtn: { padding: '10px', backgroundColor: '#00FFFF', color: '#0a192f', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  resultItem: { backgroundColor: '#0a192f', padding: '10px', borderRadius: '5px', marginBottom: '5px', border: '1px solid #233554', color: '#00FFFF' }
};

export default Reception;
