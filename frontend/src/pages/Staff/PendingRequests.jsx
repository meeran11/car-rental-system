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
      console.log('pending request ka data: ',data);
    } catch (e) {
      alert(e.message || 'Failed to load');
    } finally { setLoading(false); }
  }

  useEffect(()=>{ load(); }, []);

  async function approve(bookingid){
    try {
      await fetchJson('/rental/approveRental', { method: 'POST', body: { bookingId: bookingid, userId: user?.userid } });
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
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Pending Requests</h2>
        <p className="text-slate-600">Review and manage customer booking requests</p>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-600 text-lg">Loading requests...</div>
        </div>
      ) : requests.length ? (
        <div className="grid gap-6">
          {requests.map(r => (
            <div key={r.bookingid} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm font-bold">
                      Pending
                    </div>
                    <div className="text-sm text-slate-500">
                      Booking #{r.bookingid}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Customer Name</div>
                      <div className="text-lg font-bold text-slate-900">{r.customername || 'N/A'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Driver License</div>
                      <div className="text-lg font-bold text-slate-900">{r.driverlicense || 'N/A'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Vehicle</div>
                      <div className="text-lg font-bold text-slate-900">{r.carmodel} ({r.caryear})</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
  <span className="font-semibold text-slate-700">Duration:</span>
  <span>
    {new Date(r.startdate).toLocaleDateString()} to {new Date(r.enddate).toLocaleDateString()}
  </span>
</div>
                    <div className="h-4 w-px bg-slate-300"></div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">Total:</span>
                      <span className="text-lg font-bold text-blue-600">Rs{r.totalamount}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex lg:flex-col gap-3 lg:min-w-[140px]">
                  <button 
                    onClick={()=>approve(r.bookingid)} 
                    className="flex-1 lg:flex-none px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={()=>decline(r.bookingid)} 
                    className="flex-1 lg:flex-none px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-xl font-bold text-slate-900 mb-2">No Pending Requests</div>
          <div className="text-slate-600">All booking requests have been processed</div>
        </div>
      )}
    </div>
  );
}
