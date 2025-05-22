import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/book');
      if (response.data.success) {
        setBookings(response.data.bookings);
      }
    } catch (error) {
      setError('Error fetching bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      alert('Please select a status');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:4000/api/book/${selectedBooking._id}/status`,
        { status: selectedStatus }
      );

      if (response.data.success) {
        // Update the bookings list
        const updatedBookings = bookings.map(booking =>
          booking._id === selectedBooking._id
            ? { ...booking, status: selectedStatus }
            : booking
        );
        setBookings(updatedBookings);
        setShowStatusModal(false);
        setSelectedStatus('');
        alert(`Booking ${selectedStatus} successfully`);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert(error.response?.data?.message || 'Error updating booking status');
    }
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        const response = await axios.delete(`http://localhost:4000/api/book/${bookingId}`);
        if (response.data.success) {
          setBookings(bookings.filter(booking => booking._id !== bookingId));
          alert('Booking deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert(error.response?.data?.message || 'Error deleting booking');
      }
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading bookings...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Booked Sessions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold">{booking.name}</h3>
              <p className="text-gray-600">{booking.email}</p>
            </div>
            <div className="space-y-2">
              <p><span className="font-medium">Date:</span> {new Date(booking.date).toLocaleDateString()}</p>
              <p><span className="font-medium">Time Slot:</span> {booking.timeSlot}</p>
              <p><span className="font-medium">Age:</span> {booking.age}</p>
              <p><span className="font-medium">Trainer ID:</span> {booking.trainerId}</p>
              <p>
                <span className="font-medium">Status:</span>{' '}
                <span className={`px-2 py-1 rounded ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status || 'pending'}
                </span>
              </p>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => {
                  setSelectedBooking(booking);
                  setShowStatusModal(true);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Update Status
              </button>
              <button
                onClick={() => handleDelete(booking._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Update Booking Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="confirmed">Approve</option>
                  <option value="cancelled">Reject</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedStatus('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBookings; 