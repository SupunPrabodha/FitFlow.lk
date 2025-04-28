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
    password: { type: String, required: true },
  });

// Create a model for the user
const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
