import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { fetchJson } from "../../api";

export default function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("pending"); // 'pending', 'current', 'previous'

  useEffect(() => {
    if (user?.userid) loadBookings();
  }, [user?.userid, filter]);

  async function loadBookings() {
    setLoading(true);
    setError(null);
    try {
      const endpoint =
        filter === "pending"
          ? `/rental/pendingRequests/${user.userid}`
          : filter === "current"
          ? `/rental/currentRentals/${user.userid}`
          : `/rental/previousRentals/${user.userid}`;

      const data = await fetchJson(endpoint);
      setBookings(data.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4" style={{ color: "#0F172A" }}>
        My Bookings
      </h2>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-6">
        {["pending", "current", "previous"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === type
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading/Error */}
      {loading && <div style={{ color: "#64748B" }}>Loading bookings...</div>}
      {error && <div style={{ color: "#EF4444" }}>Error: {error.message}</div>}

      {/* Booking list */}
      {!loading && !error && (
        <ul>
          {bookings.length ? (
            bookings.map((b) => (
              <li key={b.bookingid} className="card-modern p-3 mb-2">
                <div style={{ color: "#0F172A" }} className="font-medium">
                  Car: {b.carModel || "Unknown"}
                </div>
                <div style={{ color: "#64748B" }} className="text-sm mt-1">
                  From: {new Date(b.startdate).toLocaleDateString()} To:{" "}
                  {new Date(b.enddate).toLocaleDateString()}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div style={{ color: "#10B981" }} className="font-medium"><span style={{color: "Black"}}>Total: </span>
                    $
                    {typeof b.totalamount === "number"
                      ? b.totalamount.toFixed(2)
                      : b.totalamount}
                  </div>
                  <span className="badge-primary">{b.rentalstatus}</span>
                </div>
              </li>
            ))
          ) : (
            <div style={{ color: "#64748B" }}>No bookings found.</div>
          )}
        </ul>
      )}
    </div>
  );
}
