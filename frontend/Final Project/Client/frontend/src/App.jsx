import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Navbar from "./Components/Navbar";
import SignUp from "./Pages/SignUp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Components/Footer";
import Profile from "./Pages/Profile"; // Import Profile
import TrainerLogin from "./Pages/TrainerLogin";
import UpdateProfile from "./Pages/UpdateProfile";
import AllMembers from "./Pages/AllMembers";
import ViewTrainers from "./Pages/ViewTrainers";

import Collection from './pages/Collection';
import Product from './pages/Product';
import Order from './pages/Order';
import PlaceOrder from './pages/PlaceOrder';
import Cart from './pages/cart';
import Contact from './pages/contact';
import About from './pages/about';
import { ShopContextProvider } from './context/ShopContext'; // Import ShopContextProvider
import ProductList from './pages/admin/ProductList';
import OrderList from './pages/admin/OrderList';
import FooterUser from './components/FooterUser';
import NavbarUser from './components/NavbarUser';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} /> {/* Add profile route */}
            <Route path="/trainer-login" element={<TrainerLogin />} />
            <Route path="/update-profile" element={<UpdateProfile />} />
            <Route path="/members" element={<AllMembers />} />
            <Route path="/view-trainers" element={<ViewTrainers />} />
          </Routes>

      <ShopContextProvider> {/* Wrap everything inside this */}
        <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
          <Routes>
            <Route path='/shop' element={<Dashboard />} />
            <Route path='/collection' element={<Collection />} />
            <Route path='/product/:productId' element={<Product />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/order' element={<Order />} />
            <Route path='/place-order' element={<PlaceOrder />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/admin/products' element={<ProductList />} />
            <Route path='/admin/orders' element={<OrderList />} />
          </Routes>
        </div>
      </ShopContextProvider>
    </>
  );
};

export default App;








