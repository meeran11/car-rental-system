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

  async function submit(e){
    e.preventDefault();
    setLoading(true);
    try {
      // Calculate total amount
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = (end - start) / (1000 * 60 * 60 * 24) + 1;
      const totalAmount = days * (car?.carPrice || 0);

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

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md card-modern p-8">
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#0F172A' }}>Book {car.carModel}</h2>
        <div className="mb-4 p-3 rounded" style={{ backgroundColor: '#F8FAFC', borderLeft: '4px solid #3B82F6' }}>
          <div style={{ color: '#64748B' }} className="text-sm">Daily Rate</div>
          <div style={{ color: '#3B82F6' }} className="text-lg font-bold">${car.carPrice}/day</div>
        </div>
        
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>Start Date</label>
            <input 
              type="date"
              value={startDate} 
              onChange={e=>setStartDate(e.target.value)} 
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
            {loading ? 'Processing...' : 'Complete Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}
