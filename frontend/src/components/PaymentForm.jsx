import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';

const PaymentForm = ({ clientSecret, orderId, onSuccess, totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [stripeLoaded, setStripeLoaded] = useState(false);

  useEffect(() => {
    if (stripe && elements) {
      setStripeLoaded(true);
    }
  }, [stripe, elements]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      setError('Payment system is still initializing. Please try again in a moment.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret, 
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        throw stripeError;
      }

      onSuccess(paymentIntent);
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || "Payment processing failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      {!stripeLoaded ? (
        <div className="text-center py-8">
          <div className="animate-pulse flex flex-col items-center space-y-4">
            <div className="h-12 w-12 bg-orange-600 rounded-full"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
          <p className="mt-4 text-gray-400">Initializing payment system...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border border-gray-700 rounded-lg p-4 bg-gray-900">
            <CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#f3f4f6',
                    '::placeholder': {
                      color: '#9ca3af',
                    },
                    iconColor: '#f59e0b',
                  },
                  invalid: {
                    color: '#ef4444',
                    iconColor: '#ef4444',
                  },
                },
                hidePostalCode: true,
              }} 
            />
          </div>
          
          {error && (
            <div className="text-red-400 text-sm p-3 bg-red-900/30 rounded-lg border border-red-800">
              {error}
              {error.includes('Stripe.js') && (
                <p className="mt-1 text-xs text-red-300">
                  Try refreshing the page if this persists.
                </p>
              )}
            </div>
          )}
          
          <button
            type="submit"
            disabled={!stripeLoaded || processing}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
              processing || !stripeLoaded
                ? 'bg-orange-800 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-700'
            }`}
          >
            {!stripeLoaded 
              ? 'Loading payment system...' 
              : processing 
                ? 'Processing...' 
                : `Pay $${totalAmount.toFixed(2)}`
            }
          </button>
        </form>
      )}
    </div>
  );
};

export default PaymentForm;