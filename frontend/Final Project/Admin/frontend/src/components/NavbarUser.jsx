import React, { useState, useContext } from 'react'; // Import useState and useContext
import { assets } from '../assets/assets';
import { NavLink, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext'; // Import ShopContext

const NavbarUser = () => {
  const [visible, setVisible] = useState(false); // Manage visibility state
  const { setShowSearch, getCartCount } = useContext(ShopContext); // Access context

  return (
    <nav className='bg-white shadow-md sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <Link to='/' className='flex-shrink-0'>
            <img src={assets.icons.logo} className='h-12 w-auto' alt="Logo" />
          </Link>

          <div className='hidden sm:flex sm:items-center sm:space-x-8'>
            <NavLink 
              to='/' 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors duration-200 ${
                  isActive 
                    ? 'text-black border-b-2 border-black' 
                    : 'text-gray-500 hover:text-black'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink 
              to='/collection' 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors duration-200 ${
                  isActive 
                    ? 'text-black border-b-2 border-black' 
                    : 'text-gray-500 hover:text-black'
                }`
              }
            >
              Collection
            </NavLink>
          </div>

          <Link to='/cart' className='relative group'>
            <div className='p-2 rounded-full hover:bg-gray-100 transition-colors duration-200'>
              <img 
                src={assets.icons.cart_icon} 
                className='h-6 w-6' 
                alt="Cart"
              />
              {getCartCount() > 0 && (
                <span className='absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
                  {getCartCount()}
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavbarUser;
