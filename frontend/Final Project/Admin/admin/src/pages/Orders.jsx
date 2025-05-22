import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:4000/api/order/admin/orders');
            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            setError(error.message);
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await axios.put('http://localhost:4000/api/order/admin/orders/status', {
                orderId,
                status: newStatus
            });
            if (response.data.success) {
                toast.success('Order status updated successfully');
                fetchOrders(); // Refresh orders after update
            }
        } catch (error) {
            toast.error('Failed to update order status');
        }
    };

    useEffect(() => {
        fetchOrders();
        // Refresh orders every 30 seconds
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-4">
            <ToastContainer />
            <h1 className="text-2xl font-bold mb-4">Order List</h1>
            <div className="space-y-6">
                {orders.map(order => (
                    <div key={order._id} className="border rounded-lg p-6 bg-white shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl font-semibold">Order #{order._id}</h2>
                                <p className="text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {order.status}
                                </span>
                                <select
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                    className="border rounded px-2 py-1 text-sm"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                                <h3 className="font-medium mb-2">CUSTOMER INFORMATION</h3>
                                <p className="text-gray-700">{order.customer.name}</p>
                                <p className="text-gray-700">{order.customer.email}</p>
                                <p className="text-gray-700">{order.customer.phone}</p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">SHIPPING ADDRESS</h3>
                                <p className="text-gray-700">{order.address.street}</p>
                                <p className="text-gray-700">{order.address.city}, {order.address.state} {order.address.zipcode}</p>
                                <p className="text-gray-700">{order.address.country}</p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="border-t pt-4">
                            <h3 className="font-medium mb-4">ORDER ITEMS</h3>
                            <div className="space-y-4">
                                {order.items.map(item => (
                                    <div key={item.productId} className="flex items-center gap-4">
                                        <img 
                                            src={item.image} 
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium">{item.name}</h4>
                                            <p className="text-gray-600">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="font-medium">
                                            ${(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="border-t pt-4 mt-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-600">Payment Method: {order.paymentMethod}</p>
                                    <p className="text-gray-600">Payment Status: {order.paymentStatus}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">Total: ${order.amount.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
