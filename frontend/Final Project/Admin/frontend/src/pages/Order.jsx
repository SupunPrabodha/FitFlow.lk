import React, { useRef } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Order = () => {
  const { currency } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;
  const orderRef = useRef(null);

  const downloadPDF = async () => {
    if (!orderRef.current) return;

    try {
      const canvas = await html2canvas(orderRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`order-${order?.orderId || 'temp'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (!order) {
    return (
      <div className="p-4 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">No Order Found</h2>
        <p className="text-gray-600 mb-4">Please place an order first.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // Validate required order data
  if (!order.items || !order.address || !order.customer) {
    return (
      <div className="p-4 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Invalid Order Data</h2>
        <p className="text-gray-600 mb-4">The order information is incomplete.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-8">
        <Title text1={'ORDER'} text2={'CONFIRMATION'} />
      </div>

      {/* Order Summary */}
      <div ref={orderRef} className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">Order #{order.orderId}</h2>
            <p className="text-gray-600">Placed on {order.date}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium mt-2 sm:mt-0 ${
            order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {order.status}
          </span>
        </div>

        {/* Order Items */}
        <div className="border-b pb-6 mb-6">
          <h3 className="font-medium mb-4">ITEMS</h3>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center gap-4">
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
                  {currency} {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Totals */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal:</span>
            <span>{currency} {order.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Delivery Fee:</span>
            <span>{currency} {order.deliveryFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2">
            <span>Total:</span>
            <span>{currency} {order.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Shipping and Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">SHIPPING ADDRESS</h3>
            <p className="text-gray-700">{order.customer.name}</p>
            <p className="text-gray-700">{order.address.street}</p>
            <p className="text-gray-700">{order.address.city}, {order.address.state} {order.address.zipcode}</p>
            <p className="text-gray-700">{order.address.country}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">PAYMENT METHOD</h3>
            <div className="flex items-center gap-2">
              <img 
                src={
                  order.paymentMethod === 'Stripe' ? assets.icons.stripe_icon :
                  order.paymentMethod === 'Razorpay' ? assets.icons.razorpay_icon :
                  assets.icons.service_icon
                } 
                alt={order.paymentMethod}
                className="h-6"
              />
              <span className="text-gray-700">{order.paymentMethod}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center space-x-4">
        <button 
          onClick={downloadPDF}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
        >
          DOWNLOAD PDF
        </button>
        <button 
          onClick={() => navigate('/')}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          CONTINUE SHOPPING
        </button>
      </div>
    </div>
  );
};

export default Order;