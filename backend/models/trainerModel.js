// models/trainerModel.js
import mongoose from 'mongoose';

const TrainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  qualification: { type: String, required: true },
});

const Trainer = mongoose.model('Trainer', TrainerSchema);

export default Trainer;
