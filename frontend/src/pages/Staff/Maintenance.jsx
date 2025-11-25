import React, { useEffect, useState } from "react";
import { fetchJson } from "../../api";

export default function Maintenance() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    maintenancetype: "",
    maintenancedate: "",
    maintenancecost: "",
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const d = await fetchJson("/api/maintenance");
      setItems(d.data || []);
    } catch (e) {
      console.error(e);
      alert(e.message || "Failed to load maintenance records");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(item) {
    setEditingId(item.maintenanceid);
    setEditForm({
      maintenancetype: item.maintenancetype,
      maintenancedate: item.maintenancedate,
      maintenancecost: item.maintenancecost,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({
      maintenancetype: "",
      maintenancedate: "",
      maintenancecost: "",
    });
  }

  async function saveEdit(maintenanceid) {
    try {
      await fetchJson(`/api/maintenance/${maintenanceid}`, {
        method: "PUT",
        body: editForm,
      });
      setEditingId(null);
      load();
    } catch (e) {
      alert(e.message || "Failed to update");
    }
  }

  async function deleteMaintenance(maintenanceid) {
    if (
      !window.confirm(
        "Are you sure you want to delete this maintenance record?"
      )
    )
      return;
    try {
      await fetchJson(`/api/maintenance/${maintenanceid}`, {
        method: "DELETE",
      });
      load();
    } catch (e) {
      alert(e.message || "Failed to delete");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">
          Maintenance Records
        </h2>
        <p className="text-slate-600">
          Track and manage vehicle maintenance activities
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-600 text-lg">
            Loading maintenance records...
          </div>
        </div>
      ) : items.length ? (
        <div className="grid gap-6">
          {items.map((it) => (
            <div
              key={it.maintenanceid}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200"
            >
              {editingId === it.maintenanceid ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="text-lg font-bold text-slate-900 mb-4">
                    Edit Maintenance Record
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Maintenance Type
                    </label>
                    <input
                      type="text"
                      value={editForm.maintenancetype}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          maintenancetype: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={editForm.maintenancedate}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          maintenancedate: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Cost (Rs)
                    </label>
                    <input
                      type="number"
                      value={editForm.maintenancecost}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          maintenancecost: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => saveEdit(it.maintenanceid)}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-bold">
                        Maintenance
                      </div>
                      <div className="text-sm text-slate-500">
                        Record #{it.maintenanceid}
                      </div>
                    </div>

                    <div className="text-2xl font-black text-slate-900">
                      {it.maintenancetype}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700">
                          Car:
                        </span>
                        <span>
                          {it.carModel
                            ? `${it.carModel} (ID: ${it.carId})`
                            : it.carId}
                        </span>
                      </div>
                      <div className="h-4 w-px bg-slate-300"></div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700">
                          Date:
                        </span>
                        <span>
                          {new Date(it.maintenancedate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="h-4 w-px bg-slate-300"></div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700">
                          Cost:
                        </span>
                        <span className="text-lg font-bold text-emerald-600">
                          Rs{it.maintenancecost}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-3 lg:min-w-[120px]">
                    <button
                      onClick={() => startEdit(it)}
                      className="flex-1 lg:flex-none px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMaintenance(it.maintenanceid)}
                      className="flex-1 lg:flex-none px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-10 h-10 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div className="text-xl font-bold text-slate-900 mb-2">
            No Maintenance Records
          </div>
          <div className="text-slate-600">
            All vehicles are up to date with maintenance
          </div>
        </div>
      )}
    </div>
  );
}
