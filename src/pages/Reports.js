import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Reports = () => {
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;
  
  const [reportData, setReportData] = useState({
    total_revenue: 0,
    outstanding_bills: 0,
    pending_hmo_claims: 0,
    total_drugs_in_stock: 0,
    admitted_patients: 0,
    total_anc_patients: 0
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/reports?hospital_id=${user.hospital_id}`);
        setReportData(res.data);
      } catch (err) {
        console.error('Failed to fetch reports');
      }
    };
    fetchReports();
  }, [user, API_URL]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📊 Hospital Reports & Analytics</h2>
        <button onClick={() => window.print()} style={styles.printBtn}>🖨️ Print Report</button>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>💰 Financial Overview</h3>
        <div style={styles.separator}></div>
        <div style={styles.statsGrid}>
          <div style={styles.statBox}>
            <h4 style={{...styles.statValue, color: '#2ecc71'}}>${reportData.total_revenue}</h4>
            <p style={styles.statLabel}>Total Revenue (Paid)</p>
          </div>
          <div style={styles.statBox}>
            <h4 style={{...styles.statValue, color: '#e74c3c'}}>${reportData.outstanding_bills}</h4>
            <p style={styles.statLabel}>Outstanding Bills</p>
          </div>
          <div style={styles.statBox}>
            <h4 style={{...styles.statValue, color: '#f39c12'}}>${reportData.pending_hmo_claims}</h4>
            <p style={styles.statLabel}>Pending HMO Claims</p>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>🏥 Operational Overview</h3>
        <div style={styles.separator}></div>
        <div style={styles.statsGrid}>
          <div style={styles.statBox}>
            <h4 style={{...styles.statValue, color: '#00FFFF'}}>{reportData.total_drugs_in_stock}</h4>
            <p style={styles.statLabel}>Drugs in Stock (Units)</p>
          </div>
          <div style={styles.statBox}>
            <h4 style={{...styles.statValue, color: '#9b59b6'}}>{reportData.admitted_patients}</h4>
            <p style={styles.statLabel}>Admitted Patients (Beds)</p>
          </div>
          <div style={styles.statBox}>
            <h4 style={{...styles.statValue, color: '#D4AF37'}}>{reportData.total_anc_patients}</h4>
            <p style={styles.statLabel}>Registered ANC Patients</p>
          </div>
        </div>
      </div>
      
      <p style={{textAlign: 'center', color: '#8892b0', fontSize: '14px', marginTop: '20px'}}>
        Report generated on {new Date().toLocaleString()}
      </p>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", color: '#e6f1ff', animation: 'fadeIn 0.5s ease-in' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' },
  title: { fontSize: '24px', margin: 0, color: '#e6f1ff' },
  printBtn: { padding: '12px 20px', backgroundColor: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  card: { backgroundColor: 'rgba(17, 34, 64, 0.6)', backdropFilter: 'blur(12px)', padding: '30px', borderRadius: '16px', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid rgba(0, 255, 255, 0.1)' },
  cardTitle: { margin: 0, fontSize: '20px', color: '#e6f1ff' },
  separator: { height: '2px', background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.5), transparent)', margin: '20px 0', boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' },
  statBox: { backgroundColor: 'rgba(2, 12, 27, 0.5)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(0, 255, 255, 0.05)', borderBottom: '1px solid rgba(0, 255, 255, 0.2)', textAlign: 'center' },
  statValue: { margin: 0, fontSize: '32px', fontWeight: '800' },
  statLabel: { margin: '10px 0 0 0', fontSize: '14px', color: '#8892b0' }
};

export default Reports;
