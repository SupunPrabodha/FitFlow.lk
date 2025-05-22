import React from 'react'
import { Link } from 'react-router-dom';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';

const MealButton = ({ destination ='/'}) => {
  return (
    <div className='flex'>
     <Link
        to={destination}
        className='bg-sky-800 text-white px-4 py-1 rouned-lg w-fit'
      >
       <BsArrowLeft className='text-2xl' />
      </Link>
    </div>
  )
}

export default MealButton
