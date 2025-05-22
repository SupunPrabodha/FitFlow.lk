import React, { useEffect, useState } from "react";
import Banner from "../components/Banner";
import Card from "../components/Card";
import Jobs from "./Jobs";
import SideBar from "../sidebar/sidebar";
import SessionType from "../sidebar/sessionType";
import RequestPlan from "../components/requestPlan";

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        setIsLoading(true);
        fetch("http://localhost:3000/plans/").then((res) => {
            res.json().then((data) => {
                console.log(data);
                setJobs(data);
                setIsLoading(false);
            });
        });
    }, []);

    // Handle search input change
    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    // Handle filter change
    const handleChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    // Handle click event
    const handleClick = () => {
        console.log("Filter button clicked");
    };

    // Function to filter jobs based on search and selected category
    const filteredData = () => {
        let filteredJobs = jobs;

        if (query) {
            filteredJobs = filteredJobs.filter((job) => job.workoutName.toLowerCase().includes(query.toLowerCase()));
        }

        if (selectedCategory) {
            filteredJobs = filteredJobs.filter(
                ({ difficultyLevel, maxDuration, durationType, sessionType }) =>
                    difficultyLevel.toLowerCase() === selectedCategory.toLowerCase() ||
                    (parseInt(maxDuration) <= parseInt(selectedCategory) && !isNaN(selectedCategory)) ||
                    durationType.toLowerCase() === selectedCategory.toLowerCase() ||
                    sessionType.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        return filteredJobs.map((data, i) => <Card key={i} data={data} />);
    };

    const result = filteredData();

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Hero Section */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-full">
                            <Banner query={query} handleInputChange={handleInputChange} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Filters Section */}
                        <div className="bg-gradient-to-r from-gray-100/50 to-gray-200/30 backdrop-blur-sm rounded-xl shadow-lg p-6 sticky top-8 border border-gray-200/30">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
                            <SideBar handleChange={handleChange} handleClick={handleClick} />
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Available Plans */}
                        <div className="bg-gradient-to-r from-white/90 to-gray-100/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">Available Plans</h2>
                                <div className="text-sm text-gray-600">
                                    Showing {Math.min(result.length, itemsPerPage)} of {result.length} plans
                                </div>
                            </div>
                            
                            {isLoading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                                </div>
                            ) : (
                                <>
                                    {result.length > 0 ? (
                                        <Jobs result={result} />
                                    ) : (
                                        <div className="text-center py-12">
                                            <p className="text-gray-800 text-lg">No plans match your current filters.</p>
                                            <p className="text-gray-600 text-sm mt-2">Try adjusting your search criteria</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
