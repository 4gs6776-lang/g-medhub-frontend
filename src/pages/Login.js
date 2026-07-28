import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { colors, styles as themeStyles } from '../theme'; // Import the master theme

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.bgDeep, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        backgroundColor: '#112240',
        padding: '40px',
        borderRadius: '10px',
        width: '90%',
        maxWidth: '400px',
        textAlign: 'center',
        boxShadow: `0 0 15px 4px ${colors.cyan}4D`,
        border: `1px solid ${colors.cyan}`
      }}>
        <h2 style={{ color: colors.cyan, marginBottom: '20px', fontFamily: 'Arial' }}>G-MedHub Login</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={themeStyles.input} // Using master input style
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={themeStyles.input} // Using master input style
            required
          />
          <button type="submit" style={themeStyles.buttonPrimary}>Sign In</button> {/* Using master button style */}
        </form>
        <p style={{ marginTop: '20px', color: colors.cyan, fontSize: '14px' }}>Hallel Hospital & Maternity System</p>
      </div>
    </div>
  );
};

export default Login;