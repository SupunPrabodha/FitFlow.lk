import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import FeedbackChart from './FeedbackChart';

const FeedbackAnalysis = ({ token, showAnalytics, setShowAnalytics }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const params = {
        startDate: dateRange.start,
        endDate: dateRange.end
      };

      const response = await axios.get("http://localhost:4000/api/feedback/analytics", {
        headers: { token },
        params
      });
      
      console.log("Analytics API Response:", response.data); // Debug log
      
      if (response.data.success) {
        setAnalyticsData(response.data.analytics);
      } else {
        toast.error(response.data.message || "Failed to load analytics");
        setAnalyticsData({
          ratingDistribution: Array(5).fill().map((_, i) => ({ _id: i+1, count: 0 })),
          categoryDistribution: [],
          monthlyTrend: []
        });
      }
    } catch (error) {
      console.error('Analytics error:', error);
      toast.error(error.response?.data?.message || "Failed to load analytics");
      setAnalyticsData({
        ratingDistribution: Array(5).fill().map((_, i) => ({ _id: i+1, count: 0 })),
        categoryDistribution: [],
        monthlyTrend: []
      });
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    if (showAnalytics) {
      fetchAnalytics();
    }
  }, [showAnalytics]);

  if (!showAnalytics) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">Feedback Analytics</h3>
          <button 
            onClick={() => setShowAnalytics(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 w-full text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 w-full text-white"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchAnalytics}
              disabled={analyticsLoading}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {analyticsLoading ? 'Loading...' : 'Apply Filter'}
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          {analyticsLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : analyticsData ? (
            <FeedbackChart analyticsData={analyticsData} />
          ) : (
            <div className="flex justify-center items-center h-full text-white">
              <p>No analytics data available. Apply filters to load data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackAnalysis;