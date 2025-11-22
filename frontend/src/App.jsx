import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetail from './pages/CarDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import Bookings from './pages/Customer/Bookings';
import BookingFlow from './pages/Customer/BookingFlow';
import BookingConfirm from './pages/Customer/BookingConfirm';
import Dashboard from './pages/Staff/Dashboard';
import ManageCars from './pages/Staff/ManageCars';
import PendingRequests from './pages/Staff/PendingRequests';
import Maintenance from './pages/Staff/Maintenance';
import ProtectedRoute from './components/ProtectedRoute';

export default function App(){
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/:id" element={<CarDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />

          <Route path="/customer/bookings" element={<ProtectedRoute role="customer"><Bookings /></ProtectedRoute>} />
          <Route path="/customer/book/:id" element={<ProtectedRoute role="customer"><BookingFlow /></ProtectedRoute>} />
          <Route path="/customer/book/confirm" element={<ProtectedRoute role="customer"><BookingConfirm /></ProtectedRoute>} />

          <Route path="/staff" element={<ProtectedRoute role="staff"><Dashboard /></ProtectedRoute>} />
          <Route path="/staff/manage-cars" element={<ProtectedRoute role="staff"><ManageCars /></ProtectedRoute>} />
          <Route path="/staff/pending" element={<ProtectedRoute role="staff"><PendingRequests /></ProtectedRoute>} />
          <Route path="/staff/maintenance" element={<ProtectedRoute role="staff"><Maintenance /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
