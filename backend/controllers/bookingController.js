import Booking from '../models/bookingModel.js';
import nodemailer from 'nodemailer';

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Create a booking
export const createBooking = async (req, res) => {
  try {
    console.log('Received booking request:', req.body);
    const { name, email, age, date, timeSlot, trainerId, status } = req.body;

    // Validate required fields
    if (!name || !email || !age || !date || !timeSlot || !trainerId) {
      console.log('Missing fields:', {
        name: !name,
        email: !email,
        age: !age,
        date: !date,
        timeSlot: !timeSlot,
        trainerId: !trainerId
      });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields. Please provide name, email, age, date, timeSlot, and trainerId.',
        missingFields: {
          name: !name,
          email: !email,
          age: !age,
          date: !date,
          timeSlot: !timeSlot,
          trainerId: !trainerId
        }
      });
    }

    // Validate age is a number
    if (isNaN(age) || age < 0) {
      return res.status(400).json({
        success: false,
        message: 'Age must be a positive number.',
        receivedAge: age
      });
    }

    // Parse and validate the date
    let bookingDate;
    try {
      bookingDate = new Date(date);
      if (isNaN(bookingDate.getTime())) {
        throw new Error('Invalid date format');
      }
      // Normalize the date to noon to avoid timezone issues
      bookingDate.setHours(12, 0, 0, 0);
    } catch (error) {
      console.error('Date parsing error:', error);
      return res.status(400).json({
        success: false,
        message: 'Invalid date format',
        receivedDate: date,
        error: error.message
      });
    }

    // Validate date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book appointments for past dates.',
        bookingDate: bookingDate,
        today: today
      });
    }

    // Check if the slot is already booked for the selected date and trainer
    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBooking = await Booking.findOne({
      trainerId,
      date: {
        $gte: startOfDay,
        $lt: endOfDay
      },
      timeSlot,
      status: { $ne: 'cancelled' }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'The selected time slot is already booked for this trainer on this date.',
        existingBooking: {
          date: existingBooking.date,
          timeSlot: existingBooking.timeSlot
        }
      });
    }

    // Creating a new booking object with default status if not provided
    const booking = new Booking({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      age,
      date: bookingDate,
      timeSlot,
      trainerId,
      status: status || 'pending'
    });

    console.log('Creating booking:', booking);

    // Saving the booking to the database
    await booking.save();

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Training Session Booking Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Training Session Booking Confirmation</h2>
          <p>Dear ${name},</p>
          <p>Your training session has been booked successfully.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Booking Details:</h3>
            <p><strong>Date:</strong> ${bookingDate.toLocaleDateString()}</p>
            <p><strong>Time Slot:</strong> ${timeSlot}</p>
            <p><strong>Status:</strong> Pending (awaiting confirmation)</p>
          </div>
          <p>We will review your booking and send you a confirmation shortly.</p>
          <p>Best regards,<br>FitFlow Gym Team</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the booking if email fails
    }

    // Sending the success response
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Booking creation error:', error);

    // Check for validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    // Handle duplicate key errors (time slot already booked)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked for the selected trainer and date.'
      });
    }

    // Handle other errors
    res.status(400).json({
      success: false,
      message: 'Error creating booking',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get all bookings
export const getBookings = async (req, res) => {
  try {
    console.log('Fetching all bookings...');

    // Get the user's email from the token if available
    const userEmail = req.user?.email;
    console.log('User email from token:', userEmail);

    // If user email is available, filter bookings for that user
    let query = {};
    if (userEmail) {
      query.email = userEmail;
      console.log('Filtering bookings for user:', userEmail);
    }

    const bookings = await Booking.find(query).sort({ date: -1 });
    console.log('Found bookings:', bookings.length);

    res.status(200).json({
      success: true,
      bookings,
      message: userEmail ? 'User bookings fetched successfully' : 'All bookings fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(400).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, confirmed, cancelled'
      });
    }

    // Find the booking
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Update the booking status
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update booking status'
      });
    }

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: `Your Training Session Booking - ${status}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Training Session Booking Update</h2>
          <p>Dear ${booking.name},</p>
          <p>Your training session booking has been ${status}.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Booking Details:</h3>
            <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
            <p><strong>Time Slot:</strong> ${booking.timeSlot}</p>
            <p><strong>Status:</strong> ${status}</p>
          </div>
          ${status === 'confirmed' ?
          '<p>Please arrive 10 minutes before your scheduled time.</p>' :
          '<p>If you have any questions, please contact us.</p>'
        }
          <p>Best regards,<br>FitFlow Gym Team</p>
        </div>
      `
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Return the updated booking
    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message
    });
  }
};

