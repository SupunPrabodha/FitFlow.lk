{/*import React from 'react'

const sessionType = ({handleChange}) => {
  return (
    <div>
      <h4 className='text-lg font-medium mb-2'>Session Type</h4>
      <div><lable className ='sidebar-lable-container'>
        <input type='radio' name='test' id="test" value=""
 onchange ={handleChange}/>  <span className='checkmark'></span>All      </lable>
      </div>
    </div>
    
  )
}

export default sessionType*/}
{/*import React from "react";

const SessionType = ({ handleChange }) => {
  return (
    <div>
      <h4 className="text-lg font-medium mb-2">Session Type</h4>
      <div>
        <label className="sidebar-label-container">
          <input
            type="radio"
            name="sessionType"
            id="all"
            value=""
            onChange={handleChange}
          />
          <span className="checkmark"></span> All
        </label>

        <inputField handleChange = {handleChange} value="Full-body" title="Full-Body" name="test"/>
<inputField handleChange = {handleChange} value="Upper-body" title="Full-Body" name="test"/>
<inputField handleChange = {handleChange} value="Cardio" title="Full-Body" name="test"/>
<inputField handleChange = {handleChange} value="Yoga" title="Full-Body" name="test"/>

      </div>
    </div>
  );
};

export default SessionType;*/}
import React from "react";
import InputField from "../components/inputField"; // Import InputField correctly

const SessionType = ({ handleChange }) => {
  return (
    <div>
      <h4 className="text-lg font-medium mb-2">Session Type</h4>
      <div>
        <label className="sidebar-label-container">
          <input
            type="radio"
            name="sessionType"
            id="all"
            value=""
            onChange={handleChange}
          />
          <span className="checkmark"></span> All
        </label>

        {/* Use correct capitalization for InputField */}
        <InputField handleChange={handleChange} value="Full-body" title="Full-body" name="sessionType"/>
        <InputField handleChange={handleChange} value="Upper-body" title="Upper-body" name="sessionType"/>
        <InputField handleChange={handleChange} value="Abs" title="Abs" name="sessionType"/>
        <InputField handleChange={handleChange} value="Flexibility" title="Flexibility" name="sessionType"/>
      </div>
    </div>
  );
};

export default SessionType;



