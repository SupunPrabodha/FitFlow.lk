const express = require("express");

const router = express.Router();

// Controller functions (you need to implement these in a separate file)
const { getAllRequests, getRequestById, createRequest, updateRequest, deleteRequest } = require("../Controllers/RequestController");

// Routes
// Get all workout requests
router.get("/", getAllRequests);

// Get a specific workout request by ID
router.get("/:id", getRequestById);

// Create a new workout request
router.post("/", createRequest);

// Update an existing workout request
router.put("/:id", updateRequest);

// Delete a workout request
router.delete("/:id", deleteRequest);

module.exports = router;
