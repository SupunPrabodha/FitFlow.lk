import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../config";
import { FaDownload, FaCheck, FaTimes } from "react-icons/fa";
import { PDFDownloadButton } from '../components/CommonPDFReport';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportType, setReportType] = useState('pdf');

  // Define columns for the PDF report
  const reportColumns = {
    name: 'Name',
    email: 'Email',
    contactNumber: 'Contact Number',
    age: 'Age',
    gender: 'Gender',
    membershipType: 'Membership Package',
    paymentStatus: 'Payment Status'
  };

  // Format members data for report
  const getReportData = () => {
    return members.map(member => ({
      name: member.name,
      email: member.email,
      contactNumber: member.contactNumber,
      age: member.age.toString(),
      gender: member.gender,
      membershipType: member.membershipType || '-',
      paymentStatus: member.paymentStatus || 'pending'
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Members");
        XLSX.writeFile(workbook, `members_report_${new Date().toISOString().slice(0,10)}.xlsx`);
      } else if (reportType === 'csv') {
        const csvContent = [
          Object.keys(data[0]),
          ...data.map(item => Object.values(item))
        ].map(e => e.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `members_report_${new Date().toISOString().slice(0,10)}.csv`);
      }
      toast.success(`Report downloaded as ${reportType.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to download report");
    }
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/user/list`);
        if (response.data.success) {
          setMembers(response.data.users);
        } else {
          setError(response.data.message || "Failed to fetch members");
        }
      } catch (err) {
        setError("Failed to fetch members");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const downloadCSV = () => {
    // Create CSV content
    const headers = ["Name", "Email", "Contact Number", "Age", "Gender", "Membership Package"];
    const csvContent = [
      headers.join(","),
      ...members.map(member => [
        `"${member.name}"`,
        `"${member.email}"`,
        `"${member.contactNumber}"`,
        `"${member.age}"`,
        `"${member.gender}"`,
        `"${member.membershipType || ''}"`
      ].join(","))
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "members_list.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEmailClick = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const handlePaymentStatus = async (userId, status, userEmail) => {
    try {
      if (status === 'rejected') {
        // Delete user
        await axios.delete(`${backendUrl}/api/user/delete`, { data: { email: userEmail } });
        setMembers(members.filter(m => m._id !== userId));
      } else if (status === 'accepted') {
        // Accept and send email
        await axios.post(`${backendUrl}/api/user/payment-status`, { userId, status });
        await axios.post(`${backendUrl}/api/user/send-acceptance-email`, { userId });
        // Refresh members list
        const response = await axios.get(`${backendUrl}/api/user/list`);
        if (response.data.success) {
          setMembers(response.data.users);
        }
      }
    } catch (err) {
      alert('Failed to update payment status');
    }
  };

  const EmailIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-orange-500"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center py-12">
      <ToastContainer />
      <div className="w-full max-w-7xl">
        <div className="flex justify-between items-center mb-8 px-2 md:px-0">
          <h1 className="text-4xl font-bold text-white">All Members</h1>
          <div className="flex gap-3">
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
                title="Members Report"
                data={getReportData()}
                columns={reportColumns}
                fileName={`members_report_${new Date().toISOString().slice(0,10)}.pdf`}
              />
            ) : (
              <button
                onClick={downloadReport}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
              >
                <FaDownload />
                Download Report
              </button>
            )}
          </div>
        </div>
        <div className="bg-gray-800 shadow-2xl rounded-2xl border border-gray-700 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700 rounded-t-2xl">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Contact Number</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Age</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Membership Package</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Payment Receipt</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Accept</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Reject</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {members.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center text-gray-400 py-8">No members found</td>
                </tr>
              ) : (
                members.map((user, idx) => (
                  <tr key={idx} className="hover:bg-gray-700 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{user.contactNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{user.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{user.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{user.membershipType || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {user.paymentReceipt ? (
                        <a
                          href={`${backendUrl.replace(/\\$/, '')}/${user.paymentReceipt.replace(/\\/g, '/')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 hover:underline"
                        >
                          View Receipt
                        </a>
                      ) : (
                        <span className="text-gray-400">No Receipt</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white capitalize">{user.paymentStatus || 'pending'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handlePaymentStatus(user._id, 'accepted', user.email)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold shadow-md disabled:opacity-50"
                        disabled={user.paymentStatus === 'accepted'}
                        title="Accept Payment"
                      >
                        <FaCheck /> Accept
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handlePaymentStatus(user._id, 'rejected', user.email)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold shadow-md disabled:opacity-50"
                        disabled={user.paymentStatus === 'rejected'}
                        title="Reject Payment"
                      >
                        <FaTimes /> Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllMembers; 