import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import { connectCloudinary } from './config/cloudinary.js';
import productRouter from './routes/productRoute.js';
import orderRouter from './routes/orderRoute.js';
import cartRouter from './routes/cartRoute.js';

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Connect Databases
console.log('Connecting to databases...');
connectDB();
connectCloudinary();  //  Connect Cloudinary

// Middlewares
app.use(express.json());
app.use(cors());

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

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

app.post('/api/user/admin', (req, res) => {
    res.json({ success: true, token: "sample_token" });
});

app.listen(port, () => {
    console.log(`Server started on PORT : ${port}`);
    console.log('Available routes:');
    app._router.stack.forEach(function(r){
        if (r.route && r.route.path){
            console.log(r.route.stack[0].method.toUpperCase() + ' ' + r.route.path);
        }
    });
});

///