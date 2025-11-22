import React, { useEffect, useState } from 'react';
import { fetchJson } from '../../api';
import { useAuth } from '../../contexts/AuthContext';

export default function PendingRequests(){
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  async function load(){
    setLoading(true);
    try {
      const data = await fetchJson('/rental/pendingRequests');
      setRequests(data.data || []);
    } catch (e) {
      alert(e.message || 'Failed to load');
    } finally { setLoading(false); }
  }

  useEffect(()=>{ load(); }, []);

  async function approve(bookingid){
    try {
      await fetchJson('/rental/approveRental', { method: 'POST', body: { bookingId: bookingid, staffId: user?.userid } });
      load();
    } catch (e) { alert(e.message || 'Failed'); }
  }

  async function decline(bookingid){
    try {
      await fetchJson('/rental/declineRental', { method: 'POST', body: { bookingId: bookingid } });
      load();
    } catch (e) { alert(e.message || 'Failed'); }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4" style={{ color: '#0F172A' }}>Pending Requests</h2>
      {loading ? (
        <div style={{ color: '#64748B' }}>Loading...</div>
      ) : requests.length ? (
        requests.map(r => (
          <div key={r.bookingid} className="card-modern p-3 mb-2">
            <div style={{ color: '#0F172A' }}>Customer: {r.customerid} — Car: {r.carid}</div>
            <div style={{ color: '#64748B' }} className="text-sm mt-1">
              {r.startdate} to {r.enddate} • ${r.totalamount}
            </div>
            <div className="mt-2 flex gap-2">
              <button 
                onClick={()=>approve(r.bookingid)} 
                className="btn-success text-sm px-3 py-1"
              >
                Approve
              </button>
              <button 
                onClick={()=>decline(r.bookingid)} 
                className="btn-danger text-sm px-3 py-1"
              >
                Decline
              </button>
            </div>
          </div>
        ))
      ) : (
        <div style={{ color: '#64748B' }}>No pending requests</div>
      )}
    </div>
  );
}
