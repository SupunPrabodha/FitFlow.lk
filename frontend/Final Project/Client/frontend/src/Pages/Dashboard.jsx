import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';
import OurPolicy from '../components/OurPolicy';
import NewsletterBox from '../components/NewsletterBox';
import HeroUser from '../components/HeroUser';
import NavbarUser from '../components/NavbarUser';
import FooterUser from '../components/FooterUser';

const Dashboard = () => {
    const { products, loading, error } = useContext(ShopContext);

    if (loading) return <div className="loading">Loading products...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="home-page">
            <NavbarUser/>
            <HeroUser products={products} />
            <div id="latest-collection">
                <LatestCollection products={products.slice(0, 8)} />
            </div>
            <BestSeller />
            <OurPolicy />
            <NewsletterBox />
            <FooterUser/>
        </div>
    );
};

export default Dashboard;