import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, removeFromCart, updateQuantity, totalAmount, totalItems } = useCart();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />
      
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-gray-800 shadow-xl z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Cart ({totalItems})</h2>
            <button 
              onClick={toggleSidebar}
              className="text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <p className="text-lg mb-4">Your cart is empty</p>
              <button 
                onClick={toggleSidebar}
                className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="py-4 border-b border-gray-700 flex justify-between">
                    <div className="flex">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="h-16 w-16 object-cover rounded"
                      />
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-white">{item.name}</h3>
                        <p className="text-sm text-orange-500">${item.price}</p>
                        <div className="flex items-center mt-2">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 text-gray-400 hover:text-white"
                          >
                            -
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 text-gray-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between text-lg font-bold mb-4">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={toggleSidebar}
                  className="block w-full bg-orange-600 hover:bg-orange-700 text-white text-center py-2 px-4 rounded"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;