import React from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const ProgressAnalysis = () => {
    const navigate = useNavigate();
    const { plan, progress, distribution, recommendations } = useLoaderData();

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Progress Analysis</h1>
                    <p className="mt-2 text-lg text-gray-600">Your detailed progress report for {plan.name}</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Progress Overview */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Progress Chart */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly Progress</h2>
                            <div className="h-64">
                                <Line
                                    data={{
                                        labels: progress.weeklyProgress.labels,
                                        datasets: [{
                                            label: 'Progress (%)',
                                            data: progress.weeklyProgress.data,
                                            borderColor: 'rgb(75, 192, 192)',
                                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                                            tension: 0.1
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Workout Distribution */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Workout Distribution</h2>
                            <div className="h-64">
                                <Doughnut
                                    data={{
                                        labels: distribution.labels,
                                        datasets: [{
                                            data: distribution.data,
                                            backgroundColor: [
                                                'rgba(255, 99, 132, 0.5)',
                                                'rgba(54, 162, 235, 0.5)',
                                                'rgba(255, 206, 86, 0.5)',
                                                'rgba(75, 192, 192, 0.5)'
                                            ],
                                            borderColor: [
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)'
                                            ],
                                            borderWidth: 1
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'right',
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Recommendations and Stats */}
                    <div className="space-y-6">
                        {/* Progress Stats */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Progress Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Current Progress</span>
                                    <span className="text-2xl font-bold text-blue-600">{progress.currentProgress}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Next Milestone</span>
                                    <span className="text-lg font-semibold text-green-600">{progress.nextMilestone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommendations</h2>
                            <ul className="space-y-3">
                                {recommendations.map((rec, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="text-green-500 mr-2">•</span>
                                        <span className="text-gray-700">{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={() => navigate('/received-plans')}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Back to Plans
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressAnalysis; 