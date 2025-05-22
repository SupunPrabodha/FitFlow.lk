import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';

function PaymentForm({ clientSecret, orderId, onSuccess, totalAmount }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            // Add any billing details if needed
          },
        },
      });

      if (error) {
        setPaymentError(error.message);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
        await axios.post(`${backendUrl}/api/payment/confirm-payment`, {
          paymentId: paymentIntent.id,
          orderId: orderId
        });

        clearCart();
        onSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(error.response?.data?.error || error.message || 'An error occurred while processing your payment.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Payment Details</h2>
        <div className="bg-gray-800 p-4 rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#ffffff',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {paymentError && (
        <div className="bg-red-500 text-white p-4 rounded-lg">
          {paymentError}
        </div>
      )}

      <div className="bg-gray-700 rounded-lg p-6">
        <div className="flex justify-between text-white">
          <p className="font-semibold">Total Amount:</p>
          <p className="font-semibold">${totalAmount.toFixed(2)}</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing || !clientSecret}
        className={`w-full py-3 px-4 rounded-lg text-white font-semibold ${
          !stripe || isProcessing || !clientSecret
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-orange-600 hover:bg-orange-700'
        }`}
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default PaymentForm;