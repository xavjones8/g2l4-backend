import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/auth.mjs";
import User from "../models/User.js"; // Make sure the path is correct and includes the file extension
import DailyCase from "../models/DailyCase.js";
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

// Register endpoint
router.post("/register", async (req, res) => {
  const { email, password, ...otherFields } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }
  try {
    // Check if the user already exists using the model
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create a new user using the Mongoose schema
    const user = new User({
      email,
      password: hashedPassword,
      ...otherFields, // This can include firstName, lastName, etc.
    });

    // Save the user document to the database
    await user.save();

    // Create a token (expires in 100 days)
    const token = jwt.sign({ id: user._id, email }, JWT_SECRET, {
      expiresIn: "100D",
    });

    // Convert to plain object and remove the password field before sending back the response
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).json({ token, user: userObj });
  } catch (error) {
    console.error("Error in register endpoint:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.post("/completeDailyGame/:id", authMiddleware, async (req, res) => {
  const { email } = req.user;
  const { points } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ message: "User must be logged in to access endpoint." });
  }

  // The parameter "id" is the DailyCase document's Mongoose ObjectId.
  const dailyCaseId = req.params.id;

  try {
    // Find the user by email.
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Retrieve the DailyCase document using its Mongoose ObjectId.
    const dailyCase = await DailyCase.findOne({ dailyCaseID: dailyCaseId });
    if (!dailyCase) {
      return res.status(404).json({ message: "Daily case not found." });
    }

    // Check if the daily case has already been completed.
    if (
      user.completedDailyCases.some(
        (dc) => dc.dailyCaseID == dailyCase.dailyCaseID
      )
    ) {
      return res.status(400).json({ message: "Daily case already completed." });
    }

    // Add the DailyCase object to the user's completedDailyCases array.
    user.completedDailyCases.push(dailyCase.toObject());

    // Sort the completed daily cases based on the custom numeric field "dailyCaseId".
    const sortedDailyCases = user.completedDailyCases.sort(
      (a, b) => Number(a.dailyCaseID) - Number(b.dailyCaseID)
    );

    // Compute the streak by iterating backwards from the most recent case.
    let streak = 1;
    for (let i = sortedDailyCases.length - 1; i > 0; i--) {
      const current = Number(sortedDailyCases[i].dailyCaseID);
      const previous = Number(sortedDailyCases[i - 1].dailyCaseID);
      if (current === previous + 1) {
        streak++;
      } else {
        break;
      }
    }

    // Update the user's streak and save the changes.
    user.streak = streak;
    user.points += points;
    await user.save();

    return res.status(200).json({
      message: "Daily game completed successfully",
      streak: user.streak,
      completedDailyCases: sortedDailyCases,
    });
  } catch (error) {
    console.error("Error completing daily game:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare provided password with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate a token (expires in 1 hour)
    const token = jwt.sign({ id: user._id, email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Remove password before returning user info
    user._id = user._id;
    delete user.password;

    return res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error in login endpoint:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Get user endpoint (for testing purposes, not recommended for production login)
router.get("/", authMiddleware, async (req, res) => {
  const { email } = req.user;
  if (!email) {
    return res
      .status(400)
      .json({ message: "User must be logged in to access endpoint." });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});
// User leaderboard endpoint
router.get("/leaderboard", authMiddleware, async (req, res) => {
  const { email } = req.user;
  if (!email) {
    return res
      .status(400)
      .json({ message: "User must be logged in to access endpoint." });
  }
  try {
    // Find all users and sort by points in descending order (-1)
    const users = await User.find({}).sort({ points: -1 });
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Update user endpoint
router.patch("/", authMiddleware, async (req, res) => {
  const { email: userEmail } = req.user;
  if (!userEmail) {
    return res
      .status(400)
      .json({ message: "Email is required to identify the user." });
  }
  const {
    firstName,
    lastName,
    email,
    password,
    streak,
    points,
    lastLogin,
    completedDailyCases,
    lastGamePlayedDate,
  } = req.body;
  let updateFields = {};

  if (firstName !== undefined) updateFields.firstName = firstName;
  if (lastName !== undefined) updateFields.lastName = lastName;
  if (email !== undefined) updateFields.email = email;

  // If a new password is provided, hash it before saving
  if (password !== undefined) {
    // Assume hashPassword is a function that hashes passwords securely.
    updateFields.password = await hashPassword(password);
  }

  if (streak !== undefined) updateFields.streak = streak;
  if (points !== undefined) updateFields.points = points;
  if (lastLogin !== undefined) updateFields.lastLogin = new Date(lastLogin);
  if (lastGamePlayedDate !== undefined)
    updateFields.lastGamePlayedDate = new Date(lastGamePlayedDate);
  if (completedDailyCases !== undefined)
    updateFields.completedDailyCases = completedDailyCases;

  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: "No update fields provided." });
  }

  try {
    const result = await User.updateOne(
      { email: userEmail },
      { $set: updateFields }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    return res
      .status(200)
      .json({ message: "User updated successfully.", result });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
