import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import {assets} from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const product = products.find(item => item._id == productId);
    setProductData(product || null);
    window.scrollTo(0, 0);
  }, [productId, products]);

  if (!productData) return <div className='min-h-screen pt-20'>Loading...</div>;

  const handleRelatedProductClick = (newProductId) => {
    navigate(`/product/${newProductId}`);
  };

  return (
    <div className='border-t-2 pt-10'>
      <div className='container mx-auto px-4'>
        <div className='flex gap-8 flex-col lg:flex-row'>
          {/* Main Product Image - Now with max-width */}
          <div className='lg:w-1/2 max-w-[300px] mx-auto'>
            <img 
              src={productData.image} 
              className='w-full h-auto rounded-lg shadow-md'
              alt={productData.name}
            />
          </div>
          
          {/* Product Details (unchanged) */}
          <div className='lg:w-1/2 space-y-6'>
            <div className="flex items-center pl-2">
              <img 
                src={assets.icons.star_icon} 
                className='w-[40px] h-[30px] mr-1'  
                alt="star rating"
              />
              <p>(122)</p>
            </div>

            <h1 className='text-3xl font-bold'>{productData.name}</h1>
            <p className='text-2xl font-semibold'>
              {currency} {productData.price?.toLocaleString()}
            </p>
            
            <div className='border-t pt-4'>
              <h2 className='text-lg font-medium'>Category</h2>
              <p className='capitalize'>{productData.category}</p>
            </div>

            {productData.description && (
              <div className='border-t pt-4'>
                <h2 className='text-lg font-medium'>Description</h2>
                <p className='text-gray-600'>{productData.description}</p>
              </div>
            )}

            <div className='border-t pt-4'>
              <button onClick={()=>addToCart(productData._id)} className='w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors'>
                Add to Cart
              </button>
              <hr className='mt-8 sm:w-4/5' />
              <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
                <p>100% original product</p>
                <p>Cash on delivery is available on this product</p>
                <p>Easy return and exchange policy within 7 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*-------- Description & review section --------*/}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'> Description </b>
          <p className='border px-5 py-3 text-sm'> Reviews (122) </p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-gray-500'>
          <p>This premium fitness product from FitFlow is designed to help you maximize your workouts and achieve better results. Crafted with high-quality materials and innovative design, it offers exceptional durability and performance whether you're training at home or in the gym. The ergonomic construction ensures comfort during use while promoting proper form and technique. Ideal for all fitness levels - from beginners to advanced athletes - it helps enhance strength, endurance, and overall workout effectiveness. Easy to maintain and store, this essential piece of equipment will become a valuable part of your fitness routine. All FitFlow products come with our 1-year satisfaction guarantee, so you can shop with confidence knowing you're investing in quality. Pair with our recommended workout programs (available on our website) for optimal results. Elevate your training experience with this professional-grade fitness solution.</p>
          <p></p>
        </div>
      </div>

      {/*------------------display related products--------------*/}
      <RelatedProducts 
        category={productData.category} 
        currentProductId={productData._id}
        onProductClick={handleRelatedProductClick}
      />
    </div>
  );
};

export default Product;