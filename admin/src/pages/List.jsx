import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(backendUrl + '/api/trainer/list', {
        headers: { token }
      });
      
      if (response.data.success) {
        setList(response.data.trainers);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to fetch trainers");
    } finally {
      setLoading(false);
    }
  };

  const removeTrainer = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this trainer?")) return;
    
    try {
      const response = await axios.delete(
        backendUrl + '/api/trainer/remove',
        { 
          data: { _id },
          headers: { token }
        }
      );
      
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete trainer");
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-trainer/${id}`);
  };

  const filteredTrainers = list.filter(trainer => 
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.contact.includes(searchTerm)
  );

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="bg-gray-900 text-gray-200 p-6 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">Trainer Management</h2>
        
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search trainers..."
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg 
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          <button
            onClick={() => navigate('/add')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
              />
            </svg>
            Add Trainer
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-800 rounded-t-lg text-sm font-medium">
            <div className="col-span-3">Name</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-1">Contact</div>
            <div className="col-span-1 text-center">Age</div>
            <div className="col-span-1 text-center">Gender</div>
            <div className="col-span-2">Qualifications</div>
            <div className="col-span-1 text-center">Actions</div>
          </div>

          {/* Trainer Data Rows */}
          {filteredTrainers.length > 0 ? (
            filteredTrainers.map((trainer) => (
              <div 
                key={trainer._id} 
                className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 hover:bg-gray-800 transition-colors"
              >
                <div className="col-span-3 font-medium">{trainer.name}</div>
                <div className="col-span-3 text-gray-400 truncate">{trainer.email}</div>
                <div className="col-span-1">{trainer.contact}</div>
                <div className="col-span-1 text-center">{trainer.age}</div>
                <div className="col-span-1 text-center">{trainer.gender}</div>
                <div className="col-span-2 text-gray-400">
                  {trainer.qualification || 'N/A'}
                </div>
                <div className="col-span-1 flex justify-center space-x-2">
                  <button
                    onClick={() => handleEdit(trainer._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center"
                    title="Edit"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => removeTrainer(trainer._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center"
                    title="Delete"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-400">
              {searchTerm ? 'No matching trainers found' : 'No trainers available'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default List;