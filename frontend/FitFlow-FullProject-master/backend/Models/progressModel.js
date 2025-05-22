const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
    planId: {
        type: String,
        required: false,
    },
    userEmail: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    measurements: {
        type: String,
        required: true,
    },
    completedWorkouts: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Progress", ProgressSchema);
