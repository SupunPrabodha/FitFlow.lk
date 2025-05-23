import express from "express";
import Trainer from "../models/trainerModel.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const router = express.Router();

// POST: Add a trainer
router.post("/add", async (req, res) => {
  const { name, email, contact, age, gender, qualification } = req.body;

  if (!name || !email || !contact || !age || !gender || !qualification) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Generate a random password
    const autoGeneratedPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(autoGeneratedPassword, 10);
    
    const trainer = new Trainer({
      name,
      email,
      contact,
      age,
      gender,
      qualification,
      password: hashedPassword,
    });

    const savedTrainer = await trainer.save();

    // Send email with password using the same configuration as user routes
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🎉 Welcome to FitFlow Gym - Trainer Registration Successful!',
      text: `Dear ${name},\n\nCongratulations! Your registration as a trainer at FitFlow Gym has been approved.\n\nYou can now log in to your account using the following credentials:\n\nEmail: ${email}\nPassword: ${autoGeneratedPassword}\n\nPlease keep this password safe. You can change it after logging in.\n\nLogin here: http://localhost:3000/trainer-login\n\nIf you have any questions, feel free to reply to this email.\n\nWelcome to the FitFlow family!\n\nBest regards,\nFitFlow Team`,
    };

    await transporter.sendMail(mailOptions);
    
    res.status(201).json({ success: true, message: "Trainer added and email sent successfully" });
  } catch (err) {
    console.error("Error in trainer registration:", err);
    res.status(500).json({ error: "Trainer creation failed", details: err.message });
  }
});

// GET: List all trainers
router.get("/list", async (req, res) => {
  try {
    const trainers = await Trainer.find();  // Fetch all trainers from the database
    res.status(200).json({ success: true, trainers });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch trainers" });
  }
});

// DELETE: Remove a trainer by ID
router.delete("/remove", async (req, res) => {
  const { _id } = req.body;  // Get the ID of the trainer to remove
  if (!_id) {
    return res.status(400).json({ success: false, message: "Trainer ID is required" });
  }

  try {
    // Find the trainer by ID and delete it
    const trainer = await Trainer.findByIdAndDelete(_id);
    if (trainer) {
      res.status(200).json({ success: true, message: "Trainer removed successfully" });
    } else {
      res.status(404).json({ success: false, message: "Trainer not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to remove trainer", error: err.message });
  }
});

// PUT: Edit a trainer's details by ID
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, contact, age, gender, qualification } = req.body;

  // Validate if the required fields are provided
  if (!name || !email || !contact || !age || !gender || !qualification) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Find the trainer by ID and update the details
    const updatedTrainer = await Trainer.findByIdAndUpdate(
      id, 
      { name, email, contact, age, gender, qualification }, 
      { new: true }  // Return the updated document
    );

    if (updatedTrainer) {
      res.status(200).json({ success: true, message: "Trainer updated successfully", trainer: updatedTrainer });
    } else {
      res.status(404).json({ success: false, message: "Trainer not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating trainer", error: err.message });
  }
});

// POST: Trainer login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    // Find trainer
    const trainer = await Trainer.findOne({ email });
    if (!trainer) {
      return res.status(404).json({ 
        success: false, 
        message: "Trainer not found" 
      });
    }

    // Check if trainer has a password
    if (!trainer.password) {
      return res.status(500).json({ 
        success: false, 
        message: "Trainer account not properly set up" 
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, trainer.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid password" 
      });
    }

    // Successful login
    return res.status(200).json({ 
      success: true, 
      message: "Login successful", 
      trainer: { 
        name: trainer.name, 
        email: trainer.email 
      } 
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Login failed", 
      error: err.message || "An unexpected error occurred" 
    });
  }
});

// POST: Send email to existing trainer
router.post("/send-email", async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: "Email and name are required" });
  }

  try {
    // Generate a random password
    const autoGeneratedPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(autoGeneratedPassword, 10);
    
    // Update trainer's password in database
    const trainer = await Trainer.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }

    // Send email with password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🎉 Welcome to FitFlow Gym - Trainer Registration Successful!',
      text: `Dear ${name},\n\nCongratulations! Your registration as a trainer at FitFlow Gym has been approved.\n\nYou can now log in to your account using the following credentials:\n\nEmail: ${email}\nPassword: ${autoGeneratedPassword}\n\nPlease keep this password safe. You can change it after logging in.\n\nLogin here: http://localhost:3000/trainer-login\n\nIf you have any questions, feel free to reply to this email.\n\nWelcome to the FitFlow family!\n\nBest regards,\nFitFlow Team`,
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("Error in sending trainer email:", err);
    res.status(500).json({ error: "Failed to send email", details: err.message });
  }
});

export default router;
