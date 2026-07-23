import React, { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const { token } = useContext(AuthContext);

  return (
    <div style={{ backgroundColor: '#0a192f', minHeight: '100vh' }}>
      {/* If the user has a token, show Dashboard. If not, show Login. */}
      {token ? <Dashboard /> : <Login />}
    </div>
  );
}

export default App;
