import express from "express";
import { ObjectId } from "mongodb";
import connectDB from "../db/conn.mjs";
import mongoose from "mongoose";
import DailyCase from "../models/DailyCase.js";
import Feedback from "../models/Feedback.js";
import authMiddleware from "../middleware/auth.mjs";

const router = express.Router();

// Save feedback to database
router.post("/submit", authMiddleware, async (req, res) => {
  try {
    const { dailyCaseID, questionID, answerID, feedback } = req.body;

    console.log("Received feedback request:", {
      userID: req.user.id, // Using req.user.id from auth middleware
      dailyCaseID,
      questionID,
      answerID,
      feedback,
    });

    // Create new feedback object with user ID from auth middleware
    const newFeedback = new Feedback({
      userID: req.user.id, // Using req.user.id from auth middleware
      dailyCaseID,
      questionID,
      answerID,
      feedback,
    });

    // Save to database
    const savedFeedback = await newFeedback.save();
    console.log("Feedback saved successfully:", savedFeedback);
    res.status(201).json(savedFeedback);
  } catch (error) {
    console.error("Error saving feedback:", error);
    // Send more detailed error information
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Get a single daily game
//unused
// router.get("/:id", async (req, res) => {
//     let collection = await db.collection("daily");
//     let query = {_id: ObjectId(req.params.id)};
//     let result = await collection.findOne(query);
//     if (!result) res.send("Not found").status(404);
//     else res.send(result).status(200);
//   });

export default router;
