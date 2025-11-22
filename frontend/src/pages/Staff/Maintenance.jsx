import React, { useEffect, useState } from 'react';
import { fetchJson } from '../../api';

export default function Maintenance(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{ load(); }, []);

  async function load(){
    try { 
      const d = await fetchJson('/api/maintenance');
      setItems(d.data || []); 
    } catch(e) { 
      console.error(e);
      alert(e.message || 'Failed to load maintenance records');
    } finally {
      setLoading(false);
    }
  }

  async function deleteMaintenance(maintenanceid){
    if (!window.confirm('Are you sure you want to delete this maintenance record?')) return;
    try {
      await fetchJson(`/api/maintenance/${maintenanceid}`, { method: 'DELETE' });
      load();
    } catch(e) {
      alert(e.message || 'Failed to delete');
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4" style={{ color: '#0F172A' }}>Maintenance Records</h2>
      {loading ? (
        <div style={{ color: '#64748B' }}>Loading...</div>
      ) : items.length ? (
        <ul>
          {items.map(it => (
            <li key={it.maintenanceid} className="card-modern p-3 mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <div style={{ color: '#0F172A' }} className="font-medium">{it.maintenancetype}</div>
                  <div style={{ color: '#64748B' }} className="text-sm">
                    Car: {it.carid} • Date: {it.maintenancedate}
                  </div>
                  <div style={{ color: '#10B981' }} className="text-sm font-medium">
                    Cost: ${it.maintenancecost}
                  </div>
                </div>
                <button 
                  onClick={() => deleteMaintenance(it.maintenanceid)}
                  className="text-sm px-3 py-1 rounded transition-colors"
                  style={{ color: '#EF4444' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#FEE2E2'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ color: '#64748B' }}>No maintenance records</div>
      )}
    </div>
  );
}
