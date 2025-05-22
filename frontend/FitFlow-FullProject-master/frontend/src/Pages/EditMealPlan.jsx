import React, { useState,useEffect } from "react";
import axios from "axios";
//import { useParams } from 'react-router-dom';
import MealButton from "../components/MealButton";
import Spinner from "../components/Spinner";
import { useNavigate ,useParams} from "react-router-dom";

const EditMealPlan = () => {
    const [planName, setName] = useState("");
    const [planCategory, setCategory] = useState("");
    const [planType, setType] = useState("");
    const [nutritionGoals, setnutritionGoal] = useState("");
    const [mealSchedule, setSchedule] = useState("");
    const [calorieTarget, setCalorieT] = useState("");
    const [hydration, setHydration] = useState("");
    const [supplements, setSupplements] = useState("");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();
    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:3000/mealplans/details/${id}`)
        .then((response) => {
            setName(response.data.planName);
            setCategory(response.data.planCategory);
            setType(response.data.planType);
            setnutritionGoal(response.data.nutritionGoals);
            setSchedule(response.data.mealSchedule);
            setCalorieT(response.data.calorieTarget);
            setHydration(response.data.hydration);
            setSupplements(response.data.supplements);
            setLoading(false);
        }).catch((error) => { 
            setLoading(false);
            alert('An error happend.Please check console');
            console.log(error);
        });
    },[])

    const handleEditMealPlan = () => {
        const data = {
            planName,
            planCategory,
            planType,
            nutritionGoals,
            mealSchedule,
            calorieTarget,
            hydration,
            supplements,
            postedBy: "user@example.com",
        };
        console.log("Sending data to backend:", data);
        setLoading(true);
        axios
           // .put(`http://localhost:3000/mealplans/${id}`, data)
            //  .put(`http://localhost:3000/mealplans/${id}`, data)
            .put(`http://localhost:3000/mealplans/edit/${id}`, data)

            .then((response) => {
                console.log("Response from server:", response.data);
                setLoading(false);
                navigate("/trainer-dashboard/mealplans");
            })
            .catch((error) => {
                setLoading(false);
                console.error("Detailed error:", error.response?.data || error);
                alert(`An error occurred: ${error.response?.data?.message || error.message}`);
            });
    };

    return (
        <div className="p-4">
            <MealButton />
            <h1 className="text-3xl my-4"> Edit Meal Plan</h1>
            <div className="flex  flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto">
                <div className="my-4">
                <label className="text-xl mr-4 text-gray-500"> Plan Name</label>

                    <input
                        type="text"
                        value={planName}
                        onChange={(e) => setName(e.target.value)}
                        className="border-2 border-gray-500 px-4 py-2 w-full"
                    />
                </div>
                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500"> Plan Category</label>

                    <input
                        type="text"
                        value={planCategory}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border-2 border-gray-500 px-4 py-2 w-full"
                    />
                </div>
                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500"> Plan Type</label>

                    <input
                        type="text"
                        value={planType}
                        onChange={(e) => setType(e.target.value)}
                        className="border-2 border-gray-500 px-4 py-2 w-full"
                    />
                </div>
                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500"> Nutrition Goal</label>

                    <input
                        type="text"
                        value={nutritionGoals}
                        onChange={(e) => setnutritionGoal(e.target.value)}
                        className="border-2 border-gray-500 px-4 py-2 w-full"
                    />
                </div>

                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500"> Meal Schedule</label>

                    <input
                        type="text"
                        value={mealSchedule}
                        onChange={(e) => setSchedule(e.target.value)}
                        className="border-2 border-gray-500 px-4 py-2 w-full"
                    />
                </div>
                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500"> Calorie Target</label>

                    <input
                        type="text"
                        value={calorieTarget}
                        onChange={(e) => setCalorieT(e.target.value)}
                        className="border-2 border-gray-500 px-4 py-2 w-full"
                    />
                </div>
                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500"> Hydration</label>

                    <input
                        type="text"
                        value={hydration}
                        onChange={(e) => setHydration(e.target.value)}
                        className="border-2 border-gray-500 px-4 py-2 w-full"
                    />
                </div>
                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500"> Supplements</label>

                    <input
                        type="text"
                        value={supplements}
                        onChange={(e) => setSupplements(e.target.value)}
                        className="border-2 border-gray-500 px-4 py-2 w-full"
                    />
                </div>
                <button className="p-2 bg-sky-300 m-8" onClick={handleEditMealPlan}>
                    Save
                </button>
            </div>
        </div>
    );
};

export default EditMealPlan;

