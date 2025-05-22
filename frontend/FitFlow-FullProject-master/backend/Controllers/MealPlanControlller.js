const MealPlanModel = require("../Models/MealPlanModel");

exports.getAllMealPlans = async (req, res) => {
    let MealPlans;
    try {
        MealPlans = await MealPlanModel.find();
    } catch (err) {
        console.error("Error fetching plans:", err); // Improved error logging
        return res.status(500).json({ message: "Server error", error: err });
    }

    // If no plans are found, return a 404 status code
    if (!MealPlans || MealPlans.length === 0) {
        console.log("No plans found in the database."); // Debugging log for empty results
        return res.status(404).json({ message: "No plans found" });
    }

    return res.status(200).json(MealPlans);
};

exports.getMealPlanById = async (req, res) => {
    const { id } = req.params;
    try {
        const mealplan = await MealPlanModel.findById(id);
        if (mealplan) {
            res.send(mealplan);
        } else {
            res.status(404).send({ message: "Plan not found" });
        }
    } catch (error) {
        res.status(500).send({ error: "Failed to fetch plan" });
    }
};

exports.getMealPlansByEmail = async (req, res) => {
    try {
        const mealplans = await MealPlanModel.find({ postedBy: req.params.email });
        res.send(mealplans);
    } catch (error) {
        res.status(500).send({ success: false, message: "Failed to fetch workout plans", error });
    }
};

exports.createMealPlan = async (req, res) => {
    try {
        console.log("Received request body:", req.body);
        const body = req.body;
        body.createdAt = new Date();
        const mealplan = new MealPlanModel(body);
        const result = await mealplan.save();
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

exports.updateMealPlan = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const result = await MealPlanModel.findByIdAndUpdate(id, updateData, { new: true });

        if (result) {
            res.send({ success: true, message: " Meal Plan updated successfully" });
        } else {
            res.status(404).send({ success: false, message: "Plan not found or no changes made" });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: "Failed to update plan", error });
    }
};

exports.deleteMealPlan = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await MealPlanModel.findByIdAndDelete(id);

        if (result) {
            res.send({ success: true, message: "Workout Plan Deleted Successfully!" });
        } else {
            res.status(404).send({ success: false, message: "Plan not found" });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: "Failed to delete plan", error });
    }
};
