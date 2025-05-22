const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RequestSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    goal: {
        type: String,
        required: true,
    },
    preferredDays: {
        type: String,
        required: true,
    },
    additionalInfo: {
        type: String,
    },
    status: {
        type: String,
        default: "Pending",
    },
});

module.exports = mongoose.model("request", RequestSchema);
