import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl } from '../App';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/trainer/list');
      if (response.data.success) {
        setList(response.data.trainers);
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const removeTrainers = async (_id) => {
    try {
      const response = await axios.delete(
        backendUrl + '/api/trainer/remove',
        {
          data: { _id },
          headers: { token }
        }
      );
      
      if (response.data.success) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
        await fetchList();
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleEdit = (trainer) => {
    navigate('/edit-trainer', { state: { trainer } });
  };

  useEffect(() => {
    fetchList();
  }, []);

  const filteredList = list.filter(tr => 
    tr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tr.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">All Trainers List</h2>
         
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/3 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
          />
        </div>

        <div className="bg-gray-800 shadow-xl rounded-xl border border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className='hidden md:grid grid-cols-7 items-center py-4 px-6 bg-gray-700 text-gray-300 text-sm font-medium'>
            <span>Name</span>
            <span>Email</span>
            <span>Contact</span>
            <span>Age</span>
            <span>Gender</span>
            <span>Qualifications</span>
            <span className='text-center'>Action</span>
          </div>

          {/* Table Rows */}
          <div className='divide-y divide-gray-700'>
            {filteredList.map((tr, index) => (
              <div
                key={index}
                className='grid grid-cols-1 md:grid-cols-7 items-center gap-4 py-4 px-6 text-gray-300 text-sm hover:bg-gray-750 transition-colors'
              >
                <p className="truncate">{tr.name}</p>
                <p className="truncate">{tr.email}</p>
                <p>{tr.contact}</p>
                <p>{tr.age}</p>
                <p>{tr.gender}</p>
                <p className="truncate">{tr.qualification || '-'}</p>
                <div className='flex justify-center space-x-4 items-center'>
                  <span
                    className="text-orange-500 text-lg cursor-pointer"
                    onClick={async () => {
                      try {
                        const response = await axios.post(backendUrl + '/api/trainer/send-email', {
                          email: tr.email,
                          name: tr.name
                        });
                        if (response.data.success) {
                          toast.success('Email sent successfully!', {
                            position: "top-right",
                            autoClose: 3000,
                          });
                        }
                      } catch (error) {
                        console.error('Error sending email:', error);
                        toast.error(error.response?.data?.error || 'Failed to send email. Please try again.', {
                          position: "top-right",
                          autoClose: 3000,
                        });
                      }
                    }}
                    title="Send registration email"
                  >📧</span>
                  <button
                    onClick={() => handleEdit(tr)}
                    className='text-orange-500 hover:text-orange-400 transition-colors'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeTrainers(tr._id)}
                    className='text-red-500 hover:text-red-400 transition-colors'
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredList.length === 0 && (
            <div className="py-8 text-center text-gray-400">
              No trainers found
            </div>
          )}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default List;