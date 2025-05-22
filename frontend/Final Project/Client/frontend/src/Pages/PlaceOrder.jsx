import React, { useState } from 'react';
import Title from '../components/Title';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PlaceOrder = () => {
  const { cartItems, delivery_fee, currency, products, clearCart, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Calculate order summary
  const subtotal = Object.entries(cartItems).reduce((sum, [itemId, quantity]) => {
    const product = products.find(p => p._id == itemId);
    return sum + (product ? product.price * quantity : 0);
  }, 0);

  const total = subtotal + delivery_fee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form
      if (!Object.values(formData).every(val => val.trim() !== '')) {
        toast.error('Please fill in all fields');
        setIsSubmitting(false);
        return;
      }

      // Prepare order data
      const orderItems = Object.entries(cartItems).map(([itemId, quantity]) => {
        const product = products.find(p => p._id == itemId);
        return {
          id: product._id,
          name: product.name,
          price: product.price,
          quantity,
          image: product.image
        };
      });

      const orderData = {
        items: orderItems,
        amount: total,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipcode: formData.zipcode,
          country: formData.country
        },
        customer: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone
        },
        paymentMethod: paymentMethod === 'stripe' ? 'Stripe' : 
                      paymentMethod === 'razorpay' ? 'Razorpay' : 'Cash on Delivery'
      };

      // Make API call to place order
      const response = await axios.post(`${backendUrl}/api/order/`, orderData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Order Response:', response.data); // Debug log
      
      if (response.data.success) {
        toast.success('Order placed successfully!');
        clearCart();

        // Check for low stock alerts
        if (response.data.lowStockAlert) {
          console.log('Low Stock Alert:', response.data.lowStockAlert); // Debug log
          const lowStockMessage = response.data.lowStockAlert.items
            .map(item => `${item.name} (${item.remainingQuantity} remaining)`)
            .join(', ');
          toast.warning(`Low Stock Alert: ${lowStockMessage}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }

        // Navigate to order confirmation page
        navigate('/order', { 
          state: { 
            order: {
              ...orderData,
              orderId: response.data.order._id,
              date: new Date().toLocaleDateString(),
              status: 'Processing',
              subtotal,
              deliveryFee: delivery_fee,
              total
            }
          } 
        });
      } else {
        toast.error(response.data.message || 'Order submission failed');
      }
      
    } catch (error) {
      console.error('Order submission failed:', error);
      toast.error(error.response?.data?.message || 'Order submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className='flex flex-col sm:flex-row justify-between gap-8 pt-5 sm:pt-14 min-h-[80vh] border-t px-4 sm:px-8'>
        {/* Delivery Information Section */}
        <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
          <div className='text-xl sm:text-2xl my-3'>
            <Title text1={'DELIVERY'} text2={'INFORMATION'}/>
          </div>
          
          <div className='grid grid-cols-2 gap-4'>
            <div className='col-span-1'>
              <input 
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className='border border-gray-300 rounded py-2 px-4 w-full' 
                type="text" 
                placeholder='First name' 
                required
              />
            </div>
            <div className='col-span-1'>
              <input 
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className='border border-gray-300 rounded py-2 px-4 w-full' 
                type="text" 
                placeholder='Last name' 
                required
              />
            </div>
          </div>

          <div>
            <input 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className='border border-gray-300 rounded py-2 px-4 w-full' 
              type="email" 
              placeholder='Email address' 
              required
            />
          </div>

          <div>
            <input 
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              className='border border-gray-300 rounded py-2 px-4 w-full' 
              type="text" 
              placeholder='Street Address' 
              required
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <input 
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className='border border-gray-300 rounded py-2 px-4 w-full' 
                type="text" 
                placeholder='City' 
                required
              />
            </div>
            <div>
              <input 
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className='border border-gray-300 rounded py-2 px-4 w-full' 
                type="text" 
                placeholder='State' 
                required
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <input 
                name="zipcode"
                value={formData.zipcode}
                onChange={handleInputChange}
                className='border border-gray-300 rounded py-2 px-4 w-full' 
                type="text" 
                placeholder='Zipcode' 
                required
              />
            </div>
            <div>
              <input 
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className='border border-gray-300 rounded py-2 px-4 w-full' 
                type="text" 
                placeholder='Country' 
                required
              />
            </div>
          </div>

          <div>
            <input 
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className='border border-gray-300 rounded py-2 px-4 w-full' 
              type="tel" 
              placeholder='Phone Number' 
              required
            />
          </div>
        </div>

        {/* Order Summary Section */}
        <div className='w-full sm:w-96 mt-8 sm:mt-0'>
          <div className='border rounded-lg p-6 bg-gray-50'>
            <Title text1={'ORDER'} text2={'SUMMARY'}/>
            
            <div className='space-y-3 mt-4'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Subtotal:</span>
                <span>{currency} {subtotal.toFixed(2)}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Delivery Fee:</span>
                <span>{currency} {delivery_fee.toFixed(2)}</span>
              </div>
              <div className='border-t pt-3 flex justify-between font-bold'>
                <span>Total:</span>
                <span>{currency} {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className='mt-8'>
              <h3 className='font-bold mb-4'>PAYMENT METHOD</h3>
              <div className='grid grid-cols-1 gap-3'>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('stripe')}
                  className={`flex items-center justify-center gap-3 p-3 border rounded-lg transition-all ${paymentMethod === 'stripe' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  <img src={assets.icons.stripe_icon} alt="Stripe" className='h-6' />
                  <span>Stripe</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`flex items-center justify-center gap-3 p-3 border rounded-lg transition-all ${paymentMethod === 'razorpay' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  <img src={assets.icons.razorpay_icon} alt="Razorpay" className='h-6' />
                  <span>Razorpay</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex items-center justify-center gap-3 p-3 border rounded-lg transition-all ${paymentMethod === 'cash' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  <img src={assets.icons.service_icon} alt="Cash on Delivery" className='h-6' />
                  <span>Cash on Delivery</span>
                </button>
              </div>
            </div>

            {/* Place Order Button */}
            <button 
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className={`w-full bg-black text-white py-3 rounded-lg mt-8 hover:bg-gray-800 transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'PROCESSING...' : 'PLACE ORDER'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;