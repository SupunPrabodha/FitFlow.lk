import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        // Check authentication status when component mounts and when localStorage changes
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('userData');
            if (!token || !userData) {
                logout(); // This will clear auth state if localStorage is cleared
            }
        };

        checkAuth();
        
        // Add event listener for localStorage changes
        window.addEventListener('storage', checkAuth);
        
        return () => {
            window.removeEventListener('storage', checkAuth);
        };
    }, [logout]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
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
                    {user && (
                        <NavLink 
                            to="/appointments" 
                            className={({ isActive }) => 
                                `flex flex-col items-center gap-1 ${isActive ? 'text-orange-500' : 'hover:text-orange-400'} transition-colors`
                            }
                        >
                            <p>APPOINTMENTS</p>
                            <hr className="w-2/4 border-none h-[1.5px] bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
                        </NavLink>
                    )}
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
                        <p>TRAINERS</p>
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
                    {/* <NavLink 
                        to="/tlogin" 
                        className={({ isActive }) => 
                            `flex flex-col items-center gap-1 ${isActive ? 'text-orange-500' : 'hover:text-orange-400'} transition-colors`
                        }
                    >
                        <p>Trainer Login</p>
                        <hr className="w-2/4 border-none h-[1.5px] bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
                    </NavLink> */}
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
                    <div className="group-hover:block hidden absolute right-0 pt-4 z-50">
                        <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-gray-800 text-gray-300 rounded border border-gray-700 shadow-lg">
                            {user ? (
                                <>
                                    <NavLink 
                                        to="/profile" 
                                        className="cursor-pointer hover:text-orange-500 transition-colors"
                                    >
                                        My Profile
                                    </NavLink>
                                    <NavLink 
                                        to="/orders" 
                                        className="cursor-pointer hover:text-orange-500 transition-colors"
                                    >
                                        Orders
                                    </NavLink>
                                    <button 
                                        onClick={handleLogout}
                                        className="text-left cursor-pointer hover:text-orange-500 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <NavLink 
                                        to="/login" 
                                        className="cursor-pointer hover:text-orange-500 transition-colors"
                                    >
                                        Login
                                    </NavLink>
                                    <NavLink 
                                        to="/signup" 
                                        className="cursor-pointer hover:text-orange-500 transition-colors"
                                    >
                                        Sign Up
                                    </NavLink>
                                </>
                            )}
                        </div>
                    </div>
                </div>

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

            {/* Mobile Menu Button */}
            <button
                onClick={() => setVisible(!visible)}
                className="sm:hidden text-gray-300 hover:text-orange-500 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    {visible ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    )}
                </svg>
            </button>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 bg-gray-900 z-50 transition-transform duration-300 sm:hidden ${visible ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-800">
                        <img src={assets.logo} className="w-36" alt="Gym Logo" />
                        <button
                            onClick={() => setVisible(false)}
                            className="text-gray-300 hover:text-orange-500 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
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
                        {user && (
                            <NavLink 
                                onClick={() => setVisible(false)} 
                                className={({ isActive }) => 
                                    `py-4 px-6 border-b border-gray-800 ${isActive ? 'text-orange-500 bg-gray-800' : 'text-gray-300 hover:bg-gray-800'} transition-colors`
                                }
                                to='/appointments'
                            >
                                APPOINTMENTS
                            </NavLink>
                        )}
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
                        {user ? (
                            <>
                                <NavLink 
                                    onClick={() => setVisible(false)} 
                                    className={({ isActive }) => 
                                        `py-4 px-6 border-b border-gray-800 ${isActive ? 'text-orange-500 bg-gray-800' : 'text-gray-300 hover:bg-gray-800'} transition-colors`
                                    }
                                    to='/profile'
                                >
                                    MY PROFILE
                                </NavLink>
                                <button
                                    onClick={() => {
                                        setVisible(false);
                                        handleLogout();
                                    }}
                                    className="py-4 px-6 border-b border-gray-800 text-left text-gray-300 hover:bg-gray-800 transition-colors"
                                >
                                    LOGOUT
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink 
                                    onClick={() => setVisible(false)} 
                                    className={({ isActive }) => 
                                        `py-4 px-6 border-b border-gray-800 ${isActive ? 'text-orange-500 bg-gray-800' : 'text-gray-300 hover:bg-gray-800'} transition-colors`
                                    }
                                    to='/login'
                                >
                                    LOGIN
                                </NavLink>
                                <NavLink 
                                    onClick={() => setVisible(false)} 
                                    className={({ isActive }) => 
                                        `py-4 px-6 border-b border-gray-800 ${isActive ? 'text-orange-500 bg-gray-800' : 'text-gray-300 hover:bg-gray-800'} transition-colors`
                                    }
                                    to='/signup'
                                >
                                    SIGN UP
                                </NavLink>
                            </>
                        )}
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