import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
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

  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setTrainer((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (e) => {
    const input = e.target.value;
    if (!/^\d*$/.test(input)) return;
    if (input.length === 1 && input !== '0') return;
    if (input.length <= 10) {
      handleChange('contact', input);
      if (/^0\d{9}$/.test(input)) {
        setErrors((prev) => ({ ...prev, contact: '' }));
      }
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    handleChange('email', value);
    if (!value.includes('@')) {
      setErrors((prev) => ({ ...prev, email: 'Email must contain @' }));
    } else {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const contactPattern = /^0\d{9}$/;
    if (!contactPattern.test(trainer.contact)) {
      setErrors((prev) => ({ ...prev, contact: 'Contact must start with 0 and be 10 digits' }));
      return;
    }

    if (!trainer.email.includes('@')) {
      setErrors((prev) => ({ ...prev, email: 'Email must contain @' }));
      return;
    }

    try {
      console.log('Sending request to:', `${backendUrl}/api/trainer/add`);
      console.log('Payload:', trainer);
      const response = await axios.post(`${backendUrl}/api/trainer/add`, trainer);
      console.log('Response:', response.data);

      if (response.data) {
        setTrainer({
          name: '',
          email: '',
          contact: '',
          age: '',
          gender: '',
          qualification: '',
        });
        setErrors({ contact: '', email: '' });

        toast.success('Trainer added successfully!', {
          position: "top-right",
          autoClose: 3000,
        });

        setTimeout(() => {
          navigate('/list');
        }, 500);
      }
    } catch (error) {
      console.error('AxiosError:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      toast.error(error.response?.data?.message || 'Failed to add trainer. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-800 shadow-xl rounded-xl p-8 border border-gray-700 max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Add Trainer</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              value={trainer.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              value={trainer.email}
              onChange={handleEmailChange}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">Contact Number</label>
            <input
              type="tel"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              value={trainer.contact}
              onChange={handleContactChange}
              placeholder="Starts with 0, 10 digits"
              required
            />
            {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">Age</label>
            <input
              type="number"
              min={18}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              value={trainer.age}
              onChange={(e) => handleChange('age', e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">Gender</label>
            <select
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              value={trainer.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              required
            >
              <option value="" className="text-gray-400">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">Qualification</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              value={trainer.qualification}
              onChange={(e) => handleChange('qualification', e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Add Trainer
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Add;