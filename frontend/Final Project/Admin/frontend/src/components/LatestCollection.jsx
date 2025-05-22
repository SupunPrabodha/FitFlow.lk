import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
    const { products } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        if (products && products.length > 0) {
            // Filter out invalid products and products with zero quantity
            const validProducts = products.filter(product => 
                product && 
                product._id && 
                product.image && 
                product.name &&
                product.quantity > 0 // Only include products with quantity > 0
            );
            setLatestProducts(validProducts.slice(0, 10));
        }
    }, [products]);

    return (
        <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={'LATEST'} text2={'COLLECTIONS'}/> 
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Discover top-quality supplements, gear, and essentials at the FitFlow Gym Store – fueling your fitness journey!
                </p>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {latestProducts.length > 0 ? (
                    latestProducts.map((product, index) => (
                        <ProductItem 
                            key={`${product._id}-${index}`}
                            id={product._id} 
                            image={product.image} 
                            name={product.name} 
                            price={product.price} 
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center py-10">No products available</p>
                )}
            </div>
        </div>
    );
};

export default LatestCollection;