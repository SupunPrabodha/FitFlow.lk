const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReplySchema = new Schema({
    userEmail: {
        type: String,
        required: true,
    },
    trainerName: {
        type: String,
        required: true,
    },
    replyMessage: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("reply", ReplySchema);
