import Stripe from "stripe";
import Order from "../models/orderModel.js";

let stripe;

try {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is missing from environment variables');
  }

  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16'
  });

  console.log('Stripe initialized successfully');
} catch (err) {
  console.error('Stripe initialization failed:', err);
  throw err;
}

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      error: 'Failed to create payment intent',
      details: error.message
    });
  }
};

// Confirm payment
export const confirmPayment = async (req, res) => {
  try {
    const { paymentId, orderId } = req.body;

    if (!paymentId || !orderId) {
      return res.status(400).json({ error: 'Missing paymentId or orderId' });
    }

    // Retrieve payment
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);

    // Update order status in database
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: paymentIntent.status,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      success: true,
      order,
      paymentStatus: paymentIntent.status
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};