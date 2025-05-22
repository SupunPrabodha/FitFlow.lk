import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem'; // Assuming you have this component
import Title from './Title';

const RelatedProducts = ({ category }) => {
    const { products } = useContext(ShopContext);
    const [related, setRelated] = useState([]);

    useEffect(() => {
        if (products.length > 0) {
            const filtered = products.filter(item => category === item.category);
            setRelated(filtered.slice(0, 4)); // Show max 4 related products
        }
    }, [products, category]);

    return (
        <div className='my-24'>
            <div className='text-3xl text-center py-2'>
                <Title text1={'RELATED'} text2={"PRODUCTS"}/>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4 gap-y'>
            {related.map((item,index)=>(
                <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image}/>
            ))}
            </div>
        </div>
    );
};

export default RelatedProducts;