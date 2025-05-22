import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";

// Place COD order
const placeOrder = async (req, res) => {
    try {
        const { items, amount, address, customer, paymentMethod } = req.body;
        const lowStockItems = [];

        console.log('Processing order with items:', items); // Debug log

        // Update product quantities and check for low stock
        for (const item of items) {
            const product = await productModel.findById(item.id);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product with ID ${item.id} not found`
                });
            }

            console.log(`Product ${product.name} current quantity: ${product.quantity}`); // Debug log

            if (product.quantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient quantity for product: ${product.name}`
                });
            }

            // Decrement the quantity
            product.quantity -= item.quantity;
            await product.save();

            console.log(`Product ${product.name} new quantity: ${product.quantity}`); // Debug log

            // Check if quantity is low (less than 10)
            if (product.quantity < 10) {
                console.log(`Low stock alert for ${product.name}`); // Debug log
                lowStockItems.push({
                    productId: product._id,
                    name: product.name,
                    remainingQuantity: product.quantity
                });
            }
        }

        const orderData = {
            userId: '65f1a1b1b1b1b1b1b1b1b1b1', // Temporary user ID until auth is implemented
            items: items.map(item => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            amount,
            address,
            customer,
            paymentMethod: paymentMethod || 'COD',
            paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Completed'
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // If there are low stock items, include them in the response
        const response = {
            success: true,
            message: "Order placed successfully",
            order: newOrder
        };

        if (lowStockItems.length > 0) {
            console.log('Sending low stock alert with items:', lowStockItems); // Debug log
            response.lowStockAlert = {
                message: "Some items are running low on stock",
                items: lowStockItems
            };
        }

        console.log('Sending response:', response); // Debug log
        res.status(201).json(response);

    } catch (error) {
        console.error('Error in placeOrder:', error);
        res.status(500).json({
            success: false,
            message: "Error placing order",
            error: error.message
        });
    }
};

// Get all orders (for admin)
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching orders",
            error: error.message
        });
    }
};

const userOrders = async (req, res) => {
    try {
        const { email } = req.body;

        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with the provided email"
            });
        }

    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching user orders",
            error: error.message
        });
    }
};

// Update order status
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order status updated",
            order: updatedOrder
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating order status",
            error: error.message
        });
    }
};

// Place order with Stripe
const placeOrderStripe = async (req, res) => {
    try {
        const { items, amount, address, customer } = req.body;
        
        // For now, just create a regular order
        const orderData = {
            userId: '65f1a1b1b1b1b1b1b1b1b1b1', // Temporary user ID
            items: items.map(item => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            amount,
            address,
            customer,
            paymentMethod: 'Stripe',
            paymentStatus: 'Completed'
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully with Stripe",
            order: newOrder
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error placing order with Stripe",
            error: error.message
        });
    }
};

// Place order with Razorpay
const placeOrderRazorpay = async (req, res) => {
    try {
        const { items, amount, address, customer } = req.body;
        
        // For now, just create a regular order
        const orderData = {
            userId: '65f1a1b1b1b1b1b1b1b1b1b1', // Temporary user ID
            items: items.map(item => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            amount,
            address,
            customer,
            paymentMethod: 'Razorpay',
            paymentStatus: 'Completed'
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully with Razorpay",
            order: newOrder
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error placing order with Razorpay",
            error: error.message
        });
    }
};

export { 
    placeOrder, 
    placeOrderStripe, 
    placeOrderRazorpay, 
    allOrders, 
    userOrders, 
    updateStatus 
};