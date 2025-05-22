import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { 
      type: String, 
      required: true, 
    },
    gender: { type: String, required: true },
    age: { 
      type: Number, 
      required: true, 
    },
    membershipType: { type: String, required: true },
    paymentReceipt: { type: String }, // file path or URL
    paymentStatus: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    password: { type: String },
  });

// Create a model for the user
const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
