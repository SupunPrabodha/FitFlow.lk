import React, { useState, useEffect, useContext, useRef } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const ProductList = () => {
    const { backendUrl } = useContext(ShopContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const previousProductsRef = useRef([]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendUrl}/api/product/list`);
            if (response.data.success) {
                // Check for products that went below 10 in quantity
                const newProducts = response.data.products;
                const previousProducts = previousProductsRef.current;

                newProducts.forEach(newProduct => {
                    const previousProduct = previousProducts.find(p => p._id === newProduct._id);
                    if (previousProduct && 
                        previousProduct.quantity >= 10 && 
                        newProduct.quantity < 10) {
                        toast.warning(`Low Stock Alert: ${newProduct.name} is running low (${newProduct.quantity} remaining)`, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        });
                    }
                });

                setProducts(newProducts);
                previousProductsRef.current = newProducts;
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch products initially and then every 30 seconds
    useEffect(() => {
        fetchProducts();
        const interval = setInterval(fetchProducts, 30000); // Check every 30 seconds
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-4">
            <ToastContainer />
            <h1 className="text-2xl font-bold mb-4">Product List</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(product => (
                    <div 
                        key={product._id} 
                        className={`border rounded-lg p-4 ${
                            product.quantity < 10 ? 'bg-red-50 border-red-200' : 'bg-white'
                        }`}
                    >
                        <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                        <p className="text-gray-600 mb-2">{product.description}</p>
                        <p className="font-bold mb-2">Price: ${product.price}</p>
                        <p className={`font-bold ${
                            product.quantity < 10 ? 'text-red-600' : 'text-green-600'
                        }`}>
                            Stock: {product.quantity}
                        </p>
                        {product.quantity < 10 && (
                            <p className="text-red-600 text-sm mt-2">
                                Low Stock Alert!
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList; 