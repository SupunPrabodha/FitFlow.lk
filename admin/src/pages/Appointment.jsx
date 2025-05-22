import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl } from '../App';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PDFDownloadButton } from '../components/CommonPDFReport';

const Appointments = ({ token }) => {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('pdf');
  const [reportFilters, setReportFilters] = useState({
    startDate: '',
    endDate: '',
    status: ''
  });

  // Define columns for the PDF report
  const reportColumns = {
    name: 'Name',
    email: 'Email',
    date: 'Date',
    timeSlot: 'Time Slot',
    trainerId: 'Trainer',
    status: 'Status'
  };

  // Format appointments data for report
  const getReportData = () => {
    return appointments
      .filter(appointment => {
        if (!reportFilters.startDate && !reportFilters.endDate && !reportFilters.status) return true;
        
        const appointmentDate = new Date(appointment.date);
        const startDate = reportFilters.startDate ? new Date(reportFilters.startDate) : null;
        const endDate = reportFilters.endDate ? new Date(reportFilters.endDate) : null;
        
        const meetsDateCriteria = (!startDate || appointmentDate >= startDate) && 
                                 (!endDate || appointmentDate <= endDate);
        const meetsStatusCriteria = !reportFilters.status || 
                                   appointment.status === reportFilters.status;
        
        return meetsDateCriteria && meetsStatusCriteria;
      })
      .map(appointment => ({
        name: appointment.name,
        email: appointment.email,
        date: new Date(appointment.date).toLocaleDateString(),
        timeSlot: appointment.timeSlot,
        trainerId: appointment.trainerId,
        status: appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)
      }));
  };

  const fetchAppointments = async () => {
    try {
       const response = await axios.get("http://localhost:4000/api/book");
      if (response.data.success) {
        setAppointments(response.data.bookings);
      } else {
        toast.error('Failed to fetch appointments', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Error fetching appointments', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const sendEmailNotification = async (email, status, appointmentDetails) => {
    try {
      const subject = `Appointment ${status === 'confirmed' ? 'Approved' : 'Rejected'}`;
      const body = `
        Dear ${appointmentDetails.name},
        
        Your appointment has been ${status === 'confirmed' ? 'approved' : 'rejected'}.
        
        Appointment Details:
        - Date: ${new Date(appointmentDetails.date).toLocaleDateString()}
        - Time Slot: ${appointmentDetails.timeSlot}
        - Trainer ID: ${appointmentDetails.trainerId}
        
        ${status === 'confirmed' 
          ? 'Please arrive 10 minutes before your scheduled time.' 
          : 'Please contact us if you would like to reschedule.'}
        
        Best regards,
        FitFlow Gym Team
      `;

      // Open default email client with pre-filled details
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to open email client', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      // Show loading toast
      const toastId = toast.loading('Updating appointment status...', {
        position: "top-right"
      });

      // Ensure status is one of the allowed values
      const validStatus = status === 'confirmed' ? 'confirmed' : 'cancelled';

      const response = await axios.put(`http://localhost:4000/api/book/${id}/status`,
        { status: validStatus },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Send email notification
        const appointment = appointments.find(a => a._id === id);
        if (appointment) {
          await sendEmailNotification(appointment.email, validStatus, appointment);
        }

        // Update toast to success
        toast.update(toastId, {
          render: `Appointment ${validStatus} successfully`,
          type: "success",
          isLoading: false,
          autoClose: 3000,
          position: "top-right"
        });

        // Refresh appointments
        await fetchAppointments();
      } else {
        throw new Error(response.data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error(error.response?.data?.message || 'Failed to update appointment status', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const generateReport = async () => {
    try {
      if (reportType === 'pdf') {
        // PDF generation is handled by the PDFDownloadButton component
        return;
      }

      // For CSV/Excel
      const reportData = getReportData();
      if (reportType === 'csv') {
        const csvContent = convertToCSV(reportData);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `appointments_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast.success('Report downloaded successfully', {
        position: "top-right",
        autoClose: 3000,
      });
      setShowReportModal(false);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Error generating report', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const convertToCSV = (data) => {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => 
          `"${row[header]}"`
        ).join(',')
      )
    ];
    
    return csvRows.join('\n');
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(appointment => 
    appointment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appointment.trainerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (appointment.email && appointment.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Appointments Management</h2>
          <button
            onClick={() => setShowReportModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            Generate Report
          </button>
        </div>

        {/* Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-bold text-white mb-4">Generate Report</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-1">Report Type</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                  >
                    <option value="pdf">PDF</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={reportFilters.startDate}
                    onChange={(e) => setReportFilters(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">End Date</label>
                  <input
                    type="date"
                    value={reportFilters.endDate}
                    onChange={(e) => setReportFilters(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Status</label>
                  <select
                    value={reportFilters.status}
                    onChange={(e) => setReportFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  {reportType === 'pdf' ? (
                    <PDFDownloadButton
                      title="Appointments Report"
                      data={getReportData()}
                      columns={reportColumns}
                      fileName={`appointments_report_${new Date().toISOString().split('T')[0]}.pdf`}
                    />
                  ) : (
                    <button
                      onClick={generateReport}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                    >
                      Download Report
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, trainer ID or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/3 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
          />
        </div>

        <div className="bg-gray-800 shadow-xl rounded-xl border border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className='hidden md:grid grid-cols-8 items-center py-4 px-6 bg-gray-700 text-gray-300 text-sm font-medium'>
            <span>Name</span>
            <span>Email</span>
            <span>Age</span>
            <span>Trainer ID</span>
            <span>Date</span>
            <span>Time Slot</span>
            <span>Status</span>
            <span className='text-center'>Actions</span>
          </div>

          {/* Table Rows */}
          <div className='divide-y divide-gray-700'>
            {filteredAppointments.map((appointment, index) => (
              <div
                key={index}
                className='grid grid-cols-1 md:grid-cols-8 items-center gap-4 py-4 px-6 text-gray-300 text-sm hover:bg-gray-750 transition-colors'
              >
                <p className="truncate">{appointment.name}</p>
                <p className="truncate">{appointment.email || '-'}</p>
                <p>{appointment.age}</p>
                <p className="truncate">{appointment.trainerId}</p>
                <p>{new Date(appointment.date).toLocaleDateString()}</p>
                <p>{appointment.timeSlot}</p>
                <p className={`${
                  appointment.status === 'confirmed' ? 'text-green-500' :
                  appointment.status === 'cancelled' ? 'text-red-500' :
                  'text-yellow-500'
                }`}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </p>
                <div className='flex justify-center space-x-4 items-center'>
                  {appointment.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(appointment._id, 'confirmed')}
                        className='text-green-500 hover:text-green-400 transition-colors'
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(appointment._id, 'cancelled')}
                        className='text-red-500 hover:text-red-400 transition-colors'
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredAppointments.length === 0 && (
            <div className="py-8 text-center text-gray-400">
              No appointments found
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Appointments; 