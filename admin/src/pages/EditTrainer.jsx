import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditTrainer = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trainer, setTrainer] = useState({
    name: '',
    email: '',
    contact: '',
    age: '',
    gender: '',
    qualification: ''
  });

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/trainer/${id}`, {
          headers: { token }
        });
        
        if (response.data.success) {
          setTrainer(response.data.trainer);
        } else {
          toast.error(response.data.message);
          navigate('/list');
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch trainer details');
        navigate('/list');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [id, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainer(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${backendUrl}/api/trainer/update/${id}`,
        trainer,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Trainer updated successfully');
        navigate('/list');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update trainer');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-2xl mx-auto bg-gray-800 shadow-lg rounded-xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Edit Trainer</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              value={trainer.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              value={trainer.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Contact Number</label>
            <input
              type="tel"
              name="contact"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              value={trainer.contact}
              onChange={handleChange}
              placeholder="0XXXXXXXXX"
              required
            />
          </div>

          {/* Age and Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Age</label>
              <input
                type="number"
                name="age"
                min="18"
                max="70"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                value={trainer.age}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Gender</label>
              <select
                name="gender"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                value={trainer.gender}
                onChange={handleChange}
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
              name="qualification"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              value={trainer.qualification}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Update Trainer
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

export default EditTrainer;