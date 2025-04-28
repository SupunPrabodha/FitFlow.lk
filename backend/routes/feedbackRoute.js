import express from 'express';
import {
  listFeedback,
  addFeedback,
  removeFeedback,
  removeAdminFeedback,
  updateFeedback,
  singleFeedback,
  getFeedbackAnalytics
} from '../controllers/feedbackController.js';

const router = express.Router();

// Apply CORS and JSON parsing to all feedback routes
router.use(express.json());

// Feedback CRUD Operations
router.post('/add', addFeedback);
router.get('/list', listFeedback);
router.get('/analytics', getFeedbackAnalytics);
router.get('/single/:id', singleFeedback);
router.put('/update/:feedbackId', updateFeedback);

// Feedback Deletion
router.delete('/remove/:feedbackId', removeFeedback);
router.delete('/admin/remove/:feedbackId', removeAdminFeedback);

// Test endpoint (remove in production)
router.get('/test-data', async (req, res) => {
  // Sample test data creation endpoint
  const testData = [
    {
      name: "Test User 1",
      email: "test1@example.com",
      category: "service",
      review: "Great service!",
      rating: 5,
      date: new Date()
    },
    {
      name: "Test User 2",
      email: "test2@example.com",
      category: "facility",
      review: "Good facilities",
      rating: 4,
      date: new Date(new Date().setDate(new Date().getDate() - 1))
    }
  ];
  
  try {
    const result = await feedbackModel.insertMany(testData);
    res.json({
      success: true,
      message: `Added ${result.length} test records`,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create test data",
      error: error.message
    });
  }
});

export default router;