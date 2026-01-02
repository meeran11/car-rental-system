import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/cars", label: "Browse Cars" },
  ];

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (path) => {
    setIsOpen(false);
    if (path) navigate(path);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  // Helper to check active link
  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled || isOpen
          ? "bg-blue-100 backdrop-blur-md shadow-md border-b border-slate-200"
          : "bg-blue-100 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* 🏎️ LOGO SECTION */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            onClick={() => setIsOpen(false)}
          >
            {/* Custom SVG Logo */}
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle
                  cx="7"
                  cy="17"
                  r="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="17"
                  cy="17"
                  r="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2 15l.8-1.6a2 2 0 011.8-1.1h1.6c.6 0 1.1-.2 1.5-.7L9.1 8.9A3 3 0 0111.4 8h3.2a3 3 0 012.3.9l1.4 1.7c.4.5 1 .7 1.5.7h1.6a2 2 0 011.8 1.1L22 15"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l1-3h6l.5 3M5 15h14"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">
                CarRent
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                Premium Rentals
              </span>
            </div>
          </Link>

          {/* 🖥️ DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  isActive(n.to)
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {n.label}
              </Link>
            ))}

            <div className="h-6 w-px bg-slate-500 mx-3"></div>

            {user ? (
              <div className="flex items-center gap-3">
                {user.role === "staff" ? (
                  <Link
                    to="/staff"
                    className="btn-secondary text-sm px-4 py-2 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
                  >
                    Staff Panel
                  </Link>
                ) : (
                  <Link
                    to="/customer/bookings"
                    className={`text-sm font-medium px-4 py-2 rounded-full transition ${
                      isActive("/customer/bookings")
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    My Bookings
                  </Link>
                )}

                <div className="relative group">
                  <Link
                    to="/account"
                    className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-slate-200 hover:border-blue-200 hover:shadow-sm transition bg-white"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  </Link>
                </div>

                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-500 transition p-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-full hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  Sign up
                </Link>
              </div>
            )}
          </nav>

          {/* 📱 MOBILE HAMBURGER */}
          <button
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 📱 MOBILE MENU DROPDOWN */}
      <div
        className={`md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 shadow-xl transition-all duration-300 ease-in-out origin-top overflow-hidden ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-8 space-y-4">
          {navLinks.map((n) => (
            <button
              key={n.to}
              onClick={() => handleLinkClick(n.to)}
              className="block w-full text-left text-lg font-medium text-slate-800 hover:text-blue-600 py-2"
            >
              {n.label}
            </button>
          ))}

          <div className="h-px bg-slate-100 my-4"></div>

          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">
                    {user.username}
                  </div>
                  <div className="text-xs text-slate-500 capitalize">
                    {user.role} Account
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleLinkClick("/account")}
                className="block w-full text-left text-base font-medium text-slate-600 hover:text-blue-600 py-2"
              >
                Account Settings
              </button>

              {user.role === "staff" ? (
                <button
                  onClick={() => handleLinkClick("/staff")}
                  className="block w-full text-left text-base font-medium text-blue-600 py-2"
                >
                  Staff Dashboard
                </button>
              ) : (
                <button
                  onClick={() => handleLinkClick("/customer/bookings")}
                  className="block w-full text-left text-base font-medium text-blue-600 py-2"
                >
                  My Bookings
                </button>
              )}

              <button
                onClick={handleLogout}
                className="w-full mt-4 py-3 rounded-xl border border-red-100 text-red-600 font-medium hover:bg-red-50 transition"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                onClick={() => handleLinkClick("/login")}
                className="w-full py-3 text-center font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
              >
                Log in
              </button>
              <button
                onClick={() => handleLinkClick("/register")}
                className="w-full py-3 text-center font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
