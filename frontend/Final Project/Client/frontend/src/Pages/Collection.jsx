import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from '../components/ProductItem';
import Title from '../components/Title';
import NavbarUser from '../components/NavbarUser';
import FooterUser from '../components/FooterUser';

const Collection = () => {
  const { products } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [sortOption, setSortOption] = useState('relevant');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically get all unique categories from products
  const categories = [...new Set(products?.map(product => product.category).filter(Boolean))];

  // Apply search, filtering and sorting
  useEffect(() => {
    if (!products) return;

    let filtered = [...products];
    
    // 0. Filter out products with zero quantity
    filtered = filtered.filter(product => product.quantity > 0);
    
    // 1. Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // 2. Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        product.category && selectedCategories.includes(product.category)
      );
    }

    // 3. Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch(sortOption) {
        case 'low-high': 
          return a.price - b.price;
        case 'high-low':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default: // 'relevant'
          return 0;
      }
    });

    setFilterProducts(filtered);
    console.log('Filtered products images:', filtered.map(p => p.image)); // Add this line

  }, [products, selectedCategories, sortOption, searchQuery]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSearchQuery('');
    setSortOption('relevant');
  };

  return (
    <>
      <NavbarUser/>
      <div className='flex flex-col'>
        {/* Search Bar Section */}
        <div className='sticky top-0 bg-white z-10 py-4 border-b'>
          <div className='container mx-auto px-4'>
            <div className='relative max-w-2xl mx-auto'>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className='w-full border-2 border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-blue-500 transition-colors'
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-10 pt-10 border-t container mx-auto px-4'>
          {/* Filter Section */}
          <div className='min-w-60'>
            <div className='flex justify-between items-center'>
              <p 
                className='my-2 text-xl flex items-center cursor-pointer gap-2' 
                onClick={() => setShowFilter(!showFilter)}
              >
                FILTERS
              </p>
              {(selectedCategories.length > 0 || searchQuery || sortOption !== 'relevant') && (
                <button 
                  onClick={clearAllFilters}
                  className='text-sm text-blue-600 hover:underline'
                >
                  Clear all
                </button>
              )}
            </div>
            
            <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'}`}>
              <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
              <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                {categories.map((category) => (
                  <label key={category} className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className='w-4 h-4 rounded text-blue-600 focus:ring-blue-500'
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className='flex-1'>
            <div className='flex justify-between items-center mb-4'>
              <Title text1={'All'} text2={'COLLECTIONS'} />
              <div className='flex items-center gap-4'>
                <span className='text-sm text-gray-600 hidden sm:inline'>Sort by:</span>
                <select 
                  className='border-2 border-gray-300 text-sm px-3 py-1 rounded focus:outline-none focus:border-blue-500'
                  value={sortOption}
                  onChange={handleSortChange}
                >
                  <option value="relevant">Relevance</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategories.length > 0 || searchQuery) && (
              <div className='flex flex-wrap gap-2 mb-6'>
                {selectedCategories.map(category => (
                  <span 
                    key={category} 
                    className='bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-1'
                  >
                    {category}
                    <button 
                      onClick={() => handleCategoryChange(category)}
                      className='text-gray-500 hover:text-gray-700'
                    >
                      ×
                    </button>
                  </span>
                ))}
                {searchQuery && (
                  <span className='bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-1'>
                    Search: "{searchQuery}"
                    <button 
                      onClick={() => setSearchQuery('')}
                      className='text-gray-500 hover:text-gray-700'
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Products Grid */}
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-8'>
              {filterProducts.length > 0 ? (
                filterProducts.map((item) => (
                  <ProductItem 
                    key={item._id} 
                    id={item._id}
                    name={item.name}
                    price={item.price}
                    image={item.image}
                    category={item.category}
                  />

                ))
              ) : (
                <div className="col-span-full text-center py-16 text-gray-500">
                  {searchQuery.trim() 
                    ? "No products match your search"
                    : selectedCategories.length > 0 
                      ? "No products match the selected categories"
                      : "No products available"}
                  <div className='mt-4'>
                    <button
                      onClick={clearAllFilters}
                      className='text-blue-600 hover:underline'
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <FooterUser/>
    </>
  );
};

export default Collection;