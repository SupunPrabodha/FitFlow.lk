const express = require("express");
const MealPlanControlller = require("../Controllers/MealPlanControlller");

const router = express.Router();

const {
    getAllMealPlans,
    getMealPlanById,
    getMealPlansByEmail,
    createMealPlan,
    updateMealPlan,
    deleteMealPlan,
} = require("../Controllers/MealPlanControlller");

// Routes
// Get all plans
router.get("/", getAllMealPlans);

// Get a specific plan by ID
router.get("/details/:id", getMealPlanById);

// Get plans by email
router.get("/email/:email", getMealPlansByEmail);

// Create a new plan
router.post("/create", createMealPlan);
//router.post("/create", MealPlanControlller.createMealPlan);

// Update an existing plan
router.put("/edit/:id", updateMealPlan);

// Delete a plan
router.delete("/delete/:id", deleteMealPlan);

module.exports = router;
