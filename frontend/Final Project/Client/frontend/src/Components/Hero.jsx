import React from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div className='relative flex flex-col sm:flex-row border border-gray-700 bg-gray-800 overflow-hidden'>
      {/* Background Image */}
      <div className='absolute inset-0 z-0'>
        <img 
          src={assets.hero_img} 
          alt="Gym equipment background" 
          className='w-full h-full object-cover opacity-30'
        />
      </div>

      {/* Hero Content */}
      <div className='relative z-10 flex flex-col sm:flex-row w-full'>
        {/* Hero Item 1 */}
        <div className='w-full sm:w-1/3 flex items-center justify-center py-16 sm:py-24 px-6'>
          <div className='text-gray-300 text-center'>
            <div className='flex items-center justify-center gap-2 mb-4'>
              <div className='w-8 md:w-11 h-[2px] bg-orange-500'></div>
              <p className='font-medium text-sm md:text-base uppercase tracking-wider'>OUR EQUIPMENT</p>
            </div>
            <h1 className='prata-regular text-3xl lg:text-4xl xl:text-5xl leading-tight mb-6 text-white'>
              Premium Quality
            </h1>
            <div className='flex items-center justify-center gap-2'>
              <p className='font-semibold text-sm md:text-base hover:text-orange-500 transition-colors cursor-pointer'>
                SHOP NOW
              </p>
              <div className='w-8 md:w-11 h-[1px] bg-orange-500'></div>
            </div>
          </div>
        </div>

        {/* Hero Item 2 */}
        <div className='w-full sm:w-1/3 flex items-center justify-center py-16 sm:py-24 px-6 border-t sm:border-t-0 sm:border-l border-gray-700'>
          <div className='text-gray-300 text-center'>
            <div className='flex items-center justify-center gap-2 mb-4'>
              <div className='w-8 md:w-11 h-[2px] bg-orange-500'></div>
              <p className='font-medium text-sm md:text-base uppercase tracking-wider'>TRAINING PROGRAMS</p>
            </div>
            <h1 className='prata-regular text-3xl lg:text-4xl xl:text-5xl leading-tight mb-6 text-white'>
              Latest Programs
            </h1>
            <div className='flex items-center justify-center gap-2'>
              <p className='font-semibold text-sm md:text-base hover:text-orange-500 transition-colors cursor-pointer'>
                EXPLORE NOW
              </p>
              <div className='w-8 md:w-11 h-[1px] bg-orange-500'></div>
            </div>
          </div>
        </div>

        {/* Hero Item 3 */}
        <div className='w-full sm:w-1/3 flex items-center justify-center py-16 sm:py-24 px-6 border-t sm:border-t-0 sm:border-l border-gray-700'>
          <div className='text-gray-300 text-center'>
            <div className='flex items-center justify-center gap-2 mb-4'>
              <div className='w-8 md:w-11 h-[2px] bg-orange-500'></div>
              <p className='font-medium text-sm md:text-base uppercase tracking-wider'>MEMBERSHIP</p>
            </div>
            <h1 className='prata-regular text-3xl lg:text-4xl xl:text-5xl leading-tight mb-6 text-white'>
              Join Today
            </h1>
            <div className='flex items-center justify-center gap-2'>
              <p className='font-semibold text-sm md:text-base hover:text-orange-500 transition-colors cursor-pointer'>
                SIGN UP
              </p>
              <div className='w-8 md:w-11 h-[1px] bg-orange-500'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero