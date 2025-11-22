import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchJson } from '../../api';

export default function Bookings(){
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBookings();
  }, [user?.userid]);

  async function loadBookings(){
    if (!user?.userid) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJson(`/rental/pendingRequests/${user.userid}`);
      setBookings(data.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div style={{ color: '#64748B' }}>Loading bookings...</div>;
  if (error) return <div style={{ color: '#EF4444' }}>Error: {error.message}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4" style={{ color: '#0F172A' }}>My Bookings</h2>
      <ul>
        {bookings && bookings.length ? bookings.map(b => (
          <li key={b.bookingid} className="card-modern p-3 mb-2">
            <div style={{ color: '#0F172A' }} className="font-medium">Car: {b.carid}</div>
            <div style={{ color: '#64748B' }} className="text-sm mt-1">From: {b.startdate} To: {b.enddate}</div>
            <div className="flex justify-between items-center mt-2">
              <div style={{ color: '#10B981' }} className="font-medium">${b.totalamount}</div>
              <span className="badge-primary">{b.rentalstatus}</span>
            </div>
          </li>
        )) : <div style={{ color: '#64748B' }}>No bookings yet.</div>}
      </ul>
    </div>
  );
}
