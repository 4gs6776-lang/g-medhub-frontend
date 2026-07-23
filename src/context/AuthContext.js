import React, { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('gmedhub_token'));
  const timerRef = useRef(null);

  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  const logout = () => {
    localStorage.removeItem('gmedhub_token');
    localStorage.removeItem('gmedhub_user');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    alert('You have been logged out due to 5 minutes of inactivity.');
  };

  const resetTimeout = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    // 5 minutes = 300000 milliseconds
    timerRef.current = setTimeout(logout, 300000); 
  };

  useEffect(() => {
    if (token) {
      window.addEventListener('mousemove', resetTimeout);
      window.addEventListener('keydown', resetTimeout);
      window.addEventListener('click', resetTimeout);
      resetTimeout(); 

      const savedUser = localStorage.getItem('gmedhub_user');
      if (savedUser) setUser(JSON.parse(savedUser));
    }

    return () => {
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('keydown', resetTimeout);
      window.removeEventListener('click', resetTimeout);
    };
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('gmedhub_token', res.data.token);
      localStorage.setItem('gmedhub_user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      return true;
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
