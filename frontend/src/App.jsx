import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Home from "./Pages/Home";
import About from "./Pages/about";
import Contact from "./Pages/Contact";
import Feedback from "./Pages/Feedback";
import Login from "./Pages/Login";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import PlaceOrder from "./Pages/PlaceOrder";
import Orders from "./Pages/Orders";
import Navbar from "./components/Navbar";
import SignUp from "./Pages/SignUp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";
import Store from "./Pages/Store";
import Checkout from "./Pages/Checkout";
import ViewTrainers from "./Pages/ViewTrainers";
import Profile from "./Pages/Profile";
import TrainerLogin from "./Pages/TrainerLogin";
import UpdateProfile from "./Pages/UpdateProfile";
import Appointments from "./Pages/Appointments";
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ChatBot from './components/ChatBot';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="mx-auto max-w-[1920px]">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/trainers" element={
              <ProtectedRoute>
                <ViewTrainers />
              </ProtectedRoute>
            } />
            <Route path="/collection" element={<Store />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/tlogin" element={<TrainerLogin />} />
            <Route path="/update-profile" element={
              <ProtectedRoute>
                <UpdateProfile />
              </ProtectedRoute>
            } />
            <Route path="/appointments" element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            } />
          </Routes>
          <Footer />
          {user && <ChatBot />}
        </div>
        <ToastContainer 
          position="bottom-right"
          autoClose={3000}
          theme="dark"
        />
        <Toaster position="top-right" />
      </div>
    </CartProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;