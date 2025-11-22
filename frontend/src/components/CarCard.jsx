import React from 'react';
import { Link } from 'react-router-dom';

export default function CarCard({car}){
  if (!car) return null;
  return (
    <div className="card-modern group">
      <div className="relative h-48 overflow-hidden" style={{ backgroundColor: '#E2E8F0' }}>
        <img 
          src={car.carimageurl || 'https://via.placeholder.com/300x200?text=Car'} 
          alt={car.carmodel || 'car'} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {car.carprice && (
          <div className="absolute top-3 right-3 text-white px-3 py-1 rounded-lg font-semibold text-sm" style={{ backgroundColor: '#3B82F6' }}>
            ${car.carprice}/day
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg" style={{ color: '#0F172A' }}>{car.carmodel} • {car.caryear}</h3>
        <div className="mt-4 flex items-center justify-between">
          <Link 
            to={`/cars/${car.carid}`} 
            className="text-sm font-semibold transition-colors"
            style={{ color: '#3B82F6' }}
            onMouseEnter={(e) => e.target.style.color = '#1e3a8a'}
            onMouseLeave={(e) => e.target.style.color = '#3B82F6'}
          >
            View Details →
          </Link>
          <Link 
            to={`/customer/book/${car.carid}`} 
            className="btn-primary !px-4 !py-1.5 text-sm"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
