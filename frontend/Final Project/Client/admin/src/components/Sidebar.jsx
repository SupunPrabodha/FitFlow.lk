import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-2 border-gray-700 bg-gray-800'>
      <div className='flex flex-col gap-2 pt-6 px-4'>
        <NavLink 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 w-full
            ${isActive 
              ? 'bg-orange-600 text-white' 
              : 'text-gray-300 hover:bg-gray-700'}`
          }
          to="/add"
        >
          <img className='w-5 h-5' src={assets.add_icon} alt="" />
          <p className='whitespace-nowrap'>Add Trainers</p>
        </NavLink>

        <NavLink 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 w-full
            ${isActive 
              ? 'bg-orange-600 text-white' 
              : 'text-gray-300 hover:bg-gray-700'}`
          }
          to="/list"
        >
          <img className='w-5 h-5' src={assets.order_icon} alt="" />
          <p className='whitespace-nowrap'>List Trainers</p>
        </NavLink>

        <NavLink 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 w-full
            ${isActive 
              ? 'bg-orange-600 text-white' 
              : 'text-gray-300 hover:bg-gray-700'}`
          }
          to="/members"
        >
          <img className='w-5 h-5' src={assets.parcel_icon} alt="" />
          <p className='whitespace-nowrap'>View All Members</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar