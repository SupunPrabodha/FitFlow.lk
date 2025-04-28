import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import FeedbackContextProvider from './context/FeedbackContext';
import { CartProvider } from './context/CartContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Enhanced Stripe initialization
const initializeStripe = async () => {
  try {
    const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    
    // Validate the key format
    if (!stripeKey || !stripeKey.startsWith('pk_')) {
      throw new Error('Invalid Stripe publishable key format');
    }

    // Load Stripe with advanced options
    return await loadStripe(stripeKey, {
      betas: ['elements_enable_deferred_intent_beta_1'],
      apiVersion: '2024-06-20',
    });
  } catch (err) {
    console.error('Stripe initialization failed:', err);
    // Return null to gracefully degrade
    return null;
  }
};

// Initialize Stripe with error boundary
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <FeedbackContextProvider>
        <CartProvider>
          {/* Only render Elements if stripePromise is resolved */}
          {stripePromise ? (
            <Elements stripe={stripePromise}>
              <App />
            </Elements>
          ) : (
            <div className="p-4 text-red-500">
              Payment system unavailable. Please refresh or try again later.
            </div>
          )}
        </CartProvider>
      </FeedbackContextProvider>
    </BrowserRouter>
  </StrictMode>
);