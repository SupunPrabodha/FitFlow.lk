import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartSidebar from '../components/CartSidebar';

// Import local images
import proteinPowder from '../assets/images/protein-powder.jpg';
import adjustableDumbbell from '../assets/images/adjustable-dumbbell.jpg';
import treadmill from '../assets/images/treadmill.jpg';
import yogaMat from '../assets/images/yoga-mat.jpg';
import resistanceBands from '../assets/images/resistance-bands.jpg';
import kettlebell from '../assets/images/kettlebell.jpg';

const Store = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { addToCart, totalItems } = useCart();

  // Sample product data
  const products = [
    {
      id: 1,
      name: "Premium Protein Powder",
      price: 17700, // Approx. $59.99 converted to LKR at 1 USD = 295 LKR
      category: "supplements",
      image: proteinPowder,
      description: "High-quality whey protein with 24g protein per serving"
    },
    {
      id: 2,
      name: "Adjustable Dumbbell Set",
      price: 73750, // Approx. $249.99 converted to LKR at 1 USD = 295 LKR
      category: "equipment",
      image: adjustableDumbbell,
      description: "5-50lb adjustable dumbbells in a compact design"
    },
    {
      id: 3,
      name: "Motorized Treadmill",
      price: 239000, // Based on Eser Marketing pricing for treadmills
      category: "equipment",
      image: treadmill,
      description: "High-performance treadmill with adjustable incline and digital display"
    },
    {
      id: 4,
      name: "Premium Yoga Mat",
      price: 5900, // Based on typical pricing for yoga mats in Sri Lanka
      category: "equipment",
      image: yogaMat,
      description: "Non-slip, eco-friendly yoga mat for enhanced comfort and grip"
    },
    {
      id: 5,
      name: "Resistance Band Set",
      price: 4900, // Based on Eser Marketing pricing for fitness accessories
      category: "equipment",
      image: resistanceBands,
      description: "Set of 5 resistance bands for strength training and flexibility"
    },
    {
      id: 6,
      name: "16kg Kettlebell",
      price: 12500, // Based on typical pricing for kettlebells in Sri Lanka
      category: "equipment",
      image: kettlebell,
      description: "Cast iron kettlebell for full-body strength workouts"
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gray-900 min-h-screen text-gray-300">
      {/* Store Header */}
      <div className="bg-gray-800 py-6 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-500">FITFLOW PRO SHOP</h1>
        <div className="flex items-center space-x-4">
          <Link 
            to="/checkout" 
            className="relative bg-orange-600 p-2 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Store Content */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-lg ${activeCategory === "all" ? "bg-orange-600" : "bg-gray-800"}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveCategory("equipment")}
              className={`px-4 py-2 rounded-lg ${activeCategory === "equipment" ? "bg-orange-600" : "bg-gray-800"}`}
            >
              Equipment
            </button>
            <button
              onClick={() => setActiveCategory("supplements")}
              className={`px-4 py-2 rounded-lg ${activeCategory === "supplements" ? "bg-orange-600" : "bg-gray-800"}`}
            >
              Supplements
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
              <div className="h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-white">{product.name}</h3>
                <p className="text-orange-500 font-bold my-2">Rs {product.price}</p>
                <p className="text-gray-400 mb-4">{product.description}</p>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  );
};

export default Store;