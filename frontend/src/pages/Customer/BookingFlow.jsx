import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks';
import { fetchJson } from '../../api';
import { useAuth } from '../../contexts/AuthContext';

export default function BookingFlow(){
  const { id } = useParams();
  const { data: car } = useFetch(`/car/cars/${id}`);
  const { user } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('visa');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  if (user?.role === 'staff') {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md card-modern p-8 text-center">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#0F172A' }}>Booking Unavailable</h2>
          <p style={{ color: '#64748B' }}>Staff members are not permitted to book cars.</p>
        </div>
      </div>
    );
  }
  console.log('Selected Car:', car);

  async function submit(e){
    e.preventDefault();
    setLoading(true);
    try {
      // Calculate total amount
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start < today) {
        alert('Start date cannot be in the past');
        setLoading(false);
        return;
      }
      
      if (start >= end) {
        alert('End date must be after start date');
        setLoading(false);
        return;
      }
      
      const days = (end - start) / (1000 * 60 * 60 * 24) + 1;
      const totalAmount = days * (car?.carprice || 0);

      // Confirm payment first
      const paymentData = await fetchJson('/payment/confirmPayment', { 
        method: 'POST', 
        body: { 
          paymentAmount: totalAmount,
          paymentMethod,
          cardNumber
        } 
      });

      // Create rental
      await fetchJson('/rental/create', { 
        method: 'POST', 
        body: { 
          userId: user?.userid,
          carId: parseInt(id),
          startDate,
          endDate,
          totalAmount,
          paymentId: paymentData.data?.paymentid
        } 
      });
      
      nav('/customer/book/confirm');
    } catch (err) {
      alert(err.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  }

  if (!car) return <div style={{ color: '#64748B' }}>Loading car...</div>;

  // Calculate preview total for display
  const previewDays = startDate && endDate ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) : 0;
  const previewTotal = previewDays * (car?.carprice || 0);

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Car Preview */}
        <div>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 group hover:shadow-3xl transition-all duration-500">
            <div className="relative mb-8">
              <img 
                src={car?.carimageurl || 'https://via.placeholder.com/600x400?text=Car+Image'} 
                alt={car?.carmodel}
                className="w-full h-80 lg:h-96 object-cover rounded-3xl shadow-2xl group-hover:scale-[1.02] transition-transform duration-700 mx-auto block"
              />
              <div className="absolute top-6 right-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-xl shadow-2xl ring-4 ring-white/30">
                Rs{car?.carprice}/day
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight" style={{ color: '#0F172A' }}>
              {car?.carmodel}
            </h1>
            <div className="flex flex-wrap gap-4 text-lg mb-8 text-slate-600">
              <span>{car?.caryear}</span>
            </div>
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-3xl border border-slate-200 shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <h3 className="font-black text-2xl text-slate-900 mb-6">Rental Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-2xl">
                    <span className="font-semibold text-slate-700">Daily Rate</span>
                    <span className="font-bold text-xl text-blue-600">Rs{car?.carprice}</span>
                  </div>
                  
                  {previewDays > 0 && (
                    <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-2xl">
                      <span className="font-semibold text-slate-700">Duration</span>
                      <span className="font-bold text-xl text-indigo-600">{previewDays} day{previewDays !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent my-4"></div>
                  
                  <div className="flex items-center justify-between p-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                    <span className="font-bold text-xl text-white">Total Amount</span>
                    <span className="font-black text-3xl text-white">Rs{previewTotal}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div>
          <div className="card-modern p-10 shadow-2xl ring-1 ring-slate-200/50 max-w-lg mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3" style={{ color: '#0F172A' }}>Complete Booking</h2>
              <p className="text-slate-600">Secure your ride in just a few steps</p>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>Start Date</label>
                <input 
                  type="date"
                  value={startDate} 
                  onChange={e=>setStartDate(e.target.value)} 
                  min={new Date().toISOString().split('T')[0]}
                  className="input-modern"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>End Date</label>
                <input 
                  type="date"
                  value={endDate} 
                  onChange={e=>setEndDate(e.target.value)} 
                  min={startDate || new Date().toISOString().split('T')[0]}
                  className="input-modern"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>Payment Method</label>
                <select 
                  value={paymentMethod} 
                  onChange={e=>setPaymentMethod(e.target.value)} 
                  className="input-modern"
                >
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>Card Number (16 digits)</label>
                <input 
                  type="text"
                  value={cardNumber} 
                  onChange={e=>setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))} 
                  className="input-modern"
                  placeholder="4532015112830366"
                  maxLength="16"
                  required
                />
              </div>

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Processing...' : 'Request Booking'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
