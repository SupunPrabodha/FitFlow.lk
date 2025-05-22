{/*import React from 'react'
import {Link} from 'react-router-dom';
//import {FiCalender,FiClock,FiDollarSign,FiMapPin} from "react-icons/fi"
//import { FiCalendar } from "react-icons/fi";
import { FiCalendar, FiClock, FiDollarSign, FiMapPin } from "react-icons/fi";


const Card = ({data}) => {
    const {companyName,companyLogo,minPrice,salaryType,jobLocation,employmentType,postingDate,description} = data;
  return (
    
      <section className ='card'>
        <Link to={"/"} className='flex gap-4 -col sm:flex-row items-start'>
        <img src={companyLogo} alt=""/>
        <div >
            <h4 className='text-primary mb-1'>{companyName}</h4>
            <h3 className='text-lg font-semibold mb-2'>{jobTitle}</h3>
          <div className='text-primary/70 text-base flex flex-wrap gap-2 mb-2'>
            <span className='flex items-center gap-2'><FiMapPin/>{jobLocation}</span> 
            <span className='flex items-center gap-2'><FiClock/>{employmentType}</span> 
            <span className='flex items-center gap-2'><FiDollarSign/>{minPrice}-{maxPrice}</span> 
            <span className='flex items-center gap-2'><FiCalender/>{postingDate}</span> 
            </div> 
            </div>   
        </Link>
        
        </section> 
    
  )
}

export default Card*/}
{/*import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiDollarSign, FiMapPin } from "react-icons/fi";

const Card = ({ data }) => {
    const { workoutName, workoutLogo, minDuration, maxDuration, durationType,difficultyLevel, sessionType, postedDate, description, trainerName } = data;

    return (
        <section className="card">
            <Link to={"/"} className="flex gap-4 sm:flex-row items-start">
                <img src={workoutLogo} alt="Company Logo" />
                <div>
                    <h4 className="text-primary mb-1">{workoutName}</h4>
                    <h3 className="text-lg font-semibold mb-2">{trainerName || "Unknown Job"}</h3> 
                    <div className="text-primary/70 text-base flex flex-wrap gap-2 mb-2">
                        <span className="flex items-center gap-2"><FiMapPin /> {difficultyLevel}</span> 
                        <span className="flex items-center gap-2"><FiClock /> {sessionType}</span> 
                        <span className="flex items-center gap-2"><FiDollarSign /> {minDuration}-{maxDuration}</span> 
                        <span className="flex items-center gap-2"><FiCalendar /> {postedDate}</span> 
                    </div> 
                    //</div><p className='text-base text-primary/70>{description}</p>
                    <p className="text-base text-primary/70">{description}</p>

                </div>   
            </Link>
        </section> 
    );
};

export default Card;*/}
import React from 'react';
import { Link } from 'react-router-dom';
import { 
    FaDumbbell,
    FaRunning,
    FaClock,
    FaCalendarAlt
} from "react-icons/fa";

const Card = ({ data }) => {
    const { _id, workoutName, workoutLogo, minDuration, maxDuration, durationType, difficultyLevel, sessionType, postedDate, description, trainerName } = data;

    return (
        <section className="card" style={{
            background: 'linear-gradient(45deg, #e96443, #904e95)', // Dark orange to purple gradient
            padding: '2px', // Creates the gradient border effect
            borderRadius: '8px', // Rounded corners
            margin: '1rem' // Space between cards
        }}>
            <Link 
                to={`/plan/${_id}`} 
                className="flex gap-4 sm:flex-row items-start"
                style={{
                    background: '#ffffff', // White background for content
                    borderRadius: '6px', // Slightly smaller than outer radius
                    padding: '1rem' // Inner padding
                }}
            >
                {/*} <img src={workoutLogo} alt="Workout Logo" />*/}
                <div>
                    <h3 className="text-lg font-semibold mb-2">{workoutName}</h3>
                    <h4 className="text-primary mb-1">{trainerName || "Unknown Trainer"}</h4> 
                    <div className="text-primary/70 text-base flex flex-wrap gap-2 mb-2">
                        <span className="flex items-center gap-2"><FaDumbbell /> {difficultyLevel}</span>
                        <span className="flex items-center gap-2"><FaRunning /> {sessionType}</span>
                        <span className="flex items-center gap-2"><FaClock /> {minDuration}-{maxDuration} {durationType}</span>
                        <span className="flex items-center gap-2"><FaCalendarAlt /> {postedDate}</span>
                    </div> 
                    <p className="text-base text-primary/70">{description}</p>
                </div>   
            </Link>
        </section>
    );
};

export default Card;