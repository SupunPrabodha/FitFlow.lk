import React from 'react';
import { assets } from '../assets/assets'; // Missing import

const FooterUser = () => { // Component names should be PascalCase
  return (
    <div className="w-full">
    {/* Horizontal divider line - Add this line */}
    <hr className="border-t border-gray-200 my-2 mx-auto w-full max-w-[90vw]" />

    <footer className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <div>
        <img src={assets.icons.logo} className='mb-5 w-32' alt="Company Logo" />
        <p className='w-full md:w-2/3 text-gray-600'>
          Your company description goes here. Add meaningful text about your business.
        </p>
      </div>
      
      {/* Add additional footer columns as needed */}
      <div>
        <h3 className='font-semibold mb-4'>COMPANY</h3>
        <ul className='flex flex-col gap-1 text-gray-600'>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>

        </ul>
        {/* Add links here */}
      </div>
      
      <div>
        <h3 className='font-semibold mb-4'>GET IN TOUCH</h3>
        <ul className='flex flex-col gap-1 text-gray-600'>
            <li>+1-277-084-8707</li>
            <li>fitflow@gmail.com</li>
        </ul>
        {/* Add contact info here */}
      </div>

      <div>
      <hr className="border-t border-gray-200 my-2 mx-auto w-full max-w-[90vw]" />
      <p className='py-5 text-sm text-center'> Copyright 2024@ fitflow.com - All Rights Reserved.</p>

      </div>
    </footer>
    </div>
  );
};

export default FooterUser;