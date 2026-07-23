import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div style={styles.page}>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>G-MedHub Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Sign In</button>
        </form>
        <p style={styles.footer}>Hallel Hospital & Maternity System</p>
      </div>
    </div>
  );
};

const styles = {
  page: { 
    minHeight: '100vh', 
    backgroundColor: '#0a192f', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loginBox: {
    backgroundColor: '#112240', 
    padding: '40px',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '400px',
    textAlign: 'center',
    boxShadow: '0 0 15px 4px rgba(0, 255, 255, 0.3)', 
    border: '1px solid #00FFFF' 
  },
  title: { color: '#00FFFF', marginBottom: '20px', fontFamily: 'Arial' }, 
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { 
    padding: '12px', 
    fontSize: '16px', 
    borderRadius: '5px', 
    border: '1px solid #00FFFF', 
    backgroundColor: '#0a192f', 
    color: '#00FFFF' 
  },
  button: { 
    padding: '12px', 
    fontSize: '16px', 
    borderRadius: '5px', 
    border: 'none', 
    backgroundColor: '#00FFFF', 
    color: '#0a192f', 
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  footer: { marginTop: '20px', color: '#00FFFF', fontSize: '14px' } 
};

export default Login;
