import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Appointment from "./pages/Appointment";
import Feedback from "./pages/Feedback";
import Plan from "./pages/Plan";
import Stock from "./pages/Stock";
import User from "./pages/User";
import Login from "./components/login";
import Add from "./pages/Add";
import List from "./pages/List";
import EditTrainer from "./pages/EditTrainer"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem("token", token);
    // Reset scroll position on route changes
    window.scrollTo(0, 0);
  }, [token]);

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar 
            setToken={setToken} 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
          />
          
          <div className="flex pt-16"> {/* pt-16 to account for fixed navbar height */}
            <Sidebar 
              open={sidebarOpen} 
              setOpen={setSidebarOpen} 
            />
            
            <div 
              className={`transition-all duration-300 min-h-[calc(100vh-4rem)] ${
                sidebarOpen ? 'ml-64' : 'ml-20'
              } w-full p-6`}
            >
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <Routes>
                  <Route path="/" element={<Navigate to="/feedback" />} />
                  <Route path="/appointment" element={<Appointment token={token} />} />
                  <Route path="/feedback" element={<Feedback token={token} />} />
                  <Route path="/plans" element={<Plan token={token} />} />
                  <Route path="/stock" element={<Stock token={token} />} />
                  <Route path="/users" element={<User token={token} />} />
                  <Route path="/add" element={<Add token={token} />} />
                  <Route path="/list" element={<List token={token} />} />
                  <Route path="/edit-trainer/:id" element={<EditTrainer token={token} />} />
                </Routes>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;