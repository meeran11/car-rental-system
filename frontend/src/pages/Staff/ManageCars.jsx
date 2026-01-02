import React, { useState, useEffect } from 'react';
import { fetchJson } from '../../api';
import Modal from '../../components/Modal';
import ImageUploader from '../../components/ImageUploader';

export default function ManageCars(){
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState({
    carModel: '', carYear: '', carPrice: '', 
    carStatus: 'available', carImageUrl: '',
    maintenanceType: '', maintenanceCost: '', maintenanceDate: ''
  });

  async function loadCars(){
    setLoading(true);
    try {
      const data = await fetchJson('/car/cars');
      setCars(data.data || data || []);
    } catch (e) {
      alert(e.message || 'Failed to load cars');
    } finally { setLoading(false); }
  }

  useEffect(() => { loadCars(); }, []);

  function openEditModal(car){
    setEditingCar(car);
    setFormData({
      carModel: car.carmodel || '', carYear: car.caryear || '', 
      carPrice: car.carprice || '', carStatus: car.carstatus || 'available', 
      carImageUrl: car.carimageurl || '',
      maintenanceType: '', maintenanceCost: '', maintenanceDate: ''
    });
    setShowModal(true);
  }

  function openNewCarModal(){
    setEditingCar(null);
    setFormData({
      carModel: '', carYear: '', carPrice: '', 
      carStatus: 'available', carImageUrl: '',
    maintenanceType: '', maintenanceCost: '', maintenanceDate: ''
    
    });
    setShowModal(true);
  }

  async function saveCar(){
    try {
      // Validate required fields
      if (!formData.carModel || !formData.carYear || !formData.carPrice || !formData.carImageUrl) {
        alert('Please fill in all required fields: Name, Year, Price, and Image');
        return;
      }

      if (editingCar) {
        if (formData.carStatus === 'maintenance') {
          if (!formData.maintenanceType || !formData.maintenanceCost || !formData.maintenanceDate) {
            alert('Please fill in all maintenance details');
            return;
          }
          await fetchJson('/api/maintenance', {
            method: 'POST',
            body: {
              carId: editingCar.carid,
              maintenanceType: formData.maintenanceType,
              maintenanceCost: parseFloat(formData.maintenanceCost),
              maintenanceDate: formData.maintenanceDate
            }
          });
        } else {
          await fetchJson(`/car/cars/${editingCar.carid}`, {
            method: 'PUT',
            body: formData
          });
        }
        alert('Car updated successfully');
      } else {
        await fetchJson('/car/uploadCar', {
          method: 'POST',
          body: formData
        });
        alert('Car created successfully');
      }
      setShowModal(false);
      loadCars();
    } catch (e) {
      alert(e.message || 'Failed to save car');
    }
  }

  async function deleteCar(carId){
    if (!confirm('Are you sure you want to delete this car?')) return;
    try {
      await fetchJson(`/car/cars/${carId}`, { method: 'DELETE' });
      alert('Car deleted successfully');
      loadCars();
    } catch (e) {
      alert(e.message || 'Failed to delete car');
    }
  }

  async function endRental(bookingid){
    if (!confirm('Are you sure you want to end this rental?')) return;
    try {
      console.log('Ending rental for carId:', bookingid);
      await fetchJson(`/rental/endRental/${bookingid}`, { method: 'POST' });
      alert('Rental ended successfully');
      loadCars();
    } catch (e) {
      alert(e.message || 'Failed to end rental');
    }
  }
const isRentalActive = (car) => {
  return (
    car.bookingid &&
    car.rentalstatus === 'active' &&
    new Date(car.enddate) > new Date()
  );
};

  return (
    <div>
      <div className="flex justify-between items-center mb-6 mt-16">
        <h2 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Manage Cars</h2>
        <button 
          onClick={openNewCarModal}
          className="px-4 py-2 rounded-lg font-medium text-white transition-all"
          style={{ backgroundColor: '#3B82F6' }}
        >
          + Add New Car
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderBottomColor: '#3B82F6' }}></div>
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-12" style={{ color: '#94A3B8' }}>
          No cars found. Add a new car to get started.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map(c => (
            <div key={c.carid} className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-100 hover:border-blue-200 hover:-translate-y-2">
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <img 
                  src={c.carimageurl ? c.carimageurl.replace('/upload/', '/upload/w_500,h_300,c_fill,q_auto:best,f_auto/') : 'https://via.placeholder.com/500x300?text=Car'} 
                  alt={c.carmodel} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                  loading="lazy"
                  style={{ imageRendering: '-webkit-optimize-contrast' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Price Badge */}
                <div className="absolute top-3 right-3 backdrop-blur-xl bg-white/95 px-3 py-1.5 rounded-xl shadow-xl border border-white/50 transform group-hover:scale-105 transition-all duration-300">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-lg font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Rs{c.carprice}</span>
                    <span className="text-[10px] font-semibold text-slate-500">/day</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2 backdrop-blur-lg bg-white/20 px-4 py-2 rounded-full border border-white/30">
                  <div className={`w-2 h-2 rounded-full ${c.carstatus === 'available' ? 'bg-emerald-400' : c.carstatus === 'rented' ? 'bg-amber-400' : 'bg-red-400'} shadow-lg`}></div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{c.carstatus}</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 space-y-4">
                {/* Car Info */}
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 leading-tight tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                    {c.carbrand} {c.carmodel}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-slate-700 font-semibold text-xs">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {c.caryear}
                    </span>
                    {c.cartype && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-full text-blue-700 font-semibold text-xs">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {c.cartype}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-3 border-t border-slate-100">
                  {c.bookingid ? (
                    <button 
                      onClick={() => endRental(c.bookingid)}
                      className="group/end flex-1 relative px-4 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/end:translate-x-full transition-transform duration-1000"></div>
                      <span className="relative flex items-center justify-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        End Rental
                      </span>
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={() => openEditModal(c)}
                        className="group/edit flex-1 relative px-4 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/edit:translate-x-full transition-transform duration-1000"></div>
                        <span className="relative flex items-center justify-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </span>
                      </button>
                      <button 
                        onClick={() => deleteCar(c.carid)}
                        className="group/delete flex-1 relative px-4 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/delete:translate-x-full transition-transform duration-1000"></div>
                        <span className="relative flex items-center justify-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal open={showModal} title={editingCar ? 'Edit Car' : 'Add New Car'} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>Car Name</label>
              <input 
                type="text" 
                value={formData.carModel}
                onChange={(e) => setFormData({...formData, carModel: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#E2E8F0' }}
                placeholder="e.g., Toyota Corolla"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>Year</label>
                <input 
                  type="number" 
                  value={formData.carYear}
                  onChange={(e) => setFormData({...formData, carYear: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E2E8F0' }}
                  placeholder="2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>Price/Day</label>
                <input 
                  type="number" 
                  value={formData.carPrice}
                  onChange={(e) => setFormData({...formData, carPrice: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E2E8F0' }}
                  placeholder="5000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>Status</label>
              <select 
                value={formData.carStatus}
                onChange={(e) => setFormData({...formData, carStatus: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#E2E8F0' }}
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            {formData.carStatus === 'maintenance' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>Maintenance Type</label>
                  <input 
                    type="text" 
                    value={formData.maintenanceType}
                    onChange={(e) => setFormData({...formData, maintenanceType: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: '#E2E8F0' }}
                    placeholder="e.g., Engine Repair"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>Maintenance Cost</label>
                  <input 
                    type="number" 
                    value={formData.maintenanceCost}
                    onChange={(e) => setFormData({...formData, maintenanceCost: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: '#E2E8F0' }}
                    placeholder="500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>Maintenance Date</label>
                  <input 
                    type="date" 
                    value={formData.maintenanceDate}
                    onChange={(e) => setFormData({...formData, maintenanceDate: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: '#E2E8F0' }}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#0F172A' }}>Car Image</label>
              <ImageUploader 
                onImageUrlChange={(url) => setFormData({...formData, carImageUrl: url})}
                imagePreview={formData.carImageUrl}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                onClick={saveCar}
                className="flex-1 px-4 py-2 rounded-lg font-medium text-white transition-all"
                style={{ backgroundColor: '#3B82F6' }}
              >
                {editingCar ? 'Update Car' : 'Create Car'}
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-all"
                style={{ backgroundColor: '#E2E8F0', color: '#0F172A' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
