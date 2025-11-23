import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const { login } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from?.pathname || '/';

  async function submit(e){
    e.preventDefault();
    try {
      await login(username, password, role);
      navigate(from, { replace: true });
    } catch (err) {
      alert(err.message || 'Login failed');
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md card-modern p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#0F172A' }}>Welcome Back</h1>
          <p style={{ color: '#64748B' }}>Sign in to your account</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>Username</label>
            <input 
              type="text"
              value={username} 
              onChange={e=>setUsername(e.target.value)} 
              className="input-modern"
              placeholder="your_username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              className="input-modern"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>Login as</label>
            <select 
              value={role} 
              onChange={e=>setRole(e.target.value)} 
              className="input-modern"
            >
              <option value="customer">Customer</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <button type="submit" className="btn-primary w-full mt-6">
            Sign In
          </button>
        </form>

        <p className="text-center mt-6" style={{ color: '#64748B' }}>
          Don't have an account?{' '}
          <a href="/register" className="font-semibold" style={{ color: '#3B82F6' }} onMouseEnter={(e) => e.target.style.color = '#1e3a8a'} onMouseLeave={(e) => e.target.style.color = '#3B82F6'}>
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
