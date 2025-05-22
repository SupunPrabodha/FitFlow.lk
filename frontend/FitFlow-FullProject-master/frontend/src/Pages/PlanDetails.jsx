import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import PageHeader from "../components/PageHeader"; // Adjust the path if needed
import { FaDumbbell, FaRunning, FaClock, FaCalendarAlt } from "react-icons/fa";

const PlanDetails = () => {
    const { id } = useParams();
    const [plan, setPlan] = useState({}); // Initialize as an empty object

    useEffect(() => {
        fetch(`http://localhost:3000/plans/${id}`)
            .then((res) => res.json())
            .then((data) => setPlan(data))
            .catch((error) => console.error("Error fetching plan:", error));
    }, [id]);

    const handleApply = async () => {
        const { value: email } = await Swal.fire({
            title: "Input email address",
            input: "email",
            inputLabel: "Your email address",
            inputPlaceholder: "Enter your email address",
        });
        if (email) {
            Swal.fire(`Entered email: ${email}`);
        }
    };

    return (
        <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-10">
            <PageHeader title={"Single Plan Page"} path={"single Page"} />

            <div className="bg-white shadow-lg rounded-lg p-6">
                {/* Header Section */}
                <div className="mb-6">
                    <h1
                        className="text-3xl font-bold mb-2"
                        style={{ color: "#e96443" }} // Orange for title
                    >
                        {plan.workoutName || "Loading..."}
                    </h1>
                    <h3
                        className="text-xl"
                        style={{ color: "#904e95" }} // Purple for trainer
                    >
                        Trainer: {plan.trainerName || "Unknown"}
                    </h3>
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-700">
                        <FaDumbbell style={{ color: "#e96443" }} /> {/* Orange icon */}
                        <span>Difficulty: {plan.difficultyLevel || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <FaRunning style={{ color: "#e96443" }} /> {/* Orange icon */}
                        <span>Session Type: {plan.sessionType || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <FaClock style={{ color: "#e96443" }} /> {/* Orange icon */}
                        <span>
                            Duration: {plan.minDuration}-{plan.maxDuration} {plan.durationType || "N/A"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <FaCalendarAlt style={{ color: "#e96443" }} /> {/* Orange icon */}
                        <span>Posted: {plan.postedDate || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span
                            className="font-semibold"
                            style={{ color: "#904e95" }} // Purple for label
                        >
                            Workout Type:
                        </span>
                        <span>{plan.workoutType || "N/A"}</span>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <h4
                        className="text-lg font-semibold mb-2"
                        style={{ color: "#904e95" }} // Purple for description header
                    >
                        Description
                    </h4>
                    <p className="text-gray-600">{plan.description || "No description available."}</p>
                </div>

                {/* Action Button */}
                <button
                    className="px-8 py-2 text-white rounded-md transition-colors"
                    style={{
                        backgroundColor: "#a73737", // Reddish button
                        ":hover": {
                            backgroundColor: "#7a2828", // Darker red on hover
                        },
                    }}
                    onClick={handleApply}
                >
                    Allocate Now
                </button>
            </div>
        </div>
    );
};

export default PlanDetails;
