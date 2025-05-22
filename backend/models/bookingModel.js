import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const bookingSchema = new Schema({
  trainerId: {
    type: String,
    required: true,
    index: false 
  },
  name: {
    type: String,
    required: true,
    index: false 
  },
  email: {
    type: String,
    required: true,
    index: false 
  },
  age: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    index: false 
  },
  timeSlot: {
    type: String,
    required: true,
    index: false, 
    enum: [
      '8:00 AM - 9:00 AM',
      '9:00 AM - 10:00 AM',
      '10:00 AM - 11:00 AM',
      '11:00 AM - 12:00 PM',
      '1:00 PM - 2:00 PM',
      '2:00 PM - 3:00 PM',
      '3:00 PM - 4:00 PM',
      '4:00 PM - 5:00 PM'
    ]
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
    index: false 
  }
}, {
  timestamps: true,
  // Disable automatic index creation
  autoIndex: false
});

// Create compound index for active bookings only
bookingSchema.index(
  { trainerId: 1, date: 1, timeSlot: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ['pending', 'confirmed'] } // Only apply to active bookings
    },
    name: 'trainer_date_timeslot',
    background: true
  }
);

const Booking = model('Booking', bookingSchema);

// Ensure indexes are created correctly
Booking.createIndexes().catch(err => {
  console.error('Error creating indexes:', err);
});

export default Booking;
