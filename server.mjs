// Load environment variables
import "./loadEnvironment.mjs";
import express from "express";
import cors from "cors";
import "express-async-errors";
import daily from "./routes/daily.mjs";
import users from "./routes/user.mjs";
import feedback from "./routes/feedback.mjs";
import connectDB from "./db/conn.mjs";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5050;
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Load the routes
app.use("/daily", daily);
app.use("/users", users);
app.use("/feedback", feedback);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.");
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
