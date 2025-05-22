import express from 'express';
import {
  createBooking,
  getBookings,
  updateBookingStatus,
  deleteBooking,
  checkSlotAvailability,
  updateBooking,
  generateAppointmentReport
} from '../controllers/bookingController.js';

const router = express.Router();

// GET request to check slot availability (specific route first)
router.get('/book/availability/:trainerId/:date/:timeSlot', checkSlotAvailability);

// GET request to generate appointment report
router.get('/book/report', generateAppointmentReport);

// GET request to get all bookings
router.get('/book', getBookings);

// POST request to create a booking
router.post('/book', createBooking);

// PUT request to update booking status
router.put('/book/:id/status', updateBookingStatus);

// PUT request to update booking details
router.put('/book/:id', updateBooking);

// DELETE request to delete a booking
router.delete('/book/:id', deleteBooking);

export default router;
