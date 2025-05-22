import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes, Route, Navigate } from 'react-router-dom';
import Add from './pages/Add';
import List from './pages/List';
import Login from './components/Login';
import EditTrainer from './pages/EditTrainer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AllMembers from './pages/AllMembers';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <div className='bg-gray-900 min-h-screen'>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr className='border-gray-700' />
          <div className='flex w-full'>
            <Sidebar />
            <div className='flex-1 p-8 text-gray-300'>
              <Routes>
                <Route path="/" element={<Navigate to="/list" replace />} />
                <Route path='/add' element={<Add />} />
                <Route path='/list' element={<List />} />
                <Route path='/edit-trainer' element={<EditTrainer />} />
                <Route path='/members' element={<AllMembers />} />
                <Route path="*" element={<Navigate to="/list" replace />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;