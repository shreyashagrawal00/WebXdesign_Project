import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const QueueContext = createContext();
export const useQueue = () => useContext(QueueContext);

// Use relative path when served by backend, or fallback to localhost:5001 for dev
const isProduction = process.env.NODE_ENV === 'production' || window.location.port === '5001';
// In our case, since we serve from backend, relative works best.
const API_URL = '/api';
const socket = io(); // Connects to the same origin

export const QueueProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [appointments, setAppointments] = useState([]);
  const [servingToken, setServingToken] = useState(1);
  const [departments, setDepartments] = useState([]);

  // Axios instance with auth header
  const api = axios.create({
    baseURL: API_URL,
    headers: { 'x-auth-token': token }
  });

  useEffect(() => {
    fetchInitialData();

    // Listen for queue updates
    socket.on('queueUpdate', ({ slotId, currentToken }) => {
      setServingToken(currentToken);
      // You could also refresh appointments here if needed
    });

    return () => socket.off('queueUpdate');
  }, [token]);

  const fetchInitialData = async () => {
    try {
      const resDepts = await api.get('/services');
      setDepartments(resDepts.data);

      if (token) {
        const resAppts = await api.get('/appointments/user');
        setAppointments(resAppts.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    setUser(res.data.user);
    setToken(res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    localStorage.setItem('token', res.data.token);
  };

  const register = async (details) => {
    const res = await axios.post(`${API_URL}/auth/register`, details);
    setUser(res.data.user);
    setToken(res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    localStorage.setItem('token', res.data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const bookAppointment = async (details) => {
    const res = await api.post('/appointments', details);
    setAppointments([...appointments, res.data]);
    return res.data;
  };

  const nextPatient = async (slotId) => {
    const res = await api.post('/admin/next', { slotId });
    setServingToken(res.data.currentToken);
  };

  return (
    <QueueContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      appointments,
      servingToken,
      departments,
      bookAppointment,
      nextPatient,
      fetchInitialData
    }}>
      {children}
    </QueueContext.Provider>
  );
};
