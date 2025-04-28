import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import feedbackRouter from "./routes/feedbackRoute.js";
import userRouter from "./routes/userRoute.js";
import trainerRouter from "./routes/trainerRoutes.js";
import paymentRouter from "./routes/paymentRoute.js";
import connectCloudinary from "./config/cloudinary.js";
import mongoose from "mongoose";

// Load environment variables first
dotenv.config({ path: '../.env' }); // Adjust path if needed

console.log('Environment Variables:', {
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 'Loaded' : 'Missing',
  MONGODB_URI: process.env.MONGODB_URI ? 'Loaded' : 'Missing',
  BACKEND_URL: process.env.VITE_BACKEND_URL
});

// Verify required environment variables
const requiredEnvVars = ['STRIPE_SECRET_KEY', 'MONGODB_URI', 'JWT_SECRET'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

const app = express();
const PORT = process.env.PORT || 4000;


// Enhanced CORS configuration
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.FRONTEND_URL
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token", "Stripe-Signature"],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to services
connectDB();
connectCloudinary();

// API Routes
app.use("/api/feedback", feedbackRouter);
app.use("/api/user", userRouter);
app.use("/api/trainer", trainerRouter);
app.use("/api/payment", paymentRouter); // Add this line for payment routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    services: {
      cloudinary: process.env.CLOUDINARY_NAME ? 'configured' : 'not configured',
      stripe: process.env.STRIPE_SECRET_KEY ? 'configured' : 'not configured'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Payment system ${process.env.STRIPE_SECRET_KEY ? 'ready' : 'not configured'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

export default app;