import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Collection from './pages/Collection';
import Product from './pages/Product';
import Order from './pages/Order';
import PlaceOrder from './pages/PlaceOrder';
import Cart from './pages/cart';
import Contact from './pages/contact';
import About from './pages/about';
import { ShopContextProvider } from './context/ShopContext'; // Import ShopContextProvider
import SearchBar from './components/SearchBar'; // Correct import
import ProductList from './pages/admin/ProductList';
import OrderList from './pages/admin/OrderList';
import FooterUser from './components/FooterUser';
import NavbarUser from './components/NavbarUser';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <ShopContextProvider> {/* Wrap everything inside this */}
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <NavbarUser />
        <Routes>
          <Route path='/user' element={<Dashboard />} />
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
        <FooterUser/>
      </div>
    </ShopContextProvider>
  );
}

export default App;
