const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const RequestRouter = require("./Routers/RequestRouters");
const PlanRouter = require("./Routers/PlanRouter");
const ReplyRouter = require("./Routers/ReplyRouter");
const MealPlanRouter = require("./Routers/MealPlanRouter");
const ProgressRouter = require("./Routers/ProgressRouter");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// ✅ Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" })); // ✅ Ensure CORS is correct

app.use("/requests", RequestRouter);
app.use("/plans", PlanRouter);
app.use("/reply", ReplyRouter);
app.use("/mealplans", MealPlanRouter);
app.use("/progress", ProgressRouter);

// ✅ Mongoose Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@gym-fitness-plans.d2bvb.mongodb.net/Gym-Fitness-Plans?retryWrites=true&w=majority`;

mongoose
    .connect(uri)
    .then(() => console.log("✅ Successfully connected to MongoDB using Mongoose!"))
    .then(() => {
        app.listen(port, () => console.log(`✅ Server is running on http://localhost:${port}`));
    })
    .catch((error) => console.error("❌ MongoDB connection error:", error));
