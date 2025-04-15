import express from "express";
import { ObjectId } from "mongodb";
import connectDB from "../db/conn.mjs";
import mongoose from "mongoose";
import DailyCase from "../models/DailyCase.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.mjs";

const router = express.Router();

// Get a list of 20 daily games

router.get("/", authMiddleware, async (req, res) => {
  // Get today's date
  const today = new Date();

  // Define the start date (April 10, 2025)
  const startDate = new Date("2025-04-10");

  // Calculate the difference in milliseconds
  const diffInTime = today.getTime() - startDate.getTime();

  // Convert milliseconds to days
  const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

  // Cycle dailyCaseID every 5 days
  const dailyCaseID = (diffInDays % 5) + 1;

  try {
    const dailyCase = await DailyCase.findOne({ dailyCaseID });
    res.status(200).json(dailyCase);
  } catch (error) {
    console.error("Error retrieving daily case:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Search across all daily cases for a text match
router.get("/search", authMiddleware, async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required." });
  }

  try {
    const results = await DailyCase.find({ $text: { $search: query } });
    res.status(200).json(results);
  } catch (error) {
    console.error("Error performing search: ", error);
    res.status(500).json({ error: "Internal Server Error" });
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
