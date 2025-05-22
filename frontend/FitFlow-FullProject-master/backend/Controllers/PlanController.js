const PlanModel = require("../Models/PlanModel");

exports.getAllPlans = async (req, res) => {
    let Plans;
    try {
        Plans = await PlanModel.find();
    } catch (err) {
        console.error("Error fetching plans:", err); // Improved error logging
        return res.status(500).json({ message: "Server error", error: err });
    }

    // If no plans are found, return a 404 status code
    if (!Plans || Plans.length === 0) {
        console.log("No plans found in the database."); // Debugging log for empty results
        return res.status(404).json({ message: "No plans found" });
    }

    return res.status(200).json(Plans);
};

exports.getPlanById = async (req, res) => {
    const { id } = req.params;
    try {
        const plan = await PlanModel.findById(id);
        if (plan) {
            res.send(plan);
        } else {
            res.status(404).send({ message: "Plan not found" });
        }
    } catch (error) {
        res.status(500).send({ error: "Failed to fetch plan" });
    }
};

exports.getPlansByEmail = async (req, res) => {
    try {
        const plans = await PlanModel.find({ postedBy: req.params.email });
        res.send(plans);
    } catch (error) {
        res.status(500).send({ success: false, message: "Failed to fetch workout plans", error });
    }
};

exports.createPlan = async (req, res) => {
    try {
        const body = req.body;
        body.createdAt = new Date();
        const plan = new PlanModel(body);
        const result = await plan.save();

        if (result) {
            return res.status(200).send({ success: true, result });
        } else {
            return res.status(500).send({ success: false, message: "Cannot insert! Try again later" });
        }
    } catch (error) {
        return res.status(500).send({ success: false, message: "Server error", error });
    }
};

exports.updatePlan = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const result = await PlanModel.findByIdAndUpdate(id, updateData, { new: true });

        if (result) {
            res.send({ success: true, message: "Plan updated successfully" });
        } else {
            res.status(404).send({ success: false, message: "Plan not found or no changes made" });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: "Failed to update plan", error });
    }
};

exports.deletePlan = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await PlanModel.findByIdAndDelete(id);

        if (result) {
            res.send({ success: true, message: "Workout Plan Deleted Successfully!" });
        } else {
            res.status(404).send({ success: false, message: "Plan not found" });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: "Failed to delete plan", error });
    }
};
