import React from 'react';
import { assets } from '../assets/assets';

const Navbar = ({ setToken, sidebarOpen, setSidebarOpen }) => {
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      setToken('');
      window.scrollTo(0, 0);
    }
  };

  return (
    <div 
      className="flex items-center justify-between py-4 px-6 bg-gray-800 border-b border-gray-700 fixed w-full z-10"
      style={{ overscrollBehavior: 'none' }}
    >
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-400 hover:text-white focus:outline-none"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {sidebarOpen ? (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            ) : (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            )}
          </svg>
        </button>

        <img 
          className="w-[max(25%,80px)]" 
          src={assets.logo} 
          alt="Forever Gym Logo" 
        />
      </div>

      <button 
        onClick={handleLogout}
        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 flex items-center"
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
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
          />
        </svg>
        Logout
      </button>
    </div>
  );
};

export default Navbar;