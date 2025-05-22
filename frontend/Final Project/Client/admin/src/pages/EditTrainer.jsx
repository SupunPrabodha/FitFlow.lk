import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditTrainer = () => {
  const { state } = useLocation();
  const { trainer } = state || {};
  const [editedTrainer, setEditedTrainer] = useState(trainer);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setEditedTrainer((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        backendUrl + `/api/trainer/update/${trainer._id}`, 
        editedTrainer
      );

      if (response.data.success) {
        toast.success('Trainer details updated successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
        navigate('/list');
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error('Error updating trainer. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    if (!trainer) {
      navigate('/list');
    }
  }, [trainer, navigate]);

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-800 shadow-xl rounded-xl p-8 border border-gray-700 max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Edit Trainer</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              value={editedTrainer?.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              value={editedTrainer?.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>

          {/* Contact Number */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">Contact Number</label>
            <input
              type="tel"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              value={editedTrainer?.contact || ''}
              onChange={(e) => handleChange('contact', e.target.value)}
              required
            />
          </div>

          {/* Age */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">Age</label>
            <input
              type="number"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              value={editedTrainer?.age || ''}
              onChange={(e) => handleChange('age', e.target.value)}
              required
            />
          </div>

          {/* Gender */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">Gender</label>
            <select
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              value={editedTrainer?.gender || ''}
              onChange={(e) => handleChange('gender', e.target.value)}
              required
            >
              <option value="" className="text-gray-400">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Qualification */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">Qualification</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              value={editedTrainer?.qualification || ''}
              onChange={(e) => handleChange('qualification', e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Update Trainer
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default EditTrainer;