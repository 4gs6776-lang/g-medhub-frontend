import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      // Page will automatically change to Dashboard because token is set
    }
  };

  return (
    <div style={styles.container}>
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
  );
};

const styles = {
  container: { maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center', fontFamily: 'Arial' },
  title: { color: '#2c3e50' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' },
  button: { padding: '12px', fontSize: '16px', borderRadius: '5px', border: 'none', backgroundColor: '#3498db', color: 'white', cursor: 'pointer' },
  footer: { marginTop: '20px', color: '#7f8c8d', fontSize: '14px' }
};

export default Login;