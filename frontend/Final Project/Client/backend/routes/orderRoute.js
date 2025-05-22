import express from 'express';
import { 
    placeOrder, 
    placeOrderStripe, 
    placeOrderRazorpay, 
    allOrders, 
    userOrders, 
    updateStatus, 
} from '../controllers/orderController.js';

const router = express.Router();

// Admin routes
router.get('/admin/orders', allOrders);
router.put('/admin/orders/status', updateStatus);

// User routes
router.post('/', placeOrder);
router.get('/user', userOrders);
router.post('/stripe', placeOrderStripe);
router.post('/razorpay', placeOrderRazorpay);

export default router;