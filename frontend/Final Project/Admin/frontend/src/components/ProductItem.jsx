import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price, bestSeller }) => {
  const { currency } = useContext(ShopContext);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Smart image URL handling
  const getImageSrc = () => {
    if (!image) return null;
    
    // Case 1: Already full URL (http/https)
    if (image.startsWith('http')) return image;
    
    // Case 2: Relative path from backend
    if (image.startsWith('/uploads/')) {
      return `${import.meta.env.VITE_BACKEND_URL}${image}`;
    }
    
    // Case 3: Local assets
    return `/assets/${image}`;
  };

  const imageSrc = getImageSrc();

  return (
    <Link 
      to={`/product/${id}`}
      className='group'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg'>
        {/* Product Image */}
        <div className='relative aspect-square overflow-hidden'>
          {imageSrc ? (
            <img 
              className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110'
              src={imageSrc}
              alt={name}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : null}
          
          {(!imageSrc || imageError) && (
            <div className='flex h-full items-center justify-center bg-gray-100 text-gray-400'>
              {imageError ? 'Image not available' : 'No image'}
            </div>
          )}

          {/* Best Seller Badge */}
          {bestSeller && (
            <div className='absolute top-2 right-2'>
              <span className='inline-flex items-center rounded-full bg-black px-2.5 py-0.5 text-xs font-medium text-white'>
                Best Seller
              </span>
            </div>
          )}

          {/* Quick View Overlay */}
          <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-20`}>
            <span className='rounded-full bg-white px-4 py-2 text-sm font-medium text-black opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
              Quick View
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className='p-4'>
          <h3 className='mb-1 text-sm font-medium text-gray-900 line-clamp-2'>{name}</h3>
          <p className='text-lg font-semibold text-black'>{currency} {price?.toLocaleString()}</p>
        </div>
      </div>
    </Link>
  );
}

export default ProductItem;