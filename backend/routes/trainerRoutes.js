import express from "express";
import Trainer from "../models/trainerModel.js";

const router = express.Router();

// POST: Add a trainer
router.post("/add", async (req, res) => {
  const { name, email, contact, age, gender, qualification } = req.body;

  if (!name || !email || !contact || !age || !gender || !qualification) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const trainer = new Trainer({
      name,
      email,
      contact,
      age,
      gender,
      qualification,
    });

    const savedTrainer = await trainer.save();
    res.status(201).json({ success: true, trainer: savedTrainer });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: "Trainer creation failed", 
      details: err.message 
    });
  }
});

// GET: List all trainers
router.get("/list", async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.status(200).json({ success: true, trainers });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch trainers",
      error: err.message 
    });
  }
});

// GET: Get single trainer by ID
router.get("/:id", async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ 
        success: false, 
        message: "Trainer not found" 
      });
    }
    res.status(200).json({ 
      success: true, 
      trainer 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch trainer",
      error: err.message 
    });
  }
});

// PUT: Update a trainer by ID
router.put("/update/:id", async (req, res) => {
  try {
    const updatedTrainer = await Trainer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedTrainer) {
      return res.status(404).json({ 
        success: false, 
        message: "Trainer not found" 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Trainer updated successfully",
      trainer: updatedTrainer 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to update trainer",
      error: err.message 
    });
  }
});

// DELETE: Remove a trainer by ID
router.delete("/remove", async (req, res) => {
  const { _id } = req.body;
  if (!_id) {
    return res.status(400).json({ 
      success: false, 
      message: "Trainer ID is required" 
    });
  }

  try {
    const trainer = await Trainer.findByIdAndDelete(_id);
    if (trainer) {
      res.status(200).json({ 
        success: true, 
        message: "Trainer removed successfully" 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: "Trainer not found" 
      });
    }
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to remove trainer", 
      error: err.message 
    });
  }
});

export default router;