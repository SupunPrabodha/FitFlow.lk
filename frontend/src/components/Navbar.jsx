import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    
    return (
        <div className="flex items-center justify-between py-5 bg-gray-900 px-6 md:px-10 lg:px-16 xl:px-24">
            {/* Logo with balanced spacing */}
            <div className="flex-shrink-0">
                <img src={assets.logo} className="w-36" alt="Gym Logo" />
            </div>

            {/* Desktop Navigation - Centered */}
            <div className="hidden sm:flex flex-1 justify-center">
                <ul className="flex gap-6 lg:gap-8 text-sm text-gray-300">
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => 
                            `flex flex-col items-center gap-1 ${isActive ? 'text-orange-500' : 'hover:text-orange-400'} transition-colors`
                        }
                    >
                        <p>HOME</p>
                        <hr className="w-2/4 border-none h-[1.5px] bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
                    </NavLink>
                    <NavLink 
                        to="/feedback" 
                        className={({ isActive }) => 
                            `flex flex-col items-center gap-1 ${isActive ? 'text-orange-500' : 'hover:text-orange-400'} transition-colors`
                        }
                    >
                        <p>FEEDBACK</p>
                        <hr className="w-2/4 border-none h-[1.5px] bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
                    </NavLink>
                    <NavLink 
                        to="/collection" 
                        className={({ isActive }) => 
                            `flex flex-col items-center gap-1 ${isActive ? 'text-orange-500' : 'hover:text-orange-400'} transition-colors`
                        }
                    >
                        <p>STORE</p>
                        <hr className="w-2/4 border-none h-[1.5px] bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
                    </NavLink>
                    <NavLink 
                        to="/trainers" 
                        className={({ isActive }) => 
                            `flex flex-col items-center gap-1 ${isActive ? 'text-orange-500' : 'hover:text-orange-400'} transition-colors`
                        }
                    >
                        <p>TRAINRES</p>
                        <hr className="w-2/4 border-none h-[1.5px] bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
                    </NavLink>
                    <NavLink 
                        to="/about" 
                        className={({ isActive }) => 
                            `flex flex-col items-center gap-1 ${isActive ? 'text-orange-500' : 'hover:text-orange-400'} transition-colors`
                        }
                    >
                        <p>ABOUT US</p>
                        <hr className="w-2/4 border-none h-[1.5px] bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
                    </NavLink>
                    <NavLink 
                        to="/contact" 
                        className={({ isActive }) => 
                            `flex flex-col items-center gap-1 ${isActive ? 'text-orange-500' : 'hover:text-orange-400'} transition-colors`
                        }
                    >
                        <p>CONTACT US</p>
                        <hr className="w-2/4 border-none h-[1.5px] bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
                    </NavLink>
                    
                </ul>
            </div>

 {/* Icons Group - Balanced spacing */}
 <div className="flex items-center gap-5 md:gap-6 lg:gap-7">
                <img src={assets.search_icon} className="w-5 cursor-pointer filter invert hover:opacity-80 transition-opacity" alt="Search" />
                


            <div className="group relative">
  <img
    className="w-5 cursor-pointer filter invert hover:opacity-80 transition-opacity"
    src={assets.profile_icon}
    alt="Profile"
  />
  <div className="group-hover:block hidden absolute right-0 pt-4 z-50"> {/* Added z-50 here */}
    <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-gray-800 text-gray-300 rounded border border-gray-700 shadow-lg">
      <p className="cursor-pointer hover:text-orange-500 transition-colors">My profile</p>
      <p className="cursor-pointer hover:text-orange-500 transition-colors">Orders</p>
      <p className="cursor-pointer hover:text-orange-500 transition-colors">Logout</p>
    </div>
  </div>
