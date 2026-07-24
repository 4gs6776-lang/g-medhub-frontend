import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Billing = () => {
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;
  
  const [invoices, setInvoices] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/billing?hospital_id=${user.hospital_id}`);
      setInvoices(res.data);
    } catch (err) {
      console.error('Failed to fetch invoices');
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/billing`, {
        hospital_id: user.hospital_id,
        patient_id: patientId,
        description: desc,
        amount: amount
      });
      alert('Invoice created successfully!');
      setPatientId(''); setDesc(''); setAmount('');
      fetchInvoices();
    } catch (err) {
      alert('Failed to create invoice. Make sure Patient ID is correct.');
    }
  };

  const handlePay = async (id) => {
    try {
      await axios.put(`${API_URL}/api/billing/${id}/pay`);
      alert('Payment processed successfully! Receipt generated.');
      fetchInvoices();
    } catch (err) {
      alert('Payment failed');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Cashier & Billing</h2>

      <div style={styles.card}>
        <h3>Generate New Bill</h3>
        <form onSubmit={handleCreate} style={styles.form}>
          <input type="number" placeholder="Patient ID (e.g., 1)" value={patientId} onChange={(e) => setPatientId(e.target.value)} style={styles.input} required />
          <input type="text" placeholder="Description (e.g., Consultation Fee)" value={desc} onChange={(e) => setDesc(e.target.value)} style={styles.input} required />
          <input type="number" placeholder="Amount ($)" value={amount} onChange={(e) => setAmount(e.target.value)} style={styles.input} required />
          <button type="submit" style={styles.button}>Create Invoice</button>
        </form>
      </div>

      <div style={styles.card}>
        <h3>Invoices ({invoices.length})</h3>
        {invoices.length === 0 ? (
          <p style={{fontSize:'14px'}}>No invoices yet.</p>
        ) : (
          invoices.map((inv) => (
            <div key={inv.id} style={styles.invoiceItem}>
              <div>
                <strong style={{color: '#00FFFF'}}>INV-{inv.id}</strong> | {inv.patient_name} (GMH-{inv.patient_id})
                <p style={{margin: '5px 0 0 0', fontSize: '14px'}}>{inv.description}</p>
                <p style={{margin: '5px 0 0 0', fontSize: '16px', fontWeight: 'bold'}}>${inv.amount}</p>
              </div>
              {inv.status === 'Paid' ? (
                <span style={styles.badgeGreen}>Paid</span>
              ) : (
                <button onClick={() => handlePay(inv.id)} style={styles.payBtn}>Process Payment</button>
              )}
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
  input: { padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #00FFFF', backgroundColor: '#0a192f', color: '#00FFFF' },
  button: { padding: '10px', backgroundColor: '#00FFFF', color: '#0a192f', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  invoiceItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0a192f', padding: '15px', borderRadius: '5px', marginBottom: '10px', border: '1px solid #233554' },
  payBtn: { padding: '10px 16px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  badgeGreen: { backgroundColor: '#2ecc71', color: 'white', padding: '6px 12px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold' }
};

export default Billing;