// Delete a booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error deleting booking', error });
  }
};

export const checkSlotAvailability = async (req, res) => {
  try {
    const { trainerId, date, timeSlot } = req.params;

    // If timeSlot is 'all', return all booked slots for the date
    if (timeSlot === 'all') {
      // Only get active (pending or confirmed) bookings
      const bookedSlots = await Booking.find({
        trainerId,
        date: {
          $gte: new Date(date).setHours(0, 0, 0, 0),
          $lt: new Date(date).setHours(23, 59, 59, 999)
        },
        status: { $in: ['pending', 'confirmed'] }
      }).select('timeSlot');

      const slots = bookedSlots.map(booking => booking.timeSlot);
      console.log('Booked slots for date:', date, slots);

      return res.status(200).json({
        success: true,
        bookedSlots: slots
      });
    }

    // Check if the selected time slot is already booked (and not cancelled)
    const existingBooking = await Booking.findOne({
      trainerId,
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59, 999)
      },
      timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      console.log('Slot already booked:', { trainerId, date, timeSlot });
      return res.status(200).json({
        success: false,
        message: 'The selected time slot is already booked.',
      });
    }

    console.log('Slot available:', { trainerId, date, timeSlot });
    res.status(200).json({
      success: true,
      message: 'The selected time slot is available.',
    });
  } catch (error) {
    console.error('Error checking slot availability:', error);
    res.status(400).json({
      success: false,
      message: 'Error checking slot availability',
      error: error.message
    });
  }
};

// Generate appointment report
export const generateAppointmentReport = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;

    // Build query based on filters
    const query = {};
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (status) {
      query.status = status;
    }

    // Get appointments with filters
    const appointments = await Booking.find(query)
      .sort({ date: 1, timeSlot: 1 });

    // Format the report data
    const reportData = appointments.map(appointment => ({
      Name: appointment.name,
      Email: appointment.email,
      Age: appointment.age,
      'Trainer ID': appointment.trainerId,
      Date: new Date(appointment.date).toLocaleDateString(),
      'Time Slot': appointment.timeSlot,
      Status: appointment.status
    }));

    res.status(200).json({
      success: true,
      report: reportData
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(400).json({
      success: false,
      message: 'Error generating report',
      error: error.message
    });
  }
};

// Update booking details
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { trainerId, name, email, age, date, timeSlot } = req.body;

    // Validate required fields
    if (!trainerId || !name || !email || !age || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields. Please provide all booking details.',
      });
    }

    // Check if the booking exists
    const existingBooking = await Booking.findById(id);
    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if the booking is in pending status
    if (existingBooking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending appointments can be modified',
      });
    }

    // Check if the new time slot is available (if date or time slot is being changed)
    if (date !== existingBooking.date.toISOString().split('T')[0] || timeSlot !== existingBooking.timeSlot) {
      const slotCheck = await Booking.findOne({
        trainerId,
        date,
        timeSlot,
        _id: { $ne: id }, // Exclude current booking from check
        status: { $ne: 'cancelled' } // Don't consider cancelled bookings
      });

      if (slotCheck) {
        return res.status(400).json({
          success: false,
          message: 'The selected time slot is already booked for this trainer on this date.',
        });
      }
    }

    // Update the booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      {
        trainerId,
        name,
        email,
        age,
        date,
        timeSlot
      },
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update booking'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking',
      error: error.message
    });
  }
};
