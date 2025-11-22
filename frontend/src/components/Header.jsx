import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header(){
  const { user, logout } = useAuth();
  const nav = [
    { to: '/', label: 'Home' },
    { to: '/cars', label: 'Cars' },
  ];
  return (
    <header className="shadow-lg border-b" style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}>
      <div className="container mx-auto px-4 py-5 flex items-center justify-between">
        <Link to="/" className="text-3xl font-bold hover:opacity-80 transition-opacity" style={{ 
          background: 'linear-gradient(135deg, #3B82F6 0%, #0F172A 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          CarRent
        </Link>
        <nav className="flex items-center space-x-1">
          {nav.map(n => (
            <Link 
              key={n.to} 
              to={n.to} 
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
              style={{ color: '#64748B' }}
              onMouseEnter={(e) => e.target.style.color = '#3B82F6'}
              onMouseLeave={(e) => e.target.style.color = '#64748B'}
            >
              {n.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link 
                to="/account" 
                className="ml-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                style={{ color: '#64748B' }}
                onMouseEnter={(e) => e.target.style.color = '#3B82F6'}
                onMouseLeave={(e) => e.target.style.color = '#64748B'}
              >
                Account
              </Link>
              {user.role === 'staff' ? (
                <Link 
                  to="/staff" 
                  className="ml-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                  style={{ backgroundColor: '#DBEAFE', color: '#0C4A6E' }}
                >
                  Staff
                </Link>
              ) : (
                <Link 
                  to="/customer/bookings" 
                  className="ml-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                  style={{ backgroundColor: '#DBEAFE', color: '#0C4A6E' }}
                >
                  My Bookings
                </Link>
              )}
              <button 
                onClick={logout} 
                className="ml-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                style={{ color: '#EF4444' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#FEE2E2'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="ml-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                style={{ color: '#64748B' }}
                onMouseEnter={(e) => e.target.style.color = '#3B82F6'}
                onMouseLeave={(e) => e.target.style.color = '#64748B'}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="ml-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200"
                style={{ backgroundColor: '#3B82F6' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1e3a8a'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3B82F6'}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
