import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const { login } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from?.pathname || '/';
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password, role);
      navigate(from, { replace: true });
    } catch (err) {
      alert(err.message || 'Login failed');
      setLoading(false);
    }
  }

  return (
    // Changed background from white/slate-50 to a richer Slate-100
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-10 px-4 mt-6">
      
      <div className="w-full max-w-md bg-blue-100 rounded-3xl shadow-2xl p-6 sm:p-10 border border-slate-200/60">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500">Please choose your login type</p>
        </div>

        {/* MODERN ROLE SELECTOR (Two Sections) */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Customer Selection */}
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`relative p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 group ${
              role === 'customer' 
                ? 'border-blue-600 bg-blue-50/50' 
                : 'border-slate-100 bg-slate-50 hover:border-blue-200 hover:bg-white'
            }`}
          >
            <div className={`p-2 rounded-full transition-colors ${role === 'customer' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <span className={`font-bold text-sm ${role === 'customer' ? 'text-blue-700' : 'text-slate-600'}`}>Customer</span>
            
            {/* Active Checkmark */}
            {role === 'customer' && (
              <div className="absolute top-2 right-2 text-blue-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              </div>
            )}
          </button>

          {/* Staff Selection */}
          <button
            type="button"
            onClick={() => setRole('staff')}
            className={`relative p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 group ${
              role === 'staff' 
                ? 'border-indigo-600 bg-indigo-50/50' 
                : 'border-slate-100 bg-slate-50 hover:border-indigo-200 hover:bg-white'
            }`}
          >
            <div className={`p-2 rounded-full transition-colors ${role === 'staff' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <span className={`font-bold text-sm ${role === 'staff' ? 'text-indigo-700' : 'text-slate-600'}`}>Staff</span>

            {/* Active Checkmark */}
            {role === 'staff' && (
              <div className="absolute top-2 right-2 text-indigo-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              </div>
            )}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-5">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
            <input 
              type="text"
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 px-4 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-4
              ${role === 'staff' 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/30' 
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-blue-500/30'
              }
            `}
          >
            {loading ? 'Signing in...' : `Sign in as ${role === 'staff' ? 'Staff' : 'Customer'}`}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className={`font-bold transition-colors ${role === 'staff' ? 'text-indigo-600 hover:text-indigo-800' : 'text-blue-600 hover:text-blue-800'}`}
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}