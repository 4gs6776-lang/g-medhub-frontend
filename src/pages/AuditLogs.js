import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AuditLogs = () => {
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/audit?hospital_id=${user.hospital_id}`);
        setLogs(res.data);
      } catch (err) {
        console.error('Failed to fetch audit logs');
      }
    };
    
    fetchLogs();
    // Auto-refresh every 5 seconds to catch new actions live
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [user, API_URL]);

  const getMethodColor = (method) => {
    if (method?.includes('POST')) return { color: '#2ecc71', bg: 'rgba(46, 204, 113, 0.1)' };
    if (method?.includes('PUT')) return { color: '#f39c12', bg: 'rgba(243, 156, 18, 0.1)' };
    if (method?.includes('DELETE')) return { color: '#e74c3c', bg: 'rgba(231, 76, 60, 0.1)' };
    return { color: '#00FFFF', bg: 'rgba(0, 255, 255, 0.1)' };
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🕵️ Audit Logs & Activity</h2>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Recent System Activity ({logs.length})</h3>
        <div style={styles.separator}></div>
        <p style={{color: '#8892b0', fontSize: '14px', marginTop: 0, marginBottom: '15px'}}>Live feed of all actions performed by staff across all departments.</p>
        
        {logs.length === 0 ? (
          <p style={{color: '#8892b0', textAlign: 'center', padding: '30px'}}>No recent activity logged.</p>
        ) : (
          logs.map((log) => {
            const mc = getMethodColor(log.action);
            return (
              <div key={log.id} style={styles.logItem}>
                <div style={styles.logDetails}>
                  <h4 style={styles.userName}>{log.user_name} <span style={{fontSize: '14px', color: '#8892b0', fontWeight: 'normal'}}>performed an action</span></h4>
                  <p style={styles.actionText}>{log.action}</p>
                </div>
                <div style={styles.metaData}>
                  <span style={{...styles.badge, color: mc.color, backgroundColor: mc.bg}}>{log.action.split(' ')[0]}</span>
                  <span style={styles.dateText}>{new Date(log.created_at).toLocaleString()}</span>
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
  
  logItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(2, 12, 27, 0.5)', padding: '20px', borderRadius: '12px', marginBottom: '15px', border: '1px solid rgba(0, 255, 255, 0.1)', borderBottom: '1px solid rgba(0, 255, 255, 0.2)', flexWrap: 'wrap', gap: '15px' },
  logDetails: { flex: 1 },
  userName: { margin: '0 0 5px 0', fontSize: '18px', color: '#00FFFF', fontWeight: 'bold' },
  actionText: { margin: 0, fontSize: '14px', color: '#e6f1ff', fontFamily: 'monospace' },
  metaData: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' },
  badge: { padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' },
  dateText: { fontSize: '13px', color: '#D4AF37' }
};

export default AuditLogs;
