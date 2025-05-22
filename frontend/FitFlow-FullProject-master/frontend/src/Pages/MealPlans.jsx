import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";

const MealPlans = () => {
    const [mealplans, setMealPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        axios
            .get("http://localhost:3000/mealplans")
            .then((response) => {
                setMealPlans(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl my-8">Meal plan List</h1>
                    <Link to="/mealplans/create">
                        <MdOutlineAddBox className="text-sky-800 text-4xl" />
                    </Link>
                </div>
                {loading ? (
                    <Spinner />
                ) : (
                    <table className="w-full border-separate border-spacing-2">
                        <thead>
                            <tr>
                               <th className="border border-slate-600 rounded-md">Number</th>
                                <th className="border border-slate-600 rounded-md">plan Name</th>
                                <th className="border border-slate-600 rounded-md">Plan category</th>
                                <th className="border border-slate-600 rounded-md">Plan Type</th>
                                <th className="border border-slate-600 rounded-md max-md:hidden">nutrition goals</th>
                                <th className="border border-slate-600 rounded-md max-md:hidden">Meal Shedule</th>
                                <th className="border border-slate-600 rounded-md max-md:hidden">Calorie Target</th>
                                <th className="border border-slate-600 rounded-md max-md:hidden">Hydration</th>
                                <th className="border border-slate-600 rounded-md max-md:hidden">supplemnts</th>
                                <th className="border border-slate-600 rounded-md ">operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mealplans.map((mealplan, index) => (
                                <tr key={mealplan._id} className="h-8">
                                    <td className="border border-slate-600 rounded-md text-center">{index + 1}</td>
                                    <td className="border border-slate-600 rounded-md text-center">{mealplan.planName}</td>
                                    <td className="border border-slate-600 rounded-md">{mealplan.planCategory}</td>
                                    <td className="border border-slate-600 rounded-md">{mealplan.planType}</td>
                                    <td className="border border-slate-600 rounded-md max-md:hidden">{mealplan.nutritionGoals}</td>
                                    <td className="border border-slate-600 rounded-md max-md:hidden">{mealplan.mealSchedule}</td>
                                    <td className="border border-slate-600 rounded-md max-md:hidden">{mealplan.calorieTarget}</td>
                                    <td className="border border-slate-600 rounded-md max-md:hidden">{mealplan.hydration}</td>
                                    <td className="border border-slate-600 rounded-md max-md:hidden">{mealplan.supplements}</td>
                                    <td className="flex justify-center gap-x-4">
                                        <Link to={`/mealplans/details/${mealplan._id}`}>
                                            <BsInfoCircle className="text-green-800" />
                                        </Link>
                                        <Link to={`/mealplans/edit/${mealplan._id}`}>
                                            <AiOutlineEdit className="text-yellow-600" />
                                        </Link>
                                        <Link to={`/mealplans/delete/${mealplan._id}`}>
                                            <MdOutlineDelete className="text-red-600" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default MealPlans;
