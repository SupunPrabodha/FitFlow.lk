const mongoose = require("mongoose");

const MealPlanSchema = new mongoose.Schema({
    planName: {
        type: String,
        required: true,
    },
    planCategory: {
        type: String,
        required: true,
    },
    planType: {
        type: String,
        required: true,
    },
   
    nutritionGoals: {
        type: String,
        required: true,
    },
    mealSchedule: {
        type: String,
        required: true,
    },
    calorieTarget: {
        type: String,
        required: true,
    },
    hydration: {
        type: String,
        required: true,
    },
    supplements: {
        type: String,
        required: true,
    },
    postedBy: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

module.exports = mongoose.model("demomealplans", MealPlanSchema);
