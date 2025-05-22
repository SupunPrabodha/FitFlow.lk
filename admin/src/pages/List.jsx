import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl } from '../App';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { PDFDownloadButton } from '../components/CommonPDFReport';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [reportType, setReportType] = useState('pdf');
  const navigate = useNavigate();

  // Define columns for the PDF report
  const reportColumns = {
    name: 'Name',
    email: 'Email',
    contact: 'Contact',
    age: 'Age',
    gender: 'Gender',
    qualification: 'Qualifications'
  };

  // Format trainers data for report
  const getReportData = () => {
    return list.map(trainer => ({
      name: trainer.name,
      email: trainer.email,
      contact: trainer.contact,
      age: trainer.age.toString(),
      gender: trainer.gender,
      qualification: trainer.qualification || '-'
    }));
  };

  const downloadReport = () => {
    const data = getReportData();
    if (!data.length) {
      toast.error('No data available for report');
      return;
    }
    
    try {
      if (reportType === 'excel') {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Trainers");
        XLSX.writeFile(workbook, `trainers_report_${new Date().toISOString().slice(0,10)}.xlsx`);
      } else if (reportType === 'csv') {
        const csvContent = [
          Object.keys(data[0]),
          ...data.map(item => Object.values(item))
        ].map(e => e.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `trainers_report_${new Date().toISOString().slice(0,10)}.csv`);
      }
      toast.success(`Report downloaded as ${reportType.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to download report");
    }
  };

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(backendUrl + '/api/trainer/list', {
        headers: { token }
      });
      
      if (response.data.success) {
        setList(response.data.trainers);
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to fetch trainers', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const removeTrainers = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this trainer?")) return;
    
    try {
      const response = await axios.delete(
        backendUrl + '/api/trainer/remove',
        {
          data: { _id },
          headers: { token }
        }
      );
      
      if (response.data.success) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
        await fetchList();
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to delete trainer', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleEdit = (trainer) => {
    navigate('/edit-trainer', { state: { trainer } });
  };

  const filteredTrainers = list.filter(trainer => 
    trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trainer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trainer.contact.includes(searchQuery)
  );

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-white">Trainers Management</h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 sm:flex-initial">
              <input
                type="text"
                placeholder="Search by name, email, or contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pl-10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white text-sm"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>

            {reportType === 'pdf' ? (
              <PDFDownloadButton
                title="Trainers Report"
                data={getReportData()}
                columns={reportColumns}
                fileName={`trainers_report_${new Date().toISOString().slice(0,10)}.pdf`}
              />
            ) : (
              <button
                onClick={downloadReport}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Download Report
              </button>
            )}

            <button
              onClick={() => navigate('/add')}
              className="flex items-center bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                />
              </svg>
              Add Trainer
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="bg-gray-800 shadow-xl rounded-xl border border-gray-700 overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-7 items-center py-4 px-6 bg-gray-700 text-gray-300 text-sm font-medium">
              <span>Name</span>
              <span>Email</span>
              <span>Contact</span>
              <span>Age</span>
              <span>Gender</span>
              <span>Qualifications</span>
              <span className="text-center">Action</span>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-700">
              {filteredTrainers.length > 0 ? (
                filteredTrainers.map((trainer, index) => (
                  <div
                    key={trainer._id}
                    className="grid grid-cols-1 md:grid-cols-7 items-center gap-4 py-4 px-6 text-gray-300 text-sm hover:bg-gray-750 transition-colors"
                  >
                    <p className="truncate">{trainer.name}</p>
                    <p className="truncate">{trainer.email}</p>
                    <p>{trainer.contact}</p>
                    <p>{trainer.age}</p>
                    <p>{trainer.gender}</p>
                    <p className="truncate">{trainer.qualification || '-'}</p>
                    <div className="flex justify-center space-x-4 items-center">
                      <span
                        className="text-orange-500 text-lg cursor-pointer"
                        onClick={async () => {
                          try {
                            const response = await axios.post(backendUrl + '/api/trainer/send-email', {
                              email: trainer.email,
                              name: trainer.name
                            });
                            if (response.data.success) {
                              toast.success('Email sent successfully!', {
                                position: "top-right",
                                autoClose: 3000,
                              });
                            }
                          } catch (error) {
                            console.error('Error sending email:', error);
                            toast.error(error.response?.data?.error || 'Failed to send email. Please try again.', {
                              position: "top-right",
                              autoClose: 3000,
                            });
                          }
                        }}
                        title="Send registration email"
                      >📧</span>
                      <button
                        onClick={() => handleEdit(trainer)}
                        className="text-orange-500 hover:text-orange-400 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeTrainers(trainer._id)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-400">
                  {searchQuery ? 'No matching trainers found' : 'No trainers available'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;