import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const FeedbackSlides = ({ 
  feedbacks = [], 
  selectedCategory,
  setSelectedCategory,
  ratingFilter,
  setRatingFilter,
  sortOrder,
  setSortOrder,
  cardClassName = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Star Rating
  const StarRating = ({ rating, size = "sm" }) => {
    const sizes = {
      sm: "w-5 h-5",
      md: "w-7 h-7",
      lg: "w-9 h-9"
    };
    
    return (
      <div className="flex items-center">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`${sizes[size]} mx-0.5`}
              fill={star <= rating ? "#FF5E1F" : "#4A5568"}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>
        <span className="ml-2 text-gray-300 text-sm">{rating}/5</span>
      </div>
    );
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 5000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const filteredFeedbacks = feedbacks
    .filter((feedback) => {
      // Search filter
      const matchesSearch = 
        feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.review.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = 
        selectedCategory === "all" || feedback.category === selectedCategory;
      
      // Rating filter
      const matchesRating = 
        ratingFilter === "all" || 
        (ratingFilter === "lowRating" && feedback.rating <= 3) ||
        (ratingFilter === "highRating" && feedback.rating > 3);
      
      return matchesSearch && matchesCategory && matchesRating;
    })
    .sort((a, b) => {
      if (sortOrder === "ascending") return a.rating - b.rating;
      if (sortOrder === "descending") return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="w-full mx-auto px-4">
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search feedbacks..."
            className="w-full border border-gray-700 bg-gray-800 text-white p-3 pl-10 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg 
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>

        {/* Category */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory && setSelectedCategory(e.target.value)}
          className="border border-gray-700 bg-gray-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all" className="bg-gray-800">All Categories</option>
          <option value="service" className="bg-gray-800">Training Programs</option>
          <option value="product" className="bg-gray-800">Gym Facilities</option>
          <option value="staff" className="bg-gray-800">Staff</option>
          <option value="equipment" className="bg-gray-800">Equipment</option>
        </select>

        {/* Rating */}
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter && setRatingFilter(e.target.value)}
          className="border border-gray-700 bg-gray-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all" className="bg-gray-800">All Ratings</option>
          <option value="highRating" className="bg-gray-800">High Ratings (4-5)</option>
          <option value="lowRating" className="bg-gray-800">Low Ratings (1-3)</option>
        </select>

        {/* Sort Order */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder && setSortOrder(e.target.value)}
          className="border border-gray-700 bg-gray-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="descending" className="bg-gray-800">Highest Rated</option>
          <option value="ascending" className="bg-gray-800">Lowest Rated</option>
        </select>
      </div>

      <style>{`
        .slick-dots li button:before {
          color: white;
          opacity: 0.5;
          font-size: 10px;
        }
        .slick-dots li.slick-active button:before {
          color: #FF5E1F;
          opacity: 1;
        }
      `}</style>

      {filteredFeedbacks.length > 0 ? (
        <div className="max-w-6xl mx-auto">
          <Slider {...sliderSettings} className="px-4">
            {filteredFeedbacks.map((feedback) => (
              <div key={feedback._id} className={`px-2 ${cardClassName}`}>
                <div className="bg-gray-800 p-6 shadow-xl rounded-xl border border-gray-700 h-full hover:border-orange-500 transition-colors duration-200">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-white">{feedback.name}</h3>
                    <span className="text-gray-400 text-sm">{new Date(feedback.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-300 break-words mb-3">{feedback.review}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 capitalize">{feedback.category}</span>
                    <StarRating rating={feedback.rating} size="sm" />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 text-center max-w-2xl mx-auto">
          <p className="text-gray-400 text-lg">No feedback available for this selection.</p>
        </div>
      )}
    </div>
  );
};

export default FeedbackSlides;