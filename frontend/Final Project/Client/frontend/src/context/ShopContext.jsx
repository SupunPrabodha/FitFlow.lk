import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const ShopContext = createContext();

export const ShopContextProvider = ({ children }) => {
    const [currency, setCurrency] = useState('Rs');
    const delivery_fee = 150;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(true);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const getProductsData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendUrl}/api/product/list`);
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                setError(response.data.message || 'Failed to load products');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Cart functions remain the same
    const addToCart = (itemId) => {
        setCartItems(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    };

    const removeFromCart = (itemId) => {
        setCartItems(prev => {
            const newCart = { ...prev };
            if (newCart[itemId] > 1) newCart[itemId] -= 1;
            else delete newCart[itemId];
            return newCart;
        });
    };

    const clearItem = (itemId) => {
        setCartItems(prev => {
            const newCart = { ...prev };
            delete newCart[itemId];
            return newCart;
        });
    };

    const clearCart = () => setCartItems({});

    const getCartTotalItems = () => Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);

    const getCartTotalPrice = () => Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
        const product = products.find(p => p._id == itemId);
        return total + (product ? product.price * quantity : 0);
    }, 0);

    const getCartCount = () => Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);

    useEffect(() => {
        getProductsData();
    }, []);

    const value = {
        currency,
        setCurrency,
        delivery_fee,
        products,
        loading,
        error,
        search, 
        setSearch, 
        showSearch, 
        setShowSearch,
        cartItems,
        addToCart,
        removeFromCart,
        clearItem,
        clearCart,
        getCartTotalItems,
        getCartTotalPrice,
        getCartCount,
        navigate,
        backendUrl
    };

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
};