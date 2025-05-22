import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const ProductItem = ({ id, name, price, image, category }) => {
  const { currency, addToCart } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(id);
  };

  return (
    <div 
      className="group cursor-pointer"
      onClick={handleProductClick}
    >
      <div className="relative overflow-hidden rounded-lg aspect-square">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          onClick={handleAddToCart}
          className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white py-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          Add to Cart
        </button>
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-medium truncate">{name}</h3>
        <p className="text-sm font-bold mt-1">{currency} {price.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ProductItem; 