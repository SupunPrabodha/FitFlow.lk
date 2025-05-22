const express = require("express");
const router = express.Router();
const progressController = require("../Controllers/progressController");

// Get all progress entries
router.get("/", progressController.getAllProgressPlans);

// Get progress by email
router.get("/email/:email", progressController.getProgressByEmailAndPlanId);

// Create new progress entry
router.post("/create", progressController.createProgressPlan);

// Update progress entry
router.put("/edit/:id", progressController.updateProgressPlan);

// Delete progress entry
router.delete("/delete/:id", progressController.deleteProgressPlan);

module.exports = router;
