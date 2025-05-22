import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [trainers, setTrainers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Toast configuration
  const toastConfig = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    theme: "light",
    style: {
      background: '#ffffff',
      color: '#000000',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }
  };

  useEffect(() => {
    if (!user) {
      toast.error('Please log in to view your appointments', toastConfig);
      navigate('/login');
      return;
    }

    // Initial fetch of appointments
    fetchAppointments();
  }, [navigate, user]);

  const fetchTrainerDetails = async (trainerId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/trainer/list`);
      if (response.data.success) {
        const trainer = response.data.trainers.find(t => t._id === trainerId);
        if (trainer) {
          setTrainers(prev => ({
            ...prev,
            [trainerId]: trainer
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching trainer details:', error);
      toast.error('Failed to fetch trainer details', toastConfig);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://localhost:4000/api/book');

      if (response.data.success) {
        const allAppointments = response.data.bookings || [];
        const userAppointments = allAppointments
          .filter(appointment => appointment.email.toLowerCase() === user.email.toLowerCase())
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setAppointments(userAppointments);

        // Fetch trainer details for each unique trainerId
        const uniqueTrainerIds = [...new Set(userAppointments.map(app => app.trainerId))];
        for (const trainerId of uniqueTrainerIds) {
          await fetchTrainerDetails(trainerId);
        }

        if (userAppointments.length === 0) {
          toast.info('No appointments found for your account', toastConfig);
        } else {
          toast.success(`Found ${userAppointments.length} appointments`, toastConfig);
        }
      } else {
        setError('Failed to fetch appointments');
        toast.error('Failed to fetch appointments', toastConfig);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError(error.response?.data?.message || 'Error fetching appointments');
      toast.error('Failed to fetch appointments', toastConfig);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        const response = await axios.delete(`http://localhost:4000/api/book/${id}`);
        if (response.data.success) {
          toast.success('Appointment deleted successfully', toastConfig);
          fetchAppointments();
        }
      } catch (error) {
        console.error('Error deleting appointment:', error);
        toast.error('Failed to delete appointment', toastConfig);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Format the date to match the expected format
      const formattedDate = new Date(editingAppointment.date).toISOString().split('T')[0];
      
      // Check if the selected slot is available
      const availabilityResponse = await axios.get(
        `http://localhost:4000/api/book/availability/${editingAppointment.trainerId}/${formattedDate}/${editingAppointment.timeSlot}`
      );

      if (!availabilityResponse.data.success) {
        toast.error('The selected time slot is not available. Please choose another slot.', toastConfig);
        return;
      }

      // Show loading toast
      const toastId = toast.loading('Updating appointment...', {
        position: "bottom-right",
        style: {
          background: '#ffffff',
          color: '#000000',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }
      });

      // Update the booking
      const response = await axios.put(
        `http://localhost:4000/api/book/${editingAppointment._id}`,
        {
          trainerId: editingAppointment.trainerId,
          name: editingAppointment.name,
          email: editingAppointment.email,
          age: editingAppointment.age,
          date: formattedDate,
          timeSlot: editingAppointment.timeSlot
        }
      );

      if (response.data.success) {
          toast.update(toastId, {
            render: 'Appointment updated successfully',
            type: 'success',
            isLoading: false,
            ...toastConfig
          });
          setShowEditModal(false);
          fetchAppointments();
        } else {
        throw new Error(response.data.message || 'Failed to update appointment');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to update appointment', toastConfig);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Your Training Sessions</h2>
          <button
            onClick={fetchAppointments}
            disabled={loading}
            className={`px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200 ${
              loading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-orange-600 hover:bg-orange-700'
            }`}
          >
            {loading ? 'Loading...' : 'Refresh Sessions'}
          </button>
        </div>

        {error && (
          <div className="text-center text-red-400 p-4 mb-6 bg-red-900/50 rounded-lg border border-red-700">
            {error}
          </div>
        )}

        {appointments.length === 0 ? (
          <div className="text-center text-gray-400 p-8 bg-gray-800 rounded-lg border border-gray-700">
            No training sessions found. Click the "Refresh Sessions" button to check for new appointments.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{appointment.name}</h3>
                    <p className="text-gray-400">{appointment.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status === 'confirmed' ? 'Approved' :
                     appointment.status === 'cancelled' ? 'Rejected' :
                     'Pending'}
                  </span>
                </div>
                <div className="space-y-2 text-gray-300">
                  <p><span className="font-medium">Date:</span> {new Date(appointment.date).toLocaleDateString()}</p>
                  <p><span className="font-medium">Time:</span> {appointment.timeSlot}</p>
                  <p><span className="font-medium">Age:</span> {appointment.age}</p>
                  <p><span className="font-medium">Trainer:</span> {trainers[appointment.trainerId]?.name || 'Loading...'}</p>
                </div>
                <div className="mt-4 flex space-x-2">
                {appointment.status === 'pending' && (
                    <>
                    <button
                      onClick={() => {
                        setEditingAppointment(appointment);
                        setShowEditModal(true);
                      }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(appointment._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                    </>
                  )}
                  {appointment.status === 'confirmed' && (
                    <div className="text-green-500 font-medium">
                      Your appointment has been approved
                    </div>
                  )}
                  {appointment.status === 'cancelled' && (
                    <div className="text-red-500 font-medium">
                      Your appointment has been rejected
                  </div>
                )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingAppointment?.status === 'pending' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-md w-full">
              <h3 className="text-2xl font-bold text-white mb-6">Edit Session</h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={new Date(editingAppointment.date).toISOString().split('T')[0]}
                    onChange={(e) => setEditingAppointment({
                      ...editingAppointment,
                      date: e.target.value
                    })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Time Slot</label>
                  <select
                    value={editingAppointment.timeSlot}
                    onChange={(e) => setEditingAppointment({
                      ...editingAppointment,
                      timeSlot: e.target.value
                    })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="8:00 AM - 9:00 AM">8:00 AM - 9:00 AM</option>
                    <option value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</option>
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                    <option value="1:00 PM - 2:00 PM">1:00 PM - 2:00 PM</option>
                    <option value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Appointments; 