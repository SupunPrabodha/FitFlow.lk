import React, { useRef } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  ChartDataLabels
);

const FeedbackChart = ({ analyticsData }) => {
  const chartRefs = {
    rating: useRef(null),
    category: useRef(null),
    trend: useRef(null)
  };

  // Process rating data 
  const ratingData = {
    labels: ['1★', '2★', '3★', '4★', '5★'],
    datasets: [{
      data: [1, 2, 3, 4, 5].map(rating => {
        const found = analyticsData.ratingDistribution?.find(r => r._id === rating);
        return found?.count || 0;
      }),
      backgroundColor: [
        '#ef4444', // Red for 1
        '#f97316', // Orange for 2
        '#f59e0b', // Yellow for 3
        '#10b981', // Green for 4
        '#3b82f6'  // Blue for 5
      ],
      borderWidth: 1
    }]
  };

  // Process category data
  const categoryData = {
    labels: analyticsData.categoryDistribution?.map(c => c._id || 'Unknown') || [],
    datasets: [{
      label: 'Feedbacks by Category',
      data: analyticsData.categoryDistribution?.map(c => c.count) || [],
      backgroundColor: '#8b5cf6', // Purple
      borderWidth: 1
    }]
  };

  // Process trend data
  const trendData = {
    labels: analyticsData.monthlyTrend?.map(t => 
      `${new Date(t._id.year, t._id.month - 1).toLocaleString('default', { month: 'short' })} ${t._id.year}`
    ) || [],
    datasets: [
      {
        label: 'Feedback Count',
        data: analyticsData.monthlyTrend?.map(t => t.count) || [],
        backgroundColor: '#3b82f6', // Blue
        borderColor: '#3b82f6',
        yAxisID: 'y',
        type: 'bar'
      },
      {
        label: 'Avg Rating',
        data: analyticsData.monthlyTrend?.map(t => t.avgRating || 0) || [],
        borderColor: '#10b981', // Green
        backgroundColor: 'transparent',
        yAxisID: 'y1',
        type: 'line',
        tension: 0.1
      }
    ]
  };

  const exportChart = async (chartType) => {
    try {
      if (chartRefs[chartType]?.current) {
        const canvas = chartRefs[chartType].current.canvas;
        const image = await html2canvas(canvas);
        const link = document.createElement('a');
        link.href = image.toDataURL('image/png');
        link.download = `feedback_${chartType}_${new Date().toISOString().slice(0,10)}.png`;
        link.click();
      }
    } catch (error) {
      console.error(`Failed to export ${chartType} chart:`, error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      {/* Rating Distribution Chart */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-white">Rating Distribution</h4>
          <button 
            onClick={() => exportChart('rating')}
            className="bg-gray-800 text-white px-2 py-1 rounded text-xs"
          >
            Export
          </button>
        </div>
        <div className="h-64">
          <Pie 
            ref={chartRefs.rating}
            data={ratingData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                  labels: { color: '#fff' }
                },
                datalabels: {
                  color: '#fff',
                  font: { weight: 'bold' },
                  formatter: (value) => {
                    const total = ratingData.datasets[0].data.reduce((a, b) => a + b, 0);
                    return total > 0 ? `${value} (${Math.round((value/total)*100)}%)` : value;
                  }
                }
              }
            }}
          />
        </div>
      </div>

      <div className="bg-gray-700 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-white">Category Distribution</h4>
          <button 
            onClick={() => exportChart('category')}
            className="bg-gray-800 text-white px-2 py-1 rounded text-xs"
          >
            Export
          </button>
        </div>
        <div className="h-64">
          <Bar
            ref={chartRefs.category}
            data={categoryData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                  labels: { color: '#fff' }
                },
                datalabels: {
                  color: '#fff',
                  font: { weight: 'bold' }
                }
              }
            }}
          />
        </div>
      </div>

      <div className="bg-gray-700 p-4 rounded-lg lg:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-white">Monthly Feedback Trend</h4>
          <button 
            onClick={() => exportChart('trend')}
            className="bg-gray-800 text-white px-2 py-1 rounded text-xs"
          >
            Export
          </button>
        </div>
        <div className="h-64">
          <Bar
            ref={chartRefs.trend}
            data={trendData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                mode: 'index',
                intersect: false
              },
              plugins: {
                legend: {
                  position: 'top',
                  labels: { color: '#fff' }
                }
              },
              scales: {
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  title: { 
                    display: true, 
                    text: 'Feedback Count',
                    color: '#fff'
                  },
                  ticks: { color: '#fff' }
                },
                y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  min: 0,
                  max: 5,
                  title: { 
                    display: true, 
                    text: 'Avg Rating',
                    color: '#fff'
                  },
                  grid: { drawOnChartArea: false },
                  ticks: { color: '#fff' }
                },
                x: {
                  ticks: { color: '#fff' }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FeedbackChart;