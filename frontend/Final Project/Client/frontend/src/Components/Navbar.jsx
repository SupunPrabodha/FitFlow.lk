import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    // Add your logout logic here
    console.log('User logged out')
    navigate('/login')
    setIsDropdownOpen(false)
  }

  return (
    <div className='flex items-center justify-between py-4 px-6 bg-gray-800 border-b border-gray-700 relative'>
      {/* Empty div for balance */}
      <div></div>
      
      {/* Navigation Links */}
      <ul className='flex gap-8 text-sm'>
        <NavLink 
          to='/' 
          className={({ isActive }) => 
            isActive 
              ? 'flex flex-col items-center gap-1 text-orange-500'
              : 'flex flex-col items-center gap-1 text-gray-300 hover:text-orange-500 transition-colors'
          }
        >
          {({ isActive }) => (
            <>
              <p>Home</p>
              <hr className={`w-2/4 border-none h-[1.5px] bg-orange-500 transition-all ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`} />
            </>
          )}
        </NavLink>
        
        <NavLink 
          to='/signup' 
          className={({ isActive }) => 
            isActive 
              ? 'flex flex-col items-center gap-1 text-orange-500'
              : 'flex flex-col items-center gap-1 text-gray-300 hover:text-orange-500 transition-colors'
          }
        >
          {({ isActive }) => (
            <>
              <p>Signup</p>
              <hr className={`w-2/4 border-none h-[1.5px] bg-orange-500 transition-all ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`} />
            </>
          )}
        </NavLink>
        
        <NavLink 
          to='/login' 
          className={({ isActive }) => 
            isActive 
              ? 'flex flex-col items-center gap-1 text-orange-500'
              : 'flex flex-col items-center gap-1 text-gray-300 hover:text-orange-500 transition-colors'
          }
        >
          {({ isActive }) => (
            <>
              <p>User Login</p>
              <hr className={`w-2/4 border-none h-[1.5px] bg-orange-500 transition-all ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`} />
            </>
          )}
        </NavLink>
        
        <NavLink 
          to='/trainer-login' 
          className={({ isActive }) => 
            isActive 
              ? 'flex flex-col items-center gap-1 text-orange-500'
              : 'flex flex-col items-center gap-1 text-gray-300 hover:text-orange-500 transition-colors'
          }
        >
          {({ isActive }) => (
            <>
              <p>Trainer Login</p>
              <hr className={`w-2/4 border-none h-[1.5px] bg-orange-500 transition-all ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`} />
            </>
          )}
        </NavLink>
        
        <NavLink 
          to='/view-trainers' 
          className={({ isActive }) => 
            isActive 
              ? 'flex flex-col items-center gap-1 text-orange-500'
              : 'flex flex-col items-center gap-1 text-gray-300 hover:text-orange-500 transition-colors'
          }
        >
          {({ isActive }) => (
            <>
              <p>View Trainers</p>
              <hr className={`w-2/4 border-none h-[1.5px] bg-orange-500 transition-all ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`} />
            </>
          )}
        </NavLink>
        <NavLink 
          to='/shop' 
          className={({ isActive }) => 
            isActive 
              ? 'flex flex-col items-center gap-1 text-orange-500'
              : 'flex flex-col items-center gap-1 text-gray-300 hover:text-orange-500 transition-colors'
          }
        >
          {({ isActive }) => (
            <>
              <p>Shop</p>
              <hr className={`w-2/4 border-none h-[1.5px] bg-orange-500 transition-all ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`} />
            </>
          )}
        </NavLink>
      </ul>
      
      {/* Profile Icon with Dropdown */}
      <div className="relative">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex flex-col items-center gap-1 text-gray-300 hover:text-orange-500 transition-colors focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
            <img 
              src={assets.profile_icon} 
              alt="Profile" 
              className="w-5 h-5 object-contain"
            />
          </div>
          <hr className={`w-2/4 border-none h-[1.5px] bg-orange-500 transition-all ${
            isDropdownOpen ? 'opacity-100' : 'opacity-0'
          }`} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg border border-gray-700 z-10">
            <div className="py-1">
              <NavLink
                to="/profile"
                onClick={() => setIsDropdownOpen(false)}
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                My Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  )
}

export default Navbar