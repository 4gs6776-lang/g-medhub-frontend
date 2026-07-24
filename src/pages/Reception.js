import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const nigerianStates = ["Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT (Abuja)", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"];
const africanCountries = ["Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde", "Cameroon", "Central African Republic", "Chad", "Comoros", "Congo", "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda", "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"];
const religions = ["Christianity", "Islam", "Traditional", "Other"];
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"];

const Reception = () => {
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;
  
  const [formData, setFormData] = useState({
    surname: '', other_names: '', phone: '', email: '', gender: 'Male', marital_status: 'Single', 
    dob: '', age: '', blood_group: 'Unknown', address: '', state_of_origin: 'Lagos', 
    nationality: 'Nigeria', occupation: '', religion: 'Christianity',
    next_of_kin_name: '', next_of_kin_relationship: '', next_of_kin_phone: '', next_of_kin_address: ''
  });

  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-calculate Age from DOB
    if (name === 'dob') {
      const birthDate = new Date(value);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setFormData(prev => ({ ...prev, dob: value, age: calculatedAge >= 0 ? calculatedAge : '' }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/patients/register`, {
        ...formData,
        hospital_id: user.hospital_id
      });
      alert(`Patient registered! Unique Hospital Number: GMH-${res.data.id}`);
      setFormData({
        surname: '', other_names: '', phone: '', email: '', gender: 'Male', marital_status: 'Single', 
        dob: '', age: '', blood_group: 'Unknown', address: '', state_of_origin: 'Lagos', 
        nationality: 'Nigeria', occupation: '', religion: 'Christianity',
        next_of_kin_name: '', next_of_kin_relationship: '', next_of_kin_phone: '', next_of_kin_address: ''
      });
    } catch (err) {
      alert('Failed to register patient. Check all fields.');
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
        <h3 style={styles.cardTitle}>Register New Patient</h3>
        <div style={styles.separator}></div>
        <form onSubmit={handleRegister} style={styles.form}>
          
          <label style={styles.sectionLabel}>Patient Biodata</label>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}><label style={styles.label}>Surname</label><input type="text" name="surname" value={formData.surname} onChange={handleInputChange} style={styles.input} required /></div>
            <div style={styles.inputGroup}><label style={styles.label}>Other Names</label><input type="text" name="other_names" value={formData.other_names} onChange={handleInputChange} style={styles.input} required /></div>
            <div style={styles.inputGroup}><label style={styles.label}>Tel</label><input type="text" name="phone" value={formData.phone} onChange={handleInputChange} style={styles.input} required /></div>
            <div style={styles.inputGroup}><label style={styles.label}>Email</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} style={styles.input} /></div>
            <div style={styles.inputGroup}><label style={styles.label}>Gender</label><select name="gender" value={formData.gender} onChange={handleInputChange} style={styles.input}><option>Male</option><option>Female</option></select></div>
            <div style={styles.inputGroup}><label style={styles.label}>Marital Status</label><select name="marital_status" value={formData.marital_status} onChange={handleInputChange} style={styles.input}><option>Single</option><option>Married</option><option>Widow</option><option>Widower</option><option>Divorced</option></select></div>
            <div style={styles.inputGroup}><label style={styles.label}>Date of Birth</label><input type="date" name="dob" value={formData.dob} onChange={handleInputChange} style={styles.input} /></div>
            <div style={styles.inputGroup}><label style={styles.label}>Age (Auto)</label><input type="number" name="age" value={formData.age} readOnly style={{...styles.input, backgroundColor: 'rgba(2, 12, 27, 0.4)', cursor: 'not-allowed'}} /></div>
            <div style={styles.inputGroup}><label style={styles.label}>Blood Group</label><select name="blood_group" value={formData.blood_group} onChange={handleInputChange} style={styles.input}>{bloodGroups.map(b => <option key={b} value={b}>{b}</option>)}</select></div>
            <div style={styles.inputGroup}><label style={styles.label}>Nationality</label><input type="text" list="africanCountries" name="nationality" value={formData.nationality} onChange={handleInputChange} style={styles.input} /><datalist id="africanCountries">{africanCountries.map(c => <option key={c} value={c} />)}</datalist></div>
            <div style={styles.inputGroup}><label style={styles.label}>State of Origin</label><select name="state_of_origin" value={formData.state_of_origin} onChange={handleInputChange} style={styles.input}>{nigerianStates.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div style={styles.inputGroup}><label style={styles.label}>Occupation</label><input type="text" name="occupation" value={formData.occupation} onChange={handleInputChange} style={styles.input} /></div>
            <div style={styles.inputGroup}><label style={styles.label}>Religion</label><select name="religion" value={formData.religion} onChange={handleInputChange} style={styles.input}>{religions.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
            <div style={styles.inputGroup} style={{gridColumn: 'span 2'}}><label style={styles.label}>Home Address</label><input type="text" name="address" value={formData.address} onChange={handleInputChange} style={styles.input} /></div>
          </div>

          <label style={{...styles.sectionLabel, marginTop: '20px'}}>Next of Kin</label>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}><label style={styles.label}>Name</label><input type="text" name="next_of_kin_name" value={formData.next_of_kin_name} onChange={handleInputChange} style={styles.input} required /></div>
            <div style={styles.inputGroup}><label style={styles.label}>Relationship</label><input type="text" name="next_of_kin_relationship" value={formData.next_of_kin_relationship} onChange={handleInputChange} style={styles.input} /></div>
            <div style={styles.inputGroup}><label style={styles.label}>Tel</label><input type="text" name="next_of_kin_phone" value={formData.next_of_kin_phone} onChange={handleInputChange} style={styles.input} /></div>
            <div style={styles.inputGroup} style={{gridColumn: 'span 2'}}><label style={styles.label}>Address</label><input type="text" name="next_of_kin_address" value={formData.next_of_kin_address} onChange={handleInputChange} style={styles.input} /></div>
          </div>

          <button type="submit" style={styles.button}>Register Patient</button>
        </form>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Patient Search</h3>
        <div style={styles.separator}></div>
        <form onSubmit={handleSearch} style={styles.form}>
          <input type="text" placeholder="Search by Name, Phone, or ID" value={search} onChange={(e) => setSearch(e.target.value)} style={styles.input} required />
          <button type="submit" style={styles.searchBtn}>Search</button>
        </form>
        
        <div style={{ marginTop: '15px' }}>
          {results.map((p) => (
            <div key={p.id} style={styles.resultItem}>
              <strong>GMH-{p.id}</strong> - {p.full_name} <br/>
              <span style={{color:'#8892b0', fontSize:'14px'}}>{p.phone} | {p.gender} | {p.age}y</span>
            </div>
          ))}
          {results.length === 0 && <p style={{color:'#8892b0', fontSize:'14px'}}>No results yet.</p>}
        </div>
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
  sectionLabel: { display: 'block', fontSize: '14px', color: '#D4AF37', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '14px', color: '#8892b0' },
  input: { width: '100%', padding: '12px', fontSize: '14px', borderRadius: '8px', border: '1px solid rgba(0, 255, 255, 0.2)', backgroundColor: 'rgba(2, 12, 27, 0.8)', color: '#e6f1ff', outline: 'none', boxSizing: 'border-box' },
  button: { marginTop: '10px', padding: '15px', background: 'linear-gradient(90deg, #00FFFF, #00C6C6)', color: '#020c1b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  searchBtn: { padding: '15px', background: 'linear-gradient(90deg, #D4AF37, #F4D03F)', color: '#020c1b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  resultItem: { backgroundColor: 'rgba(2, 12, 27, 0.5)', padding: '15px', borderRadius: '8px', marginBottom: '10px', border: '1px solid rgba(0, 255, 255, 0.1)' }
};

export default Reception;
