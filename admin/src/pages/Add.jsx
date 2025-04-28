import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Add = () => {
  const [trainer, setTrainer] = useState({
    name: '',
    email: '',
    contact: '',
    age: '',
    gender: '',
    qualification: '',
  });

  const [errors, setErrors] = useState({
    contact: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setTrainer((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (e) => {
    const input = e.target.value;

    // Allow only digits
    if (!/^\d*$/.test(input)) return;

    // First digit must be 0
    if (input.length === 1 && input !== '0') return;

    // Max length 10
    if (input.length <= 10) {
      handleChange('contact', input);
      // Clear error when valid
      if (/^0\d{9}$/.test(input)) {
        setErrors((prev) => ({ ...prev, contact: '' }));
      }
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    handleChange('email', value);

    // Email must include @
    if (!value.includes('@')) {
      setErrors((prev) => ({ ...prev, email: 'Email must contain @' }));
    } else {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const contactPattern = /^0\d{9}$/;
    if (!contactPattern.test(trainer.contact)) {
      setErrors((prev) => ({ ...prev, contact: 'Contact must start with 0 and be 10 digits' }));
      setLoading(false);
      return;
    }

    if (!trainer.email.includes('@')) {
      setErrors((prev) => ({ ...prev, email: 'Email must contain @' }));
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(backendUrl + '/api/trainer/add', trainer);
      
      if (response.data.success) {
        toast.success('Trainer added successfully!');
        // Navigate to list trainers page after successful addition
        navigate('/list');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to add trainer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-2xl mx-auto bg-gray-800 shadow-lg rounded-xl p-8 border border-gray-700">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Add New Trainer</h2>
            <div className="w-24 h-1 bg-orange-500"></div>
          </div>
          <button
            onClick={() => navigate('/list')}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            View All Trainers
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              placeholder='Enter Full Name'
              value={trainer.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              placeholder='Enter Email'
              value={trainer.email}
              onChange={handleEmailChange}
              required
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Contact Number</label>
            <input
              type="tel"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              value={trainer.contact}
              onChange={handleContactChange}
              placeholder="0XXXXXXXXX"
              required
            />
            {errors.contact && <p className="text-red-400 text-sm mt-1">{errors.contact}</p>}
          </div>

          {/* Age and Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Age</label>
              <input
                type="number"
                min="18"
                max="70"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              placeholder='Age'
              value={trainer.age}
                onChange={(e) => handleChange('age', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Gender</label>
              <select
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                value={trainer.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Qualification */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Qualification</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              placeholder='Enter Qualifications'
              value={trainer.qualification}
              onChange={(e) => handleChange('qualification', e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-orange-800 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Add Trainer'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/list')}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;