import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = ({ open, setOpen }) => {
  const menuItems = [
    { path: "/appointment", name: "Appointments", icon: assets.order_icon },
    { path: "/feedback", name: "Feedback", icon: assets.order_icon },
    { path: "/plans", name: "Plans", icon: assets.order_icon },
    { path: "/stock", name: "Stock", icon: assets.order_icon },
    { path: "/users", name: "Users", icon: assets.order_icon },
    { path: "/add", name: "Add Trainers", icon: assets.add_icon },
    { path: "/list", name: "List Trainers", icon: assets.order_icon },
  ];

  return (
    <div 
      className={`bg-gray-800 min-h-screen border-r border-gray-700 transition-all duration-300 fixed h-full z-10 ${
        open ? 'w-64' : 'w-20'
      }`}
      style={{ 
        overscrollBehavior: 'contain',
        top: '4rem' /* matches navbar height */
      }}
    >
      <div className="flex flex-col gap-2 p-4">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-orange-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700'
              }`
            }
            onClick={() => {
              window.scrollTo(0, 0);
              if (window.innerWidth < 768) {
                setOpen(false);
              }
            }}
          >
            <img 
              className="w-5 h-5 min-w-5" 
              src={item.icon} 
              alt={item.name} 
            />
            <span className={`${
              open ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-200 whitespace-nowrap`}>
              {item.name}
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;