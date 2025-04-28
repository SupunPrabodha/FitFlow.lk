import feedbackModel from "../models/feedbackModel.js";
import mongoose from 'mongoose';

// Utility function for date validation
const isValidDate = (dateString) => {
  return !isNaN(Date.parse(dateString));
};

const getFeedbackAnalytics = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;
    
    // Set default to last 30 days if no dates provided
    if (!startDate) {
      startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    } else {
      startDate = new Date(startDate);
    }
    
    if (!endDate) {
      endDate = new Date();
    } else {
      endDate = new Date(endDate);
    }
    
    // Include the entire end date
    endDate.setHours(23, 59, 59, 999);

    console.log(`Fetching analytics from ${startDate} to ${endDate}`);

    const matchStage = {
      date: { $gte: startDate, $lte: endDate }
    };

    const [ratingDistribution, categoryDistribution, monthlyTrend] = await Promise.all([
      // Rating distribution (1-5 stars)
      feedbackModel.aggregate([
        { $match: matchStage },
        { $group: { _id: "$rating", count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      
      // Category distribution
      feedbackModel.aggregate([
        { $match: matchStage },
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ]),
      
      // Monthly trend
      feedbackModel.aggregate([
        { $match: matchStage },
        { 
          $group: { 
            _id: { 
              year: { $year: "$date" },
              month: { $month: "$date" } 
            },
            count: { $sum: 1 },
            avgRating: { $avg: "$rating" }
          } 
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ])
    ]);

    // Format response with fallbacks for empty data
    const response = {
      ratingDistribution: ratingDistribution.length ? ratingDistribution : 
        [1,2,3,4,5].map(rating => ({ _id: rating, count: 0 })),
      categoryDistribution: categoryDistribution.length ? categoryDistribution : [],
      monthlyTrend: monthlyTrend.map(item => ({
        ...item,
        avgRating: item.avgRating ? parseFloat(item.avgRating.toFixed(2)) : 0
      }))
    };

    console.log("Analytics result:", response);
    res.json({ success: true, analytics: response });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch analytics",
      error: error.message
    });
  }
};

// Add feedback
const addFeedback = async (req, res) => {
  try {
    const { name, email, category, review, rating } = req.body;

    // Input validation
    if (!name || !email || !category || !review || rating === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: "Rating must be between 1 and 5" 
      });
    }

    const feedbackData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      category: category.trim(),
      review: review.trim(),
      rating: parseInt(rating),
      date: new Date()
    };

    const feedback = new feedbackModel(feedbackData);
    await feedback.save();

    res.status(201).json({ 
      success: true, 
      message: "Feedback Added",
      feedback 
    });
  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to add feedback",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// List feedback with pagination
const listFeedback = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [feedback, total] = await Promise.all([
      feedbackModel.find({})
        .sort({ rating: -1, date: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      feedbackModel.countDocuments()
    ]);

    res.json({ 
      success: true, 
      feedback,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('List feedback error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch feedbacks",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single feedback
const singleFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid feedback ID" 
      });
    }

    const feedback = await feedbackModel.findById(id);
    if (!feedback) {
      return res.status(404).json({ 
        success: false, 
        message: "Feedback not found" 
      });
    }

    res.json({ success: true, feedback });
  } catch (error) {
    console.error('Single feedback error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch feedback",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update feedback
const updateFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid feedback ID" 
      });
    }

    const feedback = await feedbackModel.findByIdAndUpdate(
      feedbackId, 
      updates, 
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ 
        success: false, 
        message: "Feedback not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "Feedback updated successfully",
      feedback 
    });
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update feedback",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete feedback (regular user)
const removeFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid feedback ID" 
      });
    }

    const feedback = await feedbackModel.findByIdAndDelete(feedbackId);
    if (!feedback) {
      return res.status(404).json({ 
        success: false, 
        message: "Feedback not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "Feedback deleted successfully",
      feedback 
    });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete feedback",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete feedback (admin)
const removeAdminFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid feedback ID" 
      });
    }

    const feedback = await feedbackModel.findByIdAndDelete(feedbackId);
    if (!feedback) {
      return res.status(404).json({ 
        success: false, 
        message: "Feedback not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "Feedback deleted by admin successfully",
      feedback 
    });
  } catch (error) {
    console.error('Admin delete feedback error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete feedback as admin",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export { 
  listFeedback, 
  addFeedback, 
  removeFeedback,      
  removeAdminFeedback, 
  updateFeedback, 
  singleFeedback,
  getFeedbackAnalytics 
};