const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema({
    postedBy: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    sessionType: {
        type: String,
        required: true,
    },
    workoutLogo: {
        type: String,
        required: true,
    },
    workoutType: {
        type: String,
        required: true,
    },
    postedDate: {
        type: Date,
        required: true,
    },
    difficultyLevel: {
        type: String,
        required: true,
    },
    durationType: {
        type: String,
        required: true,
    },
    maxDuration: {
        type: Number,
        required: true,
    },
    minDuration: {
        type: Number,
        required: true,
    },
    trainerName: {
        type: String,
        required: true,
    },
    workoutName: {
        type: String,
        required: true,
    },
    equipments: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("demoplans", PlanSchema);
