import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast, ToastContainer } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css';  
import { Link } from 'react-router-dom';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(backendUrl + '/api/user/admin', { email, password });
      if (response.data.success) {
        setToken(response.data.token);
        toast.success('Login successful', {
          position: "top-right",
          autoClose: 3000,
        });  
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });  
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred: ' + error.message, {
        position: "top-right",
        autoClose: 3000,
      });  
    }
  };

  return (
    <div className='bg-gray-900 min-h-screen flex items-center justify-center w-full p-4'>
      <div className='bg-gray-800 shadow-xl rounded-xl p-8 border border-gray-700 max-w-md w-full'>
        <div className="text-center mb-8">
          <h1 className='text-3xl font-bold text-white mb-2'>Admin Panel</h1>
          <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          
        </div>
        <form onSubmit={onSubmitHandler}>
          <div className='mb-6'>
            <label className='block text-gray-300 mb-2 text-sm font-medium'>Email Address</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white'
              type='email'
              placeholder='your@email.com'
              required
            />
          </div>
          <div className='mb-6'>
            <label className='block text-gray-300 mb-2 text-sm font-medium'>Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white'
              type='password'
              placeholder='••••••••'
              required
            />
          </div>
          <button 
            className='mt-2 w-full py-3 px-4 rounded-lg text-white bg-orange-600 hover:bg-orange-700 font-bold transition-colors duration-200' 
            type='submit'
          >
            Login
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;