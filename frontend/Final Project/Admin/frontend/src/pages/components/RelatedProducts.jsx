import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const RelatedProducts = ({ category, currentProductId, onProductClick }) => {
  const { products, currency, addToCart } = useContext(ShopContext);

  // Get related products (same category, excluding current product)
  const relatedProducts = products
    .filter(product => product.category === category && product._id !== currentProductId)
    .slice(0, 4); // Show up to 4 related products

  const handleAddToCart = (e, productId) => {
    e.stopPropagation(); // Prevent navigation when clicking the add to cart button
    addToCart(productId);
  };

  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-16 container mx-auto px-4">
      <Title text1={'RELATED'} text2={'PRODUCTS'} />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {relatedProducts.map((product) => (
          <div
            key={product._id}
            className="group cursor-pointer"
            onClick={() => onProductClick(product._id)}
          >
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <button
                onClick={(e) => handleAddToCart(e, product._id)}
                className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white py-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                Add to Cart
              </button>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-medium truncate">{product.name}</h3>
              <p className="text-sm font-bold mt-1">{currency} {product.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts; 