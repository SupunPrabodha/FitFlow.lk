import { useLoaderData, useParams } from "react-router-dom";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CreatableSelect from "react-select/creatable";

// Validation schema (same as CreatePlans)
const planSchema = yup.object({
    workoutName: yup.string().required("Workout plan name is required"),
    trainerName: yup.string().required("Trainer name is required"),
    minDuration: yup
        .number()
        .typeError("Minimum duration must be a number")
        .positive("Minimum duration must be positive")
        .required("Minimum duration is required"),
    maxDuration: yup
        .number()
        .typeError("Maximum duration must be a number")
        .positive("Maximum duration must be positive")
        .moreThan(yup.ref("minDuration"), "Maximum duration must be greater than minimum")
        .required("Maximum duration is required"),
    durationType: yup.string().required("Duration type is required"),
    difficultyLevel: yup.string().required("Difficulty level is required"),
    postedDate: yup.date().typeError("Posting date must be a valid date").required("Posting date is required"),
    workoutType: yup.string().required("Workout type is required"),
    workoutLogo: yup.string().url("Must be a valid URL").required("Workout photo URL is required"),
    sessionType: yup.string().required("Session type is required"),
    description: yup.string().required("Workout description is required"),
    postedBy: yup.string().email("Must be a valid email").required("Email is required"),
});

