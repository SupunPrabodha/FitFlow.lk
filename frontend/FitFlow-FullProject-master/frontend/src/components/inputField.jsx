import React from 'react'
import SessionType from '../sidebar/sessionType';

const inputField = ({handleChange,value,title,name}) => {
  return (
    <label className="sidebar-label-container">
    <input
      type="radio"
      name={name}
      id="all"
      value={value}
      onChange={handleChange}
    />
    <span className="checkmark"></span> {title}
  </label>
  );
};

export default inputField
