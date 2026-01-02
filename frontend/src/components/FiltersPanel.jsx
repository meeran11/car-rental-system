import React from 'react';

export default function FiltersPanel({onChange}) {
  return (
    <aside className="mt-16 w-64 p-4 rounded-lg card-modern">
      <h4 className="font-semibold mb-4" style={{ color: '#0F172A' }}>Filters</h4>
      <form onChange={onChange}>
        <div className="mb-4">
          <label className="block text-sm mb-1" style={{ color: '#64748B' }}>Model</label>
          <input 
            className="input-modern" 
            name="model" 
            placeholder="Search model..."
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1" style={{ color: '#64748B' }}>Year</label>
          <input 
            className="input-modern" 
            name="year" 
            type="number"
            placeholder="e.g., 2024"
            min="1900"
            max="2099"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1" style={{ color: '#64748B' }}>Min Price</label>
          <input 
            className="input-modern" 
            name="priceMin" 
            type="number"
            placeholder="Minimum price..."
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1" style={{ color: '#64748B' }}>Max Price</label>
          <input 
            className="input-modern" 
            name="priceMax" 
            type="number"
            placeholder="Maximum price..."
          />
        </div>

      </form>
    </aside>
  );
}
