import React, { useContext, useState, useEffect } from "react";
import { FeedbackContext } from "../context/FeedbackContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../components/Modal";
import FeedbackSlides from "../components/FeedbackSlides";
import { useNavigate } from "react-router-dom";

const Feedback = () => {
  const navigate = useNavigate();
  const { feedbacks, removeFeedback, updateFeedback } = useContext(FeedbackContext);
  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    email: "",
    category: "",
    review: "",
    rating: 3,
  });
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showMyFeedbacks, setShowMyFeedbacks] = useState(false);
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [expandedFeedbackId, setExpandedFeedbackId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("descending");

  // Separate authentication check
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const userData = localStorage.getItem('userData');

    if (!userEmail || !userData) {
      toast.error("Please log in to submit feedback", {
        position: "bottom-right",
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }

    const parsedUserData = JSON.parse(userData);
    setFeedbackForm(prev => ({
      ...prev,
      email: userEmail,
      name: parsedUserData.name || ""
    }));
  }, []); // Empty dependency array as this should only run once on mount

  // Separate effect for filtering feedbacks
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail && feedbacks.length > 0) {
      const filtered = feedbacks.filter((f) => f.email === userEmail);
      setMyFeedbacks(filtered);
    }
  }, [feedbacks]); // Only depend on feedbacks changes

  // Custom Star Rating Component
  const StarRating = ({ rating, setRating, size = "md", readOnly = false }) => {
    const sizes = {
      sm: "w-5 h-5",
      md: "w-7 h-7",
      lg: "w-9 h-9"
    };
    
    return (
      <div className="flex items-center justify-center mb-4">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              onClick={() => !readOnly && setRating(star)}
              className={`${sizes[size]} mx-0.5 ${readOnly ? '' : 'cursor-pointer'} transition-colors duration-200`}
              fill={star <= rating ? "#FF5E1F" : "#4A5568"}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>
        <span className="ml-2 text-gray-300">{rating}/5</span>
      </div>
    );
  };

  const handleInputChange = (e) => {
    setFeedbackForm({
      ...feedbackForm,
      [e.target.name]: e.target.value,
    });
  };

  const toggleMyFeedbacks = () => {
    setShowMyFeedbacks(!showMyFeedbacks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedbackForm.name || !feedbackForm.email || !feedbackForm.category || !feedbackForm.review) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/feedback/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackForm),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Feedback submitted successfully!");
        setFeedbackForm({
          name: "",
          email: "",
          category: "",
          review: "",
          rating: 3,
        });
      } else {
        toast.error(data.message || "Failed to submit feedback.");
      }
    } catch (error) {
      toast.error("Error submitting feedback.");
      console.error("Error submitting feedback:", error);
    }
  };

  const handleDelete = (feedbackId) => {
    const email = feedbackForm.email;

    if (!email) {
      toast.error("Email is required to delete feedback.");
      return;
    }

    fetch(`http://localhost:4000/api/feedback/remove/${feedbackId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          removeFeedback(feedbackId, email);
          toast.success("Feedback deleted successfully!");
          setExpandedFeedbackId(null);
        } else {
          toast.error(data.message || "Failed to delete feedback.");
        }
      })
      .catch((error) => {
        toast.error("Error deleting feedback.");
        console.error("Error deleting feedback:", error);
      });
  };

  const handleEdit = (feedback) => {
    setSelectedFeedback(feedback);
    setFeedbackForm({
      name: feedback.name,
      email: feedback.email,
      category: feedback.category,
      review: feedback.review,
      rating: feedback.rating,
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!feedbackForm.name || !feedbackForm.email || !feedbackForm.category || !feedbackForm.review) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/feedback/update/${selectedFeedback._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: feedbackForm.email,
          review: feedbackForm.review,
          rating: feedbackForm.rating,
        }),
      });

      const data = await response.json();

      if (data.success) {
        updateFeedback(selectedFeedback._id, feedbackForm);
        toast.success("Feedback updated successfully!");
        setSelectedFeedback(null);
        setIsModalOpen(false);
      } else {
        toast.error(data.message || "Failed to update feedback.");
      }
    } catch (error) {
      toast.error("Error updating feedback.");
      console.error("Error updating feedback:", error);
    }
  };

  return (
    <div className="flex flex-col gap-10 pt-10 items-center bg-gray-900 min-h-screen relative">
      {/* Toast Container - positioned at top-right */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: "#1F2937",
          border: "1px solid #374151",
          borderRadius: "0.375rem",
          margin: "0.5rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        }}
      />

      {/* Feedback Slides */}
      <FeedbackSlides 
        feedbacks={feedbacks}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        ratingFilter={ratingFilter}
        setRatingFilter={setRatingFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {/* Feedback Form */}
      <div className="w-full max-w-2xl px-4">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Share Your Feedback</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={feedbackForm.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <select
                name="category"
                value={feedbackForm.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Category</option>
                <option value="service">Training Programs</option>
                <option value="product">Gym Facilities</option>
                <option value="staff">Staff</option>
                <option value="equipment">Equipment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Your Feedback</label>
              <textarea
                name="review"
                value={feedbackForm.review}
                onChange={handleInputChange}
                placeholder="Your experience and suggestions..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows="4"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 text-center">Rate Your Experience</label>
              <StarRating 
                rating={feedbackForm.rating} 
                setRating={(newRating) => setFeedbackForm({...feedbackForm, rating: newRating})} 
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              SUBMIT FEEDBACK
            </button>
          </form>
        </div>
      </div>

      {/* My Feedbacks Section - Now always visible */}
      <div className="w-full max-w-6xl px-4 mb-10">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">My Feedback History</h2>
          {myFeedbacks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myFeedbacks.map((feedback) => (
                <div
                  key={feedback._id}
                  className="bg-gray-800 p-5 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors duration-200 cursor-pointer shadow-md"
                  onClick={() => setExpandedFeedbackId(feedback._id === expandedFeedbackId ? null : feedback._id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-white">{feedback.name}</h3>
                    <span className="text-gray-400 text-sm">{new Date(feedback.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-300 break-words line-clamp-2 mb-3">{feedback.review}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 capitalize">{feedback.category}</span>
                    <StarRating rating={feedback.rating} readOnly={true} size="sm" />
                  </div>

                  {expandedFeedbackId === feedback._id && (
                    <div className="mt-4 pt-4 border-t border-gray-700 animate-fadeIn">
                      <div className="space-y-2 mb-4">
                        <p className="text-gray-300"><span className="font-semibold text-white">Category:</span> {feedback.category}</p>
                        <p className="text-gray-300"><span className="font-semibold text-white">Feedback:</span> {feedback.review}</p>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(feedback._id);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex-1 font-medium"
                        >
                          Delete
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(feedback);
                          }}
                          className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex-1 font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 text-center">
              <p className="text-gray-400 text-lg">No feedback submissions found.</p>
              <p className="text-gray-500 mt-2">Share your experience with us!</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Update Form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Update Your Feedback</h2>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={feedbackForm.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={feedbackForm.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <select
                name="category"
                value={feedbackForm.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                disabled
              >
                <option value="">Select Category</option>
                <option value="service">Training Programs</option>
                <option value="product">Gym Facilities</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Your Feedback</label>
              <textarea
                name="review"
                value={feedbackForm.review}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows="4"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 text-center">Update Your Rating</label>
              <StarRating 
                rating={feedbackForm.rating} 
                setRating={(newRating) => setFeedbackForm({...feedbackForm, rating: newRating})} 
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              UPDATE FEEDBACK
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Feedback;