import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";

// Validation schema
const requestSchema = yup.object({
    name: yup.string()
        .required("Name is required")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must not exceed 50 characters"),
    email: yup.string()
        .required("Email is required")
        .email("Invalid email format"),
    phone: yup.string()
        .required("Phone number is required")
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
    goal: yup.string()
        .required("Fitness goal is required")
        .min(10, "Goal must be at least 10 characters")
        .max(200, "Goal must not exceed 200 characters"),
    preferredDays: yup.string()
        .required("Preferred workout days are required")
        .min(3, "Please specify at least one day"),
    additionalInfo: yup.string()
        .max(500, "Additional information must not exceed 500 characters")
});

const RequestPlan = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(requestSchema)
    });

    const onSubmit = (data) => {
        // Send form data to the server
        fetch("http://localhost:3000/requests/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Request submitted:", data);
                alert("Request submitted successfully!");
                reset();
                window.location.href = "/";
            })
            .catch((err) => {
                console.error("Error submitting request:", err);
                alert("An error occurred. Please try again.");
            });
    };

    return (
        <div 
            className="min-h-screen bg-cover bg-center bg-fixed"
            style={{
                backgroundImage: "url('/images/sven-mieke-Lx_GDv7VA9M-unsplash.jpg')"
            }}
        >
            <div className="absolute inset-0 bg-black/60"></div>
            
            <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
                <div className="max-w-4xl w-full">
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-white/20">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <Link 
                                    to="/" 
                                    className="text-white hover:text-orange-400 transition duration-300 flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                    Back to Home
                                </Link>
                                <h2 className="text-4xl font-bold text-white">Request Your Custom Plan</h2>
                                <div className="w-24"></div> {/* Spacer for alignment */}
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-white">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            {...register("name")}
                                            className={`mt-1 block w-full p-3 border ${
                                                errors.name ? "border-red-500" : "border-white/30"
                                            } rounded-lg shadow-sm bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                                            placeholder="Enter your name"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-white">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            {...register("email")}
                                            className={`mt-1 block w-full p-3 border ${
                                                errors.email ? "border-red-500" : "border-white/30"
                                            } rounded-lg shadow-sm bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                                            placeholder="Enter your email"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-white">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            {...register("phone")}
                                            placeholder="10 digits without spaces or dashes"
                                            className={`mt-1 block w-full p-3 border ${
                                                errors.phone ? "border-red-500" : "border-white/30"
                                            } rounded-lg shadow-sm bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="preferredDays" className="block text-sm font-medium text-white">
                                            Preferred Workout Days
                                        </label>
                                        <input
                                            type="text"
                                            id="preferredDays"
                                            {...register("preferredDays")}
                                            placeholder="e.g., Monday, Wednesday, Friday"
                                            className={`mt-1 block w-full p-3 border ${
                                                errors.preferredDays ? "border-red-500" : "border-white/30"
                                            } rounded-lg shadow-sm bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                                        />
                                        {errors.preferredDays && (
                                            <p className="mt-1 text-sm text-red-400">{errors.preferredDays.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="goal" className="block text-sm font-medium text-white">
                                        Fitness Goal
                                    </label>
                                    <input
                                        type="text"
                                        id="goal"
                                        {...register("goal")}
                                        className={`mt-1 block w-full p-3 border ${
                                            errors.goal ? "border-red-500" : "border-white/30"
                                        } rounded-lg shadow-sm bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                                        placeholder="Describe your fitness goals"
                                    />
                                    {errors.goal && (
                                        <p className="mt-1 text-sm text-red-400">{errors.goal.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="additionalInfo" className="block text-sm font-medium text-white">
                                        Additional Information
                                    </label>
                                    <textarea
                                        id="additionalInfo"
                                        {...register("additionalInfo")}
                                        rows="4"
                                        className={`mt-1 block w-full p-3 border ${
                                            errors.additionalInfo ? "border-red-500" : "border-white/30"
                                        } rounded-lg shadow-sm bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                                        placeholder="Any additional information you'd like to share"
                                    ></textarea>
                                    {errors.additionalInfo && (
                                        <p className="mt-1 text-sm text-red-400">{errors.additionalInfo.message}</p>
                                    )}
                                </div>

                                <div className="flex justify-center">
                                    <button
                                        type="submit"
                                        className="w-full md:w-1/2 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg shadow-md hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-300"
                                    >
                                        Submit Request
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestPlan;
