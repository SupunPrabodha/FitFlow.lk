const Request = require("../Models/RequestModel");

// Get all requests
exports.getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find();
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching requests", error });
    }
};

// Get a request by ID
exports.getRequestById = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }
        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ message: "Error fetching request", error });
    }
};

// Create a new request
exports.createRequest = async (req, res) => {
    console.log("Creating request..." + req.body);
    const { name, email, phone, goal, preferredDays, additionalInfo } = req.body;
    let request;
    try {
        request = new Request({
            name,
            email,
            phone,
            goal,
            preferredDays,
            additionalInfo,
        });
        await request.save();
        console.log("Request created successfully");
        res.status(201).json({ message: "Request created successfully", request });
    } catch (error) {
        console.log("Error creating request", error);
        res.status(400).json({ message: "Error creating request", error });
    }
};

// Update a request
exports.updateRequest = async (req, res) => {
    try {
        const updatedRequest = await Request.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRequest) {
            return res.status(404).json({ message: "Request not found" });
        }
        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(400).json({ message: "Error updating request", error });
    }
};

// Delete a request
exports.deleteRequest = async (req, res) => {
    try {
        const deletedRequest = await Request.findByIdAndDelete(req.params.id);
        if (!deletedRequest) {
            return res.status(404).json({ message: "Request not found" });
        }
        res.status(200).json({ message: "Request deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting request", error });
    }
};
