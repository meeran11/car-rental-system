import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchJson } from '../api';

export default function Account() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Customer fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [driverLicense, setDriverLicense] = useState('');

  // Staff fields
  const [staffName, setStaffName] = useState('');
  const [staffPhone, setStaffPhone] = useState('');

  useEffect(() => {
    if (user?.userid) {
      loadAccountInfo();
    }
  }, [user?.userid]);

  async function loadAccountInfo() {
    if (!user?.userid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let data;
      if (user.role === 'customer') {
        data = await fetchJson(`/user/customer/${user.userid}`);
        setCustomerName(data.data?.customername || '');
        setCustomerPhone(data.data?.customerphone || '');
        setDriverLicense(data.data?.driverlicense || '');
      } else if (user.role === 'staff') {
        data = await fetchJson(`/user/staff/${user.userid}`);
        setStaffName(data.data?.staffname || '');
        setStaffPhone(data.data?.staffphone || '');
      }
    } catch (err) {
      setError(err.message || 'Failed to load account information');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      let payload;
      let endpoint;

      if (user.role === 'customer') {
        payload = {
          customerName,
          customerPhone,
          driverLicense
        };
        endpoint = `/user/customer/${user.userid}`;
      } else {
        payload = {
          staffName,
          staffPhone
        };
        endpoint = `/user/staff/${user.userid}`;
      }

      await fetchJson(endpoint, {
        method: 'PUT',
        body: payload
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update account information');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div style={{ color: '#64748B' }}>Loading account information...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="card-modern p-8">
          <h1 className="text-3xl font-bold mb-8" style={{ color: '#0F172A' }}>
            Account Settings
          </h1>

          {error && (
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>
              Account information updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {user.role === 'customer' ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="input-modern w-full"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    className="input-modern w-full"
                    placeholder="03001234567"
                    maxLength="11"
                  />
                  <p style={{ color: '#64748B' }} className="text-xs mt-1">
                    Must be 11 digits
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>
                    Driver License
                  </label>
                  <input
                    type="text"
                    value={driverLicense}
                    onChange={(e) => setDriverLicense(e.target.value.slice(0, 20))}
                    className="input-modern w-full"
                    placeholder="Enter your driver license number"
                    maxLength="20"
                  />
                  <p style={{ color: '#64748B' }} className="text-xs mt-1">
                    Max 20 characters
                  </p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    className="input-modern w-full"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={staffPhone}
                    onChange={(e) => setStaffPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    className="input-modern w-full"
                    placeholder="03001234567"
                    maxLength="11"
                  />
                  <p style={{ color: '#64748B' }} className="text-xs mt-1">
                    Must be 11 digits
                  </p>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full mt-8"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
