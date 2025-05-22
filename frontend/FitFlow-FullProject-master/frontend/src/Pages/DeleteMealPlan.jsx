import React,{ useState,useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MealButton  from '../components/MealButton';
import Spinner from '../components/Spinner';
import { useNavigate } from 'react-router-dom';

const DeleteMealPlan =() => {
  const [loading,setLoading ] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const handleDeleteMealPlan = () => {
    setLoading(true);
    axios
    .delete(`http://localhost:3000/mealplans/delete/${id}`)
    .then(() => {
      setLoading(false) 
      navigate('/trainer-dashboard/mealplans');


    })
    .catch((error) => {
      setLoading(false);
      alert('An error happend.please check console');


    });
  };
  return (
    <div className='p-4'>
      <MealButton/>
       <h1 className='text-3xl my-4'>Delete Book</h1>
       {loading ? <Spinner/> : ''}
       <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto'>
        <h3 className='text-2xl'>Are You sure You want to delete this book?</h3>
       
       <button
       className ='p-4 bg-red-600 text-white m-8 w-full'
       onClick={handleDeleteMealPlan} 
       >
        Yes,Delete It
       </button>
       </div>
    </div>
  )
}
export default DeleteMealPlan