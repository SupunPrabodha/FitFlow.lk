import React, { useContext, useEffect, useState } from 'react';
import Title from './Title';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem'; 

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      // Filter best sellers and products with quantity > 0
      const bestProduct = products.filter((item) => 
        item.bestseller && item.quantity > 0
      );
      setBestSeller(bestProduct.slice(0, 5));
    }
  }, [products]);

  return (
    <div className='my-10'>
      <div className='text-center text-3xl py-8'>
        <Title text1={'BEST'} text2={'SELLERS'}/>
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
        These top-performing products are our gym's most-loved essentials—chosen repeatedly by fitness enthusiasts who demand quality and results  
        </p>
      </div>
      
      {/* Add product grid */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {bestSeller.length > 0 ? (
          bestSeller.map((product,index) => (
            <ProductItem 
              key={index} 
              id={product._id} 
              image={product.image} 
              name={product.name} 
              price={product.price}
              bestSeller={product.bestseller}
            />
          ))
        ) : (
          <p className="col-span-full text-center py-10">No best sellers available</p>
        )}
      </div>
    </div>
  );
};

export default BestSeller;  