{/*import React from 'react'

const sidebar = ({handleChange,handleClick}) => {
  return (
    <div className='space-y-5'> 
     <h3 className='text-lg font-bold mb-2'>Filters</h3>
     <sessionType handleChange = {handleChange}/>

     
    </div>
  )
}

export default sidebar*/}
import React from "react";
import SessionType from "./sessionType"; // Importing sessionType correctly

const SideBar = ({ handleChange, handleClick }) => {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold mb-2">Filters</h3>
      <SessionType handleChange={handleChange} />
    </div>
  );
};

export default SideBar;
