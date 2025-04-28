import React from "react";
import { Route, Routes } from "react-router-dom";
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
import Trainer from "./Pages/Trainer";
import Store from "./Pages/Store";
import Checkout from "./Pages/Checkout";

const App = () => {
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
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/trainers" element={<Trainer />} />
            <Route path="/collection" element={<Store />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
          <Footer />
        </div>
        <ToastContainer 
          position="bottom-right"
          autoClose={3000}
          theme="dark"
        />
      </div>
    </CartProvider>
  );
};

export default App;