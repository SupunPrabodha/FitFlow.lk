import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  review: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5 
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const feedbackModel = mongoose.model('Feedback', feedbackSchema);

export default feedbackModel;
