const express = require("express");
const { createReply, getReplies, updateReply, deleteReply, getRepliesByEmail } = require("../Controllers/ReplyController");

const router = express.Router();

// Route to create a new reply
router.post("/", createReply);

// Route to get all replies
router.get("/", getReplies);

// Route to get a reply by email
router.get("/:email", getRepliesByEmail);

// Route to update a reply by ID
router.put("/:id", updateReply);

// Route to delete a reply by ID
router.delete("/:id", deleteReply);

module.exports = router;
