import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import PaymentForm from '../components/PaymentForm';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Load Stripe outside of the component to avoid recreating it on every render
const stripePromise = loadStripe('pk_test_51OoHKuSJJwRYQZVPPXvRWqRWw5LRhGBDCrpkBHXUOvRNBLrLDr2HXGxPXHqpvEGPw8zxOJaFRrpNFtZwCPUGhHBX00vQxYPQEt');

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
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Checkout</h1>
          <Elements stripe={stripePromise}>
            <PaymentForm 
              clientSecret={clientSecret}
              orderId={orderId}
              onSuccess={handlePaymentSuccess}
              totalAmount={totalAmount}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default Checkout;