</div>

           
                {/* <div className="group relative">
                    <img
                        className="w-5 cursor-pointer filter invert hover:opacity-80 transition-opacity"
                        src={assets.profile_icon}
                        alt="Profile"
                    />
                    <div className="group-hover:block hidden absolute right-0 pt-4">
                        <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-gray-800 text-gray-300 rounded border border-gray-700 shadow-lg">
                            <p className="cursor-pointer hover:text-orange-500 transition-colors">My profile</p>
                            <p className="cursor-pointer hover:text-orange-500 transition-colors">Orders</p>
                            <p className="cursor-pointer hover:text-orange-500 transition-colors">Logout</p>
                        </div>
                    </div>
                </div> */}
                
                <Link to="/cart" className="relative">
                    <img src={assets.cart_icon} className="w-5 filter invert hover:opacity-80 transition-opacity" alt="Cart" />
                    <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-orange-600 text-white aspect-square rounded-full text-[8px]">
                        10
                    </p>
                </Link>
                
                <img 
                    onClick={() => setVisible(true)}
                    src={assets.menu_icon}
                    className="w-5 cursor-pointer sm:hidden filter invert hover:opacity-80 transition-opacity"
                    alt="Menu"
                />
            </div>

            {/* Mobile Sidebar Menu */}
            <div 
                className={`fixed top-0 right-0 h-full w-full bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out ${visible ? 'translate-x-0' : 'translate-x-full'} border-l border-gray-800`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div 
                        onClick={() => setVisible(false)} 
                        className="flex items-center gap-4 p-5 cursor-pointer border-b border-gray-800 hover:bg-gray-800 transition-colors"
                    >
                        <img className="h-4 filter invert" src={assets.dropdown_icon} alt=""/>
                        <p className="text-gray-300">Close Menu</p>
                    </div>

                    {/* Menu Items */}
                    <div className="flex flex-col flex-grow">
                        <NavLink 
                            onClick={() => setVisible(false)} 
                            className={({ isActive }) => 
                                `py-4 px-6 border-b border-gray-800 ${isActive ? 'text-orange-500 bg-gray-800' : 'text-gray-300 hover:bg-gray-800'} transition-colors`
                            }
                            to='/'
                        >
                            HOME
                        </NavLink>
                        <NavLink 
                            onClick={() => setVisible(false)} 
                            className={({ isActive }) => 
                                `py-4 px-6 border-b border-gray-800 ${isActive ? 'text-orange-500 bg-gray-800' : 'text-gray-300 hover:bg-gray-800'} transition-colors`
                            }
                            to='/feedback'
                        >
                            FEEDBACK
                        </NavLink>
                        <NavLink 
                            onClick={() => setVisible(false)} 
                            className={({ isActive }) => 
                                `py-4 px-6 border-b border-gray-800 ${isActive ? 'text-orange-500 bg-gray-800' : 'text-gray-300 hover:bg-gray-800'} transition-colors`
                            }
                            to='/collection'
                        >
                            STORE
                        </NavLink>
                        <NavLink 
                            onClick={() => setVisible(false)} 
                            className={({ isActive }) => 
                                `py-4 px-6 border-b border-gray-800 ${isActive ? 'text-orange-500 bg-gray-800' : 'text-gray-300 hover:bg-gray-800'} transition-colors`
                            }
                            to='/trainers'
                        >
                            TRAINERS
                        </NavLink>
                        <NavLink 
                            onClick={() => setVisible(false)} 
                            className={({ isActive }) => 
                                `py-4 px-6 border-b border-gray-800 ${isActive ? 'text-orange-500 bg-gray-800' : 'text-gray-300 hover:bg-gray-800'} transition-colors`
                            }
                            to='/about'
                        >
                            ABOUT US
                        </NavLink>
                        <NavLink 
                            onClick={() => setVisible(false)} 
                            className={({ isActive }) => 
                                `py-4 px-6 border-b border-gray-800 ${isActive ? 'text-orange-500 bg-gray-800' : 'text-gray-300 hover:bg-gray-800'} transition-colors`
                            }
                            to='/contact'
                        >
                            CONTACT US
                        </NavLink>
                    </div>

                    {/* Footer */}
                    <div className="p-5 border-t border-gray-800 mt-auto">
                        <p className="text-sm text-gray-500">© {new Date().getFullYear()} FOREVER GYM</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;