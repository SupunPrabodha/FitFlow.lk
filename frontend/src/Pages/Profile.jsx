import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import jsPDF from "jspdf";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const userEmail = localStorage.getItem("userEmail");
      const storedUserData = localStorage.getItem("userData");

      if (!userEmail || !storedUserData) {
        toast.error("Please log in to view your profile", {
          position: "bottom-right",
          autoClose: 3000,
        });
        navigate("/login");
        return;
      }

      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("userData");
        localStorage.removeItem("userEmail");
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/user/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userData.email }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Clear all auth data
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userData");
        
        toast.success("Profile deleted successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        toast.error(data.message || "Failed to delete profile.");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to delete profile. Please try again.");
    }
  };

  const handleDownloadPDF = () => {
    if (!userData) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("User Profile", 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${userData.name || ""}`, 20, 40);
    doc.text(`Email: ${userData.email || ""}`, 20, 50);
    doc.text(`Contact Number: ${userData.contact || ""}`, 20, 60);
    doc.text(`Age: ${userData.age || ""}`, 20, 70);
    doc.text(`Gender: ${userData.gender || ""}`, 20, 80);
    doc.save("profile.pdf");
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 shadow-xl rounded-xl p-8 border border-gray-700 relative">
        <button
          className="absolute top-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-colors duration-200 flex items-center justify-center"
          onClick={handleDownloadPDF}
          title="Download as PDF"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5m-4.5 4.5V3" />
          </svg>
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">Hi {userData.name || "User"} <span role="img" aria-label="wave">👋</span></h1>
      
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Name</label>
            <div className="text-lg font-semibold text-white bg-gray-700 rounded px-4 py-2">{userData.name || "Not set"}</div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Email</label>
            <div className="text-lg font-semibold text-white bg-gray-700 rounded px-4 py-2">{userData.email || "Not set"}</div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Contact Number</label>
            <div className="text-lg font-semibold text-white bg-gray-700 rounded px-4 py-2">{userData.contact || "Not set"}</div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Age</label>
            <div className="text-lg font-semibold text-white bg-gray-700 rounded px-4 py-2">{userData.age || "Not set"}</div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Gender</label>
            <div className="text-lg font-semibold text-white bg-gray-700 rounded px-4 py-2">{userData.gender || "Not set"}</div>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-8">
          <button 
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200" 
            onClick={() => navigate('/update-profile')}
          >
            Edit Profile
          </button>
          <button 
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200" 
            onClick={handleDeleteProfile}
          >
            Delete Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;