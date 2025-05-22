import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

function ViewTrainers() {
  const { user } = useAuth();
  const [trainers, setTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    date: '',
    timeSlot: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/trainer/list');
        const data = await response.json();
        if (data.success) {
          setTrainers(data.trainers);
          setFilteredTrainers(data.trainers);
        }
      } catch (error) {
        console.error('Error fetching trainers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTrainers(trainers);
    } else {
      const filtered = trainers.filter(trainer => {
        const name = trainer?.name?.toLowerCase() || '';
        const specialization = trainer?.specialization?.toLowerCase() || '';
        const qualification = trainer?.qualification?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        return (
          name.includes(search) || 
          specialization.includes(search) ||
          qualification.includes(search)
        );
      });
      setFilteredTrainers(filtered);
    }
  }, [searchTerm, trainers]);

  const handleBookClick = (trainer) => {
    setSelectedTrainer(trainer);
    setShowForm(true);
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || ''
      }));
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'date' && value && selectedTrainer) {
      try {
        const formattedDate = new Date(value);
        formattedDate.setHours(12, 0, 0, 0);

        const response = await axios.get(
          `http://localhost:4000/api/book/availability/${selectedTrainer._id}/${formattedDate.toISOString().split('T')[0]}/all`
        );
        
        if (response.data.success) {
          const allTimeSlots = [
            '8:00 AM - 9:00 AM',
            '9:00 AM - 10:00 AM',
            '10:00 AM - 11:00 AM',
            '11:00 AM - 12:00 PM',
            '1:00 PM - 2:00 PM',
            '2:00 PM - 3:00 PM',
            '3:00 PM - 4:00 PM',
            '4:00 PM - 5:00 PM'
          ];
          
          const bookedSlots = response.data.bookedSlots || [];
          const available = allTimeSlots.filter(slot => !bookedSlots.includes(slot));
          
          setAvailableSlots(available);

          if (formData.timeSlot && !available.includes(formData.timeSlot)) {
            setFormData(prev => ({ ...prev, timeSlot: '' }));
            toast.error('Your previously selected time slot is no longer available.');
          }
        } else {
          setAvailableSlots([]);
          toast.error('Failed to fetch available time slots');
        }
      } catch (error) {
        console.error('Error fetching available slots:', error);
        setAvailableSlots([]);
        toast.error('Error fetching available time slots');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to book an appointment');
      return;
    }
    
    try {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        toast.error('Please select a future date for your appointment');
        return;
      }

      const formattedDate = new Date(formData.date);
      formattedDate.setHours(12, 0, 0, 0);

      const age = parseInt(formData.age);
      if (age < 18 || age > 65) {
        toast.error('Age must be between 18 and 65 years.');
        return;
      }

      const bookingData = {
        trainerId: selectedTrainer._id,
        name: formData.name.trim(),
        email: user.email,
        age: age,
        date: formattedDate.toISOString(),
        timeSlot: formData.timeSlot,
        status: 'pending'
      };

      const slotResponse = await axios.get(
        `http://localhost:4000/api/book/availability/${selectedTrainer._id}/${formattedDate.toISOString().split('T')[0]}/${formData.timeSlot}`
      );

      if (!slotResponse.data.success) {
        toast.error('The selected time slot is no longer available. Please select another slot.');
        return;
      }

      const response = await axios.post('http://localhost:4000/api/book', bookingData);

      if (response.data.success) {
        toast.success('Booking successful!');
        handleCloseForm();
        window.location.reload();
      } else {
        toast.error(response.data.message || 'Booking failed!');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error(error.response?.data?.message || 'Error creating booking. Please try again.');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedTrainer(null);
    setFormData({
      name: '',
      age: '',
      date: '',
      timeSlot: ''
    });
    setAvailableSlots([]);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-300 py-20 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">OUR EXPERT TRAINERS</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          <p className="text-xl mt-6 max-w-3xl mx-auto text-gray-300">
            Meet our team of certified fitness professionals dedicated to helping you achieve your goals.
          </p>
        </div>

        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search trainers by name, specialization, or qualification..."
              className="w-full px-6 py-3 rounded-full bg-gray-800 text-white border border-gray-700 focus:border-orange-500 focus:outline-none pl-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Loading trainers...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredTrainers.map((trainer) => (
              <div key={trainer._id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-orange-500 transition-colors duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold text-orange-500">
                    {trainer.name?.charAt(0) || 'T'}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-white">{trainer.name || 'Trainer'}</h3>
                    <p className="text-orange-500">{trainer.specialization || 'Fitness Training'}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400">
                    <span className="text-white font-medium">Age:</span> {trainer.age || 'N/A'}
                  </p>
                  <p className="text-gray-400">
                    <span className="text-white font-medium">Qualification:</span> {trainer.qualification || 'N/A'}
                  </p>
                  <p className="text-gray-400">
                    <span className="text-white font-medium">Contact:</span> {trainer.contact || 'N/A'}
                  </p>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    onClick={() => handleBookClick(trainer)}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">Book Session with {selectedTrainer?.name}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Your Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="18"
                  max="65"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Preferred Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Preferred Time Slot</label>
                <select
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                  required
                >
                  <option value="">Select a Time Slot</option>
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg"
                >
                  Book
                </button>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewTrainers;