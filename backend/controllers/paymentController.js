import Stripe from "stripe";
import Order from "../models/orderModel.js";

// Initialize Stripe with proper error handling
let stripe;

try {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is missing from environment variables');
  }
  
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-04-10'
  });
  
  console.log('Stripe initialized successfully');
} catch (err) {
  console.error('Stripe initialization failed:', err);
  throw err; // Fail fast in production
}

// Create payment intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { items, email } = req.body;
    
    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty items array' });
    }
    
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Invalid email' });
    }

    // Calculate total amount
    const totalAmount = items.reduce((total, item) => {
      const itemPrice = Number(item.price);
      const itemQuantity = Number(item.quantity);
      
      if (isNaN(itemPrice) || isNaN(itemQuantity)) {
        throw new Error(`Invalid price or quantity for item ${item.id}`);
      }
      
      return total + (itemPrice * itemQuantity);
    }, 0);

    // Validate total amount
    if (totalAmount <= 0) {
      return res.status(400).json({ error: 'Invalid total amount' });
    }

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Stripe uses cents
      currency: "usd",
      metadata: { 
        integration_check: "accept_a_payment",
        email: email
      },
    });

    // Create order in database (status will be pending)
    const order = new Order({
      userEmail: email,
      products: items.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount,
      paymentId: paymentIntent.id,
    });

    await order.save();

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      orderId: order._id,
    });

  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error : undefined
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
    
    // Retrieve payment intent from Stripe
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