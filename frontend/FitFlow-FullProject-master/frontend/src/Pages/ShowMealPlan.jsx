import React,{useEffect,useState} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import MealButton from '../components/MealButton';
import Spinner from '../components/Spinner'; 
import { set } from 'react-hook-form';



const ShowMealPlan = () => {
    const [mealplan,setMealPlans] = useState({});
    const [loading,setLoading] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
       // axios
        //.get("http://localhost:3000/mealplans/details/${id}")
        //axios.get("http://localhost:3000/mealplans/details/${id}")
        axios.get(`http://localhost:3000/mealplans/details/${id}`)
        .then((response) =>{
            setMealPlans(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
        });
    },[])

    return (
        <div className='p-4'>
          <MealButton/>
          <h1 className='text-3xl my-4'>show Plan</h1>
          {loading ?(
            <Spinner/>      
          ): (
             <div className='flex flex-col border-2 border-sky-400 rounded -xl w-fit p-4'>
              <div className='my-4'>
                <span className = 'text-xl mr-4 text-gray-500'>Id</span>
                <span>{mealplan._id}</span>
                </div>
                
              <div className='my-4'>
                <span className = 'text-xl mr-4 text-gray-500'>Tilte</span>
                <span>{mealplan.planName}</span>
                </div>
               
              <div className='my-4'>
                <span className = 'text-xl mr-4 text-gray-500'>Plan Category</span>
                <span>{mealplan.planCategory}</span>
                </div>
            
               <div className='my-4'>
               <span className = 'text-xl mr-4 text-gray-500'>Plan Type</span>
               <span>{mealplan.planType}</span>
               </div>

               <div className='my-4'>
               <span className = 'text-xl mr-4 text-gray-500'>Nutrition Goals</span>
               <span>{mealplan.NutritionGoals}</span>
               </div>

               <div className='my-4'>
               <span className = 'text-xl mr-4 text-gray-500'>Meal Schedule</span>
               <span>{mealplan.mealSchedule}</span>
               </div>
               
               <div className='my-4'>
               <span className = 'text-xl mr-4 text-gray-500'>Calorie Target</span>
               <span>{mealplan.calorieTarget}</span>
               </div>

               <div className='my-4'>
               <span className = 'text-xl mr-4 text-gray-500'>supplements</span>
               <span>{mealplan.supplements}</span>
               </div>
               
               <div className='my-4'>
               <span className = 'text-xl mr-4 text-gray-500'>Created Date</span>
               <span>{new Date (mealplan.createdAt).toString()}</span>
               </div>
               <div className='my-4'>
               <span className = 'text-xl mr-4 text-gray-500'>Last Update Time</span>
               <span>{new Date (mealplan.updatedAt).toString()}</span>
               </div>
             </div>
          )}
        </div>
      )
      }

export default ShowMealPlan

