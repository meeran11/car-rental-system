import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks';
import BookingFlow from './Customer/BookingFlow';

export default function CarDetail(){
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: car, loading, error } = useFetch(`/car/cars/${id}`);

  if (loading) return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderBottomColor: '#3B82F6' }}></div>
    </div>
  );

  if (error) return (
    <div className="px-4 py-3 rounded-lg" style={{ backgroundColor: '#FEE2E2', borderColor: '#FECACA', color: '#991B1B', border: '1px solid #FECACA' }}>
      Error: {error.message}
    </div>
  );

  if (!car) return <div className="text-center py-12" style={{ color: '#94A3B8' }}>Car not found</div>;

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <button 
          onClick={() => navigate('/cars')}
          className="mb-4 px-4 py-2 rounded-lg font-medium transition-all"
          style={{ backgroundColor: '#E2E8F0', color: '#0F172A' }}
        >
          ← Back to Cars
        </button>

        <div className="rounded-xl overflow-hidden shadow-lg mb-6">
          <img 
            src={car.carimage || 'https://via.placeholder.com/600x400?text=Car'} 
            alt={car.carmodel}
            className="w-full h-96 object-cover"
          />
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#0F172A' }}>
           {car.carmodel}
          </h1>
          <p className="text-lg mb-4" style={{ color: '#64748B' }}>
            Year: {car.caryear} 
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#0F172A' }}>Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p style={{ color: '#64748B' }} className="text-sm">Status</p>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${car.carStatus === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {car.carStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-lg sticky top-24">
          <p style={{ color: '#64748B' }} className="text-sm mb-2">Price per day</p>
          <p className="text-3xl font-bold mb-6" style={{ color: '#3B82F6' }}>
            ${car.carprice?.toFixed(2) || 'N/A'}
          </p>
          
          {car.carstatus === 'available' && (
            <BookingFlow car={car} />
          )}
          
          {car.carstatus !== 'available' && (
            <div className="px-4 py-3 rounded-lg" style={{ backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' }}>
              This car is currently unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
