const progressModel = require("../Models/progressModel");

exports.getAllProgressPlans = async (req, res) => {
    try {
        const progress = await progressModel.find();
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: "Error fetching progress", error });
    }
};

exports.getProgressByEmailAndPlanId = async (req, res) => {
    try {
        const { email } = req.params;
        
        const progress = await progressModel.find({ userEmail: email }).sort({ date: -1 });
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: "Error fetching progress", error });
    }
};

exports.createProgress = async (req, res) => {
    try {
        const progress = new progressModel(req.body);
        const savedProgress = await progress.save();
        res.status(201).json(savedProgress);
    } catch (error) {
        res.status(500).json({ message: "Error creating progress", error });
    }
};

exports.updateProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProgress = await progressModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedProgress);
    } catch (error) {
        res.status(500).json({ message: "Error updating progress", error });
    }
};

exports.deleteProgress = async (req, res) => {
    try {
        const { id } = req.params;
        await progressModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Progress deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting progress", error });
    }
};

exports.getProgressPlanById = async (req, res) => {
    const { id } = req.params;
    try {
        const progress = await progressModel.findById(id);
        if (progress) {
            res.send(progress);
        } else {
            res.status(404).send({ message: "Plan not found" });
        }
    } catch (error) {
        res.status(500).send({ error: "Failed to fetch plan" });
    }
};

exports.getProgressPlansByEmail = async (req, res) => {
    try {
        const progresses = await progressModel.find({ postedBy: req.params.email });
        res.send(progresses);
    } catch (error) {
        res.status(500).send({ success: false, message: "Failed to fetch workout plans", error });
    }
};

exports.createProgressPlan = async (req, res) => {
    try {
        console.log("Received request body:", req.body);
        const body = req.body;
        body.createdAt = new Date();
        const progress = new progressModel(body);
        const result = await progress.save();
        console.log("Save result:", result);

        if (result) {
            return res.status(200).send({ success: true, result });
        } else {
            return res.status(500).send({ success: false, message: "Cannot insert! Try again later" });
        }
    } catch (error) {
        console.error("Detailed error:", error);
        return res.status(500).send({
            success: false,
            message: "Server error",
            error: error.message,
            stack: error.stack,
        });
    }
};
/*exports.createMealPlan = async (req, res) => {
    try {
      const body = req.body;
      console.log("Creating Meal Plan:", body);
  
      const mealplan = new MealPlanModel(body);
      const result = await mealplan.save();
  
      res.status(200).json({ message: "Meal Plan Created Successfully", result });
    } catch (error) {
      console.error("Error creating meal plan:", error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
  };*/

exports.updateProgressPlan = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const result = await progressModel.findByIdAndUpdate(id, updateData, { new: true });

        if (result) {
            res.send({ success: true, message: "Progress updated successfully" });
        } else {
            res.status(404).send({ success: false, message: "Progress not found or no changes made" });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: "Failed to update progress", error });
    }
};

exports.deleteProgressPlan = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await progressModel.findByIdAndDelete(id);

        if (result) {
            res.send({ success: true, message: "Progress deleted successfully!" });
        } else {
            res.status(404).send({ success: false, message: "Progress not found" });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: "Failed to delete progress", error });
    }
};
