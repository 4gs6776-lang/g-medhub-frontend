import React, { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CMDDashboard from './pages/CMDDashboard';

function App() {
  const { user, token } = useContext(AuthContext);

  // If not logged in, show Login page
  if (!token) {
    return <Login />;
  }

  // If logged in as Super Admin, show Super Admin Dashboard
  if (user?.role === 'Super Admin') {
    return <Dashboard />;
  }

  // If logged in as CMD, show Hallel Hospital Dashboard
  if (user?.role === 'CMD') {
    return <CMDDashboard />;
  }

  // Default fallback (we will add Doctor, Nurse, etc. here later)
  return <Dashboard />;
}

export default App;
