const Reply = require("../Models/ReplyModel"); // Assuming a Reply model exists

// Create a new reply
const createReply = async (req, res) => {
    try {
        const reply = new Reply(req.body);
        const savedReply = await reply.save();
        res.status(201).json(savedReply);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all replies
const getReplies = async (req, res) => {
    try {
        const replies = await Reply.find();
        res.status(200).json(replies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a reply by email
const getRepliesByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const replies = await Reply.find({ userEmail: email });
        if (replies.length === 0) {
            return res.status(404).json({ message: "No replies found for this email" });
        }
        res.status(200).json(replies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a reply by ID
const updateReply = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedReply = await Reply.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedReply) {
            return res.status(404).json({ message: "Reply not found" });
        }
        res.status(200).json(updatedReply);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a reply by ID
const deleteReply = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReply = await Reply.findByIdAndDelete(id);
        if (!deletedReply) {
            return res.status(404).json({ message: "Reply not found" });
        }
        res.status(200).json({ message: "Reply deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createReply,
    getReplies,
    getRepliesByEmail,
    updateReply,
    deleteReply,
};
