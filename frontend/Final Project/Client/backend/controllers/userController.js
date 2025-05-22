import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";  // Corrected import path with .js extension
import { toast } from "react-toastify";
import nodemailer from "nodemailer";

// Function to create a JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}; 

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            return res.json({
                success: true,
                token,
                user: {
                    name: user.name,
                    email: user.email,
                    contact: user.contactNumber,
                    age: user.age,
                    gender: user.gender
                }
            });
        } else {
            return res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

// Route for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, gender, age, contactNumber, membershipType } = req.body;
        let paymentReceipt = null;
        if (req.file) {
            paymentReceipt = req.file.path;
        } else if (req.body.paymentReceipt) {
            paymentReceipt = req.body.paymentReceipt;
        }

        const exists = await userModel.findOne({ email });

        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        const newUser = new userModel({
            name,
            email,
            gender,
            age,
            contactNumber,
            membershipType,
            paymentReceipt,
        });

        const user = await newUser.save();
        const token = createToken(user._id);

        // Send registration email
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
            subject: 'Registration Successful - FitFlow Gym',
            text: `Dear ${name},\n\nYour registration was successful! Your payment is being processed.\n\nThank you for joining FitFlow Gym!\n\nBest regards,\nFitFlow Team`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Registration email sent:', info.response);
            }
        });

        return res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({ success: true, token });
        } else {
            return res.json({ success: false, message: "Invalid admin credentials" });
        }
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOneAndDelete({ email: email.toLowerCase() });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        return res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { name, email, contact, age, gender } = req.body;

        // Find user by email
        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Update user details
        user.name = name;
        user.contactNumber = contact;
        user.age = age;
        user.gender = gender;

        // Save updated user
        const updatedUser = await user.save();

        return res.json({
            success: true,
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
                contact: updatedUser.contactNumber,
                age: updatedUser.age,
                gender: updatedUser.gender
            }
        });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

// Route to get all users
const listUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, '-password'); // Exclude password
        return res.json({ success: true, users });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Update payment status (accept/reject)
const updatePaymentStatus = async (req, res) => {
    try {
        const { userId, status } = req.body;
        if (!['accepted', 'rejected'].includes(status)) {
            return res.json({ success: false, message: 'Invalid status' });
        }
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        user.paymentStatus = status;
        await user.save();
        return res.json({ success: true, message: `Payment status updated to ${status}` });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Send acceptance email to user
const sendAcceptanceEmail = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        // Generate random password
        const plainPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        user.password = hashedPassword;
        await user.save();
        // Send acceptance email with password
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: '🎉 Welcome to FitFlow Gym - Registration Successful!',
            text: `Dear ${user.name},\n\nCongratulations! Your registration at FitFlow Gym has been approved.\n\nYou can now log in to your account using the following credentials:\n\nEmail: ${user.email}\nPassword: ${plainPassword}\n\nPlease keep this password safe. You can change it after logging in.\n\nLogin here: http://localhost:3000/login\n\nIf you have any questions, feel free to reply to this email.\n\nWelcome to the FitFlow family!\n\nBest regards,\nFitFlow Team`,
        };
        await transporter.sendMail(mailOptions);
        return res.json({ success: true, message: 'Acceptance email sent' });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export { loginUser, registerUser, adminLogin, deleteUser, updateUser, listUsers, updatePaymentStatus, sendAcceptanceEmail };
