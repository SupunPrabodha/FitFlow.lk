import { FiSearch } from "react-icons/fi";
import React from "react";

const Banner = ({ query, handleInputChange }) => {
  return (
    <div 
      className="relative min-h-[400px] flex items-center justify-center"
      style={{
        backgroundImage: `url('/images/anastase-maragos-9dzWZQWZMdE-unsplash.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-screen-2xl container mx-auto xl:px-24 px-4 md:py-20 py-14">
        <h1 className="text-5xl font-bold mb-3 text-white">
          Your Fitness<span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"> Journey</span> Starts Here!
        </h1>
        <p className="text-lg text-gray-100 mb-8">
          Embrace Your Fitness Journey Now, Transform Your Body, and Elevate Your Life.
        </p>
        <form>
          <div className="flex justify-start md:flex-row flex-col md:gap-0 gap-4">
            <div className="relative flex md:rounded-s-md rounded shadow-sm ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600 md:w-4/5 w-full">
              <FiSearch className="absolute left-2 top-2.5 text-gray-400" />
              <input
                type="text"
                name="title"
                id="title"
                placeholder="What type of plan are you looking for?"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-8 text-white placeholder:text-gray-300 focus:ring-0 sm:text-sm sm:leading-6"
                onChange={handleInputChange}
                value={query}
              />
            </div>
            <button type="submit" className="bg-black py-2 px-8 text-white md:rounded-none rounded">
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Banner;
