import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import PaymentForm from '../components/PaymentForm';
import axios from 'axios';

const Checkout = () => {
  const { cart, totalAmount, clearCart } = useCart();
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (cart.length === 0) {
      setError("Your cart is empty");
      setLoading(false);
      return;
    }

    const createPaymentIntent = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail') || 'guest@example.com';
        
        // Safely get backend URL with fallback
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
        
        if (!backendUrl) {
          throw new Error('Backend URL is not configured');
        }

        const response = await axios.post(
          `${backendUrl}/api/payment/create-payment-intent`, 
          {
            items: cart.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
            email: userEmail,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        if (!response.data.clientSecret) {
          throw new Error('Missing client secret in response');
        }

        setClientSecret(response.data.clientSecret);
        setOrderId(response.data.orderId);
        setLoading(false);
      } catch (err) {
        console.error("Payment error details:", {
          error: err,
          response: err.response,
          config: err.config
        });
        setError(err.response?.data?.error || err.message || "Payment failed");
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [cart]);
  
  const handlePaymentSuccess = () => {
    clearCart();
    setPaymentCompleted(true);
    setTimeout(() => navigate('/store'), 3000);
  };

  if (paymentCompleted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
          <p className="text-gray-700">Thank you for your purchase.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Processing your order...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => navigate('/collection')}
            className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700"
          >
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h2>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => (
                <li key={item.id} className="py-4 flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
              <p className="text-base font-medium text-gray-900">Total</p>
              <p className="text-base font-medium text-gray-900">${totalAmount.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
            {clientSecret && (
              <PaymentForm 
                clientSecret={clientSecret}
                orderId={orderId}
                onSuccess={handlePaymentSuccess}
                totalAmount={totalAmount}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;