import React, { useState } from 'react';
import { useFetch } from '../hooks';
import CarCard from '../components/CarCard';
import FiltersPanel from '../components/FiltersPanel';
import Pagination from '../components/Pagination';

export default function Cars(){
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const { data, loading, error } = useFetch(`/car/search${query ? `?${query}&page=${page}` : `?page=${page}`}`);

  function onFilterChange(e){
    const form = e.target.form;
    if (!form) return;
    const params = new URLSearchParams(new FormData(form));
    setQuery(params.toString());
    setPage(1);
  }

  const cars = data?.data || [];
  const pagination = data?.pagination || {};

  return (
    <div className="md:flex gap-6">
      <div className="hidden md:block flex-shrink-0">
        <FiltersPanel onChange={onFilterChange} />
      </div>
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#0F172A' }}>Browse Cars</h1>
          <p style={{ color: '#64748B' }}>Find the perfect vehicle for your needs</p>
        </div>
        
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderBottomColor: '#3B82F6' }}></div>
          </div>
        )}
        
        {error && (
          <div className="px-4 py-3 rounded-lg" style={{ backgroundColor: '#FEE2E2', borderColor: '#FECACA', color: '#991B1B', border: '1px solid #FECACA' }}>
            Error: {error.message}
          </div>
        )}
        
        {!loading && !error && (
          <>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cars && cars.length ? (
                cars.map(c => <CarCard key={c.carid} car={c} />)
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-lg" style={{ color: '#94A3B8' }}>No cars found. Try adjusting your filters.</p>
                </div>
              )}
            </div>
            
            {cars && cars.length > 0 && (
              <div className="mt-8">
                <Pagination 
                  page={pagination.currentPage || 1} 
                  total={pagination.totalPages || 1} 
                  onChange={(newPage) => setPage(newPage)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
