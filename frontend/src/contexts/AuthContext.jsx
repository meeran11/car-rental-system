import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchJson } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }){
  const [user, setUser] = useState(()=> {
    try { const raw = localStorage.getItem('user'); return raw ? JSON.parse(raw) : null; } catch { return null; }
  });
  const [token, setToken] = useState(()=> localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(()=> {
    if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
  }, [token]);

  useEffect(()=> {
    if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
  }, [user]);

  async function login(username, password, role = 'customer'){
    setLoading(true);
    try {
      const data = await fetchJson('/user/login', { method: 'POST', body: { username, password, role } });
      setToken(data.token);
      console.log(data);
      setUser({ username, role: data.role, userid: data.userid });
      setLoading(false);
      return data;
    } catch (e) {
      setLoading(false);
      throw e;
    }
  }

  async function register(payload){
    setLoading(true);
    try {
      const data = await fetchJson('/user/register', { method: 'POST', body: payload });
      setLoading(false);
      return data;
    } catch (e){
      setLoading(false);
      throw e;
    }
  }

  function logout(){
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(){ return useContext(AuthContext); }
