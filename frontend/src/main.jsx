import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import FeedbackContextProvider from './context/FeedbackContext';
import { CartProvider } from './context/CartContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe if key is available
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

// Wrap app with Stripe Elements only if stripe is initialized
const StripeWrapper = ({ children }) => {
  if (!stripePromise) {
    console.warn('Stripe is not initialized. Payment features will be disabled.');
    return children;
  }
  return <Elements stripe={stripePromise}>{children}</Elements>;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <FeedbackContextProvider>
        <CartProvider>
          <StripeWrapper>
            <App />
          </StripeWrapper>
        </CartProvider>
      </FeedbackContextProvider>
    </BrowserRouter>
  </StrictMode>
);