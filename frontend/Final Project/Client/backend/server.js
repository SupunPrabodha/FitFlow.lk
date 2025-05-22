import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import { connectCloudinary } from "./config/cloudinary.js";
import path from 'path';
import productRouter from './routes/productRoute.js';
import orderRouter from './routes/orderRoute.js';
import cartRouter from './routes/cartRoute.js';

import userRouter from "./routes/userRoutes.js";
import trainerRouter from "./routes/trainerRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();
connectCloudinary(); 

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve uploads folder as static
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/trainer', trainerRouter);
app.use('/api/user', userRouter);

// API Endpoints
console.log('Registering routes...');
app.use('/api/product', productRouter);
app.use('/api/order', orderRouter);
app.use('/api/cart', cartRouter);

// Log all registered routes
app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
      console.log(r.route.stack[0].method.toUpperCase() + ' ' + r.route.path);
  }
});

app.get('/', (req, res) => {
  res.send("API Working");
});

app.get("/", (req, res) => {
  res.send("API Working ");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
