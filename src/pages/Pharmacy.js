import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Pharmacy = () => {
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;
  
  const [drugs, setDrugs] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiry, setExpiry] = useState('');
  const [price, setPrice] = useState('');

  const fetchDrugs = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/pharmacy?hospital_id=${user.hospital_id}`);
      setDrugs(res.data);
    } catch (err) {
      console.error('Failed to load drugs');
    }
  };

  useEffect(() => {
    fetchDrugs();
  }, []);

  const handleAddDrug = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/pharmacy`, {
        hospital_id: user.hospital_id,
        drug_name: name,
        quantity: quantity,
        expiry_date: expiry,
        price: price
      });
      alert('Drug added successfully!');
      setName(''); setQuantity(''); setExpiry(''); setPrice('');
      fetchDrugs();
    } catch (err) {
      alert('Failed to add drug');
    }
  };

  const handleDispense = async (drug) => {
    // Simple prompt on mobile to ask how many to dispense
    const amount = prompt(`How many units of ${drug.drug_name} to dispense?`, "1");
    if (amount === null) return; // User clicked cancel
    
    try {
      await axios.put(`${API_URL}/api/pharmacy/${drug.id}/dispense`, { quantity_dispensed: amount });
      alert(`Dispensed ${amount} units successfully!`);
      fetchDrugs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to dispense drug');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Pharmacy Desk</h2>

      <div style={styles.card}>
        <h3>Add New Drug</h3>
        <form onSubmit={handleAddDrug} style={styles.form}>
          <input type="text" placeholder="Drug Name" value={name} onChange={(e) => setName(e.target.value)} style={styles.input} required />
          <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} style={styles.input} required />
          <label style={{color: '#00FFFF', fontSize: '14px'}}>Expiry Date:</label>
          <input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} style={styles.input} required />
          <input type="number" placeholder="Price ($)" value={price} onChange={(e) => setPrice(e.target.value)} style={styles.input} required />
          <button type="submit" style={styles.button}>Add to Inventory</button>
        </form>
      </div>

      <div style={styles.card}>
        <h3>Inventory ({drugs.length})</h3>
        {drugs.length === 0 ? (
          <p style={{fontSize:'14px'}}>No drugs in inventory.</p>
        ) : (
          drugs.map((d) => (
            <div key={d.id} style={styles.drugItem}>
              <div>
                <strong style={{color: '#00FFFF'}}>{d.drug_name}</strong>
                <p style={{margin: '5px 0 0 0', fontSize: '14px'}}>
                  Stock: {d.quantity} units <br/>
                  Price: ${d.price} <br/>
                  Expiry: {new Date(d.expiry_date).toLocaleDateString()}
                </p>
              </div>
              <button onClick={() => handleDispense(d)} style={styles.dispenseBtn}>Dispense</button>
            </div>
          ))
        )}
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
  drugItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0a192f', padding: '15px', borderRadius: '5px', marginBottom: '10px', border: '1px solid #233554' },
  dispenseBtn: { padding: '8px 16px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Pharmacy;