const UpdatePlan = () => {
    const { id } = useParams();
    const {
        _id,
        workoutName = "",
        trainerName = "",
        maxDuration = "",
        minDuration = "",
        durationType = "",
        difficultyLevel = "",
        postedDate = "",
        workoutLogo = "",
        description = "",
        postedBy = "",
        equipments = [],
        workoutType = "",
        sessionType = "",
    } = useLoaderData() || {};

    const [selectedOption, setSelectedOption] = useState(equipments.map((eq) => ({ value: eq, label: eq })));

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(planSchema),
        defaultValues: {
            workoutName,
            trainerName,
            maxDuration,
            minDuration,
            durationType,
            difficultyLevel,
            postedDate: postedDate ? new Date(postedDate).toISOString().split("T")[0] : "",
            workoutLogo,
            description,
            postedBy,
            workoutType,
            sessionType,
        },
    });

    const onSubmit = (data) => {
        if (!selectedOption || selectedOption.length === 0) {
            alert("Please select at least one piece of equipment");
            return;
        }

        data.equipments = selectedOption.map((opt) => opt.value);

        fetch(`http://localhost:3000/plans/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
            .then(() => {
                alert("Plan updated successfully");
                reset();
                window.location.href = "/trainer-dashboard";
            })
            .catch((error) => {
                console.error("Error updating plan:", error);
                alert("Failed to update the plan. Please try again.");
            });
    };

    const options = [
        { value: "Dumbbells", label: "Dumbbells" },
        { value: "Barbells", label: "Barbells" },
        { value: "Treadmill", label: "Treadmill" },
        { value: "StationaryBike", label: "Stationary Bike" },
        { value: "ResistanceBands", label: "Resistance Bands" },
        { value: "MedicineBall", label: "Medicine Ball" },
        { value: "RowingMachine", label: "Rowing Machine" },
    ];

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white py-10 px-8 lg:px-16 rounded-lg shadow-lg w-full max-w-3xl">
                <h2 className="text-2xl font-semibold text-center mb-6">Update Workout Plan</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div className="lg:w-1/2 w-full">
                            <label className="block mb-2 text-lg">Workout Plan Name</label>
                            <input
                                type="text"
                                {...register("workoutName")}
                                className="block w-full border border-gray-300 rounded-md bg-white py-2 px-3 text-gray-900 focus:ring focus:ring-indigo-300"
                            />
                            {errors.workoutName && <p className="text-red-500">{errors.workoutName.message}</p>}
                        </div>
                        <div className="lg:w-1/2 w-full">
                            <label className="block mb-2 text-lg">Trainer Name</label>
                            <input
                                type="text"
                                placeholder="Enter Trainer Name"
                                {...register("trainerName")}
                                className="block w-full border border-gray-300 rounded-md bg-white py-2 px-3 text-gray-900 focus:ring focus:ring-indigo-300"
                            />
                            {errors.trainerName && <p className="text-red-500">{errors.trainerName.message}</p>}
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div className="lg:w-1/2 w-full">
                            <label className="block mb-2 text-lg">Min Duration (in minutes)</label>
                            <input
                                type="number"
                                placeholder="e.g., 30"
                                {...register("minDuration")}
                                className="block w-full border border-gray-300 rounded-md bg-white py-2 px-3 text-gray-900 focus:ring focus:ring-indigo-300"
                            />
                            {errors.minDuration && <p className="text-red-500">{errors.minDuration.message}</p>}
                        </div>
                        <div className="lg:w-1/2 w-full">
                            <label className="block mb-2 text-lg">Max Duration (in minutes)</label>
                            <input
                                type="number"
                                placeholder="e.g., 90"
                                {...register("maxDuration")}
                                className="block w-full border border-gray-300 rounded-md bg-white py-2 px-3 text-gray-900 focus:ring focus:ring-indigo-300"
                            />
                            {errors.maxDuration && <p className="text-red-500">{errors.maxDuration.message}</p>}
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div className="lg:w-1/2 w-full">
                            <label className="block mb-2 text-lg">Duration Type</label>
                            <select
                                {...register("durationType")}
                                className="block w-full border border-gray-300 rounded-md bg-white py-2 px-3 text-gray-900 focus:ring focus:ring-indigo-300"
                            >
                                <option value="">Select Duration</option>
                                <option value="Hourly">Hours</option>
                                <option value="Daily">Days</option>
                                <option value="Minutes">Minutes</option>
                            </select>
                            {errors.durationType && <p className="text-red-500">{errors.durationType.message}</p>}
                        </div>

                        <div className="lg:w-1/2 w-full">
                            <label className="block mb-2 text-lg">Difficulty Level</label>
                            <select
                                {...register("difficultyLevel")}
                                className="block w-full border border-gray-300 rounded-md bg-white py-2 px-3 text-gray-900 focus:ring focus:ring-indigo-300"
                            >
                                <option value="">Select Difficulty</option>
                                <option value="Any">Any level</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                            {errors.difficultyLevel && <p className="text-red-500">{errors.difficultyLevel.message}</p>}
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="w-full lg:w-1/2">
                            <label className="block mb-2 text-lg">Posting Date</label>
                            <input
                                type="date"
                                {...register("postedDate")}
                                className="block w-full border border-gray-300 rounded-md bg-white py-2 px-3 text-gray-900 focus:ring focus:ring-indigo-300"
                            />
                            {errors.postedDate && <p className="text-red-500">{errors.postedDate.message}</p>}
                        </div>
                        <div className="w-full lg:w-1/2">
                            <label className="block mb-2 text-lg">Workout Type</label>
                            <select
                                {...register("workoutType")}
                                className="block w-full border border-gray-300 rounded-md bg-white py-2 px-3 text-gray-900 focus:ring focus:ring-indigo-300"
                            >
                                <option value="">Select Type</option>
                                <option value="CoreStrength">Core Strength</option>
                                <option value="Yoga">Yoga</option>
                                <option value="HIIT">HIIT</option>
                                <option value="StrengthTraining">Strength Training</option>
                            </select>
                            {errors.workoutType && <p className="text-red-500">{errors.workoutType.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 text-lg">Select Equipment</label>
                        <CreatableSelect
                            value={selectedOption}
                            onChange={setSelectedOption}
                            options={options}
                            isMulti
                            className="basic-multi-select"
                            classNamePrefix="select"
                        />
                        {(!selectedOption || selectedOption.length === 0) && <p className="text-red-500">At least one equipment is required</p>}
                    </div>

                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div className="lg:w-1/2 w-full">
                            <label className="block mb-2 text-lg">Workout Logo URL</label>
                            <input
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                {...register("workoutLogo")}
                                className="block w-full border border-gray-300 rounded-md bg-white py-2 px-3 text-gray-900 focus:ring focus:ring-indigo-300"
                            />
                            {errors.workoutLogo && <p className="text-red-500">{errors.workoutLogo.message}</p>}
                        </div>

                        <div className="lg:w-1/2 w-full">
                            <label className="block mb-2 text-lg">Session Type</label>
                            <select
                                {...register("sessionType")}
                                className="block w-full border border-gray-300 rounded-md bg-white py-2 px-3 text-gray-900 focus:ring focus:ring-indigo-300"
                            >
                                <option value="">Select Session</option>
                                <option value="upperBody">Upper-body</option>
                                <option value="fullBody">Full-body</option>
                                <option value="Abs">Abs</option>
                                <option value="flexibility">Flexibility</option>
                            </select>
                            {errors.sessionType && <p className="text-red-500">{errors.sessionType.message}</p>}
                        </div>
                    </div>

                    <div className="w-full">
                        <label className="block mb-2 text-lg">Workout Description</label>
                        <textarea
                            className="w-full pl-3 py-1.5 border border-gray-300 focus:outline-none placeholder-gray-400 rounded-md"
                            rows={6}
                            placeholder="Workout Description"
                            {...register("description")}
                        />
                        {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                    </div>

                    <div className="w-full">
                        <label className="block mb-2 text-lg">Workout plan posted by</label>
                        <input
                            type="email"
                            placeholder="Your Email"
                            {...register("postedBy")}
                            className="block w-full border border-gray-300 rounded-md bg-white py-2 px-3 text-gray-900 focus:ring focus:ring-indigo-300"
                        />
                        {errors.postedBy && <p className="text-red-500">{errors.postedBy.message}</p>}
                    </div>

                    <div className="flex justify-center">
                        <input
                            type="submit"
                            value="Update Plan"
                            className="bg-black text-white font-semibold px-8 py-2 rounded-md cursor-pointer hover:bg-gray-800 transition duration-200"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdatePlan;
