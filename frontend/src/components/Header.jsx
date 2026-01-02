import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/cars', label: 'Cars' },
  ];

  // Helper to close menu when clicking a link
  const handleLinkClick = (path) => {
    setIsOpen(false);
    if (path) navigate(path);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm transition-all">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="group relative z-50" onClick={() => setIsOpen(false)}>
            <span className="text-2xl font-black text-blue-600 hover:text-blue-700 transition-colors">
              CarRent
            </span>
          </Link>

          {/* DESKTOP NAVIGATION (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map(n => (
              <Link 
                key={n.to} 
                to={n.to} 
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200"
              >
                {n.label}
              </Link>
            ))}
            
            <div className="w-px h-6 bg-slate-200 mx-2"></div> {/* Divider */}

            {user ? (
              <>
                <Link 
                  to="/account" 
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200"
                >
                  Account
                </Link>
                {user.role === 'staff' ? (
                  <Link 
                    to="/staff" 
                    className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Staff Panel
                  </Link>
                ) : (
                  <Link 
                    to="/customer/bookings" 
                    className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    My Bookings
                  </Link>
                )}
                <button 
                  onClick={handleLogout} 
                  className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* MOBILE MENU BUTTON (Hamburger) */}
          <button 
            className="md:hidden relative z-50 p-2 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xl transition-all duration-300 ease-in-out origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 h-0 overflow-hidden'}`}>
        <div className="px-6 py-6 space-y-4 flex flex-col">
          {navLinks.map(n => (
            <button 
              key={n.to} 
              onClick={() => handleLinkClick(n.to)}
              className="text-left text-base font-semibold text-slate-700 hover:text-blue-600 py-2"
            >
              {n.label}
            </button>
          ))}
          
          <div className="h-px bg-slate-100 my-2"></div>

          {user ? (
            <>
              <button onClick={() => handleLinkClick('/account')} className="text-left text-base font-semibold text-slate-700 hover:text-blue-600 py-2">
                Account
              </button>
              
              {user.role === 'staff' ? (
                <button onClick={() => handleLinkClick('/staff')} className="text-left text-base font-semibold text-blue-600 py-2">
                  Staff Panel
                </button>
              ) : (
                <button onClick={() => handleLinkClick('/customer/bookings')} className="text-left text-base font-semibold text-blue-600 py-2">
                  My Bookings
                </button>
              )}

              <button 
                onClick={handleLogout} 
                className="text-left text-base font-semibold text-red-600 py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-4 mt-2">
              <button 
                onClick={() => handleLinkClick('/login')}
                className="w-full py-3 text-center font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
              >
                Login
              </button>
              <button 
                onClick={() => handleLinkClick('/register')}
                className="w-full py-3 text-center font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl shadow-lg"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}