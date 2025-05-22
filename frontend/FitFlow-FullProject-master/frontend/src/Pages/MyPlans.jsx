import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button, Alert, CircularProgress } from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";

const MyPlans = () => {
    const [plans, setPlans] = useState([]);
    const [filteredPlans, setFilteredPlans] = useState([]); // Store original data separately
    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [requestedPlans, setRequestedPlans] = useState([]); // State for requested plans
    const [progressData, setProgressData] = useState([]);
    const [deleteError, setDeleteError] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const [requestedCurrentPage, setRequestedCurrentPage] = useState(1); // Pagination for requested plans
    const requestedItemsPerPage = 4; // Items per page for requested plans

    useEffect(() => {
        setIsLoading(true);
        fetch(`http://localhost:3000/plans`)
            .then((res) => res.json())
            .then((data) => {
                setPlans(data);
                setFilteredPlans(data); // Store a copy for search functionality
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching plans:", err);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        // Fetch requested plans
        fetch(`http://localhost:3000/requests`)
            .then((res) => res.json())
            .then((data) => {
                setRequestedPlans(data);
            })
            .catch((err) => console.error("Error fetching requested plans:", err));
    }, []);

    useEffect(() => {
        fetch(`http://localhost:3000/progress`)
            .then((res) => res.json())
            .then((data) => {
                setProgressData(data);
            })
            .catch((err) => console.error("Error fetching progress data:", err));
    }, []);

    useEffect(() => {
        // Filter plans when searching
        const handleSearch = () => {
            if (searchText.trim() === "") {
                setFilteredPlans(plans);
            } else {
                const filtered = plans.filter((plan) => {
                    // Search by workout name and trainer name
                    return (
                        plan.workoutName.toLowerCase().includes(searchText.toLowerCase()) ||
                        plan.trainerName.toLowerCase().includes(searchText.toLowerCase())
                    );
                });
                setFilteredPlans(filtered);
            }
        };
        handleSearch(); // Trigger search whenever searchText changes
    }, [plans, searchText]);

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPlans = filteredPlans.slice(indexOfFirstItem, indexOfLastItem);

    // Pagination calculations for requested plans
    const requestedIndexOfLastItem = requestedCurrentPage * requestedItemsPerPage;
    const requestedIndexOfFirstItem = requestedIndexOfLastItem - requestedItemsPerPage;
    const currentRequestedPlans = requestedPlans.slice(requestedIndexOfFirstItem, requestedIndexOfLastItem);

    // Next and Previous page handlers
    const nextPage = () => {
        if (indexOfLastItem < filteredPlans.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prePage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Next and Previous page handlers for requested plans
    const nextRequestedPage = () => {
        if (requestedIndexOfLastItem < requestedPlans.length) {
            setRequestedCurrentPage(requestedCurrentPage + 1);
        }
    };

    const preRequestedPage = () => {
        if (requestedCurrentPage > 1) {
            setRequestedCurrentPage(requestedCurrentPage - 1);
        }
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this workout plan?");
        if (!confirmDelete) return;

        fetch(`http://localhost:3000/plans/${id}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Plan deleted successfully:", data);
                // Remove the deleted plan from the UI
                const updatedPlans = plans.filter((plan) => plan._id !== id);
                setPlans(updatedPlans);
                setFilteredPlans(updatedPlans);
            })
            .catch((err) => console.error("Error deleting plan:", err));
    };

    const handleDeleteProgress = async (id) => {
        if (window.confirm("Are you sure you want to delete this progress entry?")) {
            try {
                const response = await fetch(`http://localhost:3000/progress/delete/${id}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    throw new Error("Failed to delete progress entry");
                }

                // Refresh the progress data after successful deletion
                const updatedProgress = progressData.filter(progress => progress._id !== id);
                setProgressData(updatedProgress);
            } catch (error) {
                console.error("Error deleting progress:", error);
                setDeleteError("Failed to delete progress entry. Please try again.");
            }
        }
    };

    const downloadProgressPDF = (progress) => {
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(16);
        doc.text("Progress Details", 14, 15);
        
        // Add client information
        doc.setFontSize(12);
        doc.text(`Client Email: ${progress.userEmail}`, 14, 25);
        doc.text(`Date: ${new Date(progress.date).toLocaleDateString()}`, 14, 35);
        
        // Add progress details
        doc.setFontSize(10);
        doc.text(`Weight: ${progress.weight} kg`, 14, 45);
        doc.text(`Measurements: ${progress.measurements}`, 14, 55);
        doc.text(`Completed Workouts: ${progress.completedWorkouts}`, 14, 65);
        
        if (progress.notes) {
            doc.text(`Notes: ${progress.notes}`, 14, 75);
        }
        
        // Add generation date
        doc.setFontSize(8);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 85);
        
        // Save the PDF
        doc.save(`progress-${progress.userEmail}-${new Date(progress.date).toLocaleDateString()}.pdf`);
    };

    return (
        <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
            <h1 className="text-center p-4 text-lg font-bold">All My Plans</h1>

            {/* Search Box */}
            <div className="flex justify-center items-center gap-2 mb-4">
                <input
                    onChange={(e) => setSearchText(e.target.value)}
                    type="text"
                    placeholder="Search workout plans"
                    className="py-2 px-4 border border-gray-300 focus:outline-none w-2/5 bg-gray-100 rounded-md"
                />
                <button
                    className="bg-gray-700 text-white font-semibold px-4 py-2 rounded-md"
                >
                    Search
                </button>

                <Link to="/trainer-dashboard/mealplans">
                    <button className="bg-green-600 text-white text-xs font-bold uppercase px-4 py-2 rounded">Post A New Meal Plan</button>
                </Link>
            </div>

            {isLoading ? <p>Loading...</p> : <p className="text-center mb-2">My Plans: {filteredPlans.length}</p>}

            <section className="py-1">
                <div className="w-full xl:w-10/12 mx-auto mt-6">
                    <div className="relative flex flex-col bg-white w-full mb-6 shadow-md rounded-lg">
                        <div className="rounded-t px-4 py-3 border-b flex justify-between items-center">
                            <h3 className="font-semibold text-lg">All Plans</h3>
                            <Link to="/trainer-dashboard/postplans">
                                <button className="bg-green-600 text-white text-xs font-bold uppercase px-4 py-2 rounded">Post A New Plan</button>
                            </Link>
                        </div>

                        {/* Table */}
                        <div className="block w-full overflow-x-auto">
                            <table className="items-center bg-transparent w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="px-6 py-3 text-xs uppercase font-semibold text-left">No:</th>
                                        <th className="px-6 py-3 text-xs uppercase font-semibold text-left">Workout Name</th>
                                        <th className="px-6 py-3 text-xs uppercase font-semibold text-left">Min Duration (min)</th>
                                        <th className="px-6 py-3 text-xs uppercase font-semibold text-left">Max Duration (min)</th>
                                        <th className="px-6 py-3 text-xs uppercase font-semibold text-left">Trainer Name</th>
                                        <th className="px-6 py-3 text-xs uppercase font-semibold text-left">Edit</th>
                                        <th className="px-6 py-3 text-xs uppercase font-semibold text-left">Delete</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {currentPlans.map((plan, index) => (
                                        <tr key={plan._id} className="border-b hover:bg-gray-100">
                                            <td className="px-6 py-4 text-sm">{indexOfFirstItem + index + 1}</td>
                                            <td className="px-6 py-4 text-sm">{plan.workoutName}</td>
                                            <td className="px-6 py-4 text-sm">{plan.minDuration}</td>
                                            <td className="px-6 py-4 text-sm">{plan.maxDuration}</td>
                                            <td className="px-6 py-4 text-sm">{plan.trainerName}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <Link to={`/trainer-dashboard/edit-plans/${plan._id}`}>
                                                    <button className="bg-yellow-500 text-white px-4 py-1 rounded-md">Edit</button>
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <button className="bg-red-600 py-2 px-4 text-white rounded-md" onClick={() => handleDelete(plan._id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="flex justify-center text-black space-x-8 mt-4">
                        {currentPage > 1 && (
                            <button className="hover:underline" onClick={prePage}>
                                Previous
                            </button>
                        )}
                        {indexOfLastItem < filteredPlans.length && (
                            <button className="hover:underline" onClick={nextPage}>
                                Next
                            </button>
                        )}
                    </div>
                </div>

                {/* New table for requested plans */}
                <div className="w-full xl:w-10/12 mx-auto mt-6">
                    <div className="relative flex flex-col bg-white w-full mb-6 shadow-md rounded-lg">
                        <div className="rounded-t px-4 py-3 border-b flex justify-between items-center">
                            <h3 className="font-semibold text-lg">Requested Plans</h3>
                        </div>

                        <div className="block w-full overflow-x-auto">
                            <table className="items-center bg-transparent w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="px-6 py-3 text-xs uppercase font-semibold text-left">No:</th>
                                        <th className="px-6 py-3 text-xs uppercase font-semibold text-left">Workout Name</th>
                                        <th className="px-6 py-3 text-xs uppercase font-semibold text-left">Requested By</th>
                                        <th className="px-6 py-3 text-xs uppercase font-semibold text-left">Goal</th>
                                        <th className="px-6 py-3 text-xs uppercase font-semibold text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRequestedPlans.map((plan, index) => (
                                        <tr
                                            key={plan._id}
                                            className="border-b hover:bg-gray-100"
                                            onClick={() => {
                                                // redirect to the plan details page
                                                window.location.href = `/request-plan/${plan._id}`;
                                            }}
                                        >
                                            <td className="px-6 py-4 text-sm">{requestedIndexOfFirstItem + index + 1}</td>
                                            <td className="px-6 py-4 text-sm">{plan.name}</td>
                                            <td className="px-6 py-4 text-sm">{plan.email}</td>
                                            <td className="px-6 py-4 text-sm">{plan.goal}</td>
                                            <td className="px-6 py-4 text-sm">{plan.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="flex justify-center text-black space-x-8 mt-4">
                        {requestedCurrentPage > 1 && (
                            <button className="hover:underline" onClick={preRequestedPage}>
                                Previous
                            </button>
                        )}
                        {requestedIndexOfLastItem < requestedPlans.length && (
                            <button className="hover:underline" onClick={nextRequestedPage}>
                                Next
                            </button>
                        )}
                    </div>
                </div>

                {/* Progress Updates Table */}
                <div className="w-full xl:w-10/12 mx-auto mt-6">
                    <div className="relative flex flex-col bg-white w-full mb-6 shadow-lg rounded-xl overflow-hidden">
                        <div className="rounded-t px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                            <h3 className="font-bold text-xl text-gray-800">Submitted Progress Details</h3>
                        </div>
                        {deleteError && (
                            <Alert 
                                severity="error" 
                                sx={{ 
                                    mx: 4, 
                                    mt: 2, 
                                    borderRadius: 2,
                                    '& .MuiAlert-icon': {
                                        color: '#ef4444'
                                    }
                                }}
                            >
                                {deleteError}
                            </Alert>
                        )}
                        <div className="p-6">
                            <div className="overflow-x-auto rounded-lg shadow">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-[5%]">
                                                No.
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-[15%]">
                                                Client Email
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-[10%]">
                                                Date
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-[10%]">
                                                Weight
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-[20%]">
                                                Measurements
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-[15%]">
                                                Completed Workouts
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-[15%]">
                                                Notes
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-[10%]">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {progressData.map((progress, index) => (
                                            <tr 
                                                key={progress._id} 
                                                className="transition-colors hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {progress.userEmail}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {new Date(progress.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    <span className="font-medium">{progress.weight}</span> kg
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {progress.measurements}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {progress.completedWorkouts}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {progress.notes || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <div className="flex items-center space-x-3">
                                                        <button
                                                            onClick={() => handleDeleteProgress(progress._id)}
                                                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                                            title="Delete Progress"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => downloadProgressPDF(progress)}
                                                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                                            title="Download Progress Details"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MyPlans;
