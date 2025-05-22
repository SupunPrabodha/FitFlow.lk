import React from 'react';
import { assets } from '../assets/assets';

const HeroUser = () => {
  const bestSellers = assets.products.filter(product => product.bestSeller);
  const latestBestSeller = bestSellers[bestSellers.length - 1];
  const heroImage = latestBestSeller ? latestBestSeller.image : assets.products[0].image;

  const scrollToLatestCollection = () => {
    const element = document.getElementById('latest-collection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='relative bg-gradient-to-r from-gray-50 to-gray-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='flex flex-col lg:flex-row items-center gap-12'>
          {/* Hero Left Section */}
          <div className='lg:w-1/2 text-center lg:text-left'>
            <div className='space-y-6'>
              <div className='inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full'>
                <span className='w-2 h-2 bg-red-500 rounded-full'></span>
                <p className='text-sm font-medium text-red-600'>NEW ARRIVALS</p>
              </div>
              
              <h1 className='text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-tight'>
                Elevate Your Fitness Journey
              </h1>
              
              <p className='text-lg text-gray-600 max-w-xl'>
                Discover premium fitness equipment and accessories designed to help you achieve your goals.
              </p>

              <div className='flex justify-center lg:justify-start'>
                <button 
                  onClick={scrollToLatestCollection}
                  className='px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200'
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>

          {/* Hero Image Section */}
          <div className='lg:w-1/2'>
            <div className='relative'>
              <div className='absolute -inset-4 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl opacity-20 blur-xl'></div>
              <div className='relative'>
                <img 
                  src={heroImage} 
                  alt="Latest Arrivals"
                  className='w-full h-[400px] object-cover rounded-2xl shadow-2xl'
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/800x500?text=Hero+Image';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroUser;