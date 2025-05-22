import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import NavbarUser from '../components/NavbarUser';
import FooterUser from '../components/FooterUser';

const Cart = () => {
  const { 
    products, 
    currency, 
    cartItems, 
    removeFromCart, 
    clearCart, 
    addToCart, 
    delivery_fee
  } = useContext(ShopContext);
  
  const navigate = useNavigate();
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    
    for(const itemId in cartItems) {
      if(cartItems[itemId] > 0) {
        const product = products.find(p => p._id == itemId);
        if(product) {
          tempData.push({
            ...product,
            quantity: cartItems[itemId],
            total: product.price * cartItems[itemId]
          });
        }
      }
    }
    
    setCartData(tempData);
  }, [cartItems, products]);

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleClearCart = () => {
    if(window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const currentQuantity = cartItems[itemId] || 0;
    const quantityDifference = newQuantity - currentQuantity;
    
    if (quantityDifference > 0) {
      addToCart(itemId, quantityDifference);
    } else if (quantityDifference < 0) {
      removeFromCart(itemId, Math.abs(quantityDifference));
    }
  };

  const handleProceedToCheckout = () => {
    navigate('/place-order');
  };

  // Calculate subtotal
  const subtotal = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // Calculate total including delivery fee
  const total = subtotal + delivery_fee;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <NavbarUser/>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        {cartData.length > 0 && (
          <button 
            onClick={handleClearCart}
            className="flex items-center gap-2 text-red-600 hover:text-red-800"
          >
            <img src={assets.icons.bin_icon} alt="Clear cart" className="w-5 h-5" />
            Clear Cart
          </button>
        )}
      </div>
      
      {cartData.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <a href="/" className="text-blue-600 hover:underline">Continue Shopping</a>
        </div>
      ) : (
        <div className="space-y-4">
          {cartData.map(item => (
            <div key={item._id} className="border p-4 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-600">{currency} {item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border rounded">
                      <button 
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-gray-100"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-gray-100"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold">
                      {currency} {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleRemoveItem(item._id)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                    aria-label="Remove item"
                  >
                    <img src={assets.icons.bin_icon} alt="Remove" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="border-t pt-4 mt-6">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>{currency} {subtotal.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee:</span>
                <span>{currency} {delivery_fee.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2">
                <span>Total:</span>
                <span>{currency} {total.toLocaleString()}.00</span>
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={handleProceedToCheckout}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;