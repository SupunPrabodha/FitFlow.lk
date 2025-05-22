const express = require("express");

const router = express.Router();

const { getAllPlans, getPlanById, getPlansByEmail, createPlan, updatePlan, deletePlan } = require("../Controllers/PlanController");

// Routes
// Get all plans
router.get("/", getAllPlans);

// Get a specific plan by ID
router.get("/:id", getPlanById);

// Get plans by email
router.get("/email/:email", getPlansByEmail);

// Create a new plan
router.post("/", createPlan);

// Update an existing plan
router.patch("/:id", updatePlan);

// Delete a plan
router.delete("/:id", deletePlan);

module.exports = router;
