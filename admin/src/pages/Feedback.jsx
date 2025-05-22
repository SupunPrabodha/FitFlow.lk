import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { PDFDownloadButton } from '../components/CommonPDFReport';
import FeedbackAnalysis from '../components/FeedbackAnalysis';

const FeedbackList = ({ token }) => {
  // State management
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('descending');
  const [reportType, setReportType] = useState('excel');
  const [reportLoading, setReportLoading] = useState(false);
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Define columns for the PDF report
  const reportColumns = {
    name: 'Name',
    email: 'Email',
    category: 'Category',
    rating: 'Rating',
    review: 'Feedback',
    date: 'Date'
  };

  // Fetch feedback data
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/api/feedback/list", {
        headers: { token }
      });
      
      if (response.data.success) {
        setFeedbacks(response.data.feedback);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error(err.response?.data?.message || "Failed to fetch feedbacks");
    } finally {
      setLoading(false);
    }
  };

  // Delete feedback
  const removeFeedback = async (feedbackId) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/feedback/admin/remove/${feedbackId}`,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchFeedbacks();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || "Failed to delete feedback");
    }
  };

  // Filter and sort feedbacks
  const filteredFeedbacks = feedbacks
  .filter(feedback => {
    const matchesSearch = 
      feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.review.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      feedback.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  })
  .sort((a, b) => {
    return sortOrder === 'ascending' 
      ? new Date(a.date) - new Date(b.date) 
      : new Date(b.date) - new Date(a.date);
  });

  const generateReportData = () => {
    return filteredFeedbacks.map(fb => ({
      name: fb.name,
      email: fb.email,
      category: fb.category,
      rating: `${fb.rating}/5`,
      review: fb.review,
      date: new Date(fb.date).toLocaleDateString()
    }));
  };

  const previewReport = () => {
    setReportLoading(true);
    try {
      const data = generateReportData();
      setReportData(data);
      setShowReportPreview(true);
      toast.success("Report preview generated");
    } catch (error) {
      toast.error("Failed to generate preview");
    } finally {
      setReportLoading(false);
    }
  };

  const downloadReport = () => {
    if (!reportData) return;
    
    setReportLoading(true);
    try {
      if (reportType === 'excel') {
        const worksheet = XLSX.utils.json_to_sheet(reportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Feedbacks");
        XLSX.writeFile(workbook, `feedbacks_report_${new Date().toISOString().slice(0,10)}.xlsx`);
      } else if (reportType === 'csv') {
        const csvContent = [
          Object.keys(reportData[0]),
          ...reportData.map(item => Object.values(item))
        ].map(e => e.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `feedbacks_report_${new Date().toISOString().slice(0,10)}.csv`);
      }
      toast.success(`Report downloaded as ${reportType.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to download report");
    } finally {
      setReportLoading(false);
    }
  };

  const PDFReportDocument = ({ data }) => (
    <Document>
      <Page style={{ padding: 30, fontSize: 12 }}>
        <View style={{ marginBottom: 20, textAlign: 'center' }}>
          <Text style={{ fontSize: 24, marginBottom: 10 }}>Feedback Report</Text>
          <Text style={{ fontSize: 10, color: 'gray' }}>
            Generated on: {new Date().toLocaleDateString()}
          </Text>
        </View>
        
        <View style={{ 
          display: 'flex', 
          width: '100%', 
          borderStyle: 'solid', 
          borderWidth: 1,
          borderColor: '#e5e7eb'
        }}>
          
          <View style={{ 
            flexDirection: 'row', 
            borderBottomWidth: 1,
            backgroundColor: '#f3f4f6',
            fontWeight: 'bold'
          }}>
            {Object.keys(data[0]).map((key) => (
              <View key={key} style={{ 
                width: `${100/Object.keys(data[0]).length}%`, 
                padding: 5,
                borderRightWidth: 1,
                borderRightColor: '#e5e7eb'
              }}>
                <Text>{key}</Text>
              </View>
            ))}
          </View>
          
          {/* Table Rows */}
          {data.map((item, index) => (
            <View key={index} style={{ 
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderBottomColor: '#e5e7eb'
            }}>
              {Object.values(item).map((value, i) => (
                <View key={i} style={{ 
                  width: `${100/Object.keys(item).length}%`, 
                  padding: 5,
                  borderRightWidth: 1,
                  borderRightColor: '#e5e7eb'
                }}>
                  <Text>{value}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  // Star Rating Component
  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-orange-500' : 'text-gray-500'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-gray-400 text-sm">({rating}/5)</span>
      </div>
    );
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div className="max-w-7xl mx-auto">
        {/* Header and Report Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-white">Feedback Management</h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white text-sm"
            >
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
            </select>
            
            {reportType === 'pdf' ? (
              <PDFDownloadButton
                title="Feedback Report"
                data={generateReportData()}
                columns={reportColumns}
                fileName={`feedback_report_${new Date().toISOString().slice(0,10)}.pdf`}
              />
            ) : (
              <button
                onClick={downloadReport}
                disabled={reportLoading}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {reportLoading ? 'Generating...' : `Download ${reportType.toUpperCase()}`}
              </button>
            )}

            <button
              onClick={() => setShowAnalytics(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Analysis
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search feedback..."
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg 
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          
          <select
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
>
  <option value="all">All Categories</option>
  <option value="service">Service</option>
  <option value="product">Product</option>
  <option value="experience">Experience</option>
  <option value="support">Support</option>
  <option value="other">Other</option>
</select>
          
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
          >
            <option value="descending">Newest First</option>
            <option value="ascending">Oldest First</option>
          </select>
        </div>

        {/* Feedback Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Feedback
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Rating
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Submitted By
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {filteredFeedbacks.length > 0 ? (
                    filteredFeedbacks.map((feedback) => (
                      <tr key={feedback._id} className="hover:bg-gray-750 transition-colors">
                        <td className="px-6 py-4 whitespace-normal max-w-xs">
                          <div className="text-sm text-gray-300 line-clamp-2">{feedback.review}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center">
                            <StarRating rating={feedback.rating} />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{feedback.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {new Date(feedback.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <button
                            onClick={() => removeFeedback(feedback._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-400">
                        {searchTerm || selectedCategory !== 'all' 
                          ? 'No matching feedbacks found' 
                          : 'No feedbacks available'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Report Preview Modal */}
        {showReportPreview && reportData && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h3 className="text-xl font-bold text-white">
                  Report Preview ({reportType.toUpperCase()})
                </h3>
                <button 
                  onClick={() => setShowReportPreview(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-1 overflow-hidden">
                {reportType === 'pdf' ? (
                  <PDFViewer className="w-full h-full">
                    <PDFReportDocument data={reportData} />
                  </PDFViewer>
                ) : (
                  <div className="overflow-auto h-full p-4">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-700">
                        <tr>
                          {Object.keys(reportData[0]).map((key) => (
                            <th 
                              key={key}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {reportData.map((row, i) => (
                          <tr key={i} className="hover:bg-gray-750">
                            {Object.values(row).map((value, j) => (
                              <td 
                                key={j}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
                              >
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-700 flex justify-end space-x-3">
                <button
                  onClick={() => setShowReportPreview(false)}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={downloadReport}
                  className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Modal */}
        <FeedbackAnalysis 
          token={token}
          showAnalytics={showAnalytics}
          setShowAnalytics={setShowAnalytics}
        />
      </div>
    </div>
  );
};

export default FeedbackList;